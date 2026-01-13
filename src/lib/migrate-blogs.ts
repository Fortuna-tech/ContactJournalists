/**
 * Migration script to extract content from existing blog components
 * and insert them into the Supabase blogs table.
 * 
 * Run this once to migrate all existing blog posts.
 */

import { supabase } from "./supabaseClient";

interface BlogMigrationData {
  title: string;
  slug: string;
  status: "published" | "draft" | "scheduled";
  publish_date: string;
  meta_description?: string;
  content: string;
}

// Blog post data extracted from existing components
const blogPosts: BlogMigrationData[] = [
  {
    title: "How To Pitch Journalists on Twitter (Full Breakdown)",
    slug: "how-to-pitch-journalists-on-twitter",
    status: "published",
    publish_date: "2025-12-27T00:00:00Z",
    meta_description: "Learn how to pitch journalists on Twitter. Real strategies from a founder who got press coverage through Twitter. Full breakdown of what works and what doesn't.",
    content: "", // Will be populated from component file
  },
  {
    title: "The Fastest Ways to Get Press Coverage Without an Agency",
    slug: "the-fastest-ways-to-get-press-coverage-without-an-agency",
    status: "published",
    publish_date: "2025-12-19T00:00:00Z",
    meta_description: "Learn the fastest ways to get press coverage without hiring a PR agency. Real strategies from a founder who built coverage for their business from scratch.",
    content: "",
  },
  {
    title: "7 Press Pitch Examples That Actually Get Replies",
    slug: "press-pitch-examples-that-get-replies",
    status: "published",
    publish_date: "2025-11-16T00:00:00Z",
    meta_description: "Real press pitch examples that work in 2025. Founder-friendly templates, timing strategies, and proven examples for getting journalist replies. Copy, customize, and start pitching.",
    content: "",
  },
  {
    title: "The Ultimate Guide to the Best Platforms for Contacting Journalists in 2026",
    slug: "ultimate-guide-best-platforms-contacting-journalists-2026",
    status: "published",
    publish_date: "2025-12-01T00:00:00Z",
    meta_description: "Complete guide to the best platforms for contacting journalists in 2026. Compare PR tools, media databases, and outreach platforms to get press coverage for your brand.",
    content: "",
  },
  {
    title: "How to Get Press for Your Brand Without a PR Agency",
    slug: "how-to-get-press-for-your-brand-without-a-pr-agency",
    status: "published",
    publish_date: "2025-01-01T00:00:00Z",
    meta_description: "",
    content: "",
  },
  {
    title: "Free Small Business P&L Template (Google Sheets + Excel)",
    slug: "free-small-business-pl-template-google-sheets-excel",
    status: "published",
    publish_date: "2025-11-15T00:00:00Z",
    meta_description: "Free small business Profit & Loss template for Google Sheets and Excel. Track revenue, expenses and profit easily. Built for founders, startups and solopreneurs.",
    content: "",
  },
];

/**
 * Extract JSX content from a blog component file
 * This is a helper function - actual content extraction should be done manually
 * or via a build-time script that reads the component files
 */
function extractContentFromComponent(componentPath: string): string {
  // This would need to parse the JSX/TSX file and extract the content
  // For now, return empty string - content should be added via admin form
  return "";
}

/**
 * Migrate all blog posts to Supabase
 */
export async function migrateBlogs() {
  console.log("Starting blog migration...");

  for (const blog of blogPosts) {
    try {
      // Check if blog already exists
      const { data: existing } = await supabase
        .from("blogs")
        .select("id")
        .eq("slug", blog.slug)
        .maybeSingle();

      if (existing) {
        console.log(`Blog "${blog.title}" already exists, skipping...`);
        continue;
      }

      // Insert blog post
      const { error } = await supabase.from("blogs").insert({
        title: blog.title,
        slug: blog.slug,
        status: blog.status,
        publish_date: blog.publish_date,
        meta_description: blog.meta_description || null,
        content: blog.content || null, // Content should be added via admin form
        word_count: 0,
        seo_score: 0,
      });

      if (error) {
        console.error(`Error migrating "${blog.title}":`, error);
      } else {
        console.log(`✓ Migrated "${blog.title}"`);
      }
    } catch (error) {
      console.error(`Error migrating "${blog.title}":`, error);
    }
  }

  console.log("Blog migration complete!");
}

/**
 * Run migration from browser console or admin page
 * Usage: Call migrateBlogs() from browser console after authenticating
 */
if (typeof window !== "undefined") {
  (window as any).migrateBlogs = migrateBlogs;
}



