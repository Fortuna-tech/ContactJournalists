/**
 * Admin API Layer
 *
 * This module provides admin-only API functions for managing journalists, pitches, and queries.
 * All functions require staff privileges and use edge functions that bypass RLS.
 */

import { supabase } from "./supabaseClient";
import { Query, Pitch } from "@/types";

// ============================================================================
// Types
// ============================================================================

export interface AdminJournalistProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  press: string | null;
  company: string | null;
  website: string | null;
  linkedin: string | null;
  x_handle: string | null;
  categories: string[];
  created_at: string;
  meta?: Record<string, unknown>;
  billing_account?: {
    status: string;
    plan_id: string | null;
    current_period_end: string | null;
    cancel_at_period_end: boolean;
  } | null;
}

export interface AdminPitch {
  id: string;
  content: string;
  status: "pending" | "responded" | "archived";
  created_at: string;
  query: {
    id: string;
    title: string;
    journalist: {
      id: string;
      full_name: string | null;
      email: string;
      press: string | null;
    } | null;
  } | null;
  author: {
    id: string;
    full_name: string | null;
    email: string;
    company: string | null;
    role: string;
  } | null;
}

export interface AdminPitchDetail extends AdminPitch {
  query: {
    id: string;
    title: string;
    description: string;
    category_id: string;
    deadline: string | null;
    journalist: {
      id: string;
      full_name: string | null;
      email: string;
      press: string | null;
    } | null;
  } | null;
  author: {
    id: string;
    full_name: string | null;
    email: string;
    company: string | null;
    role: string;
    meta: Record<string, unknown> | null;
  } | null;
  comments: {
    id: string;
    content: string;
    created_at: string;
    author: {
      id: string;
      full_name: string | null;
      role: string;
    } | null;
  }[];
}

export interface PitchStatistics {
  pending: number;
  responded: number;
  archived: number;
  lastWeek: number;
  total: number;
}

export interface BulkImportResult {
  recordsInserted: number;
  skipped: number;
  skippedRows: { row: number; email: string }[];
  errors: { row: number; message: string }[];
  profilesWithImages: { profileId: string; url: string }[];
}

export interface ImageProcessResult {
  successful: string[];
  failed: { profileId: string; error: string }[];
}

// ============================================================================
// Generic Edge Function Helpers
// ============================================================================

/**
 * Call admin-manage-journalists edge function
 */
async function callJournalistsAdminFunction<T>(
  action: string,
  data?: unknown,
  id?: string
): Promise<T> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Not authenticated");
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const response = await fetch(
    `${supabaseUrl}/functions/v1/admin-manage-journalists`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action, data, id }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Admin operation failed");
  }

  return result;
}

/**
 * Call admin-manage-pitches edge function
 */
async function callPitchesAdminFunction<T>(
  action: string,
  data?: unknown,
  id?: string
): Promise<T> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Not authenticated");
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const response = await fetch(
    `${supabaseUrl}/functions/v1/admin-manage-pitches`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action, data, id }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Admin operation failed");
  }

  return result;
}

// ============================================================================
// Journalist Admin Functions
// ============================================================================

export const getJournalistsAdmin = async ({
  page = 1,
  pageSize = 20,
  search = "",
}: {
  page?: number;
  pageSize?: number;
  search?: string;
}): Promise<{ data: AdminJournalistProfile[]; count: number }> => {
  const result = await callJournalistsAdminFunction<{
    data: Record<string, unknown>[];
    count: number;
  }>("get_all", { page, pageSize, search });

  return {
    data: (result.data || []).map((p) => ({
      id: p.id as string,
      email: p.email as string,
      full_name: p.full_name as string | null,
      role: p.role as string,
      press: p.press as string | null,
      company: p.company as string | null,
      website: p.website as string | null,
      linkedin: p.linkedin as string | null,
      x_handle: p.x_handle as string | null,
      categories: (p.categories as string[]) || [],
      created_at: p.created_at as string,
      meta: p.meta as Record<string, unknown> | undefined,
      billing_account: Array.isArray(p.billing_accounts)
        ? (p.billing_accounts[0] as AdminJournalistProfile["billing_account"])
        : (p.billing_accounts as AdminJournalistProfile["billing_account"]),
    })),
    count: result.count || 0,
  };
};

export const updateJournalistAdmin = async (
  id: string,
  updates: {
    full_name?: string;
    email?: string;
    press?: string;
    company?: string;
    website?: string;
    linkedin?: string;
    x_handle?: string;
    categories?: string[];
  }
): Promise<AdminJournalistProfile> => {
  const data = await callJournalistsAdminFunction<Record<string, unknown>>(
    "update",
    updates,
    id
  );

  return {
    id: data.id as string,
    email: data.email as string,
    full_name: data.full_name as string | null,
    role: data.role as string,
    press: data.press as string | null,
    company: data.company as string | null,
    website: data.website as string | null,
    linkedin: data.linkedin as string | null,
    x_handle: data.x_handle as string | null,
    categories: (data.categories as string[]) || [],
    created_at: data.created_at as string,
  };
};

