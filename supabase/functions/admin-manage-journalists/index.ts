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

interface JournalistData {
  full_name?: string;
  email?: string;
  press?: string;
  company?: string;
  website?: string;
  linkedin?: string;
  x_handle?: string;
  categories?: string[];
  email_screenshot?: string;
}

interface BulkImportResult {
  recordsInserted: number;
  errors: { row: number; message: string }[];
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

serve(async (req) => {
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
      case "create": {
        const profileData = data as JournalistData;
        const { email_screenshot, ...insertData } = profileData;

        const { data: created, error } = await supabaseAdmin
          .from("profiles")
          .insert({
            role: "journalist",
            onboarding_complete: true,
            ...insertData,
            categories: insertData.categories || [],
          })
          .select()
          .single();

        if (error) throw error;

        return new Response(JSON.stringify(created), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      case "update": {
        if (!id) throw new Error("ID is required for update");

        const { data: updated, error } = await supabaseAdmin
          .from("profiles")
          .update(data)
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;

        return new Response(JSON.stringify(updated), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      case "bulk_import": {
        const rows = data as JournalistData[];
        const results: BulkImportResult = {
          recordsInserted: 0,
          errors: [],
        };

        // Process in batches of 100 (within timeout limits)
        const batchSize = 100;
        for (let i = 0; i < rows.length; i += batchSize) {
          const batch = rows.slice(i, i + batchSize).map((row, idx) => {
            const { email_screenshot, ...profileData } = row;
            return {
              role: "journalist",
              onboarding_complete: true,
              ...profileData,
              categories: profileData.categories || [],
              // Store email_screenshot URL in meta for later processing
              meta: email_screenshot
                ? { email_screenshot_url: email_screenshot }
                : {},
            };
          });

          const { data: inserted, error } = await supabaseAdmin
            .from("profiles")
            .insert(batch)
            .select();

          if (error) {
            // If batch fails, try individual inserts
            for (let j = 0; j < batch.length; j++) {
              const { error: singleError } = await supabaseAdmin
                .from("profiles")
                .insert(batch[j]);

              if (singleError) {
                results.errors.push({
                  row: i + j + 1,
                  message: singleError.message,
                });
              } else {
                results.recordsInserted++;
              }
            }
          } else {
            results.recordsInserted += inserted?.length || batch.length;
          }
        }

        return new Response(JSON.stringify(results), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      case "get_all": {
        const { page = 1, pageSize = 20, search = "" } = data || {};

        let query = supabaseAdmin
          .from("profiles")
          .select(
            "id, email, full_name, role, press, company, website, linkedin, x_handle, categories, created_at, meta, billing_accounts(status, plan_id, current_period_end, cancel_at_period_end)",
            { count: "exact" }
          )
          .eq("role", "journalist")
          .order("created_at", { ascending: false });

        if (search) {
          query = query.or(
            `email.ilike.%${search}%,full_name.ilike.%${search}%,press.ilike.%${search}%`
          );
        }

        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;
        query = query.range(from, to);

        const { data: profiles, error, count } = await query;
        if (error) throw error;

        return new Response(JSON.stringify({ data: profiles, count }), {
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
