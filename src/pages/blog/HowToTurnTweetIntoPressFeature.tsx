import { Helmet } from "react-helmet-async";
import { howToPitchJournalistsTwitterContent, howToPitchJournalistsTwitterMeta } from "@/lib/how-to-pitch-journalists-twitter-content";

const HowToTurnTweetIntoPressFeature = () => {
  return (
    <div className="min-h-screen bg-base-900 text-slate-200">
      <Helmet>
        <title>{howToPitchJournalistsTwitterMeta.title} | ContactJournalists.com</title>
        <meta name="description" content={howToPitchJournalistsTwitterMeta.metaDescription} />
        <meta property="og:title" content={howToPitchJournalistsTwitterMeta.title} />
        <meta property="og:description" content={howToPitchJournalistsTwitterMeta.metaDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="/assets/Turn%20tweet%20into%20a%20press%20feature.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={howToPitchJournalistsTwitterMeta.title} />
        <meta name="twitter:description" content={howToPitchJournalistsTwitterMeta.metaDescription} />
        <meta name="twitter:image" content="/assets/Turn%20tweet%20into%20a%20press%20feature.png" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How do I turn a journalist's tweet into press coverage?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Monitor hashtags like #journorequest and #PRrequest on Twitter. When you see a relevant request, reply with your experience (not your job title), match their tone, and end with an open door like 'Happy to share more if helpful'. Timing and relevance matter more than perfect writing."
                }
              },
              {
                "@type": "Question",
                "name": "What hashtags do journalists use to find sources on Twitter?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Journalists commonly use #journorequest, #journorequests, and #PRrequest to source quotes and experts quickly. These hashtags are live sourcing signals that indicate a journalist is actively looking for input."
                }
              },
              {
                "@type": "Question",
                "name": "Is replying to journalist tweets better than cold pitching?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. When you reply to a journalist's tweet, you're responding to an active need rather than interrupting their day with an unsolicited pitch. This makes you a helper, not a salesperson, which significantly improves your chances of getting coverage."
                }
              },
              {
                "@type": "Question",
                "name": "What are soft signals from journalists on Twitter?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Soft signals are tweets where journalists float early story ideas or observations, like 'Seeing a lot of startups struggling with X lately'. These often turn into articles within days. Replying puts you on their radar before they formally ask for sources."
                }
              },
              {
                "@type": "Question",
                "name": "How should I reply to a journalist's tweet without sounding spammy?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Lead with experience ('We saw this firsthand while building...'), not your job title. Match their tone - casual for casual tweets, tight for direct requests. End with an open door ('Happy to share specifics if helpful'). No links, no attachments, no pushing."
                }
              },
              {
                "@type": "Question",
                "name": "Do I need a PR agency to get press coverage from Twitter?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No. You need visibility and speed. Over 70% of journalists use Twitter to source stories. By monitoring journalist requests and responding quickly with relevant experience, founders can get press coverage without hiring an agency."
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
              <time>{howToPitchJournalistsTwitterMeta.date}</time>
              <span>•</span>
              <span>By {howToPitchJournalistsTwitterMeta.author}</span>
              <span>•</span>
              <span>{howToPitchJournalistsTwitterMeta.readTime} read</span>
            </div>
          </header>

          <div 
            className="prose prose-invert prose-lg max-w-none [&_img]:float-none [&_.float-left]:float-left [&_.float-right]:float-right [&_.clear-both]:clear-both"
            dangerouslySetInnerHTML={{ __html: howToPitchJournalistsTwitterContent }}
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

export default HowToTurnTweetIntoPressFeature;
