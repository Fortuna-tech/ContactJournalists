import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Define types for database responses
interface Profile {
  email: string;
  meta?: {
    email_alerts?: boolean;
  };
}

interface Query {
  id: string;
  title: string;
  journalist_id: string;
  category: string;
  description: string;
  profiles?: Profile; // joined journalist profile
}

interface Pitch {
  id: string;
  user_id: string;
  content: string;
  queries: Query;
  profiles?: Profile; // joined author profile
}

interface Comment {
  id: string;
  user_id: string;
  content: string;
  pitches: Pitch;
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

const EMAIL_FROM = "Contact Journalists <noreply@contactjournalists.com>";

async function sendEmail(apiKey: string | undefined, data: EmailData) {
  if (!apiKey) {
    console.log("Mock Email Send:", data);
    return { id: "mock-id" };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "HARO Platform <noreply@haro-platform.com>",
      to: [data.to],
      subject: data.subject,
      html: data.html,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    console.error("Resend error:", error);
    throw new Error(`Resend API error: ${error}`);
  }

  return await res.json();
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
    const appUrl = Deno.env.get("APP_URL") || "http://localhost:5173";

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

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();
    const type = body.type || (body.pitch_id ? "new_pitch" : "unknown");

    console.log(`Processing notification type: ${type}`);

    if (type === "new_pitch") {
      // Case 2: Notify Journalist about new pitch
      const pitchId =
        body.pitch_id || body.payload?.pitch_id || body.record?.id;
      if (!pitchId) throw new Error("Missing pitch_id");

      const { data: pitch, error: pitchError } = await supabase
        .from("pitches")
        .select(
          `
          id,
          user_id,
          content,
          queries!inner (
            id,
            title,
            journalist_id,
            profiles!queries_journalist_id_fkey (
              id,
              email
            )
          )
        `
        )
        .eq("id", pitchId)
        .single();

      if (pitchError || !pitch)
        throw new Error("Pitch not found or access denied");

      // Cast to Pitch type (Supabase types are generic, manual cast for safety)
      const pitchData = pitch as unknown as Pitch;
      const journalistEmail = pitchData.queries.profiles?.email;

      if (pitchData.user_id !== user.id) {
        return new Response(JSON.stringify({ error: "Forbidden" }), {
          status: 403,
          headers: corsHeaders,
        });
      }

      if (!journalistEmail) throw new Error("Journalist email not found");

      await sendEmail(resendApiKey, {
        to: journalistEmail,
        subject: `New pitch for your query: ${pitchData.queries.title}`,
        html: `
          <h2>New Pitch Received</h2>
          <p>You have received a new pitch for your query: <strong>${
            pitchData.queries.title
          }</strong></p>
          <h3>Pitch Content:</h3>
          <p>${pitchData.content.replace(/\n/g, "<br>")}</p>
          <p><a href="${appUrl}/journalist/requests/${
          pitchData.queries.id
        }">View Pitch</a></p>
        `,
      });

      return new Response(
        JSON.stringify({ message: "Notification sent to journalist" }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (type === "new_comment") {
      // Case 3 & 4: Notify about new comment
      const commentId =
        body.comment_id || body.payload?.comment_id || body.record?.id;
      if (!commentId) throw new Error("Missing comment_id");

      const { data: comment, error: commentError } = await supabase
        .from("pitch_comments")
        .select(
          `
          id,
          user_id,
          content,
          pitches!inner (
            id,
            user_id,
            queries!inner (
              id,
              title,
              journalist_id,
              profiles!queries_journalist_id_fkey (email)
            ),
            profiles!pitches_user_id_fkey (email)
          )
        `
        )
        .eq("id", commentId)
        .single();

      if (commentError || !comment) throw new Error("Comment not found");

      const commentData = comment as unknown as Comment;
      const pitch = commentData.pitches;
      const query = pitch.queries;
      const authorId = commentData.user_id;

      if (authorId !== user.id) {
        return new Response(JSON.stringify({ error: "Forbidden" }), {
          status: 403,
          headers: corsHeaders,
        });
      }

      let targetEmail: string | undefined;
      let subject = "";
      let context = "";
      let actionLink = "";

      if (authorId === query.journalist_id) {
        // Journalist commented -> Notify Pitch Author
        targetEmail = pitch.profiles?.email;
        subject = `Journalist responded to your pitch: ${query.title}`;
        context = "The journalist has responded to your pitch.";
        actionLink = `${appUrl}/founder/my-activity`;
      } else if (authorId === pitch.user_id) {
        // Pitch author commented -> Notify Journalist
        targetEmail = query.profiles?.email;
        subject = `New comment on pitch for: ${query.title}`;
        context = "The pitch author has left a comment on their pitch.";
        actionLink = `${appUrl}/journalist/requests/${query.id}`;
      }

      if (targetEmail) {
        await sendEmail(resendApiKey, {
          to: targetEmail,
          subject,
          html: `
            <h2>${subject}</h2>
            <p>${context}</p>
            <p><strong>Comment:</strong></p>
            <p>${commentData.content.replace(/\n/g, "<br>")}</p>
            <p><a href="${actionLink}">View Conversation</a></p>
          `,
        });
        return new Response(JSON.stringify({ message: "Notification sent" }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } else {
        return new Response(
          JSON.stringify({
            message: "No notification needed (self-reply or unknown)",
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    if (type === "new_query") {
      // Case 1: Notify Founders/Agencies
      const queryId =
        body.query_id || body.payload?.query_id || body.record?.id;
      if (!queryId) throw new Error("Missing query_id");

      const { data: query, error: queryError } = await supabase
        .from("queries")
        .select("id, title, category, description, journalist_id")
        .eq("id", queryId)
        .single();

      if (queryError || !query) throw new Error("Query not found");

      if (query.journalist_id !== user.id) {
        return new Response(JSON.stringify({ error: "Forbidden" }), {
          status: 403,
          headers: corsHeaders,
        });
      }

      const { data: profiles, error: profilesError } = await supabaseAdmin
        .from("profiles")
        .select("email, meta")
        .in("role", ["founder", "agency"])
        .contains("categories", [query.category]);

      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        throw new Error("Failed to fetch matching profiles");
      }

      // Explicitly cast profiles to Profile[] to access meta safely
      const recipients = (profiles as unknown as Profile[]).filter(
        (p) => p.meta?.email_alerts === true
      );

      console.log(
        `Found ${recipients.length} recipients for query notification`
      );

      const emailPromises = recipients.map((p) =>
        sendEmail(resendApiKey, {
          to: p.email,
          subject: `New Opportunity: ${query.title}`,
          html: `
            <h2>New Journalist Request</h2>
            <p>A new request matching your category <strong>${
              query.category
            }</strong> has been posted.</p>
            <h3>${query.title}</h3>
            <p>${query.description.substring(0, 300)}${
            query.description.length > 300 ? "..." : ""
          }</p>
            <p><a href="${appUrl}/founder/find-journalists">View Request</a></p>
          `,
        })
      );

      await Promise.allSettled(emailPromises);

      return new Response(
        JSON.stringify({ message: `Sent ${recipients.length} notifications` }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    throw new Error(`Unknown notification type: ${type}`);
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
