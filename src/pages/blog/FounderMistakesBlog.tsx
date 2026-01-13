import { Helmet } from "react-helmet-async";
import { founderMistakesBlogContent, founderMistakesBlogMeta } from "@/lib/founder-mistakes-blog-content";

const FounderMistakesBlog = () => {
  return (
    <div className="min-h-screen bg-base-900 text-slate-200">
      <Helmet>
        <title>{founderMistakesBlogMeta.title} | ContactJournalists.com</title>
        <meta name="description" content={founderMistakesBlogMeta.metaDescription} />
        <meta property="og:title" content={founderMistakesBlogMeta.title} />
        <meta property="og:description" content={founderMistakesBlogMeta.metaDescription} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={founderMistakesBlogMeta.title} />
        <meta name="twitter:description" content={founderMistakesBlogMeta.metaDescription} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Why do most founders struggle to get press coverage?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Most founders struggle to get press because they pitch the wrong journalists at the wrong time. Journalists receive a high volume of pitches, and relevance and timing are the biggest factors in whether a pitch gets opened or ignored."
                }
              },
              {
                "@type": "Question",
                "name": "What is the biggest mistake founders make when pitching journalists?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The biggest mistake is starting with publications instead of journalists. PR works better when founders pitch journalists who already cover their niche regularly and are actively publishing."
                }
              },
              {
                "@type": "Question",
                "name": "Do I need a PR agency to get press coverage?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No. Many founders get press without a PR agency by focusing on relevance, timing, and pitching journalists directly. A clear system often works better than outsourcing too early."
                }
              },
              {
                "@type": "Question",
                "name": "How many journalists should I pitch for one story?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Pitching a small group of highly relevant journalists is more effective than sending a generic pitch to hundreds of contacts. Quality and fit matter more than volume."
                }
              },
              {
                "@type": "Question",
                "name": "Should I send a press release or a pitch email?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "In most cases, a short pitch email works better than a press release. Journalists prefer clear, concise pitches that explain the story, why it matters now, and why the founder is a credible source."
                }
              },
              {
                "@type": "Question",
                "name": "How long should a journalist pitch be?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Most effective journalist pitches are between 100 and 200 words. Journalists scan quickly, so clarity in the first few lines is essential."
                }
              },
              {
                "@type": "Question",
                "name": "Why don't journalists reply to pitches?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Journalists may not reply due to timing, workload, or volume of pitches, even if the story is relevant. Silence does not always mean lack of interest."
                }
              },
              {
                "@type": "Question",
                "name": "How quickly should I respond to a journalist request?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Journalist requests move fast, so responding as quickly as possible significantly increases the chances of being included in a story."
                }
              },
              {
                "@type": "Question",
                "name": "Is it okay to follow up with journalists?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, one polite follow-up is acceptable. Avoid repeated follow-ups, as PR is about timing rather than persistence."
                }
              },
              {
                "@type": "Question",
                "name": "Can PR actually drive sales?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. PR builds trust through third-party validation, which helps customers trust brands faster and can directly support sales, partnerships, and long-term growth."
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
              <time>January 13, 2026</time>
              <span>•</span>
              <span>By Fortuna, Founder</span>
              <span>•</span>
              <span>18 min read</span>
            </div>
          </header>

          <div 
            className="prose prose-invert prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: founderMistakesBlogContent }}
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

export default FounderMistakesBlog;

