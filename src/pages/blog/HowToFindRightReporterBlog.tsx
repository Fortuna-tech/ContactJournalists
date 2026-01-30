import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { blogTheme } from "@/styles/blogTheme";
import BlogLayout from "@/layouts/BlogLayout";
import { FOOTER_LINKS } from "@/components/Footer";

const HowToFindRightReporterBlog = () => {
  const today = new Date();
  const publishDate = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <BlogLayout>
      <Helmet>
        <title>How to Find the Right Reporter for Your Story | ContactJournalists.com</title>
        <meta
          name="description"
          content="Learn how to find the right reporter for your story. Practical guide for founders on finding journalists, responding to press requests, and getting coverage without a PR agency."
        />
        <meta property="og:title" content="How to Find the Right Reporter for Your Story" />
        <meta property="og:description" content="Most founders struggle to get press because they pitch the wrong journalists. This guide breaks down how to find journalists who actually want your story." />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="How to Find the Right Reporter for Your Story" />
        <meta name="twitter:description" content="Most founders struggle to get press because they pitch the wrong journalists. This guide breaks down how to find journalists who actually want your story." />
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
          <header className="mb-8">
            <h1 className={blogTheme.h1} style={blogTheme.h1Style}>
              How to Find the Right Reporter for Your Story
            </h1>
            <div className={blogTheme.metaRow + " " + blogTheme.articleHeaderBorder}>
              <time>{publishDate}</time>
              <span className={blogTheme.metaDivider}>•</span>
              <span>By Fortuna, Founder</span>
            </div>
          </header>

          <div className={blogTheme.prose}>
            {/* TL;DR Section */}
            <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-6 my-8">
              <h2 className="text-xl font-semibold text-black mb-4 mt-0">TL;DR (for exhausted founders who just want the truth)</h2>
              <ul className="text-slate-600 mb-4 list-disc list-inside space-y-2">
                <li>I spent seven exhausting years building and selling a startup.</li>
                <li>PR worked, but figuring it out took months and months of wasted time, stress, and second-guessing.</li>
                <li>So I built <a href="https://contactjournalists.com" className={blogTheme.link}>contactjournalists.com</a> to fix that.</li>
                <li>The hardest part of PR isn't writing the pitch, it's finding the right reporter!</li>
                <li>Googling journalists and scrolling Twitter burns so much time, that quite frankly you just don't have.</li>
                <li>The right press builds trust, credibility, and revenue much faster than ads</li>
                <li>You don't need a PR agency, you need relevance and speed</li>
                <li>ContactJournalists.com gives you journalists, bloggers, YouTubers, podcasters, and live press requests in one place</li>
                <li>There's a 7-day free trial so you can take a look around and start getting PR for your business right now</li>
              </ul>
            </div>

            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              If you're trying to figure out how to find the right reporter for your story, you're not alone. Most founders struggle to get press because they pitch the wrong journalists, waste time on outdated media lists, or don't know where to start. This guide breaks down how to find journalists who actually want your story, how to respond to journalist requests quickly, and how to get press without a PR agency.
            </p>

            {/* First Image - Woman working on laptop */}
            <div className="my-10">
              <img
                src="/assets/pexels-element5-973408_1763117889746.jpg"
                alt="Woman working on laptop researching journalists"
                className="w-full h-auto rounded-xl border-2 border-black shadow-lg"
              />
            </div>

            <h2 className="text-2xl font-semibold text-black mb-4">How to Find the Right Reporter for Your Story</h2>

            <p className="text-slate-600 mb-6">
              Hello I'm Fortuna - I'm the founder of <a href="https://contactjournalists.com" className={blogTheme.link}>ContactJournalists.com</a>.
            </p>

            <p className="text-slate-600 mb-6">
              If you're here because you're trying to work out how to get press without losing your mind, your time, or your self-belief, you're exactly where I hoped you'd land! If you want to shortcut months of trial and error, there's a 7-day free trial on ContactJournalists.com so you can take a look around and start getting PR for your business right now.
            </p>

            <p className="text-slate-600 mb-6">
              I spent seven exhausting years building a startup, figuring PR out the long, slow, deeply inefficient way, and then decided that whole process needed fixing. If I'd had something like ContactJournalists.com back then, I would have used it immediately as I would have loved Journalist requests to come directly to me and I hit reply - rather than me scouring the internet for hours on end to no avail!
            </p>

            <h2 className="text-2xl font-semibold text-black mb-4">My first business is why this exists</h2>

            <p className="text-slate-600 mb-6">
              Before ContactJournalists.com, I founded It Really Works Vitamins.
            </p>

            <p className="text-slate-600 mb-6">
              I built this supplement brand from scratch (totally bootstrapped woohoo!) over seven years where anything that saved time, stress or emotional bandwidth would have been a lifeline! If you're in need of an easy way to contact journalists and get publicity for your startup - start your 7-day free trial at <a href="https://contactjournalists.com" className={blogTheme.link}>ContactJournalists.com</a>
            </p>

            {/* Second Image - Craftsman/Workshop */}
            <div className="my-10">
              <img
                src="/assets/pexels-rdne-7947746_1763372982891.jpg"
                alt="Craftsman working in workshop representing building a business"
                className="w-full h-auto rounded-xl border-2 border-black shadow-lg"
              />
            </div>

            <h2 className="text-2xl font-semibold text-black mb-4">Why I shifted focus from ads to press</h2>

            <p className="text-slate-600 mb-6">
              With It Really Works Vitamins, paid ads didn't suddenly stop working. They still drove sales. What changed was how fragile the whole setup felt.
            </p>

            <p className="text-slate-600 mb-6">
              Press behaved differently. When people discovered the brand through coverage - they arrived warmer and trusted us faster as they trusted the publication we'd been featured in - I really felt this level of trust compound over time.
            </p>

            <h2 className="text-2xl font-semibold text-black mb-4">What actually happened once press landed</h2>

            <p className="text-slate-600 mb-6">
              We eventually landed features in Forbes, Coach Magazine, and Men's Health! Yay!
            </p>

            <p className="text-slate-600 mb-6">
              This <a href="https://www.forbes.com/sites/leebelltech/2019/04/27/best-nutrition-innovation-2019/" className={blogTheme.link} target="_blank" rel="noopener noreferrer">Forbes feature</a> was a really nice turning point for us.
            </p>

            {/* Third Image - Professional woman */}
            <div className="my-10">
              <img
                src="/assets/pexels-vlada-karpovich-4050316_1763395875996.jpg"
                alt="Professional woman in creative workspace representing success"
                className="w-full h-auto rounded-xl border-2 border-black shadow-lg"
              />
            </div>

            <h2 className="text-2xl font-semibold text-black mb-4">The mistake I made for far too long</h2>

            <p className="text-slate-600 mb-6">
              For a long time, I chased publications instead of people. What actually worked was identifying journalists who were already deep in the space.
            </p>

            <p className="text-slate-600 mb-6">
              That's exactly how <a href="https://contactjournalists.com" className={blogTheme.link}>contactjournalists.com</a> is structured.
            </p>

            {/* 7-Day Free Trial Banner */}
            <div className="my-12 relative overflow-hidden">
              <div className="relative bg-purple-50 border-2 border-purple-500 rounded-2xl p-8 md:p-12 text-center">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className={blogTheme.badge}>
                    🚀 Limited Time Offer
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-black mb-4 mt-4">
                  Start Your 7-Day Free Trial Today!
                </h3>
                <p className="text-lg text-slate-600 mb-6 max-w-2xl mx-auto">
                  We have a 7-day free trial so you can check us out and start replying to news requests. No credit card required. Cancel anytime.
                </p>
                <a
                  href="/"
                  className={blogTheme.primaryBtn}
                >
                  Start Your Free Trial Now
                  <svg className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
                <p className="text-sm text-slate-500 mt-4">Join thousands of founders getting press coverage</p>
              </div>
            </div>

            {/* Fourth Image - Coffee and magazines */}
            <div className="my-10">
              <img
                src="/assets/pexels-iamloe-722244_1763395878473.jpg"
                alt="Professional with coffee and magazines representing press and media"
                className="w-full h-auto rounded-xl border-2 border-black shadow-lg"
              />
            </div>

            <h2 className="text-2xl font-semibold text-black mb-4">A final word, founder to founder</h2>

            <p className="text-slate-600 mb-6">
              What most founders actually need is a simpler way to find the right reporter for their story, understand which journalists are relevant to their business, and respond to journalist requests without it becoming another full-time job.
            </p>

            <p className="text-slate-600 mb-6">
              That's exactly why <a href="https://contactjournalists.com" className={blogTheme.link}>contactjournalists.com</a> exists.
            </p>

            {/* Final CTA */}
            <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-6 my-8">
              <h3 className="text-xl font-semibold text-black mb-4">Ready to find the right reporters?</h3>
              <p className="text-slate-600 mb-4">
                Start your 7-day free trial of ContactJournalists.com and see how different PR feels when relevance comes first.
              </p>
              <a
                href="/"
                className={blogTheme.primaryBtn}
              >
                👉 Start your 7-day free trial of ContactJournalists.com
              </a>
            </div>
          </div>
        </article>
      </div>

      <footer className={blogTheme.footer}>
        <div className={blogTheme.footerInner}>
          <div className="flex flex-wrap justify-center gap-1 text-sm text-slate-600 mb-4">
            {FOOTER_LINKS.map((link, index) => (
              <span key={link.href} className="flex items-center">
                <Link className="hover:text-black hover:underline" to={link.href}>
                  {link.label}
                </Link>
                {index < FOOTER_LINKS.length - 1 && (
                  <span className="mx-2 text-slate-400">|</span>
                )}
              </span>
            ))}
          </div>
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

export default HowToFindRightReporterBlog;
