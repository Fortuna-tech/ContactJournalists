/**
 * Extract blog content from React components
 */

import { supabase } from "./supabaseClient";
import { calculateSEOScore } from "./blog-seo";

const blogFiles = [
  {
    slug: 'press-pitch-examples-that-get-replies',
    title: '7 Press Pitch Examples That Actually Get Replies',
    file: 'src/pages/blog/PressPitchExamplesBlog.tsx',
    publishDate: '2025-11-16T00:00:00Z',
  },
  {
    slug: 'the-fastest-ways-to-get-press-coverage-without-an-agency',
    title: 'The Fastest Ways to Get Press Coverage Without an Agency',
    file: 'src/pages/blog/PressWithoutAgencyBlog.tsx',
    publishDate: '2025-12-19T00:00:00Z',
  },
  {
    slug: 'how-to-pitch-journalists-on-twitter',
    title: 'How To Pitch Journalists on Twitter (Full Breakdown)',
    file: 'src/pages/blog/HowToPitchJournalistsTwitter.tsx',
    publishDate: '2025-12-27T00:00:00Z',
  },
  {
    slug: 'ultimate-guide-best-platforms-contacting-journalists-2026',
    title: 'The Ultimate Guide to the Best Platforms for Contacting Journalists in 2026',
    file: 'src/pages/blog/UltimateGuideBlog.tsx',
    publishDate: '2025-12-01T00:00:00Z',
  },
  {
    slug: 'free-small-business-pl-template-google-sheets-excel',
    title: 'Free Small Business P&L Template (Google Sheets + Excel)',
    file: 'src/pages/blog/PLTemplateBlog.tsx',
    publishDate: '2025-11-15T00:00:00Z',
  },
  {
    slug: 'how-to-get-press-for-your-brand-without-a-pr-agency',
    title: 'How to Get Press for Your Brand Without a PR Agency',
    file: 'src/pages/blog/GetPress.tsx',
    publishDate: '2025-01-01T00:00:00Z',
  },
];

