import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface Profile {
  email: string;
  categories: string[];
  meta?: {
    email_alerts?: boolean;
  };
}

interface QueryWithCategory {
  id: string;
  title: string;
  description: string;
  category_id: string;
  deadline: string | null;
  category: {
    id: string;
    title: string;
  };
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailData {
  to: string;
  subject: string;
  html: string;
}

const EMAIL_FROM =
  "ContactJournalists <new-requests@updates.contactjournalists.com>";

interface BatchEmailItem {
  from: string;
  to: string[];
  subject: string;
  html: string;
}

interface BatchSendResult {
  data: { id: string }[] | null;
  error: string | null;
}

async function sendBatchEmails(
  apiKey: string | undefined,
  emails: { to: string; subject: string; html: string }[]
): Promise<BatchSendResult> {
  if (!apiKey) {
    console.log(`Mock Batch Email Send: ${emails.length} emails`);
    emails.forEach((e) => console.log(`  - To: ${e.to}`));
    return {
      data: emails.map(() => ({ id: "mock-id" })),
      error: null,
    };
  }

  // Resend batch API has a limit of 100 emails per request
  const BATCH_SIZE = 100;
  const allResults: { id: string }[] = [];

  for (let i = 0; i < emails.length; i += BATCH_SIZE) {
    const batch = emails.slice(i, i + BATCH_SIZE);
    const batchPayload: BatchEmailItem[] = batch.map((email) => ({
      from: EMAIL_FROM,
      to: [email.to],
      subject: email.subject,
      html: email.html,
    }));

    const res = await fetch("https://api.resend.com/emails/batch", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(batchPayload),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Resend batch error:", error);
      return { data: allResults.length > 0 ? allResults : null, error };
    }

    const result = await res.json();
    if (result.data) {
      allResults.push(...result.data);
    }
  }

  return { data: allResults, error: null };
}

// Helper to truncate description to first 2 sentences
function truncateToTwoSentences(text: string): string {
  if (!text) return "";

  // Match sentences ending with . ! or ?
  const sentences = text.match(/[^.!?]*[.!?]+/g);
  if (!sentences || sentences.length === 0) {
    // No sentence endings found, truncate at 200 chars
    return text.length > 200 ? text.substring(0, 200) + "..." : text;
  }

  const firstTwo = sentences.slice(0, 2).join(" ").trim();
  if (sentences.length > 2) {
    return firstTwo + "...";
  }
  return firstTwo;
}

// Format deadline or return "Accepting pitches"
function formatDeadline(deadline: string | null): string {
  if (!deadline) return "Accepting pitches";

  const date = new Date(deadline);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Build the email HTML with stacked story requests
function buildEmailHtml(queries: QueryWithCategory[], appUrl: string): string {
  const storiesHtml = queries
    .map(
      (query) => `
    <div style="border-top: 2px solid #e5e7eb; padding: 20px 0;">
      <h3 style="margin: 0 0 8px 0; color: #111827; font-size: 18px;">
        ${query.title}
      </h3>
      <p style="margin: 0 0 12px 0; color: #4b5563; font-size: 14px; line-height: 1.5;">
        ${truncateToTwoSentences(query.description)}
      </p>
      <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 13px;">
        <strong>Category:</strong> ${query.category?.title || "General"}
      </p>
      <p style="margin: 0 0 12px 0; color: #6b7280; font-size: 13px;">
        <strong>Deadline:</strong> ${formatDeadline(query.deadline)}
      </p>
      <a href="${appUrl}/feed?beat=${query.category_id}" 
         style="display: inline-block; background-color: #2563eb; color: white; 
                padding: 10px 20px; text-decoration: none; border-radius: 6px;
                font-size: 14px; font-weight: 500;">
        Pitch your story
      </a>
    </div>
  `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                 background-color: #f9fafb; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; 
                  border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <div style="background-color: #1e40af; padding: 24px; text-align: center;">
          <h1 style="margin: 0; color: white; font-size: 24px;">
            New Story Requests
          </h1>
          <p style="margin: 8px 0 0 0; color: #bfdbfe; font-size: 14px;">
            ${queries.length} new ${
    queries.length === 1 ? "opportunity" : "opportunities"
  } matching your interests
          </p>
        </div>
        
        <div style="padding: 24px;">
          <p style="margin: 0 0 20px 0; color: #374151; font-size: 15px;">
            We've got some new story requests from journalists looking for expert sources 
            like you. Check them out below:
          </p>
          
          ${storiesHtml}
          
          <div style="border-top: 2px solid #e5e7eb; padding-top: 20px; margin-top: 20px;">
            <p style="margin: 0; color: #6b7280; font-size: 12px; text-align: center;">
              You're receiving this because you have email alerts enabled on 
              <a href="${appUrl}" style="color: #2563eb;">Contact Journalists</a>.
              <br>
              <a href="${appUrl}/founder/settings" style="color: #2563eb;">
                Manage your notification preferences
              </a>
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const appUrl = Deno.env.get("APP_URL") || "https://contactjournalists.com";

    // Verify user is authenticated and is admin
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if user is admin
    const { data: staffPrivileges } = await supabase
      .from("staff_privileges")
      .select("permissions")
      .eq("user_id", user.id)
      .single();

    if (!staffPrivileges?.permissions?.includes("admin")) {
      return new Response(
        JSON.stringify({ error: "Forbidden: Admin access required" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const body = await req.json();
    const queryIds: string[] = body.query_ids;

    if (!queryIds || !Array.isArray(queryIds) || queryIds.length === 0) {
      throw new Error("Missing or invalid query_ids array");
    }

    console.log(`Broadcasting alerts for ${queryIds.length} queries`);

    // Use service role key to fetch queries and profiles
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch the queries with their categories
    const { data: queries, error: queriesError } = await supabaseAdmin
      .from("queries")
      .select(
        "id, title, description, category_id, deadline, category:categories(id, title)"
      )
      .in("id", queryIds);

    if (queriesError) {
      console.error("Error fetching queries:", queriesError);
      throw new Error("Failed to fetch queries");
    }

    if (!queries || queries.length === 0) {
      throw new Error("No queries found for the provided IDs");
    }

    // Get unique category IDs from the queries
    const categoryIds = [...new Set(queries.map((q) => q.category_id))];

    // Fetch all founder/agency profiles with email_alerts enabled
    // that match at least one of the categories
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from("profiles")
      .select("email, categories, meta")
      .in("role", ["founder", "agency"])
      .eq("onboarding_complete", true);

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      throw new Error("Failed to fetch profiles");
    }

    // Filter profiles: must have email_alerts enabled AND match at least one category
    const recipients = (profiles as unknown as Profile[]).filter((p) => {
      // Check email_alerts is enabled
      if (p.meta?.email_alerts !== true) return false;

      // Check if profile has at least one matching category
      if (!p.categories || p.categories.length === 0) return true; // No categories = all categories
      return p.categories.some((cat) => categoryIds.includes(cat));
    });

    console.log(
      `Found ${recipients.length} recipients with matching categories`
    );

    if (recipients.length === 0) {
      return new Response(
        JSON.stringify({
          message:
            "No recipients found with matching categories and email alerts enabled",
          sent: 0,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Build and send emails using batch API
    const emailSubject =
      queries.length === 1
        ? `New HARO query just got posted: ${queries[0].title?.slice(0, 50)}`
        : `New ${queries.length} HARO queries just got posted`;

    const emailHtml = buildEmailHtml(queries as QueryWithCategory[], appUrl);

    // Prepare batch emails
    const emailsToSend = recipients.map((p) => ({
      to: p.email,
      subject: emailSubject,
      html: emailHtml,
    }));

    const batchResult = await sendBatchEmails(resendApiKey, emailsToSend);

    const successCount = batchResult.data?.length ?? 0;

    if (batchResult.error) {
      console.error(`Batch send had errors: ${batchResult.error}`);
    }

    console.log(
      `Successfully sent ${successCount} of ${recipients.length} emails`
    );

    return new Response(
      JSON.stringify({
        message: `Sent ${successCount} broadcast alerts`,
        sent: successCount,
        total: recipients.length,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    console.error("Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
