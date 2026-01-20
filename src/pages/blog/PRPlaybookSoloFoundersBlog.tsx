import { Helmet } from "react-helmet-async";
import { prPlaybookSoloFoundersContent, prPlaybookSoloFoundersMeta } from "@/lib/pr-playbook-solo-founders-content";

const PRPlaybookSoloFoundersBlog = () => {
  return (
    <div className="min-h-screen bg-base-900 text-slate-200">
      <Helmet>
        <title>{prPlaybookSoloFoundersMeta.title} | ContactJournalists.com</title>
        <meta name="description" content={prPlaybookSoloFoundersMeta.metaDescription} />
        <meta property="og:title" content={prPlaybookSoloFoundersMeta.title} />
        <meta property="og:description" content={prPlaybookSoloFoundersMeta.metaDescription} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={prPlaybookSoloFoundersMeta.title} />
        <meta name="twitter:description" content={prPlaybookSoloFoundersMeta.metaDescription} />
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
            href="/#blog"
            className="flex items-center gap-2 text-sm text-slate-300 hover:text-white"
          >
            Back to Blog
          </a>
        </nav>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <article>
          <header className="mb-8 border-b border-white/10 pb-6">
            <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
              <time>January 20, 2026</time>
              <span>•</span>
              <span>By {prPlaybookSoloFoundersMeta.author}</span>
              <span>•</span>
              <span>{prPlaybookSoloFoundersMeta.readTime}</span>
            </div>
          </header>

          <div 
            className="prose prose-invert prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: prPlaybookSoloFoundersContent }}
          />
        </article>
      </div>
    </div>
  );
};

export default PRPlaybookSoloFoundersBlog;

