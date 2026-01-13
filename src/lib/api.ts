import { supabase } from "./supabaseClient";
import { toast } from "sonner";
import {
  UserRole,
  Query,
  Pitch,
  Category,
  JournalistProfile,
  MediaList,
  AgencyFounderProfile,
  PitchComment,
  SubscriptionStatus,
} from "@/types";
import { normalizeCategoryId, sanitizeCategoryTitle } from "./categories";

export const createCheckoutSession = async (
  priceId: string,
  cancelUrl: string
) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) throw new Error("No session");

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const response = await fetch(
    `${supabaseUrl}/functions/v1/create-checkout-session`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        priceId,
        customerEmail: user.email,
        successUrl: `${window.location.origin}/feed?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl:
          cancelUrl || `${window.location.origin}/onboarding?step=plan`,
      }),
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to create checkout session");
  }

  return data;
};

export const createPortalSession = async (returnUrl: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) throw new Error("No session");

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const response = await fetch(
    `${supabaseUrl}/functions/v1/create-portal-session`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        returnUrl,
      }),
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to create portal session");
  }

  return data;
};

// Helper to send notifications via Edge Function
const sendNotification = async (payload: {
  type: "new_query" | "new_pitch" | "new_comment";
  query_id?: string;
  pitch_id?: string;
  comment_id?: string;
}) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session) {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      await fetch(`${supabaseUrl}/functions/v1/notify-pitch`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error("Failed to send notification:", err);
    }
  }
};

// Broadcast story alerts to founders/agencies (admin only)
export const sendBroadcastAlerts = async (queryIds: string[]) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) throw new Error("Not authenticated");

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const response = await fetch(
    `${supabaseUrl}/functions/v1/broadcast-story-alerts`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query_ids: queryIds }),
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to send broadcast alerts");
  }

  return data as { message: string; sent: number; total?: number };
};

// Profile API
export const getProfile = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("profiles")
    .select("*, billing_accounts(*)")
    .eq("id", user.id)
    .maybeSingle();

  if (error) throw error;

  // Flatten billing details into profile
  const billing = data.billing_accounts || {};
  return {
    ...data,
    subscriptionStatus: billing.subscription_status,
    stripeCustomerId: billing.stripe_customer_id,
    planId: billing.plan_id,
  };
};

export const updateProfile = async (updates: {
  role?: UserRole;
  onboarding_complete?: boolean;
  press?: string;
  company?: string;
  website?: string;
  linkedin?: string;
  x_handle?: string;
  categories?: string[];
  meta?: Record<string, unknown>;
}) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const getBillingAccount =
  async (): Promise<SubscriptionStatus | null> => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase.functions.invoke(
      "get-subscription-status"
    );

    if (error) {
      console.error("Error fetching subscription status:", error);
      throw error;
    }

    return data;
  };

interface SearchProfileResult {
  id: string;
  role: string;
  full_name: string | null;
  press: string;
  company: string | null;
  website: string | null;
  linkedin: string;
  x_handle: string;
  categories: string[];
  meta: { full_name?: string; publisherProfile?: string } | null;
  queries: { count: number }[];
}

export const searchJournalists = async (filters: {
  searchTerm?: string;
  category?: string;
  publicationType?: string;
}) => {
  let query = supabase
    .from("profiles")
    .select(
      "id, role, full_name, press, company, website, linkedin, x_handle, categories, meta, queries(count)"
    )
    .eq("role", "journalist")
    .eq("onboarding_complete", true);

  if (filters.category) {
    query = query.contains("categories", [filters.category]);
  }

  if (filters.searchTerm) {
    // Searching by press (publication) since name is not available in profiles table
    query = query.ilike("press", `%${filters.searchTerm}%`);
  }

  // Add more filters here as needed

  const { data, error } = await query.limit(100);
  console.log(data);
  if (error) throw error;

  // Map to JournalistProfile type
  return (data as unknown as SearchProfileResult[]).map((p) => ({
    userId: p.id,
    name: p.full_name || p.meta?.full_name || "Unknown", // Use meta.full_name or fallback
    press: p.press,
    linkedin: p.linkedin,
    publisherProfile: p.meta?.publisherProfile || "",
    xHandle: p.x_handle,
    categories: p.categories,
    queryCount: p.queries?.[0]?.count ?? 0,
  })) as JournalistProfile[];
};

export const getProfileById = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*, queries(*)")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;

  // Transform based on role
  if (data.role === "journalist") {
    return {
      userId: data.id,
      role: data.role,
      name: data.full_name || data.meta?.full_name || "Unknown",
      press: data.press,
      linkedin: data.linkedin,
      publisherProfile: data.meta?.publisherProfile || "",
      xHandle: data.x_handle,
      website: data.website,
      categories: data.categories,
      meta: data.meta,
      queries: data.queries,
    };
  } else {
    return {
      userId: data.id,
      role: data.role,
      name: data.full_name || data.meta?.full_name || "Unknown",
      company: data.company,
      website: data.website,
      linkedin: data.linkedin,
      xHandle: data.x_handle,
      categories: data.categories,
      meta: data.meta,
    };
  }
};

// Queries API
export const getQuery = async (id: string) => {
  const { data, error } = await supabase
    .from("queries")
    .select("*, category:categories(id,title)")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;

  return {
    id: data.id,
    journalistId: data.journalist_id,
    title: data.title,
    description: data.description,
    categoryId: data.category_id,
    categoryTitle: data.category?.title ?? data.category_id,
    datePosted: data.created_at,
    pitchCount: data.pitch_count,
    archivedAt: data.archived_at,
    deadline: data.deadline,
    preferredContactMethod: data.preferred_contact_method,
    attachmentUrl: data.attachment_url,
  } as Query;
};

export const getQueries = async (filters?: {
  categoryId?: string;
  journalistId?: string;
}) => {
  let query = supabase
    .from("queries")
    .select("*, category:categories(id,title)")
    .order("created_at", { ascending: false });

  query = query.is("archived_at", null);

  if (filters?.categoryId) {
    query = query.eq("category_id", filters.categoryId);
  }

  if (filters?.journalistId) {
    query = query.eq("journalist_id", filters.journalistId);
  }

  const { data, error } = await query;
  if (error) throw error;

  // Transform to match frontend types
  return data.map((q) => ({
    id: q.id,
    journalistId: q.journalist_id,
    title: q.title,
    description: q.description,
    categoryId: q.category_id,
    categoryTitle: q.category?.title ?? q.category_id,
    datePosted: q.created_at,
    pitchCount: q.pitch_count,
    archivedAt: q.archived_at,
    deadline: q.deadline,
    preferredContactMethod: q.preferred_contact_method,
    attachmentUrl: q.attachment_url,
  })) as Query[];
};

export const getMyQueries = async (includeArchived = true) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  let query = supabase
    .from("queries")
    .select("*, category:categories(id,title), pitches(count)")
    .eq("journalist_id", user.id)
    .order("created_at", { ascending: false });

  if (!includeArchived) {
    query = query.is("archived_at", null);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data.map((q) => ({
    id: q.id,
    journalistId: q.journalist_id,
    title: q.title,
    description: q.description,
    categoryId: q.category_id,
    categoryTitle: q.category?.title ?? q.category_id,
    datePosted: q.created_at,
    pitchCount: q.pitches?.[0]?.count ?? 0,
    archivedAt: q.archived_at,
    deadline: q.deadline,
    preferredContactMethod: q.preferred_contact_method,
    attachmentUrl: q.attachment_url,
  })) as Query[];
};

export const createQuery = async (query: {
  title: string;
  description: string;
  categoryId: string;
  deadline?: Date | null;
  preferredContactMethod?: string;
  attachmentUrl?: string;
  journalistId?: string; // Optional: admin can assign to a specific journalist
}) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Use provided journalistId or default to current user
  const targetJournalistId = query.journalistId || user.id;

  const { data, error } = await supabase
    .from("queries")
    .insert({
      journalist_id: targetJournalistId,
      title: query.title,
      description: query.description,
      category_id: query.categoryId,
      deadline: query.deadline?.toISOString(),
      preferred_contact_method: query.preferredContactMethod,
      attachment_url: query.attachmentUrl,
    })
    .select("*, category:categories(id,title)")
    .maybeSingle();

  if (error) throw error;

  // If the query is assigned to the current user, it's not admin query
  if (targetJournalistId === user.id) {
    // Trigger notification for new query
    await sendNotification({
      type: "new_query",
      query_id: data.id,
    });
  }

  return {
    id: data.id,
    journalistId: data.journalist_id,
    title: data.title,
    description: data.description,
    categoryId: data.category_id,
    categoryTitle: data.category?.title ?? data.category_id,
    datePosted: data.created_at,
    pitchCount: data.pitch_count,
    archivedAt: data.archived_at,
    deadline: data.deadline,
    preferredContactMethod: data.preferred_contact_method,
    attachmentUrl: data.attachment_url,
  } as Query;
};

export const updateQuery = async (
  queryId: string,
  updates: {
    title: string;
    description: string;
    categoryId: string;
    deadline?: Date | null;
    preferredContactMethod?: string;
    attachmentUrl?: string;
  }
) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("queries")
    .update({
      title: updates.title,
      description: updates.description,
      category_id: updates.categoryId,
      deadline: updates.deadline?.toISOString(),
      preferred_contact_method: updates.preferredContactMethod,
      attachment_url: updates.attachmentUrl,
    })
    .eq("id", queryId)
    .eq("journalist_id", user.id)
    .select("*, category:categories(id,title)")
    .maybeSingle();

  if (error) throw error;
  if (!data)
    throw new Error(
      "Query not found or you don't have permission to update it"
    );

  return {
    id: data.id,
    journalistId: data.journalist_id,
    title: data.title,
    description: data.description,
    categoryId: data.category_id,
    categoryTitle: data.category?.title ?? data.category_id,
    datePosted: data.created_at,
    pitchCount: data.pitch_count,
    archivedAt: data.archived_at,
    deadline: data.deadline,
    preferredContactMethod: data.preferred_contact_method,
    attachmentUrl: data.attachment_url,
  } as Query;
};

export const archiveQuery = async (
  queryId: string,
  archive = true
): Promise<Query> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("queries")
    .update({
      archived_at: archive ? new Date().toISOString() : null,
    })
    .eq("id", queryId)
    .eq("journalist_id", user.id)
    .select("*, category:categories(id,title)")
    .maybeSingle();

  if (error) throw error;

  return {
    id: data.id,
    journalistId: data.journalist_id,
    title: data.title,
    description: data.description,
    categoryId: data.category_id,
    categoryTitle: data.category?.title ?? data.category_id,
    datePosted: data.created_at,
    pitchCount: data.pitch_count,
    archivedAt: data.archived_at,
    deadline: data.deadline,
    preferredContactMethod: data.preferred_contact_method,
    attachmentUrl: data.attachment_url,
  } as Query;
};

export const deleteQuery = async (queryId: string) => {
  const { error } = await supabase.from("queries").delete().eq("id", queryId);

  if (error) throw error;
};

// Delete query function (for journalists)
export const removeQuery = deleteQuery;

// Pitches API
export const getPitchesForQuery = async (queryId: string) => {
  const { data, error } = await supabase
    .from("pitches")
    .select("*, author:user_id(id, full_name, company, role, meta)")
    .eq("query_id", queryId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  type DBPitchWithAuthor = {
    id: string;
    query_id: string;
    user_id: string;
    content: string;
    status: string;
    created_at: string;
    author: {
      id: string;
      full_name: string | null;
      company: string | null;
      role: string;
      meta: Record<string, unknown>;
    };
  };

  return (data as unknown as DBPitchWithAuthor[]).map((p) => ({
    id: p.id,
    queryId: p.query_id,
    userId: p.user_id,
    content: p.content,
    status: p.status as "pending" | "responded" | "archived",
    createdAt: p.created_at,
    author: {
      userId: p.author.id,
      name:
        p.author.full_name || (p.author.meta?.full_name as string) || "Unknown",
      company: p.author.company || "",
    },
  })) as Pitch[];
};

export const getMyPitches = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("pitches")
    .select(
      "*, query:queries(*, category:categories(id,title), journalist:journalist_id(email,website,x_handle))"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data.map((p) => ({
    id: p.id,
    queryId: p.query_id,
    userId: p.user_id,
    content: p.content,
    status: p.status as "pending" | "responded" | "archived",
    createdAt: p.created_at,
    query: p.query
      ? {
          id: p.query.id,
          journalistId: p.query.journalist_id,
          title: p.query.title,
          description: p.query.description,
          categoryId: p.query.category_id,
          categoryTitle: p.query.category?.title ?? p.query.category_id,
          datePosted: p.query.created_at,
          pitchCount: p.query.pitch_count,
          archivedAt: p.query.archived_at,
          deadline: p.query.deadline,
          preferredContactMethod: p.query.preferred_contact_method,
          attachmentUrl: p.query.attachment_url,
          journalist: p.query.journalist
            ? {
                email: p.query.journalist.email,
                website: p.query.journalist.website,
                xHandle: p.query.journalist.x_handle,
              }
            : undefined,
        }
      : undefined,
  })) as Pitch[];
};

export const createPitch = async (pitch: {
  queryId: string;
  content: string;
}) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Check usage limits
  const billing = await getBillingAccount();
  if (
    billing &&
    billing.remainingPitches <= 0 &&
    billing.maxPitches < 9999999
  ) {
    toast.error("Pitch limit reached", {
      description: "You have reached your monthly pitch limit.",
      action: {
        label: "Upgrade",
        onClick: () => (window.location.href = "/founder/settings"),
      },
    });
    throw new Error("Pitch limit reached");
  }

  const { data, error } = await supabase
    .from("pitches")
    .insert({
      query_id: pitch.queryId,
      user_id: user.id,
      content: pitch.content,
      status: "pending",
    })
    .select()
    .maybeSingle();

  if (error) throw error;

  // Call notify-pitch function
  await sendNotification({
    type: "new_pitch",
    pitch_id: data.id,
  });

  return {
    id: data.id,
    queryId: data.query_id,
    userId: data.user_id,
    content: data.content,
    status: data.status as "pending" | "responded" | "archived",
    createdAt: data.created_at,
  } as Pitch;
};

export const updatePitchStatus = async (
  pitchId: string,
  status: "pending" | "responded" | "archived"
) => {
  const { data, error } = await supabase
    .from("pitches")
    .update({ status })
    .eq("id", pitchId)
    .select()
    .maybeSingle();

  if (error) throw error;

  return {
    id: data.id,
    queryId: data.query_id,
    userId: data.user_id,
    content: data.content,
    status: data.status as "pending" | "responded" | "archived",
    createdAt: data.created_at,
  } as Pitch;
};

// Pitch Comments API
export const getPitchComments = async (pitchId: string) => {
  const { data, error } = await supabase
    .from("pitch_comments")
    .select("*, author:user_id(id, full_name, role, company, meta)")
    .eq("pitch_id", pitchId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  type DBCommentWithAuthor = {
    id: string;
    pitch_id: string;
    user_id: string;
    content: string;
    created_at: string;
    author: {
      id: string;
      full_name: string | null;
      role: UserRole;
      company: string | null;
      meta: Record<string, unknown>;
    };
  };

  return (data as unknown as DBCommentWithAuthor[]).map((c) => ({
    id: c.id,
    pitchId: c.pitch_id,
    userId: c.user_id,
    content: c.content,
    createdAt: c.created_at,
    author: {
      name:
        c.author.full_name || (c.author.meta?.full_name as string) || "Unknown",
      role: c.author.role,
      company: c.author.company || undefined,
    },
  })) as PitchComment[];
};

export const createPitchComment = async (pitchId: string, content: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("pitch_comments")
    .insert({
      pitch_id: pitchId,
      user_id: user.id,
      content,
    })
    .select("*, author:user_id(id, full_name, role, company, meta)")
    .maybeSingle();

  if (error) throw error;

  // Trigger notification for new comment
  await sendNotification({
    type: "new_comment",
    comment_id: data.id,
  });

  // Return with author info structured correctly
  const c = data;
  return {
    id: c.id,
    pitchId: c.pitch_id,
    userId: c.user_id,
    content: c.content,
    createdAt: c.created_at,
    author: {
      name:
        c.author?.full_name ||
        (c.author?.meta?.full_name as string) ||
        "Unknown",
      role: c.author?.role,
      company: c.author?.company || undefined,
    },
  } as PitchComment;
};

// Saved Contacts API

export const saveContact = async (journalistId: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("saved_contacts").insert({
    user_id: user.id,
    journalist_id: journalistId,
  });

  if (error) {
    // Ignore unique violation error if already saved
    if (error.code === "23505") return;
    throw error;
  }
};

export const removeSavedContact = async (journalistId: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("saved_contacts")
    .delete()
    .eq("user_id", user.id)
    .eq("journalist_id", journalistId);

  if (error) throw error;
};

export const getSavedContacts = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("saved_contacts")
    .select(
      `
      journalist:journalist_id (
        id,
        role,
        full_name,
        press,
        company,
        website,
        linkedin,
        x_handle,
        categories,
        meta,
        queries(count)
      )
    `
    )
    .eq("user_id", user.id);

  if (error) throw error;

  // Transform to JournalistProfile
  return (data as unknown as { journalist: SearchProfileResult }[]).map(
    (item) => {
      const p = item.journalist;
      return {
        userId: p.id,
        name: p.full_name || p.meta?.full_name || "Unknown",
        press: p.press,
        linkedin: p.linkedin,
        publisherProfile: p.meta?.publisherProfile || "",
        xHandle: p.x_handle,
        categories: p.categories,
        queryCount: p.queries?.[0]?.count ?? 0,
        isSaved: true,
      } as JournalistProfile;
    }
  );
};

export const getSavedContactIds = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("saved_contacts")
    .select("journalist_id")
    .eq("user_id", user.id);

  if (error) throw error;
  return data.map((d) => d.journalist_id) as string[];
};

export const getCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("title", { ascending: true });

  if (error) throw error;
  return data as Category[];
};

export const createCategory = async (title: string): Promise<Category> => {
  const sanitizedTitle = sanitizeCategoryTitle(title);
  const id = normalizeCategoryId(sanitizedTitle);

  if (!id) {
    throw new Error("Category name is invalid");
  }

  const { data, error } = await supabase
    .from("categories")
    .insert({
      id,
      title: sanitizedTitle,
    })
    .select()
    .maybeSingle();

  if (error) throw error;
  return data as Category;
};

// Media Lists API

export const getMediaLists = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("media_lists")
    .select("*, media_list_members(count)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data.map((l) => ({
    ...l,
    userId: l.user_id,
    createdAt: l.created_at,
    memberCount: l.media_list_members?.[0]?.count ?? 0,
  })) as MediaList[];
};

export const createMediaList = async (name: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("media_lists")
    .insert({ user_id: user.id, name })
    .select()
    .maybeSingle();

  if (error) throw error;
  return {
    ...data,
    userId: data.user_id,
    createdAt: data.created_at,
    memberCount: 0,
  } as MediaList;
};

export const deleteMediaList = async (listId: string) => {
  const { error } = await supabase
    .from("media_lists")
    .delete()
    .eq("id", listId);
  if (error) throw error;
};

export const addJournalistToMediaList = async (
  listId: string,
  journalistId: string
) => {
  const { error } = await supabase.from("media_list_members").insert({
    list_id: listId,
    journalist_id: journalistId,
  });
  if (error && error.code !== "23505") throw error;
};

export const removeJournalistFromMediaList = async (
  listId: string,
  journalistId: string
) => {
  const { error } = await supabase
    .from("media_list_members")
    .delete()
    .eq("list_id", listId)
    .eq("journalist_id", journalistId);
  if (error) throw error;
};

export const getMediaListMembers = async (listId: string) => {
  const { data, error } = await supabase
    .from("media_list_members")
    .select(
      `
      journalist:journalist_id (
        id,
        role,
        full_name,
        press,
        company,
        website,
        linkedin,
        x_handle,
        categories,
        meta,
        queries(count)
      )
    `
    )
    .eq("list_id", listId);

  if (error) throw error;

  return (data as unknown as { journalist: SearchProfileResult }[]).map(
    (item) => {
      const p = item.journalist;
      return {
        userId: p.id,
        name: p.full_name || p.meta?.full_name || "Unknown",
        press: p.press,
        linkedin: p.linkedin,
        publisherProfile: p.meta?.publisherProfile || "",
        xHandle: p.x_handle,
        categories: p.categories,
        queryCount: p.queries?.[0]?.count ?? 0,
        isSaved: true,
      } as JournalistProfile;
    }
  );
};

// Saved Sources API (Journalist saving Founders)

export const saveSource = async (sourceId: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("saved_sources").insert({
    journalist_id: user.id,
    source_id: sourceId,
  });

  if (error) {
    if (error.code === "23505") return;
    throw error;
  }
};

export const removeSavedSource = async (sourceId: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("saved_sources")
    .delete()
    .eq("journalist_id", user.id)
    .eq("source_id", sourceId);

  if (error) throw error;
};

export const getSavedSources = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("saved_sources")
    .select(
      `
      source:source_id (
        id,
        role,
        full_name,
        press,
        company,
        website,
        linkedin,
        x_handle,
        categories,
        meta
      )
    `
    )
    .eq("journalist_id", user.id);

  if (error) throw error;

  return (data as unknown as { source: SearchProfileResult }[]).map((item) => {
    const p = item.source;
    return {
      userId: p.id,
      name: p.full_name || p.meta?.full_name || "Unknown",
      company: p.company || "",
      website: p.website || "",
      linkedin: p.linkedin || "",
      xHandle: p.x_handle || "",
      categories: p.categories || [],
      isSaved: true,
    } as AgencyFounderProfile;
  });
};

export const getSuggestedSources = async () => {
  // 1. Get current journalist's categories
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: profile } = await supabase
    .from("profiles")
    .select("categories")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || !profile.categories || profile.categories.length === 0) {
    return [];
  }

  // 2. Find founders/agencies with matching categories
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, role, full_name, company, website, linkedin, x_handle, categories, meta"
    )
    .neq("role", "journalist") // Founders and agencies
    .overlaps("categories", profile.categories)
    .limit(5); // Suggest top 5

  if (error) throw error;

  return (data as unknown as SearchProfileResult[]).map((p) => ({
    userId: p.id,
    name: p.full_name || p.meta?.full_name || "Unknown",
    company: p.company || "",
    website: p.website || "",
    linkedin: p.linkedin || "",
    xHandle: p.x_handle || "",
    categories: p.categories || [],
  })) as AgencyFounderProfile[];
};

// =========================================
// Admin API Functions (re-exported from admin-api.ts)
// =========================================

export {
  // Types
  type AdminJournalistProfile,
  type AdminPitch,
  type AdminPitchDetail,
  type PitchStatistics,
  type BulkImportResult,
  type ImageProcessResult,
  // Journalist Admin Functions
  getJournalistsAdmin,
  updateJournalistAdmin,
  createJournalistAdmin,
  deleteJournalistAdmin,
  bulkImportJournalists,
  processImageBatch,
  // Pitch Admin Functions
  getPitchesAdmin,
  getPitchByIdAdmin,
  updatePitchAdmin,
  deletePitchAdmin,
  getPitchStatisticsAdmin,
  // Query Admin Functions
  getQueriesAdmin,
  updateQueryAdmin,
  deleteQueryAdmin,
  createQueryAdmin,
} from "./admin-api";
