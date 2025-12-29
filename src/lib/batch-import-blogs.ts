/**
 * Batch import script to fetch and import all blog posts from URLs
 * Run this from the admin dashboard console or add a button to trigger it
 */

import { supabase } from "./supabaseClient";
import { calculateSEOScore } from "./blog-seo";

interface BlogURL {
  url: string;
  slug: string;
  expectedTitle?: string;
  expectedPublishDate?: string;
}

const BLOG_URLS: BlogURL[] = [
  {
    url: "https://contactjournalists.com/blog/press-pitch-examples-that-get-replies",
    slug: "press-pitch-examples-that-get-replies",
    expectedPublishDate: "2025-11-16T00:00:00Z",
  },
  {
    url: "https://contactjournalists.com/blog/the-fastest-ways-to-get-press-coverage-without-an-agency",
    slug: "the-fastest-ways-to-get-press-coverage-without-an-agency",
    expectedPublishDate: "2025-12-19T00:00:00Z",
  },
  {
    url: "https://contactjournalists.com/blog/how-to-pitch-journalists-on-twitter",
    slug: "how-to-pitch-journalists-on-twitter",
    expectedPublishDate: "2025-12-27T00:00:00Z",
  },
  {
    url: "https://contactjournalists.com/blog/ultimate-guide-best-platforms-contacting-journalists-2026",
    slug: "ultimate-guide-best-platforms-contacting-journalists-2026",
    expectedPublishDate: "2025-12-01T00:00:00Z",
  },
  {
    url: "https://contactjournalists.com/blog/free-small-business-pl-template-google-sheets-excel",
    slug: "free-small-business-pl-template-google-sheets-excel",
    expectedPublishDate: "2025-11-15T00:00:00Z",
  },
];

function extractSlugFromURL(url: string): string {
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    const match = path.match(/\/blog\/([^\/]+)/);
    if (match && match[1]) {
      return match[1];
    }
    return "";
  } catch {
    return "";
  }
}

