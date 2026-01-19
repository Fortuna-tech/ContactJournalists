/**
 * Migration script to extract blog content from React components
 * Run this with: node scripts/migrate-blog-content.js
 * 
 * This script reads the blog component files and extracts their content
 * to prepare for migration to Supabase.
 */

const fs = require('fs');
const path = require('path');

const blogFiles = [
  {
    file: 'src/pages/blog/HowToPitchJournalistsTwitter.tsx',
    slug: 'how-to-pitch-journalists-on-twitter',
    title: 'How To Pitch Journalists on Twitter (Full Breakdown)',
    publishDate: '2025-12-27T00:00:00Z',
  },
  {
    file: 'src/pages/blog/PressWithoutAgencyBlog.tsx',
    slug: 'the-fastest-ways-to-get-press-coverage-without-an-agency',
    title: 'The Fastest Ways to Get Press Coverage Without an Agency',
    publishDate: '2025-12-19T00:00:00Z',
  },
  {
    file: 'src/pages/blog/PressPitchExamplesBlog.tsx',
    slug: 'press-pitch-examples-that-get-replies',
    title: '7 Press Pitch Examples That Actually Get Replies',
    publishDate: '2025-11-16T00:00:00Z',
  },
  {
    file: 'src/pages/blog/UltimateGuideBlog.tsx',
    slug: 'ultimate-guide-best-platforms-contacting-journalists-2026',
    title: 'The Ultimate Guide to the Best Platforms for Contacting Journalists in 2026',
    publishDate: '2025-12-01T00:00:00Z',
  },
  {
    file: 'src/pages/blog/GetPress.tsx',
    slug: 'how-to-get-press-for-your-brand-without-a-pr-agency',
    title: 'How to Get Press for Your Brand Without a PR Agency',
    publishDate: '2025-01-01T00:00:00Z',
  },
  {
    file: 'src/pages/blog/PLTemplateBlog.tsx',
    slug: 'free-small-business-pl-template-google-sheets-excel',
    title: 'Free Small Business P&L Template (Google Sheets + Excel)',
    publishDate: '2025-11-15T00:00:00Z',
  },
];

function extractContentFromFile(filePath) {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    const content = fs.readFileSync(fullPath, 'utf-8');
    
    // Extract the main content between the return statement and closing
    // This is a simplified extraction - you may need to adjust based on your component structure
    const returnMatch = content.match(/return\s*\(([\s\S]*?)\)\s*;?\s*}$/);
    
    if (returnMatch) {
      return returnMatch[1].trim();
    }
    
    return content; // Fallback to full file content
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return '';
  }
}

function generateMigrationSQL() {
  console.log('-- Blog Content Migration SQL\n');
  console.log('-- Run this SQL in your Supabase SQL Editor\n');
  console.log('-- Or use the admin dashboard to add content via the edit form\n\n');
  
  blogFiles.forEach((blog) => {
    const content = extractContentFromFile(blog.file);
    const escapedContent = content.replace(/'/g, "''"); // Escape single quotes for SQL
    
    console.log(`-- ${blog.title}`);
    console.log(`UPDATE blogs SET content = $blog_content_${blog.slug.replace(/-/g, '_')}$ WHERE slug = '${blog.slug}';`);
    console.log(`-- Content length: ${content.length} characters\n`);
  });
  
  console.log('\n-- Note: For large content, use the admin dashboard edit form instead');
  console.log('-- Go to: /admin/blog-dashboard-a7f3b9c2d1e4f5a6');
  console.log('-- Click Edit on each blog post and paste the content');
}

// Run the migration
generateMigrationSQL();





