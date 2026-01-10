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

async function importBlogViaEdgeFunction(url: string, password: string): Promise<{
  id: string;
  title: string;
  slug: string;
}> {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !anonKey) {
      throw new Error("Missing Supabase configuration");
    }

    const functionUrl = `${supabaseUrl}/functions/v1/import-blog`;
    
    console.log(`Calling edge function for: ${url}`);
    const response = await fetch(functionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${anonKey}`,
        "apikey": anonKey,
      },
      body: JSON.stringify({
        url,
        password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(errorData.error || errorData.message || `HTTP ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error(`Error calling edge function for ${url}:`, error);
    throw error;
  }
}

export async function batchImportBlogs() {
  console.log("Starting batch import of blog posts...");
  const results: Array<{ url: string; success: boolean; error?: string }> = [];

  // Get admin password from env or use default
  const adminPassword = import.meta.env.VITE_BLOG_ADMIN_PASSWORD || "admin123";

  for (const blogUrl of BLOG_URLS) {
    try {
      console.log(`\nProcessing: ${blogUrl.url}`);

      // First, check if blog already exists
      const slug = blogUrl.slug;
      const { data: existing } = await supabase
        .from("blogs")
        .select("id, content")
        .eq("slug", slug)
        .maybeSingle();

      if (existing) {
        console.log(`Blog ${slug} already exists, updating...`);

        // Update existing blog with publish date and status
        const updates: any = {
          status: "published",
          last_updated: new Date().toISOString(),
        };

        if (blogUrl.expectedPublishDate) {
          updates.publish_date = blogUrl.expectedPublishDate;
        }

        // Try to get fresh content from the URL
        try {
          const imported = await importBlogViaEdgeFunction(blogUrl.url, adminPassword);
          if (imported) {
            // If we got new content, update it
            const { data: freshBlog } = await supabase
              .from("blogs")
              .select("*")
              .eq("id", imported.id)
              .maybeSingle();

            if (freshBlog && freshBlog.content && freshBlog.content.length > existing.content?.length) {
              updates.content = freshBlog.content;
              updates.word_count = freshBlog.word_count || 0;
            }
          }
        } catch (importError) {
          console.warn(`Could not get fresh content for ${slug}, keeping existing`);
        }

        // Recalculate SEO if we have content
        if (updates.content || existing.content) {
          const content = updates.content || existing.content;
          if (content && content.trim().length > 0) {
            const seoData = calculateSEOScore({
              title: existing.title || "Blog Post",
              metaDescription: undefined,
              content: content,
              slug: slug,
            });

            updates.seo_score = seoData.score;
            updates.seo_breakdown = seoData.breakdown;
            updates.seo_flags = seoData.flags;
            updates.seo_last_scored_at = new Date().toISOString();
          }
        }

        const { error: updateError } = await supabase
          .from("blogs")
          .update(updates)
          .eq("id", existing.id);

        if (updateError) {
          console.error(`Failed to update ${slug}:`, updateError);
          results.push({
            url: blogUrl.url,
            success: false,
            error: updateError.message,
          });
        } else {
          console.log(`✓ Updated existing blog: ${slug}`);
          results.push({ url: blogUrl.url, success: true });
        }
      } else {
        // Blog doesn't exist, try to import it
        try {
          const imported = await importBlogViaEdgeFunction(blogUrl.url, adminPassword);
          console.log(`✓ Imported new blog: ${imported.title}`);

          // Update with expected publish date
          if (blogUrl.expectedPublishDate) {
            const { error: updateError } = await supabase
              .from("blogs")
              .update({
                publish_date: blogUrl.expectedPublishDate,
                status: "published",
                last_updated: new Date().toISOString(),
              })
              .eq("id", imported.id);

            if (updateError) {
              console.warn(`Warning: Could not update publish date for ${imported.id}:`, updateError);
            }
          }

          results.push({ url: blogUrl.url, success: true });
        } catch (importError: any) {
          console.error(`✗ Failed to import ${blogUrl.url}:`, importError);
          results.push({
            url: blogUrl.url,
            success: false,
            error: importError.message || String(importError),
          });
        }
      }
    } catch (error: any) {
      console.error(`✗ Failed to process ${blogUrl.url}:`, error);
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

