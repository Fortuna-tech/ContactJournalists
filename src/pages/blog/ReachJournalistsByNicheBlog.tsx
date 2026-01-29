import { Helmet } from "react-helmet-async";
import { reachJournalistsByNicheContent, reachJournalistsByNicheMeta } from "@/lib/reach-journalists-by-niche-content";
import { blogTheme } from "@/styles/blogTheme";
import BlogLayout from "@/layouts/BlogLayout";

const ReachJournalistsByNicheBlog = () => {
  return (
    <BlogLayout>
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

      <header className={blogTheme.header}>
        <nav className={blogTheme.headerNav}>
          <a href="/" className={blogTheme.logo}>
            <span className={blogTheme.logoIcon}></span>
            Contact<span className={blogTheme.logoText}>Journalists</span>
          </a>
          <a href="/guides" className={blogTheme.navLink}>
            Back to Guides
          </a>
        </nav>
      </header>

      <div className={blogTheme.container}>
        <article className={blogTheme.card + " " + blogTheme.cardPad}>
          <header className={blogTheme.articleHeaderBorder}>
            <div className={blogTheme.metaRow}>
              <time>{reachJournalistsByNicheMeta.date}</time>
              <span className={blogTheme.metaDivider}>•</span>
              <span>By {reachJournalistsByNicheMeta.author}</span>
              <span className={blogTheme.metaDivider}>•</span>
              <span>{reachJournalistsByNicheMeta.readTime}</span>
            </div>
          </header>

          <div 
            className={blogTheme.prose}
            dangerouslySetInnerHTML={{ __html: reachJournalistsByNicheContent }}
          />
        </article>
      </div>

      <footer className={blogTheme.footer}>
        <div className={blogTheme.containerWide + " py-12"}>
          <div className="flex flex-col items-center gap-6 text-center">
            <a href="/" className={blogTheme.logo}>
              <span className={blogTheme.logoIcon}></span>
              Contact<span className={blogTheme.logoText}>Journalists</span>
            </a>
            <p className={blogTheme.footerText + " max-w-md"}>
              The fastest way for founders to find and reach journalists covering their niche.
            </p>
            <div className="flex gap-6 text-sm text-slate-600">
              <a href="/guides" className="hover:text-black transition-colors">Guides</a>
              <a href="/affiliates" className="hover:text-black transition-colors">Affiliates</a>
            </div>
          </div>
        </div>
      </footer>
    </BlogLayout>
  );
};

export default ReachJournalistsByNicheBlog;