// Full content for each blog (extracted from React components)
const fullBlogContent = {
  'press-pitch-examples-that-get-replies': `<div class="prose prose-invert prose-lg max-w-none">
    <p class="text-xl text-slate-300 mb-8 leading-relaxed">
      7 Press Pitch Examples That Actually Get Replies
    </p>

    <div class="bg-accent-blue/10 border border-accent-blue/30 rounded-lg p-6 my-8">
      <p class="text-slate-200 mb-4">
        <strong>Real Press Pitch Examples That Work</strong>
      </p>
      <p class="text-slate-200 mb-4">
        These are actual pitch examples I've used to get press coverage for my business. They're founder-friendly, realistic, and focused on relevance over hype. Copy, customize, and start pitching.
      </p>
    </div>

    <h2>Why Most Press Pitches Fail</h2>
    <p>Most founders send pitches that sound like marketing copy. Journalists get hundreds of these every day. The pitches that work are the ones that sound like a colleague sharing a genuine insight.</p>

    <h2>The "Quick Take" Pitch</h2>
    <div class="bg-base-800/50 border border-white/10 rounded-lg p-4 my-6">
      <p class="text-slate-200 font-medium mb-2">Subject: Quick take on [trend] from a founder who's actually doing it</p>
      <p class="text-slate-200">Hi [Journalist's name],</p>
      <p class="text-slate-200">I'm building [brief product description] and noticed [specific trend/insight].</p>
      <p class="text-slate-200">From what I'm seeing with customers: [1-2 specific data points or examples]</p>
      <p class="text-slate-200">Would love to share what I'm learning if you're covering this space.</p>
      <p class="text-slate-200">Best,<br/>[Your name]</p>
    </div>

    <h2>The "Customer Story" Pitch</h2>
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
  </div>`,

  'the-fastest-ways-to-get-press-coverage-without-an-agency': `<div class="prose prose-invert prose-lg max-w-none">
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
  </div>`,

  'how-to-pitch-journalists-on-twitter': `<div class="prose prose-invert prose-lg max-w-none">
    <p class="text-xl text-slate-300 mb-8 leading-relaxed">
      How To Pitch Journalists on Twitter (Full Breakdown)
    </p>

    <div class="bg-accent-blue/10 border border-accent-blue/30 rounded-lg p-6 my-8">
      <p class="text-slate-200 mb-4">
        <strong>TL;DR – How ContactJournalists.com Helps Founders Win at PR</strong>
      </p>
      <p class="text-slate-200 mb-4">
        Twitter is where journalists actually ask for sources. This guide covers everything I learned from pitching on Twitter for 7 years.
      </p>
      <a href="/waitlist-signup" class="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold hover:opacity-95 transition-opacity" style="color: #000000 !important;">
        👉 Start your 7-day free trial now
      </a>
    </div>

    <h2>Why Twitter Matters for PR</h2>
    <p>Twitter is where journalists go when they need sources quickly. Unlike email, Twitter requests are public and immediate.</p>

    <h2>How Journalist Requests Work</h2>
    <p>Journalists post requests when they're on deadline and need specific sources. They want relevant, helpful responses that advance their story.</p>

    <h2>What to Say When You Reply</h2>
    <p>Keep it short, relevant, and helpful. Mention why you're qualified and offer specific value.</p>

    <h2>Speed Matters</h2>
    <p>Twitter threads move fast. Reply within minutes, not hours, to have the best chance of being noticed.</p>

    <h2>Public vs DM</h2>
    <p>Start public unless the journalist specifically asks for DMs. Public replies build credibility and can help other journalists find you.</p>
  </div>`,

  'ultimate-guide-best-platforms-contacting-journalists-2026': `<div class="prose prose-invert prose-lg max-w-none">
    <p class="text-xl text-slate-300 mb-8 leading-relaxed">
      The Ultimate Guide to the Best Platforms for Contacting Journalists in 2026
    </p>

    <div class="bg-accent-blue/10 border border-accent-blue/30 rounded-lg p-6 my-8">
      <p class="text-slate-200 mb-4">
        <strong>Complete Guide to PR Platforms in 2026</strong>
      </p>
      <p class="text-slate-200 mb-4">
        Compare PR tools, media databases, and outreach platforms to get press coverage for your brand.
      </p>
    </div>

    <h2>The PR Landscape in 2026</h2>
    <p>Getting press coverage requires the right tools and platforms. Here's what actually works for founders and startups.</p>

    <h2>Platform #1: ContactJournalists.com</h2>
    <p>The most founder-friendly platform. Shows live journalist requests filtered by your niche. No cold pitching required.</p>

    <h2>Platform #2: HARO (Help A Reporter Out)</h2>
    <p>Established service that sends journalist queries 3x daily. Good for consistent outreach but can be competitive.</p>

    <h2>Platform #3: Traditional Media Databases</h2>
    <p>Cision, Meltwater, and similar platforms. Professional but expensive and often overkill for early-stage founders.</p>

    <h2>Platform #4: Social Media Monitoring</h2>
    <p>Twitter/X, LinkedIn, and Reddit for finding journalist requests. Free but time-intensive.</p>

    <div class="bg-accent-violet/10 border border-accent-violet/30 rounded-lg p-6 my-8">
      <p class="text-slate-200 mb-4">
        For most founders, ContactJournalists.com offers the best ROI. Try the 7-day free trial.
      </p>
      <a href="/waitlist-signup" class="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold hover:opacity-95 transition-opacity" style="color: #000000 !important;">
        👉 Start your free trial
      </a>
    </div>
  </div>`,

  'free-small-business-pl-template-google-sheets-excel': `<div class="prose prose-invert prose-lg max-w-none">
    <p class="text-xl text-slate-300 mb-8 leading-relaxed">
      Free Small Business P&L Template (Google Sheets + Excel)
    </p>

    <div class="bg-accent-blue/10 border border-accent-blue/30 rounded-lg p-6 my-8">
      <p class="text-slate-200 mb-4">
        <strong>Free P&L Template for Founders</strong>
      </p>
      <p class="text-slate-200 mb-4">
        Founder-made Profit & Loss template. Works with any currency, clear structure, no clutter. Download for Google Sheets and Excel.
      </p>
    </div>

    <h2>📥 Download Your Free P&L Template</h2>
    <p>Compatible with Google Sheets & Excel. Enter your email to get instant access.</p>

    <div class="bg-base-800/50 border border-white/10 rounded-lg p-6 my-8">
      <p class="text-slate-200 mb-4">✔ Google Sheets & Excel versions</p>
      <p class="text-slate-200 mb-4">✔ Works with any currency</p>
      <p class="text-slate-200 mb-4">✔ Founder-friendly layout</p>
      <p class="text-slate-200 mb-4">✔ Clear structure with no clutter</p>
    </div>

    <h2>Why This Template Works</h2>
    <p>I built this P&L template because almost everything I create for founders has the same heartbeat — making life easier for the people who are doing everything alone.</p>

    <p>That's exactly why I'm building ContactJournalists.com. It gives founders access to real journalist opportunities, clear outreach tools, and a simple way to manage press without spreadsheets or retainers.</p>

    <div class="bg-accent-violet/10 border border-accent-violet/30 rounded-lg p-6 my-8">
      <p class="text-slate-200 mb-4">
        While you wait for your template, check out ContactJournalists.com for press coverage.
      </p>
      <a href="/waitlist-signup" class="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold hover:opacity-95 transition-opacity" style="color: #000000 !important;">
        👉 Start your 7-day free trial
      </a>
    </div>
  </div>`,

  'how-to-get-press-for-your-brand-without-a-pr-agency': `<div class="prose prose-invert prose-lg max-w-none">
    <p class="text-xl text-slate-300 mb-8 leading-relaxed">
      How to Get Press for Your Brand Without a PR Agency
    </p>

    <div class="bg-accent-blue/10 border border-accent-blue/30 rounded-lg p-6 my-8">
      <p class="text-slate-200 mb-4">
        <strong>Founder-Led PR Guide</strong>
      </p>
      <p class="text-slate-200 mb-4">
        Everything I learned from 7 years of getting press coverage without hiring expensive PR agencies. Real strategies that work for bootstrapped founders.
      </p>
    </div>

    <h2>Why Traditional PR Agencies Don't Work for Most Founders</h2>
    <p>PR agencies are built for big companies with big budgets. They charge thousands per month and promise results that often don't materialize for early-stage businesses.</p>

    <h2>The Founder PR Framework</h2>
    <p>Focus on relevance, speed, and relationships. Build credibility through consistent, valuable contributions rather than one-off pitches.</p>

    <h2>Step 1: Define Your Story Clearly</h2>
    <p>Know exactly what makes your business newsworthy. What problem are you solving? Why now? Who cares?</p>

    <h2>Step 2: Find the Right Journalists</h2>
    <p>Don't pitch everyone. Find journalists who cover your space and have audiences that match your target customers.</p>

    <h2>Step 3: Build Relationships First</h2>
    <p>Before pitching, engage with journalists. Comment on their work, share insights, build rapport.</p>

    <h2>Step 4: Time Your Pitches Perfectly</h2>
    <p>Watch for trends, seasonal angles, and current events in your industry. Pitch when journalists are actively looking for stories.</p>

    <div class="bg-accent-violet/10 border border-accent-violet/30 rounded-lg p-6 my-8">
      <p class="text-slate-200 mb-4">
        The easiest way to get press is to respond to journalists who are already looking for sources.
      </p>
      <a href="/waitlist-signup" class="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold hover:opacity-95 transition-opacity" style="color: #000000 !important;">
        👉 Try ContactJournalists.com free for 7 days
      </a>
    </div>
  </div>`
};

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
  },

  'how-to-pitch-journalists-on-twitter': {
    content: `
<div class="prose prose-invert prose-lg max-w-none">
  <p class="text-xl text-slate-300 mb-8 leading-relaxed">
    How To Pitch Journalists on Twitter (Full Breakdown)
  </p>

  <div class="bg-accent-blue/10 border border-accent-blue/30 rounded-lg p-6 my-8">
    <p className="text-slate-200 mb-4">
      <strong>TL;DR – How ContactJournalists.com Helps Founders Win at PR</strong>
    </p>
    <p className="text-slate-200 mb-4">
      Twitter is where journalists actually ask for sources. This guide covers everything I learned from pitching on Twitter for 7 years.
    </p>
    <a href="/waitlist-signup" className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold hover:opacity-95 transition-opacity" style="color: #000000 !important;">
      👉 Start your 7-day free trial now
    </a>
  </div>

  <h2>Why Twitter Matters for PR</h2>
  <p>Twitter is where journalists go when they need sources quickly. Unlike email, Twitter requests are public and immediate.</p>

  <h2>How Journalist Requests Work</h2>
  <p>Journalists post requests when they're on deadline and need specific sources. They want relevant, helpful responses that advance their story.</p>

  <h2>What to Say When You Reply</h2>
  <p>Keep it short, relevant, and helpful. Mention why you're qualified and offer specific value.</p>

  <h2>Speed Matters</h2>
  <p>Twitter threads move fast. Reply within minutes, not hours, to have the best chance of being noticed.</p>

  <h2>Public vs DM</h2>
  <p>Start public unless the journalist specifically asks for DMs. Public replies build credibility and can help other journalists find you.</p>
</div>
`,
    metaDescription: "Learn how to pitch journalists on Twitter. Real strategies from a founder who got press coverage through Twitter. Full breakdown of what works and what doesn't.",
    publishDate: "2025-12-27T00:00:00Z"
  },

  'ultimate-guide-best-platforms-contacting-journalists-2026': {
    content: `
<div class="prose prose-invert prose-lg max-w-none">
  <p class="text-xl text-slate-300 mb-8 leading-relaxed">
    The Ultimate Guide to the Best Platforms for Contacting Journalists in 2026
  </p>

  <div class="bg-accent-blue/10 border border-accent-blue/30 rounded-lg p-6 my-8">
    <p class="text-slate-200 mb-4">
      <strong>Complete Guide to PR Platforms in 2026</strong>
    </p>
    <p class="text-slate-200 mb-4">
      Compare PR tools, media databases, and outreach platforms to get press coverage for your brand.
    </p>
  </div>

  <h2>The PR Landscape in 2026</h2>
  <p>Getting press coverage requires the right tools and platforms. Here's what actually works for founders and startups.</p>

  <h2>Platform #1: ContactJournalists.com</h2>
  <p>The most founder-friendly platform. Shows live journalist requests filtered by your niche. No cold pitching required.</p>

  <h2>Platform #2: HARO (Help A Reporter Out)</h2>
  <p>Established service that sends journalist queries 3x daily. Good for consistent outreach but can be competitive.</p>

  <h2>Platform #3: Traditional Media Databases</h2>
  <p>Cision, Meltwater, and similar platforms. Professional but expensive and often overkill for early-stage founders.</p>

  <h2>Platform #4: Social Media Monitoring</h2>
  <p>Twitter/X, LinkedIn, and Reddit for finding journalist requests. Free but time-intensive.</p>

  <div class="bg-accent-violet/10 border border-accent-violet/30 rounded-lg p-6 my-8">
    <p class="text-slate-200 mb-4">
      For most founders, ContactJournalists.com offers the best ROI. Try the 7-day free trial.
    </p>
    <a href="/waitlist-signup" class="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold hover:opacity-95 transition-opacity" style="color: #000000 !important;">
      👉 Start your free trial
    </a>
  </div>
</div>
`,
    metaDescription: "Complete guide to the best platforms for contacting journalists in 2026. Compare PR tools, media databases, and outreach platforms to get press coverage for your brand.",
    publishDate: "2025-12-01T00:00:00Z"
  },

  'free-small-business-pl-template-google-sheets-excel': {
    content: `
<div class="prose prose-invert prose-lg max-w-none">
  <p class="text-xl text-slate-300 mb-8 leading-relaxed">
    Free Small Business P&L Template (Google Sheets + Excel)
  </p>

  <div class="bg-accent-blue/10 border border-accent-blue/30 rounded-lg p-6 my-8">
    <p class="text-slate-200 mb-4">
      <strong>Free P&L Template for Founders</strong>
    </p>
    <p class="text-slate-200 mb-4">
      Founder-made Profit & Loss template. Works with any currency, clear structure, no clutter. Download for Google Sheets and Excel.
    </p>
  </div>

  <h2>📥 Download Your Free P&L Template</h2>
  <p>Compatible with Google Sheets & Excel. Enter your email to get instant access.</p>

  <div class="bg-base-800/50 border border-white/10 rounded-lg p-6 my-8">
    <p class="text-slate-200 mb-4">✔ Google Sheets & Excel versions</p>
    <p class="text-slate-200 mb-4">✔ Works with any currency</p>
    <p class="text-slate-200 mb-4">✔ Founder-friendly layout</p>
    <p class="text-slate-200 mb-4">✔ Clear structure with no clutter</p>
  </div>

  <h2>Why This Template Works</h2>
  <p>I built this P&L template because almost everything I create for founders has the same heartbeat — making life easier for the people who are doing everything alone.</p>

  <p>That's exactly why I'm building ContactJournalists.com. It gives founders access to real journalist opportunities, clear outreach tools, and a simple way to manage press without spreadsheets or retainers.</p>

  <div class="bg-accent-violet/10 border border-accent-violet/30 rounded-lg p-6 my-8">
    <p class="text-slate-200 mb-4">
      While you wait for your template, check out ContactJournalists.com for press coverage.
    </p>
    <a href="/waitlist-signup" class="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold hover:opacity-95 transition-opacity" style="color: #000000 !important;">
      👉 Start your 7-day free trial
    </a>
  </div>
</div>
`,
    metaDescription: "Free small business Profit & Loss template for Google Sheets and Excel. Track revenue, expenses and profit easily. Built for founders, startups and solopreneurs.",
    publishDate: "2025-11-15T00:00:00Z"
  }
};

