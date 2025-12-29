import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Whitelist allowed domains
const ALLOWED_DOMAINS = ["contactjournalists.com", "www.contactjournalists.com"];
const MAX_FETCH_SIZE = 5 * 1024 * 1024; // 5MB
const FETCH_TIMEOUT = 30000; // 30 seconds

interface ImportResult {
  id: string;
  title: string;
  slug: string;
}

function extractSlugFromURL(url: string): string {
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    // Extract slug from /blog/slug-here
    const match = path.match(/\/blog\/([^\/]+)/);
    if (match && match[1]) {
      return match[1];
    }
    return "";
  } catch {
    return "";
  }
}

function generateSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .substring(0, 100);
}

async function fetchWithTimeout(url: string, timeout: number): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ContactJournalists/1.0)",
      },
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

function parseHTML(html: string): {
  title: string;
  metaDescription: string;
  content: string;
} {
  // Extract title
  let title = "";
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) {
    title = titleMatch[1].trim();
  }
  
  // Try og:title if no title
  if (!title) {
    const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
    if (ogTitleMatch) {
      title = ogTitleMatch[1].trim();
    }
  }

  // Extract meta description
  let metaDescription = "";
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
  if (descMatch) {
    metaDescription = descMatch[1].trim();
  }
  
  // Try og:description if no meta description
  if (!metaDescription) {
    const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
    if (ogDescMatch) {
      metaDescription = ogDescMatch[1].trim();
    }
  }

  // Extract content - specifically look for the blog prose content
  let content = "";

  // First, try the most specific selector for ContactJournalists.com blogs
  // Look for: <div class="prose prose-invert prose-lg max-w-none">
  const proseSelector = /<div[^>]*class=["'][^"']*prose[^"']*prose-invert[^"']*prose-lg[^"']*max-w-none[^"']*["'][^>]*>([\s\S]*?)<\/div>/i;
  const proseMatch = html.match(proseSelector);
  if (proseMatch && proseMatch[1]) {
    const candidate = proseMatch[1].trim();
    if (candidate.length > 1000) { // Blogs should be much longer than 1000 chars
      content = candidate;
    }
  }

  // If that didn't work, try alternative selectors
  if (!content) {
    const contentSelectors = [
      /<div[^>]*class=["'][^"']*prose[^"']*max-w-none[^"']*["'][^>]*>([\s\S]*?)<\/div>/i,
      /<div[^>]*class=["'][^"']*max-w-4xl[^"']*["'][^>]*>([\s\S]*?)<\/div>/i,
      /<article[^>]*>([\s\S]*?)<\/article>/i,
      /<main[^>]*>([\s\S]*?)<\/main>/i,
    ];

    for (const selector of contentSelectors) {
      const match = html.match(selector);
      if (match && match[1]) {
        const candidate = match[1].trim();
        // Look for substantial content (has paragraphs, headings, etc.)
        if (candidate.length > 1000 &&
            (candidate.includes('<p') || candidate.includes('<h') || candidate.includes('text-'))) {
          content = candidate;
          break;
        }
      }
    }
  }

  // Fallback: extract body content, remove scripts, styles, nav, header, footer
  if (!content || content.length < 500) {
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) {
      let bodyContent = bodyMatch[1];
      
      // Remove unwanted elements
      bodyContent = bodyContent
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
        .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "")
        .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
        .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, "")
        .replace(/<div[^>]*id=["']root["'][^>]*>([\s\S]*?)<\/div>/gi, "$1"); // Extract React root content
      
      // Try to find the main content div within body
      const mainContentMatch = bodyContent.match(/<div[^>]*class=["'][^"']*min-h-screen[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
      if (mainContentMatch && mainContentMatch[1].length > 500) {
        content = mainContentMatch[1].trim();
      } else {
        content = bodyContent.trim();
      }
    }
  }
  
  // If still no content, try to extract from React hydration data or JSON
  if (!content || content.length < 100) {
    // Look for JSON data in script tags that might contain content
    const jsonDataMatch = html.match(/<script[^>]*type=["']application\/json["'][^>]*>([\s\S]*?)<\/script>/i);
    if (jsonDataMatch) {
      try {
        const jsonData = JSON.parse(jsonDataMatch[1]);
        if (jsonData.content || jsonData.body) {
          content = jsonData.content || jsonData.body;
        }
      } catch {
        // Ignore JSON parse errors
      }
    }
  }

  // Clean up content - remove excessive whitespace but preserve structure
  if (content) {
    content = content
      .replace(/\s+/g, " ")
      .replace(/>\s+</g, "><")
      .trim();
  }

  return { title, metaDescription, content };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  try {
    // Log incoming request for debugging
    console.log("Import blog request received");
    console.log("Method:", req.method);
    console.log("URL:", req.url);
    console.log("Headers:", Object.fromEntries(req.headers.entries()));
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const blogAdminPassword = Deno.env.get("BLOG_ADMIN_PASSWORD") || "admin123";

    if (!supabaseUrl) {
      return new Response(
        JSON.stringify({ error: "SUPABASE_URL environment variable is not set" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: "SUPABASE_SERVICE_ROLE_KEY environment variable is not set" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create admin client with service role key (bypasses RLS)
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body
    const body = await req.json();
    const { url, password } = body;

    // Check authentication - either Supabase auth or password
    let userId: string | null = null;
    const authHeader = req.headers.get("Authorization");

    // First check password auth (for blog admin dashboard) - this is simpler and works without auth headers
    if (password && password === blogAdminPassword) {
      userId = "blog-admin"; // Placeholder ID for password auth
    } else if (authHeader) {
      // Try Supabase auth if password doesn't match
      try {
        const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
        if (supabaseAnonKey) {
          const supabase = createClient(supabaseUrl, supabaseAnonKey, {
            global: {
              headers: { Authorization: authHeader },
            },
          });

          const {
            data: { user },
            error: authError,
          } = await supabase.auth.getUser();

          if (!authError && user) {
            // Check if user has admin privileges
            const { data: staffCheck } = await supabase
              .from("staff_privileges")
              .select("user_id")
              .eq("user_id", user.id)
              .maybeSingle();

            if (staffCheck) {
              userId = user.id;
            }
          }
        }
      } catch (error) {
        console.error("Supabase auth error:", error);
        // Supabase auth failed, will check password below
      }
    }

    if (!userId) {
      return new Response(
        JSON.stringify({ 
          error: "Unauthorized: Admin access required",
          hint: password ? "Password incorrect or missing" : "Password required in request body"
        }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!url || typeof url !== "string") {
      return new Response(
        JSON.stringify({ error: "URL is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate URL and check whitelist
    let urlObj: URL;
    try {
      urlObj = new URL(url);
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid URL format" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const hostname = urlObj.hostname.replace(/^www\./, "");
    if (!ALLOWED_DOMAINS.includes(hostname)) {
      return new Response(
        JSON.stringify({ error: "Domain not whitelisted. Only contactjournalists.com/blog/* URLs are allowed." }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check URL path starts with /blog/
    if (!urlObj.pathname.startsWith("/blog/")) {
      return new Response(
        JSON.stringify({ error: "URL must be from /blog/* path" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Fetch HTML
    let html: string;
    try {
      const response = await fetchWithTimeout(url, FETCH_TIMEOUT);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentLength = response.headers.get("content-length");
      if (contentLength && parseInt(contentLength) > MAX_FETCH_SIZE) {
        throw new Error("Response too large");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response body");
      }

      let htmlChunks: Uint8Array[] = [];
      let totalSize = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        totalSize += value.length;
        if (totalSize > MAX_FETCH_SIZE) {
          throw new Error("Response too large");
        }

        htmlChunks.push(value);
      }

      html = new TextDecoder().decode(
        new Uint8Array(htmlChunks.reduce((acc, chunk) => [...acc, ...chunk], [] as number[]))
      );
    } catch (error: any) {
      return new Response(
        JSON.stringify({ error: `Failed to fetch URL: ${error.message}` }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Parse HTML
    let { title, metaDescription, content } = parseHTML(html);

    if (!title) {
      return new Response(
        JSON.stringify({ error: "Could not extract title from page" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // If content extraction fails, create a placeholder that can be edited
    if (!content || content.length < 100) {
      console.warn("Could not extract sufficient content, creating placeholder");
      // Create a minimal content entry that can be edited
      content = `<div class="prose">
        <p><strong>Note:</strong> Content could not be automatically extracted from this React-rendered page.</p>
        <p>Please edit this blog post and add the content manually by:</p>
        <ol>
          <li>Opening the blog post URL in your browser</li>
          <li>Copying the content</li>
          <li>Pasting it into the content field</li>
        </ol>
        <p>Original URL: <a href="${url}" target="_blank">${url}</a></p>
      </div>`;
      
      // Still proceed with import, but with placeholder content
      // The user can edit it later
    }

    // Generate slug
    let slug = extractSlugFromURL(url);
    if (!slug) {
      slug = generateSlugFromTitle(title);
    }

    // Check if blog with this slug already exists (using admin client)
    const { data: existing, error: checkError } = await supabaseAdmin
      .from("blogs")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (checkError) {
      console.error("Check existing error:", checkError);
      return new Response(
        JSON.stringify({ error: `Failed to check existing blog: ${checkError.message}` }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (existing) {
      return new Response(
        JSON.stringify({ error: `Blog with slug "${slug}" already exists` }),
        {
          status: 409,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Calculate word count
    const wordCount = content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(w => w.length > 0).length;

    // Determine status - published if we have substantial content
    const status = (content && content.length > 1000) ? "published" : "draft";

    // Insert into database
    const now = new Date().toISOString();
    const { data: blog, error: insertError } = await supabaseAdmin
      .from("blogs")
      .insert({
        title,
        slug,
        status,
        publish_date: now,
        meta_description: metaDescription || null,
        content,
        created_at: now,
        last_updated: now,
        created_by: userId !== "blog-admin" ? userId : null,
        word_count: wordCount,
        seo_score: 0,
      })
      .select("id, title, slug")
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(
        JSON.stringify({ 
          error: `Failed to save blog: ${insertError.message}`,
          details: insertError.details || null,
          hint: insertError.hint || null,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const result: ImportResult = {
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Import blog error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

