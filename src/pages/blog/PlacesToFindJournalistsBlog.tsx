import { Helmet } from "react-helmet-async";
import { placesToFindJournalistsContent, placesToFindJournalistsMeta } from "@/lib/places-to-find-journalists-content";
import { blogTheme } from "@/styles/blogTheme";
import BlogLayout from "@/layouts/BlogLayout";

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
    </BlogLayout>
  );
};

export default PlacesToFindJournalistsBlog;
