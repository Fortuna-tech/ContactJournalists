import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { blogTheme } from "@/styles/blogTheme";
import BlogLayout from "@/layouts/BlogLayout";
import { FOOTER_LINKS } from "@/components/Footer";

const CATEGORIES = [
  { id: "all", label: "All Guides", icon: "📚" },
  { id: "pr-strategy", label: "PR Strategy", icon: "🎯" },
  { id: "pitching", label: "Pitching", icon: "✉️" },
  { id: "tools", label: "Tools & Resources", icon: "🛠️" },
  { id: "social", label: "Social Media", icon: "📱" },
];

const GUIDES = [
  {
    id: 13,
    title: "20 Places to Find Journalists Covering Your Niche",
    slug: "20-places-to-find-journalists-covering-your-niche",
    description: "A founder's guide to the 20 real places journalists actually use. Find journalists covering your niche without guessing, spamming, or hiring a PR agency. Complete breakdown of costs, effort, and what actually works.",
    category: "tools",
    readTime: "25 min",
    date: "January 2026",
    featured: true,
    isNew: true,
  },
  {
    id: 12,
    title: "The PR Playbook for Solo Founders",
    slug: "pr-playbook-for-solo-founders",
    description: "A founder-to-founder PR playbook for solo founders who want press without an agency. Learn how journalists source stories in 2026, why request-led PR beats cold pitching, and how to build a calm weekly routine that gets coverage without burnout.",
    category: "pr-strategy",
    readTime: "25 min",
    date: "January 2026",
    featured: true,
    isNew: false,
  },
  {
    id: 11,
    title: "The Best Time of Day to Email Journalists (Backed by Data)",
    slug: "best-time-of-day-to-email-journalists",
    description: "Find the best time of day to email journalists, backed by real data from Muck Rack, Cision, and HubSpot. A calm, founder-to-founder guide to timing PR without guessing.",
    category: "pitching",
    readTime: "18 min",
    date: "January 2026",
    featured: true,
    isNew: false,
  },
  {
    id: 10,
    title: "Why Following Up Matters (And How Often to Do It)",
    slug: "why-following-up-matters-and-how-often-to-do-it",
    description: "A founder's guide to not overthinking, not annoying journalists, and not giving up too early. Learn when following up helps, when it hurts, and how often to do it.",
    category: "pitching",
    readTime: "22 min",
    date: "January 2026",
    featured: true,
    isNew: false,
  },
  {
    id: 9,
    title: "11 Mistakes Founders Make When Pitching Journalists",
    slug: "11-mistakes-founders-make-when-pitching-journalists",
    description: "Discover the 11 most common mistakes founders make when pitching journalists and learn how to fix them. Real advice from a founder who spent 7 years learning PR the hard way.",
    category: "pitching",
    readTime: "18 min",
    date: "January 2026",
    featured: true,
    isNew: false,
  },
  {
    id: 1,
    title: "How to Find the Right Reporter for Your Story",
    slug: "how-to-find-the-right-reporter-for-your-story",
    description: "Most founders struggle to get press because they pitch the wrong journalists. This guide breaks down how to find journalists who actually want your story.",
    category: "pr-strategy",
    readTime: "15 min",
    date: "January 2026",
    featured: true,
    isNew: false,
  },
  {
    id: 8,
    title: "How Founders Can Use PR to Explode Early-Stage Growth",
    slug: "how-founders-can-use-pr-to-explode-early-stage-growth",
    description: "Learn how founders and solopreneurs can use PR to grow an early-stage business without hiring a PR agency. Get press coverage and build credibility that compounds.",
    category: "pr-strategy",
    readTime: "30 min",
    date: "January 2026",
    featured: true,
    isNew: false,
  },
  {
    id: 2,
    title: "How To Pitch Journalists on Twitter",
    slug: "how-to-pitch-journalists-on-twitter",
    description: "Learn how to pitch journalists on Twitter. Real strategies from a founder who got press coverage through Twitter. Full breakdown of what works.",
    category: "social",
    readTime: "15 min",
    date: "December 2025",
    featured: false,
    isNew: false,
  },
  {
    id: 3,
    title: "The Fastest Ways to Get Press Coverage Without an Agency",
    slug: "the-fastest-ways-to-get-press-coverage-without-an-agency",
    description: "A founder-led playbook on landing press fast—without retainers, guesswork, or noisy outreach. Learn how to respond to live journalist requests.",
    category: "pr-strategy",
    readTime: "18 min",
    date: "December 2025",
    featured: true,
    isNew: false,
  },
  {
    id: 4,
    title: "The Ultimate Guide to Best Platforms for Contacting Journalists in 2026",
    slug: "ultimate-guide-best-platforms-contacting-journalists-2026",
    description: "Deep dive into PR tools, media databases, and outreach platforms so you can choose the right way to reach journalists.",
    category: "tools",
    readTime: "15 min",
    date: "December 2025",
    featured: false,
    isNew: false,
  },
  {
    id: 5,
    title: "Free Small Business P&L Template (Google Sheets & Excel)",
    slug: "free-small-business-pl-template-google-sheets-excel",
    description: "Download our free P&L template for startups. Track revenue, expenses, and profitability with this easy-to-use spreadsheet.",
    category: "tools",
    readTime: "8 min",
    date: "November 2025",
    featured: false,
    isNew: false,
  },
  {
    id: 6,
    title: "7 Press Pitch Examples That Actually Get Replies",
    slug: "press-pitch-examples-that-get-replies",
    description: "Real press pitch templates that work in 2025. Copy, customize, and start getting journalist replies with these founder-friendly examples.",
    category: "pitching",
    readTime: "12 min",
    date: "November 2025",
    featured: true,
    isNew: false,
  },
  {
    id: 7,
    title: "How to Get Press for Your Brand Without a PR Agency",
    slug: "how-to-get-press-for-your-brand-without-a-pr-agency",
    description: "The complete guide to DIY PR for founders. Learn how to build media relationships and get featured in top publications.",
    category: "pr-strategy",
    readTime: "15 min",
    date: "November 2025",
    featured: false,
    isNew: false,
  },
];

