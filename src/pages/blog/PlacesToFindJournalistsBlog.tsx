import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { placesToFindJournalistsContent, placesToFindJournalistsMeta } from "@/lib/places-to-find-journalists-content";
import { blogTheme } from "@/styles/blogTheme";
import BlogLayout from "@/layouts/BlogLayout";
import { FOOTER_LINKS } from "@/components/Footer";

const PlacesToFindJournalistsBlog = () => {
  return (
    <BlogLayout>
      <Helmet>
        <title>{placesToFindJournalistsMeta.title} | ContactJournalists.com</title>
        <meta name="description" content={placesToFindJournalistsMeta.metaDescription} />
        <meta property="og:title" content={placesToFindJournalistsMeta.title} />
        <meta property="og:description" content={placesToFindJournalistsMeta.metaDescription} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={placesToFindJournalistsMeta.title} />
        <meta name="twitter:description" content={placesToFindJournalistsMeta.metaDescription} />
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
              <time>{placesToFindJournalistsMeta.date}</time>
              <span className={blogTheme.metaDivider}>•</span>
              <span>By {placesToFindJournalistsMeta.author}</span>
              <span className={blogTheme.metaDivider}>•</span>
              <span>{placesToFindJournalistsMeta.readTime}</span>
            </div>
          </header>

          <div 
            className={blogTheme.prose}
            dangerouslySetInnerHTML={{ __html: placesToFindJournalistsContent }}
          />
        </article>
      </div>

      <footer className={blogTheme.footer}>
        <div className={blogTheme.footerInner}>
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
          <div className="text-center">
            <p className={blogTheme.footerText + " mb-2"}>
              Questions? Ping us a message at{" "}
              <a href="mailto:hello@contactjournalists.com" className={blogTheme.footerLink}>
                hello@contactjournalists.com
              </a>
            </p>
            <p className={blogTheme.footerText}>© 2026 ContactJournalists.com. Built in London with ☕️</p>
          </div>
        </div>
      </footer>
    </BlogLayout>
  );
};

export default PlacesToFindJournalistsBlog;