export async function extractAndUpdateBlogContent() {
  console.log('Starting content extraction and blog updates...');

  const results = [];

  // First try the edge function approach
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const adminPassword = import.meta.env.VITE_BLOG_ADMIN_PASSWORD || "admin123";

    const functionUrl = `${supabaseUrl}/functions/v1/extract-blog-content`;

    console.log("Attempting to call extract-blog-content edge function...");

    const response = await fetch(functionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${anonKey}`,
        "apikey": anonKey,
      },
      body: JSON.stringify({
        password: adminPassword,
        blogFiles: blogFiles,
      }),
    });

    if (response.ok) {
      const edgeResults = await response.json();
      console.log('Edge function succeeded:', edgeResults);
      return edgeResults;
    } else {
      console.log('Edge function not available, falling back to manual update...');
    }
  } catch (error) {
    console.log('Edge function failed, falling back to manual update:', error);
  }

  // Fallback: Update with proper titles, status, and existing content
  console.log('Updating blogs with correct titles and status...');

  for (const blog of blogFiles) {
    try {
      console.log(`Processing: ${blog.slug} -> "${blog.title}"`);

      // Use the full content from our hardcoded data
      const fullContent = fullBlogContent[blog.slug as keyof typeof fullBlogContent];

      if (fullContent) {
        // Calculate word count from full content
        const cleanContent = fullContent
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
          .replace(/<[^>]*>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();

        const wordCount = cleanContent.split(/\s+/).filter(w => w.length > 0).length;

        const seoData = calculateSEOScore({
          title: blog.title,
          slug: blog.slug,
          metaDescription: undefined,
          content: fullContent,
        });

        // Update with full content, correct title, and proper calculations
        const updateData: any = {
          title: blog.title,
          content: fullContent,
          status: "published",
          publish_date: blog.publishDate,
          last_updated: new Date().toISOString(),
          word_count: wordCount,
          seo_score: seoData.score,
          seo_breakdown: seoData.breakdown,
          seo_flags: seoData.flags,
          seo_last_scored_at: new Date().toISOString(),
        };

        console.log(`  Updating ${blog.slug} with ${wordCount} words, SEO score: ${seoData.score}`);

        const { error } = await supabase
          .from('blogs')
          .update(updateData)
          .eq('slug', blog.slug);

        if (error) {
          console.error(`Database update failed for ${blog.slug}:`, error);
          results.push({ slug: blog.slug, success: false, error: error.message });
        } else {
          console.log(`✓ Updated ${blog.slug} with full content`);
          results.push({ slug: blog.slug, success: true });
        }
      } else {
        console.error(`No full content found for ${blog.slug}`);
        results.push({ slug: blog.slug, success: false, error: 'No content available' });
      }

      const { error } = await supabase
        .from('blogs')
        .update(updateData)
        .eq('slug', blog.slug);

      if (error) {
        console.error(`Database update failed for ${blog.slug}:`, error);
        results.push({ slug: blog.slug, success: false, error: error.message });
      } else {
        console.log(`✓ Updated ${blog.slug} with title "${blog.title}"`);
        results.push({ slug: blog.slug, success: true });
      }

    } catch (error: any) {
      console.error(`Error processing ${blog.slug}:`, error);
      results.push({ slug: blog.slug, success: false, error: error.message });
    }
  }

  console.log('\n=== Blog Update Complete ===');
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