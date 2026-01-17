import { Helmet } from "react-helmet-async";
import { followingUpBlogContent, followingUpBlogMeta } from "@/lib/following-up-blog-content";

const FollowingUpBlog = () => {
  return (
    <div className="min-h-screen bg-base-900 text-slate-200">
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

      <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-base-900/70 border-b border-white/5">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <a
            href="/"
            className="flex items-center gap-2 font-extrabold text-lg tracking-tight"
          >
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-gradient-to-br from-accent-blue to-accent-violet"></span>
            Contact<span className="text-slate-400">Journalists</span>
          </a>
          <div className="flex items-center gap-4">
            <a
              href="/guides"
              className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              All Guides
            </a>
            <a
              href="/#blog"
              className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Blog
            </a>
          </div>
        </nav>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <article>
          <header className="mb-8 border-b border-white/10 pb-6">
            <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
              <time>{followingUpBlogMeta.date}</time>
              <span>•</span>
              <span>By {followingUpBlogMeta.author}</span>
              <span>•</span>
              <span>{followingUpBlogMeta.readTime} read</span>
            </div>
          </header>

          <div 
            className="prose prose-invert prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: followingUpBlogContent }}
          />
        </article>
      </div>

      <footer className="border-t border-white/5 bg-base-800/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-sm text-slate-400">
            <p className="mb-2">
              Questions? Ping us a message at{" "}
              <a
                href="mailto:hello@contactjournalists.com"
                className="text-accent-blue hover:underline"
              >
                hello@contactjournalists.com
              </a>
            </p>
            <p>© 2026 ContactJournalists.com. Built in London with ☕️</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FollowingUpBlog;