export const createJournalistAdmin = async (profile: {
  full_name?: string;
  email?: string;
  press?: string;
  company?: string;
  website?: string;
  linkedin?: string;
  x_handle?: string;
  categories?: string[];
}): Promise<AdminJournalistProfile> => {
  const data = await callJournalistsAdminFunction<Record<string, unknown>>(
    "create",
    profile
  );

  return {
    id: data.id as string,
    email: data.email as string,
    full_name: data.full_name as string | null,
    role: data.role as string,
    press: data.press as string | null,
    company: data.company as string | null,
    website: data.website as string | null,
    linkedin: data.linkedin as string | null,
    x_handle: data.x_handle as string | null,
    categories: (data.categories as string[]) || [],
    created_at: data.created_at as string,
  };
};

export const deleteJournalistAdmin = async (id: string): Promise<void> => {
  await callJournalistsAdminFunction<{ success: boolean }>("delete", undefined, id);
};

export const bulkImportJournalists = async (
  rows: {
    full_name?: string;
    email?: string;
    press?: string;
    company?: string;
    website?: string;
    linkedin?: string;
    x_handle?: string;
    categories?: string[];
    email_screenshot?: string;
  }[]
): Promise<BulkImportResult> => {
  const result = await callJournalistsAdminFunction<{
    recordsInserted: number;
    skipped: number;
    skippedRows: { row: number; email: string }[];
    errors: { row: number; message: string }[];
    profilesWithImages: { profileId: string; url: string }[];
  }>("bulk_import", rows);

  return {
    recordsInserted: result.recordsInserted,
    skipped: result.skipped || 0,
    skippedRows: result.skippedRows || [],
    errors: result.errors || [],
    profilesWithImages: result.profilesWithImages || [],
  };
};

export const processImageBatch = async (
  items: { profileId: string; url: string }[]
): Promise<ImageProcessResult> => {
  const result = await callJournalistsAdminFunction<{
    successful: string[];
    failed: { profileId: string; error: string }[];
  }>("process_images", items);

  return {
    successful: result.successful || [],
    failed: result.failed || [],
  };
};

export const deleteJournalistAdmin = async (id: string): Promise<void> => {
  await callJournalistsAdminFunction("delete", undefined, id);
};

// ============================================================================
// Pitch Admin Functions
// ============================================================================

export const getPitchesAdmin = async ({
  page = 1,
  pageSize = 20,
  search = "",
  status,
  queryId,
  userId,
}: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: "pending" | "responded" | "archived";
  queryId?: string;
  userId?: string;
}): Promise<{ data: AdminPitch[]; count: number }> => {
  const result = await callPitchesAdminFunction<{
    data: AdminPitch[];
    count: number;
  }>("get_all", { page, pageSize, search, status, queryId, userId });

  return {
    data: result.data || [],
    count: result.count || 0,
  };
};

export const getPitchByIdAdmin = async (
  id: string
): Promise<AdminPitchDetail> => {
  const result = await callPitchesAdminFunction<AdminPitchDetail>(
    "get_by_id",
    undefined,
    id
  );
  return result;
};

export const updatePitchAdmin = async (
  id: string,
  updates: {
    content?: string;
    status?: "pending" | "responded" | "archived";
  }
): Promise<Pitch> => {
  const data = await callPitchesAdminFunction<Record<string, unknown>>(
    "update",
    updates,
    id
  );

  return {
    id: data.id as string,
    queryId: data.query_id as string,
    userId: data.user_id as string,
    content: data.content as string,
    status: data.status as "pending" | "responded" | "archived",
    createdAt: data.created_at as string,
  };
};

export const deletePitchAdmin = async (id: string): Promise<void> => {
  await callPitchesAdminFunction("delete", undefined, id);
};

export const getPitchStatisticsAdmin = async (): Promise<PitchStatistics> => {
  const result = await callPitchesAdminFunction<PitchStatistics>(
    "get_statistics"
  );
  return result;
};

// ============================================================================
// Query Admin Functions (using direct Supabase for now, can be moved to edge function)
// ============================================================================

export const getQueriesAdmin = async ({
  page = 1,
  pageSize = 20,
  search = "",
  journalistId,
  categoryId,
  includeArchived = false,
}: {
  page?: number;
  pageSize?: number;
  search?: string;
  journalistId?: string;
  categoryId?: string;
  includeArchived?: boolean;
}): Promise<{ data: Query[]; count: number }> => {
  let query = supabase
    .from("queries")
    .select(
      "*, category:categories(id,title), journalist:journalist_id(id, full_name, email, press)",
      { count: "exact" }
    )
    .order("created_at", { ascending: false });

  if (!includeArchived) {
    query = query.is("archived_at", null);
  }

  if (journalistId) {
    query = query.eq("journalist_id", journalistId);
  }

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    data: (data || []).map((q) => ({
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
    })) as Query[],
    count: count || 0,
  };
};

export const updateQueryAdmin = async (
  id: string,
  updates: {
    title?: string;
    description?: string;
    category_id?: string;
    deadline?: string | null;
    preferred_contact_method?: string;
    attachment_url?: string;
    journalist_id?: string;
    archived_at?: string | null;
  }
): Promise<Query> => {
  const { data, error } = await supabase
    .from("queries")
    .update(updates)
    .eq("id", id)
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

export const deleteQueryAdmin = async (id: string): Promise<void> => {
  const { error } = await supabase.from("queries").delete().eq("id", id);
  if (error) throw error;
};

export const createQueryAdmin = async (query: {
  title: string;
  description: string;
  category_id: string;
  journalist_id: string;
  deadline?: string | null;
  preferred_contact_method?: string;
  attachment_url?: string;
}): Promise<Query> => {
  const { data, error } = await supabase
    .from("queries")
    .insert(query)
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
