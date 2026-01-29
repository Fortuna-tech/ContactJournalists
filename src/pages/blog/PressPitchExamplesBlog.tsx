import { ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet-async";
import founderLaptopImage from "@assets/pexels-vlada-karpovich-4050316_1763395875996.jpg";
import coffeeShopWorkImage from "@assets/pexels-iamloe-722244_1763395878473.jpg";
import { blogTheme } from "@/styles/blogTheme";
import BlogLayout from "@/layouts/BlogLayout";

const PressPitchExamplesBlog = () => {
  return (
    <BlogLayout>
      <Helmet>
        <title>
          7 Press Pitch Examples That Actually Get Replies (Founder Guide +
          Templates) | ContactJournalists.com
        </title>
        <meta
          name="description"
          content="Real press pitch examples that work in 2025. Founder-friendly templates, timing strategies, and proven examples for getting journalist replies. Copy, customize, and start pitching."
        />
        <meta
          property="og:title"
          content="7 Press Pitch Examples That Actually Get Replies (Founder Guide + Templates)"
        />
        <meta
          property="og:description"
          content="Real press pitch examples that work in 2025. Founder-friendly templates, timing strategies, and proven examples for getting journalist replies."
        />
        <meta property="og:type" content="article" />
        <meta
          property="og:url"
          content="https://contactjournalists.com/blog/press-pitch-examples-that-get-replies"
        />
      </Helmet>

        <header className={blogTheme.header}>
          <nav className={blogTheme.headerNav}>
            <a href="/" className={blogTheme.logo}>
              <span className={blogTheme.logoIcon}></span>
              Contact<span className={blogTheme.logoText}>Journalists</span>
            </a>
            <a href="/#blog" className={blogTheme.navLink}>
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </a>
          </nav>
        </header>

        <main className="relative">
          <div className={blogTheme.container}>
            <article className={blogTheme.card + " " + blogTheme.cardPad}>
              <header className="mb-12">
                <div className="flex items-center gap-2 mb-4">
                  <span className={blogTheme.badgeCategory}>
                    Pitch Templates
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-sm text-slate-500">Founder Guide</span>
                </div>

                <h1 className={blogTheme.h1} style={blogTheme.h1Style}>
                  7 Press Pitch Examples That Actually Get Replies
                  (Founder-Friendly Guide + Real Templates)
                </h1>

                <div className={blogTheme.metaRow + " mb-8"}>
                  <time>Sunday, November 16, 2025</time>
                  <span className={blogTheme.metaDivider}>•</span>
                  <span>12 min read</span>
                </div>

                <div className="relative rounded-2xl overflow-hidden mb-8 border-2 border-black">
                  <img
                    src={founderLaptopImage}
                    alt="Founder working on press pitches using ContactJournalists.com templates to get journalist replies and media coverage"
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-2xl md:text-3xl font-bold text-white drop-shadow-2xl">
                      ContactJournalists.com
                    </p>
                  </div>
                </div>
              </header>

              <div className={blogTheme.prose}>
                <div className="flex flex-col md:flex-row gap-6 mb-8 items-start">
                  <img
                    src="/assets/fortuna-founder-balloons.jpg"
                    alt="Fortuna, founder of ContactJournalists.com"
                    className="w-full md:w-64 md:flex-shrink-0 rounded-2xl"
                  />
                  <div className="flex-1">
                    <p className="text-xl text-slate-600 leading-relaxed mb-6">
                      Hi, I'm Fortuna — the founder of{" "}
                      <a
                        href="https://contactjournalists.com"
                        className={blogTheme.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        ContactJournalists.com
                      </a>
                      .
                    </p>

                    <p className="text-slate-600 mb-6">
                      I built ContactJournalists.com after my own stressful, scattered
                      attempts at getting publicity for my brand. If you've ever tried
                      to do your own PR as a small founder, you'll know exactly what I
                      mean.
                    </p>

                    <p className="text-slate-600 mb-6">
                      Refreshing Twitter, scrolling endlessly, jumping between tools,
                      hunting for journalist email addresses, and still missing
                      brilliant opportunities because you heard about them too late.
                    </p>
                  </div>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-black mt-12 mb-6">
                  That's Why Timing Is Everything in PR
                </h2>

                <p className="text-slate-600 mb-6">
                  You can write a great pitch, but if you send it when a
                  journalist isn't thinking about that topic, it just vanishes.
                </p>

                <p className="text-slate-600 mb-6">
                  That's the whole idea behind{" "}
                  <a
                    href="https://contactjournalists.com"
                    className={blogTheme.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ContactJournalists.com
                  </a>{" "}
                  — helping founders catch opportunities as they happen, instead
                  of hours (or days) too late.
                </p>

                <p className="text-slate-600 mb-6">
                  This guide gives you 7 real, modern press pitch examples you can
                  copy, personalised for what journalists actually respond to in
                  2025.
                </p>

                <div className="mt-12 p-8 rounded-2xl border-2 border-purple-500 bg-purple-50">
                  <h3 className="text-2xl font-bold text-black mb-4">
                    Never Miss a Journalist Request Again
                  </h3>
                  <p className="text-slate-600 mb-6">
                    ContactJournalists.com sends you real-time alerts when
                    journalists are looking for sources. Get the timing right, and
                    watch your reply rates soar.
                  </p>
                  <a
                    href="/signup"
                    data-testid="link-signup-cta-early"
                    className={blogTheme.primaryBtn}
                  >
                    Try It Free
                  </a>
                </div>

                <div className="rounded-2xl overflow-hidden my-12 border-2 border-black">
                  <img
                    src={coffeeShopWorkImage}
                    alt="Entrepreneur at coffee shop writing press pitches using ContactJournalists.com founder-friendly templates to reach journalists"
                    className="w-full h-auto object-cover"
                  />
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-black mt-12 mb-6">
                  ⭐ Why These Pitch Examples Actually Work
                </h2>

                <p className="text-slate-600 mb-4">
                  Journalists reply to pitches that are:
                </p>

                <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
                  <li>short</li>
                  <li>relevant</li>
                  <li>timely</li>
                  <li>directly answering what they're working on</li>
                  <li>human (NOT robotic or formal)</li>
                </ul>

                <h2 className="text-2xl md:text-3xl font-bold text-black mt-12 mb-6">
                  ⭐ Pitch Example 1: "Saw your request — here's a quick quote you can use"
                </h2>

                <p className="text-slate-600 mb-6">
                  This is the easiest pitch in the world if you catch the request
                  at the right time.
                </p>

                <div className="bg-white/50 border-2 border-black/20 rounded-xl p-6 my-8">
                  <p className="text-sm font-semibold text-purple-600 mb-4">
                    TEMPLATE:
                  </p>
                  <p className="text-slate-600 mb-3">
                    <strong>Subject:</strong> Quick quote for your piece on
                    &lt;topic&gt;
                  </p>
                  <p className="text-slate-600 mb-3">Hi &lt;Name&gt;,</p>
                  <p className="text-slate-600 mb-3">
                    Just saw your request pop up about &lt;topic&gt; and wanted to
                    send something over straight away.
                  </p>
                  <p className="text-slate-600 mb-3 italic">
                    "&lt;Insert crisp, clear insight. Make it useful, not
                    fluffy.&gt;"
                  </p>
                  <p className="text-slate-600 mb-3">
                    I'm the founder of &lt;brand&gt; — brief context in case it
                    helps: &lt;one line credibility&gt;.
                  </p>
                  <p className="text-slate-600">
                    Thanks,
                    <br />
                    &lt;Your name&gt;
                  </p>
                </div>

                <p className="text-slate-600 mb-6">
                  <strong>Why journalists reply:</strong> You've saved them time
                  and answered their request quickly. Reply rate is extremely high
                  when timed correctly.
                </p>

                <h2 className="text-2xl md:text-3xl font-bold text-black mt-12 mb-6">
                  ⭐ Pitch Example 2: "I have a data point you'll want for this"
                </h2>

                <p className="text-slate-600 mb-6">
                  Journalists love data because it makes their article stronger.
                </p>

                <div className="bg-white/50 border-2 border-black/20 rounded-xl p-6 my-8">
                  <p className="text-sm font-semibold text-purple-600 mb-4">
                    TEMPLATE:
                  </p>
                  <p className="text-slate-600 mb-3">
                    <strong>Subject:</strong> Useful data for your
                    &lt;industry&gt; story
                  </p>
                  <p className="text-slate-600 mb-3">Hi &lt;Name&gt;,</p>
                  <p className="text-slate-600 mb-3">
                    I've got a stat that might help with your piece on
                    &lt;topic&gt;.
                  </p>
                  <ul className="list-disc list-inside text-slate-600 mb-3 ml-4">
                    <li>&lt;Interesting stat&gt;</li>
                    <li>&lt;Second stat&gt;</li>
                  </ul>
                  <p className="text-slate-600">
                    Thanks!
                    <br />
                    &lt;Your name&gt;
                  </p>
                </div>

                <p className="text-slate-600 mb-6">
                  <strong>Why this works:</strong> Data = instant authority. And
                  you're not making them dig for anything.
                </p>

                <div className="mt-12 p-8 rounded-2xl border-2 border-purple-500 bg-purple-50">
                  <h3 className="text-2xl font-bold text-black mb-4">
                    Get Journalist Requests in Real-Time
                  </h3>
                  <p className="text-slate-600 mb-6">
                    Stop missing opportunities. ContactJournalists.com sends you
                    instant alerts when journalists are actively looking for
                    sources, quotes, and founder stories — so you can pitch at the
                    perfect moment.
                  </p>
                  <a
                    href="/signup"
                    data-testid="link-signup-cta-midpoint"
                    className={blogTheme.primaryBtn}
                  >
                    Start Free Trial
                  </a>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-black mt-12 mb-6">
                  ⭐ Final Thoughts From Me to You
                </h2>

                <p className="text-slate-600 mb-6">
                  I've tried the long, complicated way of PR and it's honestly
                  exhausting.
                </p>

                <p className="text-slate-600 mb-6">
                  Founders don't need more complexity — we need clarity, speed,
                  and timing.
                </p>

                <p className="text-slate-600 mb-6">
                  And when you want to catch opportunities as they happen, have a
                  look at{" "}
                  <a
                    href="https://contactjournalists.com"
                    className={blogTheme.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ContactJournalists.com
                  </a>{" "}
                  — it's built specifically for founders like you and me.
                </p>

                <div className="mt-12 p-8 rounded-2xl border-2 border-purple-500 bg-purple-50">
                  <h3 className="text-2xl font-bold text-black mb-4">
                    Ready to Start Getting Press?
                  </h3>
                  <p className="text-slate-600 mb-6">
                    Join founders who are already using ContactJournalists.com to
                    get featured in top publications. Get instant journalist
                    alerts, verified contacts, and AI-powered pitch writing tools.
                  </p>
                  <a
                    href="/signup"
                    data-testid="link-signup-cta-bottom"
                    className={blogTheme.primaryBtn}
                  >
                    Start Your Free Trial
                  </a>
                </div>

                <div className="mt-12 pt-8 border-t-2 border-black/10">
                  <h3 className="text-xl font-bold text-black mb-4">
                    More Founder Resources:
                  </h3>
                  <ul className="space-y-3">
                    <li>
                      <a
                        href="/blog/ultimate-guide-best-platforms-contacting-journalists-2026"
                        className={blogTheme.link + " font-medium"}
                      >
                        → Ultimate Guide: Best Platforms for Contacting
                        Journalists in 2026
                      </a>
                    </li>
                    <li>
                      <a
                        href="/blog/the-fastest-ways-to-get-press-coverage-without-an-agency"
                        className={blogTheme.link + " font-medium"}
                      >
                        → The Fastest Ways to Get Press Coverage Without an Agency
                      </a>
                    </li>
                    <li>
                      <a
                        href="/blog/free-small-business-pl-template-google-sheets-excel"
                        className={blogTheme.link + " font-medium"}
                      >
                        → Free Small Business P&L Template (Google Sheets + Excel)
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </article>
          </div>
        </main>

        <footer className={blogTheme.footer}>
          <div className={blogTheme.footerInner}>
            <div className="text-center">
              <p className={blogTheme.footerText}>
                © 2025 ContactJournalists.com. Built for founders, by a founder.
              </p>
            </div>
          </div>
        </footer>
    </BlogLayout>
  );
};

export default PressPitchExamplesBlog;
