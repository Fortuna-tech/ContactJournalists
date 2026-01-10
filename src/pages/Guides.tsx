import { useState } from "react";
import { Helmet } from "react-helmet-async";

const CATEGORIES = [
  { id: "all", label: "All Guides", icon: "📚" },
  { id: "pr-strategy", label: "PR Strategy", icon: "🎯" },
  { id: "pitching", label: "Pitching", icon: "✉️" },
  { id: "tools", label: "Tools & Resources", icon: "🛠️" },
  { id: "social", label: "Social Media", icon: "📱" },
];

const GUIDES = [
  {
    id: 1,
    title: "How to Find the Right Reporter for Your Story",
    slug: "how-to-find-the-right-reporter-for-your-story",
    description: "Most founders struggle to get press because they pitch the wrong journalists. This guide breaks down how to find journalists who actually want your story.",
    category: "pr-strategy",
    readTime: "15 min",
    date: "January 2026",
    featured: true,
    isNew: true,
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
    <div className="min-h-screen bg-base-900 text-slate-200">
      <Helmet>
        <title>PR Guides for Founders | ContactJournalists.com</title>
        <meta
          name="description"
          content="Free guides on how to contact journalists, get press coverage, and grow your startup through PR. Written by founders, for founders."
        />
      </Helmet>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-base-900/70 border-b border-white/5">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <a
            href="/"
            className="flex items-center gap-2 font-extrabold text-lg tracking-tight"
          >
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-gradient-to-br from-accent-blue to-accent-violet"></span>
            Contact<span className="text-slate-400">Journalists</span>
          </a>
          <a
            href="/"
            className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/20 via-transparent to-accent-violet/20"></div>
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                              radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)`
          }}></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent-blue/10 border border-accent-blue/30 px-4 py-1.5 text-sm font-medium text-accent-blue mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-blue opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-blue"></span>
              </span>
              Free Resources for Founders
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
              More Guides On How To{" "}
              <span className="bg-gradient-to-r from-accent-blue via-accent-violet to-accent-mint bg-clip-text text-transparent">
                Contact Journalists
              </span>
              <br />
              and Get Publicity for Your Start Up
            </h1>

            <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10">
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
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue/50 transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <section className="border-b border-white/5 sticky top-16 z-40 bg-base-900/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 py-4 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? "bg-accent-blue text-white shadow-lg shadow-accent-blue/25"
                    : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
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
        <section className="py-12 border-b border-white/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-2xl">⭐</span>
              <h2 className="text-2xl font-bold text-white">Featured Guides</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {featuredGuides.map((guide) => (
                <a
                  key={guide.id}
                  href={`/blog/${guide.slug}`}
                  className="group relative rounded-2xl border border-accent-blue/30 bg-gradient-to-br from-accent-blue/10 to-accent-violet/10 p-6 hover:border-accent-blue/50 transition-all hover:shadow-lg hover:shadow-accent-blue/10"
                >
                  {guide.isNew && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-accent-mint to-accent-blue px-2 py-1 rounded-full text-xs font-bold text-white uppercase">
                      New
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-accent-blue uppercase tracking-wide">
                      {CATEGORIES.find((c) => c.id === guide.category)?.label}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-accent-blue transition-colors">
                    {guide.title}
                  </h3>
                  <p className="text-sm text-slate-400 mb-4 line-clamp-2">
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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">
              {activeCategory === "all" ? "All Guides" : CATEGORIES.find((c) => c.id === activeCategory)?.label}
              <span className="ml-2 text-slate-500 text-lg font-normal">({filteredGuides.length})</span>
            </h2>
          </div>

          {filteredGuides.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-white mb-2">No guides found</h3>
              <p className="text-slate-400">Try adjusting your search or filter</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGuides.map((guide) => (
                <a
                  key={guide.id}
                  href={`/blog/${guide.slug}`}
                  className="group rounded-2xl border border-white/10 bg-base-800/50 p-6 hover:border-accent-blue/50 transition-all hover:bg-base-800"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-accent-violet uppercase tracking-wide">
                      {CATEGORIES.find((c) => c.id === guide.category)?.label}
                    </span>
                    {guide.isNew && (
                      <span className="bg-accent-mint/20 text-accent-mint text-xs px-2 py-0.5 rounded-full font-medium">
                        New
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-accent-blue transition-colors">
                    {guide.title}
                  </h3>
                  <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                    {guide.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>{guide.date}</span>
                      <span>•</span>
                      <span>{guide.readTime} read</span>
                    </div>
                    <svg className="h-5 w-5 text-slate-500 group-hover:text-accent-blue group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
      <section className="py-16 border-t border-white/5">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Press Coverage?
          </h2>
          <p className="text-lg text-slate-400 mb-8">
            Stop guessing which journalists to pitch. Get access to live press requests and a database of 50,000+ media contacts.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-3 rounded-xl bg-white px-8 py-4 text-lg font-bold text-black shadow-glow transition-all hover:bg-slate-100 hover:scale-105 active:scale-95"
          >
            Start Your 7-Day Free Trial
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 font-extrabold text-lg tracking-tight">
              <span className="inline-block h-2.5 w-2.5 rounded-sm bg-gradient-to-br from-accent-blue to-accent-violet"></span>
              Contact<span className="text-slate-400">Journalists</span>
            </a>
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} ContactJournalists.com
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Guides;

