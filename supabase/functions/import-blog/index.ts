import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
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

  // Extract content - try multiple selectors
  let content = "";
  
  // Try to find main article content using common selectors
  const contentSelectors = [
    /<article[^>]*>([\s\S]*?)<\/article>/i,
    /<main[^>]*>([\s\S]*?)<\/main>/i,
    /<div[^>]*class=["'][^"']*prose[^"']*["'][^>]*>([\s\S]*?)<\/div>/i,
    /<div[^>]*class=["'][^"']*content[^"']*["'][^>]*>([\s\S]*?)<\/div>/i,
  ];

  for (const selector of contentSelectors) {
    const match = html.match(selector);
    if (match && match[1]) {
      content = match[1].trim();
      if (content.length > 500) {
        // Found substantial content
        break;
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
        .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, "");
      
      content = bodyContent.trim();
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
    // Check authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

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
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check if user has admin privileges (staff_privileges table)
    const { data: staffCheck } = await supabase
      .from("staff_privileges")
      .select("user_id")
      .eq("user_id", user.id)
      .single();

    if (!staffCheck) {
      return new Response(
        JSON.stringify({ error: "Forbidden: Admin access required" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Parse request body
    const { url } = await req.json();

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
    const { title, metaDescription, content } = parseHTML(html);

    if (!title) {
      return new Response(
        JSON.stringify({ error: "Could not extract title from page" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!content || content.length < 100) {
      return new Response(
        JSON.stringify({ error: "Could not extract sufficient content from page" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Generate slug
    let slug = extractSlugFromURL(url);
    if (!slug) {
      slug = generateSlugFromTitle(title);
    }

    // Check if blog with this slug already exists
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    const { data: existing } = await supabaseAdmin
      .from("blogs")
      .select("id")
      .eq("slug", slug)
      .single();

    if (existing) {
      return new Response(
        JSON.stringify({ error: `Blog with slug "${slug}" already exists` }),
        {
          status: 409,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Insert into database
    const now = new Date().toISOString();
    const { data: blog, error: insertError } = await supabaseAdmin
      .from("blogs")
      .insert({
        title,
        slug,
        status: "draft",
        publish_date: now,
        meta_description: metaDescription || null,
        content,
        created_at: now,
        last_updated: now,
        created_by: user.id,
        word_count: 0,
        seo_score: 0,
      })
      .select("id, title, slug")
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(
        JSON.stringify({ error: `Failed to save blog: ${insertError.message}` }),
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

