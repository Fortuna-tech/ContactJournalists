import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { blogTheme } from "@/styles/blogTheme";
import BlogLayout from "@/layouts/BlogLayout";
import { FOOTER_LINKS } from "@/components/Footer";

const PressWithoutAgencyBlog = () => {
  return (
    <BlogLayout>
      <Helmet>
        <title>The Fastest Ways to Get Press Coverage Without an Agency</title>
        <meta
          name="description"
          content="Learn the fastest ways to get press coverage without hiring a PR agency. Real strategies from a founder who built coverage for their business from scratch."
        />
        <meta property="og:title" content="The Fastest Ways to Get Press Coverage Without an Agency" />
        <meta property="og:description" content="Learn the fastest ways to get press coverage without hiring a PR agency. Real strategies from a founder who built coverage for their business from scratch." />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="The Fastest Ways to Get Press Coverage Without an Agency" />
        <meta name="twitter:description" content="Learn the fastest ways to get press coverage without hiring a PR agency." />
      </Helmet>

      <div className={blogTheme.container}>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className={blogTheme.badgeCategory}>
              Founder Guide
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-sm text-slate-500">Press Strategy</span>
          </div>

          <h1 className={blogTheme.h1} style={blogTheme.h1Style}>
            The Fastest Ways to Get Press Coverage Without an Agency
          </h1>

          <div className={blogTheme.metaRow + " " + blogTheme.articleHeaderBorder}>
            <time>December 19, 2025</time>
            <span className={blogTheme.metaDivider}>•</span>
            <span>12 min read</span>
            <span className={blogTheme.metaDivider}>•</span>
            <span>By Fortuna, Founder</span>
          </div>
        </div>

        {/* Introduction */}
        <article className={blogTheme.card + " " + blogTheme.cardPad}>
          <div className={blogTheme.prose}>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              TL;DR – Want Press Coverage Without an Agency?
            </p>

            <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-6 my-8">
              <p className="text-slate-600 mb-4">
                <strong>ContactJournalists.com</strong> gives you direct access to journalists already writing stories and requesting sources right now. You can pitch relevant journalists, stay organised, and cancel anytime.
              </p>
              <a
                href="/pricing"
                className={blogTheme.primaryBtn}
              >
                👉 Start your 7-day free trial now
              </a>
            </div>

            <h2 className="text-2xl font-semibold text-black mb-4">How Do I Get Press Coverage Without a PR Agency?</h2>

            <p className="text-slate-600 mb-6">
              You're probably reading this with far too many tabs open, Stripe sitting there in the background, Slack pinging away, half-written emails you meant to send last week, and a Google search along the lines of "how do I get press coverage without a PR agency" because it's been on your list for a while and you know it matters.
            </p>

            <p className="text-slate-600 mb-6">
              I know exactly where you are, because a few years ago, I was you!
            </p>

            <div className="flex flex-col md:flex-row gap-6 mb-6 items-start">
              <img
                src="/assets/fortuna-founder-balloons.jpg"
                alt="Fortuna, founder of ContactJournalists.com"
                className="w-full md:w-64 md:flex-shrink-0 h-48 object-cover rounded-lg border-2 border-black"
              />
              <p className="flex-1 text-slate-600">
                My name is Fortuna and I founded <a href="https://www.itreallyworksvitamins.com" className={blogTheme.link} target="_blank" rel="noopener noreferrer">It Really Works Vitamins</a>, and like most founders, I was building it from scratch and trying to grow it properly without burning out or burning through my savings.
              </p>
            </div>

            <p className="text-slate-600 mb-6">
              Without an agency, we managed to get featured in Forbes, Shortlist, Coach Mag and many others.
            </p>

            <p className="text-slate-600 mb-6">
              If you want to get press without hiring a PR agency, this is exactly why I built ContactJournalists.com.
            </p>

            <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-6 my-8">
              <p className="text-slate-600 mb-4">
                👉 Start your 7-day free trial and see how doable press actually is.
              </p>
              <a
                href="/pricing"
                className={blogTheme.primaryBtn}
              >
                Start your 7-day free trial
              </a>
            </div>

            <h2 className="text-2xl font-semibold text-black mb-4">What This Article Will Cover</h2>

            <div className="bg-white/50 border-2 border-black/20 rounded-lg p-6 my-8">
              <h3 className="text-xl font-semibold text-black mb-3">Quick Navigation</h3>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <a href="#why-press-works" className={blogTheme.link}>Why Press Coverage Still Works in 2025</a>
                <a href="#why-founders-fail" className={blogTheme.link}>Why Most Founders Never Get Press</a>
                <a href="#need-agency" className={blogTheme.link}>Do You Really Need a PR Agency?</a>
                <a href="#fastest-ways" className={blogTheme.link}>The Fastest Ways to Get Press</a>
                <a href="#how-journalists-work" className={blogTheme.link}>How Journalists Work</a>
                <a href="#find-journalists" className={blogTheme.link}>How to Find the Right Journalists</a>
              </div>
            </div>

            {/* Why Press Coverage Still Works */}
            <section id="why-press-works" className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">Why Press Coverage Still Works in 2025</h2>

              <p className="text-slate-600 mb-6">
                In a world of noisy influencers being paid to feature things and ads that interrupt your reading, scrolling, and videos, it's easy to assume press doesn't matter anymore.
              </p>

              <p className="text-slate-600 mb-6">
                In reality, press is still doing something most other channels can't.
              </p>

              <p className="text-slate-600 mb-6">
                It builds trust before someone ever lands on your website.
              </p>

              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=300&fit=crop"
                alt="Analytics dashboard showing website traffic and conversion improvements"
                className="w-full h-48 object-cover rounded-lg border-2 border-black mb-6"
              />

              <h3 className="text-xl font-semibold text-black mb-6">Press Reaches the Right People, Not Just More People</h3>

              <p className="text-slate-600 mb-6">
                When your brand appears in a publication, you're not shouting into the void. You're being placed directly in front of people who already care about that topic.
              </p>

              <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-6 my-8">
                <p className="text-slate-600 mb-4">
                  👉 This is where targeted outreach matters most.
                  <a href="/blog/ultimate-guide-best-platforms-contacting-journalists-2026" className={blogTheme.link + " ml-2"}>
                    With ContactJournalists.com →
                  </a>
                </p>
                <a
                  href="/pricing"
                  className={blogTheme.primaryBtn}
                >
                  Start your 7-day free trial today
                </a>
              </div>
            </section>

            {/* Why Most Founders Never Get Press */}
            <section id="why-founders-fail" className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">Why Most Founders Never Get Press (Even With a Great Product)</h2>

              <img
                src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=300&fit=crop"
                alt="Founder looking frustrated at computer screen with press coverage challenges"
                className="w-full h-48 object-cover rounded-lg border-2 border-black mb-6"
              />

              <p className="text-slate-600 mb-6">
                Most founders don't miss out on press because their product isn't good enough. They miss out because they assume press is reserved for bigger brands, when in reality it's reserved for the most interesting stories.
              </p>

              <p className="text-slate-600 mb-6">
                If any of this feels familiar, you don't need a PR agency, you need a better system.
              </p>

              <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-6 my-8">
                <p className="text-slate-600 mb-4">
                  ContactJournalists.com helps you find the right journalists, respond to live opportunities, and keep your outreach organised in one place.
                </p>
                <a
                  href="/pricing"
                  className={blogTheme.primaryBtn}
                >
                  👉 Start your 7-day free trial now
                </a>
              </div>
            </section>

            {/* The Fastest Ways to Get Press */}
            <section id="fastest-ways" className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">The Fastest Ways to Get Press Coverage Without an Agency</h2>

              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=300&fit=crop"
                alt="Speed and efficiency concept for press coverage"
                className="w-full h-48 object-cover rounded-lg border-2 border-black mb-6"
              />

              <p className="text-slate-600 mb-6">
                Once you understand that press isn't about confidence, connections, or being loud, it becomes much easier to approach it strategically.
              </p>

              <h3 className="text-xl font-semibold text-black mb-6">1. Tie Your Story to Something That's Already Happening</h3>

              <p className="text-slate-600 mb-6">
                The quickest press wins come when your business fits naturally into a story journalists are already working on.
              </p>

              <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-6 my-8">
                <p className="text-slate-600 mb-4">
                  👉 Speed matters in press.
                  <a href="/blog/ultimate-guide-best-platforms-contacting-journalists-2026" className={blogTheme.link + " ml-2"}>
                    ContactJournalists.com →
                  </a>
                  shows you journalist requests as they happen, so you can respond immediately.
                </p>
                <a
                  href="/pricing"
                  className={blogTheme.primaryBtn}
                >
                  Start your 7-day free trial and experience how fast press can actually move
                </a>
              </div>

              <h3 className="text-xl font-semibold text-black mb-6">2. Use Reactive PR to Your Advantage</h3>

              <p className="text-slate-600 mb-6">
                Reactive press is one of the most underused opportunities for founders. This is where journalists actively ask for input, quotes, or examples, often with tight deadlines.
              </p>

              <h3 className="text-xl font-semibold text-black mb-6">3. Lead With Insight, Not Promotion</h3>

              <p className="text-slate-600 mb-6">
                One of the fastest ways to get ignored is to sound like marketing. Journalists want insight.
              </p>
            </section>

            {/* Final Thoughts */}
            <section className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">Final Thoughts: You Don't Need a PR Agency, You Need a Process</h2>

              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=300&fit=crop"
                alt="Success and process concept"
                className="w-full h-48 object-cover rounded-lg border-2 border-black mb-6"
              />

              <p className="text-slate-600 mb-6">
                Press isn't reserved for big brands, loud founders, or companies with huge budgets. It's reserved for relevant stories, clear thinking, good timing, and founders who understand how journalists actually work.
              </p>

              <p className="text-slate-600 mb-6">
                You just need a simple way to find the right journalists, respond to opportunities when they appear, and keep your outreach organised.
              </p>

              <div className="bg-purple-100 border-2 border-purple-500 rounded-lg p-8 text-center">
                <h3 className="text-3xl md:text-4xl font-bold text-black mb-4">Ready to start getting press without a PR agency?</h3>
                <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
                  👉 Start your 7-day free trial of ContactJournalists.com and get in front of journalists who are actively writing right now.
                </p>
                <a
                  href="/pricing"
                  className={blogTheme.primaryBtn}
                >
                  Start Your Free Trial
                </a>
              </div>

              <p className="text-slate-600 mt-6 mb-6">
                See you on the inside!
              </p>
            </section>

            {/* Footer */}
            <div className="mt-16 pt-8 border-t-2 border-black/10 text-center text-sm text-slate-500">
              <p>
                This guide was last updated on December 19, 2025.
                Press landscapes change quickly, so verify the latest pricing and features directly with providers.
              </p>
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

export default PressWithoutAgencyBlog;
