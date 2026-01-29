import { Helmet } from "react-helmet-async";
import { founderMistakesBlogContent, founderMistakesBlogMeta } from "@/lib/founder-mistakes-blog-content";
import { blogTheme } from "@/styles/blogTheme";
import BlogLayout from "@/layouts/BlogLayout";

const FounderMistakesBlog = () => {
  return (
    <BlogLayout>
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
              <time>January 13, 2026</time>
              <span className={blogTheme.metaDivider}>•</span>
              <span>By Fortuna, Founder</span>
              <span className={blogTheme.metaDivider}>•</span>
              <span>18 min read</span>
            </div>
          </header>

          <div 
            className={blogTheme.prose}
            dangerouslySetInnerHTML={{ __html: founderMistakesBlogContent }}
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

export default FounderMistakesBlog;
