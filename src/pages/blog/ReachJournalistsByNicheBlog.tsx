import { Helmet } from "react-helmet-async";
import { reachJournalistsByNicheContent, reachJournalistsByNicheMeta } from "@/lib/reach-journalists-by-niche-content";

const ReachJournalistsByNicheBlog = () => {
  return (
    <div className="min-h-screen bg-base-900 text-slate-200">
      <Helmet>
        <title>{reachJournalistsByNicheMeta.title} | ContactJournalists.com</title>
        <meta name="description" content={reachJournalistsByNicheMeta.metaDescription} />
        <meta property="og:title" content={reachJournalistsByNicheMeta.title} />
        <meta property="og:description" content={reachJournalistsByNicheMeta.metaDescription} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={reachJournalistsByNicheMeta.title} />
        <meta name="twitter:description" content={reachJournalistsByNicheMeta.metaDescription} />
      </Helmet>

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
            href="/guides"
            className="flex items-center gap-2 text-sm text-slate-300 hover:text-white"
          >
            Back to Guides
          </a>
        </nav>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <article>
          <header className="mb-8 border-b border-white/10 pb-6">
            <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
              <time>{reachJournalistsByNicheMeta.date}</time>
              <span>•</span>
              <span>By {reachJournalistsByNicheMeta.author}</span>
              <span>•</span>
              <span>{reachJournalistsByNicheMeta.readTime}</span>
            </div>
          </header>

          <div 
            className="prose prose-invert prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: reachJournalistsByNicheContent }}
          />
        </article>
      </div>

      <footer className="border-t border-white/10 bg-base-900/50 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6 text-center">
            <a
              href="/"
              className="flex items-center gap-2 font-extrabold text-lg tracking-tight"
            >
              <span className="inline-block h-2.5 w-2.5 rounded-sm bg-gradient-to-br from-accent-blue to-accent-violet"></span>
              Contact<span className="text-slate-400">Journalists</span>
            </a>
            <p className="text-sm text-slate-400 max-w-md">
              The fastest way for founders to find and reach journalists covering their niche.
            </p>
            <div className="flex gap-6 text-sm text-slate-400">
              <a href="/guides" className="hover:text-white transition-colors">Guides</a>
              <a href="/affiliates" className="hover:text-white transition-colors">Affiliates</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ReachJournalistsByNicheBlog;