const Guides = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGuides = GUIDES.filter((guide) => {
    const matchesCategory = activeCategory === "all" || guide.category === activeCategory;
    const matchesSearch = guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredGuides = GUIDES.filter((g) => g.featured);

  return (
    <BlogLayout>
      <Helmet>
        <title>PR Guides for Founders | ContactJournalists.com</title>
        <meta
          name="description"
          content="Free guides on how to contact journalists, get press coverage, and grow your startup through PR. Written by founders, for founders."
        />
      </Helmet>

      {/* Header */}
      <header className={blogTheme.header}>
        <nav className={blogTheme.headerNav}>
          <a href="/" className={blogTheme.logo}>
            <span className={blogTheme.logoIcon}></span>
            Contact<span className={blogTheme.logoText}>Journalists</span>
          </a>
          <a href="/" className={blogTheme.navLink}>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24">
        <div className={blogTheme.containerWide}>
          <div className="text-center">
            <span className={blogTheme.badge + " mb-6"}>
              Free Resources for Founders
            </span>

            <h1
              className="text-4xl md:text-5xl lg:text-6xl text-black mb-6 tracking-tight"
              style={blogTheme.h1Style}
            >
              Guides: How To{" "}
              <span className="text-purple-600">
                Contact Journalists
              </span>
              <br />
              and Get Publicity for Your Start Up
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-10">
              Everything you need to know about PR, pitching, and getting press coverage—without hiring an expensive agency. Written by founders who&apos;ve done it.
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search guides..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={blogTheme.searchInput}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <section className="border-b border-black/10 sticky top-16 z-40 bg-[#F5F5DC]/95 backdrop-blur">
        <div className={blogTheme.containerWide}>
          <div className="flex gap-2 py-4 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`${blogTheme.categoryPill} ${
                  activeCategory === cat.id
                    ? blogTheme.categoryPillActive
                    : blogTheme.categoryPillInactive
                }`}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Guides */}
      {activeCategory === "all" && !searchQuery && (
        <section className="py-12 border-b border-black/10">
          <div className={blogTheme.containerWide}>
            <div className="flex items-center gap-3 mb-8">
              <span className="text-2xl">⭐</span>
              <h2 className="text-2xl font-bold text-black">Featured Guides</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {featuredGuides.slice(0, 6).map((guide) => (
                <a
                  key={guide.id}
                  href={`/blog/${guide.slug}`}
                  className={`${blogTheme.guideCardFeatured} relative`}
                >
                  {guide.isNew && (
                    <div className="absolute -top-2 -right-2 bg-green-500 px-2 py-1 rounded-full text-xs font-bold text-white uppercase">
                      New
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-3">
                    <span className={blogTheme.badgeCategory}>
                      {CATEGORIES.find((c) => c.id === guide.category)?.label}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-black mb-2 group-hover:text-purple-600 transition-colors">
                    {guide.title}
                  </h3>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                    {guide.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span>{guide.date}</span>
                    <span>•</span>
                    <span>{guide.readTime} read</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Guides Grid */}
      <section className="py-12">
        <div className={blogTheme.containerWide}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-black">
              {activeCategory === "all" ? "All Guides" : CATEGORIES.find((c) => c.id === activeCategory)?.label}
              <span className="ml-2 text-slate-500 text-lg font-normal">({filteredGuides.length})</span>
            </h2>
          </div>

          {filteredGuides.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-black mb-2">No guides found</h3>
              <p className="text-slate-600">Try adjusting your search or filter</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGuides.map((guide) => (
                <a
                  key={guide.id}
                  href={`/blog/${guide.slug}`}
                  className={blogTheme.guideCard}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className={blogTheme.badgeCategory}>
                      {CATEGORIES.find((c) => c.id === guide.category)?.label}
                    </span>
                    {guide.isNew && (
                      <span className={blogTheme.badgeNew}>
                        New
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-black mb-2 hover:text-purple-600 transition-colors">
                    {guide.title}
                  </h3>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                    {guide.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>{guide.date}</span>
                      <span>•</span>
                      <span>{guide.readTime} read</span>
                    </div>
                    <svg className="h-5 w-5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 border-t border-black/10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-3xl font-normal text-black mb-4"
            style={blogTheme.h2Style}
          >
            Ready to Get Press Coverage?
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Stop guessing which journalists to pitch. Get access to live press requests and a database of 50,000+ media contacts.
          </p>
          <a
            href="/auth"
            className={blogTheme.primaryBtn}
          >
            Start Your 7-Day Free Trial
            <svg className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className={blogTheme.footer}>
        <div className={blogTheme.containerWide + " py-8"}>
          <div className="flex flex-col items-center gap-4">
            <a href="/" className={blogTheme.logo}>
              <span className={blogTheme.logoIcon}></span>
              Contact<span className={blogTheme.logoText}>Journalists</span>
            </a>
            <div className="flex flex-wrap justify-center gap-1 text-sm text-slate-600">
              {FOOTER_LINKS.map((link, index) => (
                <span key={link.href} className="flex items-center">
                  <Link className="hover:text-black hover:underline" to={link.href}>
                    {link.label}
                  </Link>
                  {index < FOOTER_LINKS.length - 1 && (
                    <span className="mx-2 text-slate-400">|</span>
                  )}
                </span>
              ))}
            </div>
            <p className={blogTheme.footerText}>
              © {new Date().getFullYear()} ContactJournalists.com. Built in London with ☕️
            </p>
          </div>
        </div>
      </footer>
    </BlogLayout>
  );
};

export default Guides;
