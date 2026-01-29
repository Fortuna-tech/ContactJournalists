import { Helmet } from "react-helmet-async";
import { followingUpBlogContent, followingUpBlogMeta } from "@/lib/following-up-blog-content";
import { blogTheme } from "@/styles/blogTheme";
import BlogLayout from "@/layouts/BlogLayout";

const FollowingUpBlog = () => {
  return (
    <BlogLayout>
      <Helmet>
        <title>{followingUpBlogMeta.title} | ContactJournalists.com</title>
        <meta name="description" content={followingUpBlogMeta.metaDescription} />
        <meta property="og:title" content={followingUpBlogMeta.title} />
        <meta property="og:description" content={followingUpBlogMeta.metaDescription} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={followingUpBlogMeta.title} />
        <meta name="twitter:description" content={followingUpBlogMeta.metaDescription} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Is it okay to follow up with journalists?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. One polite follow-up is completely acceptable. Two at most, only if the story is still timely."
                }
              },
              {
                "@type": "Question",
                "name": "How long should I wait before following up with a journalist?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Three to five working days for email pitches. Journalist requests often don't need follow-ups."
                }
              },
              {
                "@type": "Question",
                "name": "Why don't journalists reply even when my pitch feels relevant?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Usually timing, workload, or inbox volume. Silence rarely means rejection."
                }
              },
              {
                "@type": "Question",
                "name": "Can following up hurt my chances with journalists?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, if it's excessive, emotional, or trying to compensate for poor fit."
                }
              },
              {
                "@type": "Question",
                "name": "Should I follow up with journalists on Twitter?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Only if invited. Otherwise, follow the original instructions exactly."
                }
              },
              {
                "@type": "Question",
                "name": "Does ContactJournalists.com actually reduce follow-ups?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. When you reply instantly to live journalist requests that already match your niche, follow-ups often become unnecessary."
                }
              }
            ]
          })}
        </script>
      </Helmet>

      <header className={blogTheme.header}>
        <nav className={blogTheme.headerNav}>
          <a href="/" className={blogTheme.logo}>
            <span className={blogTheme.logoIcon}></span>
            Contact<span className={blogTheme.logoText}>Journalists</span>
          </a>
          <div className="flex items-center gap-4">
            <a href="/guides" className={blogTheme.navLink}>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              All Guides
            </a>
            <a href="/#blog" className={blogTheme.navLink}>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Blog
            </a>
          </div>
        </nav>
      </header>

      <div className={blogTheme.container}>
        <article className={blogTheme.card + " " + blogTheme.cardPad}>
          <header className={blogTheme.articleHeaderBorder}>
            <div className={blogTheme.metaRow}>
              <time>{followingUpBlogMeta.date}</time>
              <span className={blogTheme.metaDivider}>•</span>
              <span>By {followingUpBlogMeta.author}</span>
              <span className={blogTheme.metaDivider}>•</span>
              <span>{followingUpBlogMeta.readTime} read</span>
            </div>
          </header>

          <div 
            className={blogTheme.prose}
            dangerouslySetInnerHTML={{ __html: followingUpBlogContent }}
          />
        </article>
      </div>

      <footer className={blogTheme.footer}>
        <div className={blogTheme.footerInner}>
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

export default FollowingUpBlog;
