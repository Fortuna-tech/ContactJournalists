import { Helmet } from "react-helmet-async";
import { prForFoundersBlogContent, prForFoundersBlogMeta } from "@/lib/pr-for-founders-blog-content";
import { blogTheme } from "@/styles/blogTheme";
import BlogLayout from "@/layouts/BlogLayout";

const PRForFoundersBlog = () => {
  return (
    <BlogLayout>
      <Helmet>
        <title>{prForFoundersBlogMeta.title} | ContactJournalists.com</title>
        <meta name="description" content={prForFoundersBlogMeta.metaDescription} />
        <meta property="og:title" content={prForFoundersBlogMeta.title} />
        <meta property="og:description" content={prForFoundersBlogMeta.metaDescription} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={prForFoundersBlogMeta.title} />
        <meta name="twitter:description" content={prForFoundersBlogMeta.metaDescription} />
      </Helmet>

      <header className={blogTheme.header}>
        <nav className={blogTheme.headerNav}>
          <a href="/" className={blogTheme.logo}>
            <span className={blogTheme.logoIcon}></span>
            Contact<span className={blogTheme.logoText}>Journalists</span>
          </a>
          <a href="/#blog" className={blogTheme.navLink}>
            Back to Blog
          </a>
        </nav>
      </header>

      <div className={blogTheme.container}>
        <article className={blogTheme.card + " " + blogTheme.cardPad}>
          <header className={blogTheme.articleHeaderBorder}>
            <div className={blogTheme.metaRow}>
              <time>January 8, 2026</time>
              <span className={blogTheme.metaDivider}>•</span>
              <span>By Fortuna, Founder</span>
              <span className={blogTheme.metaDivider}>•</span>
              <span>30 min read</span>
            </div>
          </header>

          <div 
            className={blogTheme.prose}
            dangerouslySetInnerHTML={{ __html: prForFoundersBlogContent }}
          />
        </article>
      </div>
    </BlogLayout>
  );
};

export default PRForFoundersBlog;
