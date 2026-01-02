import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Create admin client with service role key (bypasses RLS)
const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

// Create regular client to verify caller is staff
const supabaseAuth = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_ANON_KEY") ?? ""
);

interface PitchFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: "pending" | "responded" | "archived";
  queryId?: string;
  userId?: string;
}

// Verify the caller is a staff member
async function verifyStaffAccess(authHeader: string): Promise<boolean> {
  try {
    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error,
    } = await supabaseAuth.auth.getUser(token);

    if (error || !user) return false;

    const { data: staffRecord } = await supabaseAdmin
      .from("staff_privileges")
      .select("user_id")
      .eq("user_id", user.id)
      .single();

    return !!staffRecord;
  } catch {
    return false;
  }
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Verify staff access
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    const isStaff = await verifyStaffAccess(authHeader);
    if (!isStaff) {
      throw new Error("Unauthorized: Staff access required");
    }

    const { action, data, id } = await req.json();

    switch (action) {
      case "get_all": {
        const filters = (data || {}) as PitchFilters;
        const {
          page = 1,
          pageSize = 20,
          search = "",
          status,
          queryId,
          userId,
        } = filters;

        let query = supabaseAdmin
          .from("pitches")
          .select(
            `
            id,
            content,
            status,
            created_at,
            query:query_id (
              id,
              title,
              journalist:journalist_id (
                id,
                full_name,
                email,
                press
              )
            ),
            author:user_id (
              id,
              full_name,
              email,
              company,
              role
            )
          `,
            { count: "exact" }
          )
          .order("created_at", { ascending: false });

        // Apply filters
        if (status) {
          query = query.eq("status", status);
        }
        if (queryId) {
          query = query.eq("query_id", queryId);
        }
        if (userId) {
          query = query.eq("user_id", userId);
        }
        if (search) {
          query = query.ilike("content", `%${search}%`);
        }

        // Pagination
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;
        query = query.range(from, to);

        const { data: pitches, error, count } = await query;
        if (error) throw error;

        return new Response(JSON.stringify({ data: pitches, count }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      case "get_by_id": {
        if (!id) throw new Error("ID is required");

        const { data: pitch, error } = await supabaseAdmin
          .from("pitches")
          .select(
            `
            id,
            content,
            status,
            created_at,
            query:query_id (
              id,
              title,
              description,
              category_id,
              deadline,
              journalist:journalist_id (
                id,
                full_name,
                email,
                press
              )
            ),
            author:user_id (
              id,
              full_name,
              email,
              company,
              role,
              meta
            ),
            comments:pitch_comments (
              id,
              content,
              created_at,
              author:user_id (
                id,
                full_name,
                role
              )
            )
          `
          )
          .eq("id", id)
          .single();

        if (error) throw error;

        return new Response(JSON.stringify(pitch), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      case "update": {
        if (!id) throw new Error("ID is required for update");

        const updates = data as {
          content?: string;
          status?: "pending" | "responded" | "archived";
        };

        const { data: updated, error } = await supabaseAdmin
          .from("pitches")
          .update(updates)
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;

        return new Response(JSON.stringify(updated), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      case "delete": {
        if (!id) throw new Error("ID is required for delete");

        // First delete related comments
        const { error: commentsError } = await supabaseAdmin
          .from("pitch_comments")
          .delete()
          .eq("pitch_id", id);

        if (commentsError) throw commentsError;

        // Then delete the pitch
        const { error } = await supabaseAdmin
          .from("pitches")
          .delete()
          .eq("id", id);

        if (error) throw error;

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      case "get_statistics": {
        // Get count by status
        const [pendingResult, respondedResult, archivedResult, recentResult] =
          await Promise.all([
            supabaseAdmin
              .from("pitches")
              .select("id", { count: "exact", head: true })
              .eq("status", "pending"),
            supabaseAdmin
              .from("pitches")
              .select("id", { count: "exact", head: true })
              .eq("status", "responded"),
            supabaseAdmin
              .from("pitches")
              .select("id", { count: "exact", head: true })
              .eq("status", "archived"),
            supabaseAdmin
              .from("pitches")
              .select("id", { count: "exact", head: true })
              .gte(
                "created_at",
                new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
              ),
          ]);

        const statistics = {
          pending: pendingResult.count || 0,
          responded: respondedResult.count || 0,
          archived: archivedResult.count || 0,
          lastWeek: recentResult.count || 0,
          total:
            (pendingResult.count || 0) +
            (respondedResult.count || 0) +
            (archivedResult.count || 0),
        };

        return new Response(JSON.stringify(statistics), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
