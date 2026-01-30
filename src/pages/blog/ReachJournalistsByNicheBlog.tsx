import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { reachJournalistsByNicheContent, reachJournalistsByNicheMeta } from "@/lib/reach-journalists-by-niche-content";
import { blogTheme } from "@/styles/blogTheme";
import BlogLayout from "@/layouts/BlogLayout";
import { FOOTER_LINKS } from "@/components/Footer";

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
            <div className="flex flex-wrap justify-center gap-1 text-sm text-slate-600 mb-4">
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
            <p className={blogTheme.footerText}>© 2026 ContactJournalists.com. Built in London with ☕️</p>
          </div>
        </div>
      </footer>
    </BlogLayout>
  );
};

export default ReachJournalistsByNicheBlog;
