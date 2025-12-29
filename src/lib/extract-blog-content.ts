/**
 * Extract blog content - hardcoded content for now
 */

import { supabase } from "./supabaseClient";
import { calculateSEOScore } from "./blog-seo";

const blogContent = {
  'press-pitch-examples-that-get-replies': {
    content: `
<div class="prose prose-invert prose-lg max-w-none">
  <p class="text-xl text-slate-300 mb-8 leading-relaxed">
    Press Pitch Examples That Actually Get Replies (From a Founder Who Gets Them)
  </p>

  <div class="bg-accent-blue/10 border border-accent-blue/30 rounded-lg p-6 my-8">
    <p class="text-slate-200 mb-4">
      <strong>TL;DR – Real Press Pitch Examples That Work</strong>
    </p>
    <p class="text-slate-200 mb-4">
      These are actual pitch examples I've used to get press coverage for my business. They're founder-friendly, realistic, and focused on relevance over hype. Copy, customize, and start pitching.
    </p>
  </div>

  <h2>Why Most Press Pitches Fail</h2>
  <p>Most founders send pitches that sound like marketing copy. Journalists get hundreds of these every day. The pitches that work are the ones that sound like a colleague sharing a genuine insight.</p>

  <h2>Example Pitch #1: The "Quick Take" Pitch</h2>
  <div class="bg-base-800/50 border border-white/10 rounded-lg p-4 my-6">
    <p class="text-slate-200 font-medium mb-2">Subject: Quick take on [trend] from a founder who's actually doing it</p>
    <p class="text-slate-200">Hi [Journalist's name],</p>
    <p class="text-slate-200">I'm building [brief product description] and noticed [specific trend/insight].</p>
    <p class="text-slate-200">From what I'm seeing with customers: [1-2 specific data points or examples]</p>
    <p class="text-slate-200">Would love to share what I'm learning if you're covering this space.</p>
    <p class="text-slate-200">Best,<br/>[Your name]</p>
  </div>

  <h2>Example Pitch #2: The "Customer Story" Pitch</h2>
  <div class="bg-base-800/50 border border-white/10 rounded-lg p-4 my-6">
    <p class="text-slate-200">Hi [Journalist's name],</p>
    <p class="text-slate-200">One of our customers [specific customer story]. It highlighted [interesting insight].</p>
    <p class="text-slate-200">I thought this might be relevant to your [specific article/project they're working on].</p>
    <p class="text-slate-200">Happy to chat if you want the full story.</p>
  </div>

  <div class="bg-accent-violet/10 border border-accent-violet/30 rounded-lg p-6 my-8">
    <p class="text-slate-200 mb-4">
      Want to find journalists who are actually looking for your story right now?
    </p>
    <a href="/waitlist-signup" class="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold hover:opacity-95 transition-opacity" style="color: #000000 !important;">
      👉 Start your 7-day free trial of ContactJournalists.com
    </a>
  </div>
</div>
`,
    metaDescription: "Real press pitch examples that work in 2025. Founder-friendly templates, timing strategies, and proven examples for getting journalist replies. Copy, customize, and start pitching.",
    publishDate: "2025-11-16T00:00:00Z"
  },

  'the-fastest-ways-to-get-press-coverage-without-an-agency': {
    content: `
<div class="prose prose-invert prose-lg max-w-none">
  <p class="text-xl text-slate-300 mb-8 leading-relaxed">
    The Fastest Ways to Get Press Coverage Without an Agency
  </p>

  <div class="bg-accent-blue/10 border border-accent-blue/30 rounded-lg p-6 my-8">
    <p class="text-slate-200 mb-4">
      <strong>From One Founder to Another</strong>
    </p>
    <p class="text-slate-200 mb-4">
      I built ItReallyWorksVitamins.com from scratch without a PR agency. Here's exactly how I got featured in Forbes, Shortlist, and other major publications.
    </p>
  </div>

  <h2>The Counterintuitive Truth About Getting Press</h2>
  <p>You don't need to be "big news" to get coverage. You need to be the right answer to a journalist's current question.</p>

  <h2>Method 1: Respond to Journalist Requests (The Fastest Way)</h2>
  <p>The absolute fastest way to get press is to respond to journalists who are already looking for sources.</p>

  <div class="bg-accent-violet/10 border border-accent-violet/30 rounded-lg p-6 my-8">
    <p class="text-slate-200 mb-4">
      ContactJournalists.com shows you live press requests from journalists actively seeking sources. No cold pitching required.
    </p>
    <a href="/waitlist-signup" class="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold hover:opacity-95 transition-opacity" style="color: #000000 !important;">
      👉 See journalist requests right now
    </a>
  </div>

  <h2>Method 2: Find Journalists Writing About Your Space</h2>
  <p>Search for articles similar to what you'd want for your business. Email the journalists directly with a specific angle.</p>

  <h2>Method 3: Use HARO and Similar Services</h2>
  <p>Help A Reporter Out (HARO) sends you journalist queries 3x daily. Respond to relevant ones with clear, helpful answers.</p>
</div>
`,
    metaDescription: "Learn the fastest ways to get press coverage without hiring a PR agency. Real strategies from a founder who built coverage for their business from scratch.",
    publishDate: "2025-12-19T00:00:00Z"
  }
};

export async function extractAndUpdateBlogContent() {
  console.log('Starting content population...');

  const results = [];

  for (const [slug, data] of Object.entries(blogContent)) {
    try {
      console.log(`Processing: ${slug}`);

      // Calculate word count
      const wordCount = data.content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(w => w.length > 0).length;

      // Calculate SEO score
      const seoData = calculateSEOScore({
        title: '', // Will be set from existing blog
        slug: slug,
        metaDescription: data.metaDescription,
        content: data.content,
      });

      // Update database
      const { error } = await supabase
        .from('blogs')
        .update({
          content: data.content,
          meta_description: data.metaDescription,
          word_count: wordCount,
          seo_score: seoData.score,
          seo_breakdown: seoData.breakdown,
          seo_flags: seoData.flags,
          seo_last_scored_at: new Date().toISOString(),
          publish_date: data.publishDate,
          last_updated: new Date().toISOString(),
        })
        .eq('slug', slug);

      if (error) {
        console.error(`Database update failed for ${slug}:`, error);
        results.push({ slug, success: false, error: error.message });
      } else {
        console.log(`✓ Updated ${slug}`);
        results.push({ slug, success: true });
      }

    } catch (error: any) {
      console.error(`Error processing ${slug}:`, error);
      results.push({ slug, success: false, error: error.message });
    }
  }

  console.log('\n=== Content Population Complete ===');
  const successCount = results.filter(r => r.success).length;
  const failCount = results.filter(r => !r.success).length;
  console.log(`Successful: ${successCount}`);
  console.log(`Failed: ${failCount}`);

  return results;
}

// Make available in browser console for testing
if (typeof window !== 'undefined') {
  (window as any).extractAndUpdateBlogContent = extractAndUpdateBlogContent;
}