function parseHTML(html: string): {
  title: string;
  metaDescription: string;
  content: string;
  publishDate: string | null;
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

  // Extract publish date - look for date in article or meta tags
  let publishDate: string | null = null;
  
  // Try article:published_time
  const pubTimeMatch = html.match(/<meta[^>]*property=["']article:published_time["'][^>]*content=["']([^"']+)["']/i);
  if (pubTimeMatch) {
    publishDate = pubTimeMatch[1].trim();
  }
  
  // Try to find date in content (look for time elements or date patterns)
  if (!publishDate) {
    const timeMatch = html.match(/<time[^>]*datetime=["']([^"']+)["'][^>]*>/i);
    if (timeMatch) {
      publishDate = timeMatch[1].trim();
    }
  }
  
  // Try to find date in text (December 19, 2025 format)
  if (!publishDate) {
    const datePatterns = [
      /(December|January|February|March|April|May|June|July|August|September|October|November)\s+(\d{1,2}),\s+(\d{4})/i,
      /(\d{4})-(\d{2})-(\d{2})/,
    ];
    for (const pattern of datePatterns) {
      const match = html.match(pattern);
      if (match) {
        // Convert to ISO format if needed
        try {
          const date = new Date(match[0]);
          if (!isNaN(date.getTime())) {
            publishDate = date.toISOString();
            break;
          }
        } catch (e) {
          // Continue to next pattern
        }
      }
    }
  }

  // Extract content - try multiple selectors for React-rendered pages
  let content = "";
  
  // Try to find main content area
  const contentSelectors = [
    /<div[^>]*class=["'][^"']*prose[^"']*["'][^>]*>([\s\S]*?)<\/div>/i,
    /<article[^>]*>([\s\S]*?)<\/article>/i,
    /<main[^>]*>([\s\S]*?)<\/main>/i,
    /<div[^>]*class=["'][^"']*max-w-4xl[^"']*["'][^>]*>([\s\S]*?)<\/div>/i,
  ];

  for (const selector of contentSelectors) {
    const match = html.match(selector);
    if (match && match[1]) {
      const candidate = match[1].trim();
      if (candidate.length > 500) {
        content = candidate;
        break;
      }
    }
  }

  // Fallback: extract body content
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
      
      // Try to find main content div
      const mainContentMatch = bodyContent.match(/<div[^>]*class=["'][^"']*min-h-screen[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
      if (mainContentMatch && mainContentMatch[1].length > 500) {
        content = mainContentMatch[1].trim();
      } else {
        content = bodyContent.trim();
      }
    }
  }

  // Clean up content - remove React-specific attributes but keep structure
  if (content) {
    // Replace className with class for better HTML compatibility
    content = content.replace(/className=/g, "class=");
    // Remove React-specific props that might cause issues
    content = content.replace(/\s+target={[^}]+}/g, "");
    content = content.replace(/\s+rel={[^}]+}/g, "");
  }

  return {
    title,
    metaDescription,
    content,
    publishDate,
  };
}

async function fetchBlogContent(url: string): Promise<{
  title: string;
  metaDescription: string;
  content: string;
  publishDate: string | null;
}> {
  try {
    console.log(`Fetching: ${url}`);
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ContactJournalists/1.0)",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const parsed = parseHTML(html);

    if (!parsed.title) {
      throw new Error("Could not extract title");
    }

    if (!parsed.content || parsed.content.length < 500) {
      throw new Error("Could not extract sufficient content");
    }

    return parsed;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
}

export async function batchImportBlogs() {
  console.log("Starting batch import of blog posts...");
  const results: Array<{ url: string; success: boolean; error?: string }> = [];

  for (const blogUrl of BLOG_URLS) {
    try {
      console.log(`\nProcessing: ${blogUrl.url}`);

      // Fetch and parse content
      const { title, metaDescription, content, publishDate } = await fetchBlogContent(blogUrl.url);

      // Use expected publish date if available, otherwise use extracted date or current date
      const finalPublishDate = blogUrl.expectedPublishDate || publishDate || new Date().toISOString();

      // Calculate word count
      const wordCount = content.replace(/<[^>]*>/g, " ").split(/\s+/).filter((w) => w.length > 0).length;

      // Calculate SEO score
      const seoData = calculateSEOScore({
        title,
        metaDescription,
        content,
        slug: blogUrl.slug,
      });

      // Check if blog already exists
      const { data: existing } = await supabase
        .from("blogs")
        .select("id")
        .eq("slug", blogUrl.slug)
        .single();

      const blogData = {
        title,
        slug: blogUrl.slug,
        status: "published" as const,
        publish_date: finalPublishDate,
        meta_description: metaDescription || null,
        content,
        word_count: wordCount,
        seo_score: seoData.score,
        seo_breakdown: seoData.breakdown,
        seo_flags: seoData.flags,
        seo_last_scored_at: new Date().toISOString(),
        last_updated: new Date().toISOString(),
      };

      if (existing) {
        // Update existing blog
        console.log(`Updating existing blog: ${title}`);
        const { error } = await supabase
          .from("blogs")
          .update(blogData)
          .eq("id", existing.id);

        if (error) {
          throw error;
        }
        console.log(`✓ Updated: ${title}`);
      } else {
        // Insert new blog
        console.log(`Inserting new blog: ${title}`);
        const { error } = await supabase.from("blogs").insert(blogData);

        if (error) {
          throw error;
        }
        console.log(`✓ Inserted: ${title}`);
      }

      results.push({ url: blogUrl.url, success: true });
    } catch (error: any) {
      console.error(`✗ Failed to import ${blogUrl.url}:`, error);
      results.push({
        url: blogUrl.url,
        success: false,
        error: error.message || String(error),
      });
    }
  }

  console.log("\n=== Batch Import Complete ===");
  console.log(`Total: ${BLOG_URLS.length}`);
  console.log(`Successful: ${results.filter((r) => r.success).length}`);
  console.log(`Failed: ${results.filter((r) => !r.success).length}`);

  if (results.some((r) => !r.success)) {
    console.log("\nFailed imports:");
    results
      .filter((r) => !r.success)
      .forEach((r) => {
        console.log(`  - ${r.url}: ${r.error}`);
      });
  }

  return results;
}

// Make available in browser console
if (typeof window !== "undefined") {
  (window as any).batchImportBlogs = batchImportBlogs;
}

