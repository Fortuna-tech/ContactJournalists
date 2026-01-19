import { Helmet } from "react-helmet-async";
import { bestTimeToEmailBlogContent, bestTimeToEmailBlogMeta } from "@/lib/best-time-to-email-blog-content";

const BestTimeToEmailBlog = () => {
  return (
    <div className="min-h-screen bg-base-900 text-slate-200">
      <Helmet>
        <title>{bestTimeToEmailBlogMeta.title} | ContactJournalists.com</title>
        <meta name="description" content={bestTimeToEmailBlogMeta.metaDescription} />
        <meta property="og:title" content={bestTimeToEmailBlogMeta.title} />
        <meta property="og:description" content={bestTimeToEmailBlogMeta.metaDescription} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={bestTimeToEmailBlogMeta.title} />
        <meta name="twitter:description" content={bestTimeToEmailBlogMeta.metaDescription} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is the best time of day to email journalists?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The best window is roughly 6:30am–9:30am in the journalist's local time. This is when inboxes are manageable and journalists are making quick decisions before their day fills up with deadlines."
                }
              },
              {
                "@type": "Question",
                "name": "Does the day of the week matter when emailing journalists?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, but less than timing. Tuesday, Wednesday, and Thursday tend to perform best. Avoid Friday afternoons and be cautious with Monday mornings when inboxes are crowded."
                }
              },
              {
                "@type": "Question",
                "name": "Should I email journalists in the evening or on weekends?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Only if you're replying to a live journalist request. Cold pitches sent during evenings or weekends typically underperform because journalists aren't in 'work mode.'"
                }
              },
              {
                "@type": "Question",
                "name": "Why do morning emails perform better with journalists?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Journalists scan emails quickly in the morning before meetings and deadlines take over. Early emails get seen when mental load is lower and decisions are faster."
                }
              },
              {
                "@type": "Question",
                "name": "Does timing guarantee press coverage?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No. Timing improves your odds of being seen, but relevance is what gets replies. The best-timed pitch in the world won't work if it's sent to the wrong journalist or covers the wrong angle."
                }
              },
              {
                "@type": "Question",
                "name": "How can I stop overthinking when to send my pitch?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The best way is to respond to live journalist requests instead of cold pitching. When a journalist is actively looking for sources, timing anxiety disappears because you know they want to hear from you right now."
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
              <time>{bestTimeToEmailBlogMeta.date}</time>
              <span>•</span>
              <span>By {bestTimeToEmailBlogMeta.author}</span>
              <span>•</span>
              <span>{bestTimeToEmailBlogMeta.readTime} read</span>
            </div>
          </header>

          <div 
            className="prose prose-invert prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: bestTimeToEmailBlogContent }}
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

export default BestTimeToEmailBlog;

