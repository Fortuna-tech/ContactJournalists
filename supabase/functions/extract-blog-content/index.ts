import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface BlogFile {
  slug: string;
  title: string;
  file: string;
  publishDate: string;
}

interface BlogUpdate {
  slug: string;
  title: string;
  content: string;
  publishDate: string;
  metaDescription?: string;
}

function extractContentFromComponent(componentContent: string): string {
  try {
    // Find the prose div start - more flexible pattern
    const proseStartPattern = /<div\s+className="[^"]*prose[^"]*prose-invert[^"]*prose-lg[^"]*max-w-none[^"]*"[^>]*>/;
    const proseStart = componentContent.search(proseStartPattern);

    if (proseStart === -1) {
      console.warn("Could not find prose section");
      return "";
    }

    // Count div tags to find the matching closing div
    let divCount = 0;
    let inJSXExpression = false;
    let inString = false;
    let stringChar = '';
    let endPos = proseStart;

    for (let i = proseStart; i < componentContent.length; i++) {
      const char = componentContent[i];
      const nextChar = componentContent[i + 1] || '';

      // Handle strings
      if (!inJSXExpression && !inString && (char === '"' || char === "'")) {
        inString = true;
        stringChar = char;
      } else if (inString && char === stringChar && componentContent[i - 1] !== '\\') {
        inString = false;
      }

      // Handle JSX expressions
      if (!inString && char === '{') {
        inJSXExpression = true;
      } else if (!inString && char === '}') {
        inJSXExpression = false;
      }

      // Count div tags (outside strings and JSX expressions)
      if (!inString && !inJSXExpression) {
        if (char === '<' && nextChar === '/' && componentContent.substr(i, 6) === '</div>') {
          divCount--;
          if (divCount === 0) {
            endPos = i + 6; // Include the closing </div>
            break;
          }
        } else if (char === '<' && componentContent.substr(i, 5) === '<div ') {
          divCount++;
        }
      }
    }

    // Extract content
    let extractedContent = componentContent.substring(proseStart, endPos);

    // Convert JSX to HTML
    extractedContent = extractedContent.replace(/className=/g, 'class=');
    extractedContent = extractedContent.replace(/\{\/\*.*?\*\/\}/g, ''); // Remove JSX comments
    extractedContent = extractedContent.replace(/\{[^}]*\}/g, ''); // Remove JSX expressions

    // Clean up multiple spaces and newlines
    extractedContent = extractedContent
      .replace(/\n\s*\n/g, '\n') // Remove empty lines
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();

    return extractedContent;
  } catch (error: any) {
    console.error("Error extracting content:", error);
    return "";
  }
}

function calculateSEO(content: string, title: string, slug: string) {
  // Simple SEO calculation
  const wordCount = content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(w => w.length > 0).length;

  let score = 50; // Base score

  // Title length (30-60 chars ideal)
  if (title.length >= 30 && title.length <= 60) score += 10;

  // Word count (300+ words ideal)
  if (wordCount >= 300) score += 10;
  else if (wordCount >= 150) score += 5;

  // Has headings
  if (content.includes('<h2') || content.includes('<h3')) score += 10;

  // Has links
  if (content.includes('<a href=')) score += 5;

  // Has images
  if (content.includes('<img')) score += 5;

  return {
    score: Math.min(100, score),
    breakdown: {
      title_length: { score: title.length >= 30 && title.length <= 60 ? 10 : 0, max: 10 },
      word_count: { score: wordCount >= 300 ? 10 : wordCount >= 150 ? 5 : 0, max: 10 },
      headings: { score: content.includes('<h2') || content.includes('<h3') ? 10 : 0, max: 10 },
      links: { score: content.includes('<a href=') ? 5 : 0, max: 5 },
      images: { score: content.includes('<img') ? 5 : 0, max: 5 },
    },
    flags: [],
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const blogAdminPassword = Deno.env.get("BLOG_ADMIN_PASSWORD") || "admin123";

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();
    const { password, blogUpdates } = body;

    // Authenticate
    if (password !== blogAdminPassword) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!blogUpdates || !Array.isArray(blogUpdates)) {
      return new Response(
        JSON.stringify({ error: "blogUpdates array required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const results = [];

    for (const blogUpdate of blogUpdates) {
      try {
        console.log(`Processing: ${blogUpdate.slug}`);

        const content = blogUpdate.content;

        if (!content || content.length < 100) {
          console.warn(`No content provided for ${blogUpdate.slug}`);
          results.push({ slug: blogUpdate.slug, success: false, error: 'No content provided' });
          continue;
        }

        console.log(`Processing ${content.length} characters for ${blogUpdate.slug}`);

        // Calculate word count properly
        const cleanContent = content
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
          .replace(/<[^>]*>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        const wordCount = cleanContent.split(/\s+/).filter(w => w.length > 0).length;

        // Calculate SEO
        const seoData = calculateSEO(content, blogUpdate.title, blogUpdate.slug);

        // Update database
        const { error } = await supabaseAdmin
          .from("blogs")
          .update({
            title: blogUpdate.title,
            content: content,
            meta_description: blogUpdate.metaDescription || null,
            status: "published",
            word_count: wordCount,
            seo_score: seoData.score,
            seo_breakdown: seoData.breakdown,
            seo_flags: seoData.flags,
            seo_last_scored_at: new Date().toISOString(),
            publish_date: blogUpdate.publishDate,
            last_updated: new Date().toISOString(),
          })
          .eq("slug", blogUpdate.slug);

        if (error) {
          console.error(`Database update failed for ${blogUpdate.slug}:`, error);
          results.push({ slug: blogUpdate.slug, success: false, error: error.message });
        } else {
          console.log(`✓ Updated ${blogUpdate.slug} with ${wordCount} words`);
          results.push({ slug: blogUpdate.slug, success: true });
        }

      } catch (error: any) {
        console.error(`Error processing ${blogFile.slug}:`, error);
        results.push({ slug: blogFile.slug, success: false, error: error.message });
      }
    }

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Function error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
