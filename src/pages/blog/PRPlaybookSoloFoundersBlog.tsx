import { Helmet } from "react-helmet-async";
import { prPlaybookSoloFoundersContent, prPlaybookSoloFoundersMeta } from "@/lib/pr-playbook-solo-founders-content";
import { blogTheme } from "@/styles/blogTheme";
import BlogLayout from "@/layouts/BlogLayout";

const PRPlaybookSoloFoundersBlog = () => {
  return (
    <BlogLayout>
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
              <time>January 20, 2026</time>
              <span className={blogTheme.metaDivider}>•</span>
              <span>By {prPlaybookSoloFoundersMeta.author}</span>
              <span className={blogTheme.metaDivider}>•</span>
              <span>{prPlaybookSoloFoundersMeta.readTime}</span>
            </div>
          </header>

          <div 
            className={blogTheme.prose}
            dangerouslySetInnerHTML={{ __html: prPlaybookSoloFoundersContent }}
          />
        </article>
      </div>
    </BlogLayout>
  );
};

export default PRPlaybookSoloFoundersBlog;
