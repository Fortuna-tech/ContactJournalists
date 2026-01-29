import { Helmet } from "react-helmet-async";
import { blogTheme } from "@/styles/blogTheme";
import BlogLayout from "@/layouts/BlogLayout";

const HowToPitchJournalistsTwitter = () => {
  return (
    <BlogLayout>
      <Helmet>
        <title>How To Pitch Journalists on Twitter (Full Breakdown) | ContactJournalists.com</title>
        <meta
          name="description"
          content="Learn how to pitch journalists on Twitter. Real strategies from a founder who got press coverage through Twitter. Full breakdown of what works and what doesn't."
        />
        <meta property="og:title" content="How To Pitch Journalists on Twitter (Full Breakdown)" />
        <meta property="og:description" content="Learn how to pitch journalists on Twitter. Real strategies from a founder who got press coverage through Twitter." />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="How To Pitch Journalists on Twitter (Full Breakdown)" />
        <meta name="twitter:description" content="Learn how to pitch journalists on Twitter. Real strategies from a founder." />
      </Helmet>

      <div className={blogTheme.container}>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className={blogTheme.badgeCategory}>
              Twitter PR Guide
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-sm text-slate-500">Founder Guide</span>
          </div>

          <h1 className={blogTheme.h1} style={blogTheme.h1Style}>
            How To Pitch Journalists on Twitter (Full Breakdown)
          </h1>

          <div className={blogTheme.metaRow + " " + blogTheme.articleHeaderBorder + " mb-8"}>
            <time>December 27, 2025</time>
            <span className={blogTheme.metaDivider}>•</span>
            <span>15 min read</span>
            <span className={blogTheme.metaDivider}>•</span>
            <span>By Fortuna, Founder</span>
          </div>

          {/* Header Image with Overlay */}
          <div className="relative rounded-lg overflow-hidden mb-8 border-2 border-black">
            <img
              src="/assets/twitter-x-laptop.jpg"
              alt="Twitter X logo on laptop screen"
              className="w-full h-64 md:h-80 object-cover"
              style={{ objectPosition: 'center 40%' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-2xl md:text-3xl font-bold text-white drop-shadow-2xl">
                ContactJournalists.com
              </p>
            </div>
          </div>
        </div>

        {/* Introduction */}
        <article className={blogTheme.card + " " + blogTheme.cardPad}>
          <div className={blogTheme.prose}>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              If you've ever Googled "how do I get press for my startup?", felt overwhelmed, opened Twitter and immediately felt a bit sick, this is for you.
            </p>

            <p className="text-slate-600 mb-6">
              Because Twitter is where journalists actually ask for things. And when you first realise that, it's slightly overwhelming. Requests flying past, deadlines attached, replies piling up underneath, and no real clue what you're meant to say or how fast you're meant to say it.
            </p>

            <p className="text-slate-600 mb-6">
              That's how I ended up there in the first place. I wasn't trying to become good at PR. I was just trying to get coverage for my own business and Twitter kept being where the action was.
            </p>

            <p className="text-slate-600 mb-6">
              I started noticing patterns! Replies that were too long went nowhere. Replies that got straight to the point sometimes did. Some journalists wanted a DM, some didn't, and some only replied if you caught them almost straight away!
            </p>

            <p className="text-slate-600 mb-8">
              This post is covering everything that no one tells you on how to pitch journalists on Twitter! Ok let's dive in:
            </p>

            <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-6 my-8">
              <p className="text-slate-600 mb-4">
                If you don't want to learn this the hard way like I did, this is exactly why I built ContactJournalists.com. It shows you journalist requests as they're happening, so you can respond while the opportunity is still there, not hours later when the thread is already dead. There's also a 7-day free trial, so you can try it properly without committing to anything.
              </p>
              <a
                href="/waitlist-signup"
                className={blogTheme.primaryBtn}
              >
                Start your 7-day free trial
              </a>
            </div>

            <div className="bg-white/50 border-2 border-black/20 rounded-lg p-6 my-8">
              <h3 className="text-xl font-semibold text-black mb-3">Quick Navigation</h3>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <a href="#why-twitter" className={blogTheme.link}>Why Twitter Ends Up Being Where Journalists Ask for Help</a>
                <a href="#how-requests-work" className={blogTheme.link}>How Journalist Requests Actually Work</a>
                <a href="#what-to-say" className={blogTheme.link}>What to Say When You Reply</a>
                <a href="#speed-matters" className={blogTheme.link}>Why Speed Matters More Than the Perfect Pitch</a>
                <a href="#public-vs-dm" className={blogTheme.link}>When to Reply Publicly vs When to Send a DM</a>
                <a href="#mistakes" className={blogTheme.link}>The Mistakes I Made Early On</a>
              </div>
            </div>

            {/* Section: Why Twitter */}
            <section id="why-twitter" className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">Why Twitter Ends Up Being Where Journalists Ask for Help</h2>

              <img
                src="/assets/pexels-vlada-karpovich-4050316_1763395875996.jpg"
                alt="Person working on laptop"
                className="w-full h-48 object-cover rounded-lg border-2 border-black mb-6"
              />

              <p className="text-slate-600 mb-6">
                Twitter is the easiest place for journalists. It's public, it's fast, and it doesn't require much effort. A journalist can post a request in under a minute and immediately see who responds.
              </p>

              <p className="text-slate-600 mb-6">
                That's why the requests you see on Twitter are usually very specific. They're not vague fishing exercises. They tend to come with details, deadlines, and sometimes even word counts.
              </p>

              <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-6 my-8">
                <p className="text-slate-600 mb-4">
                  It's one of the reasons I eventually built ContactJournalists.com. After years of doing this manually, I knew how easy it was to miss good opportunities simply because you weren't looking at the right moment.
                </p>
                <a
                  href="/waitlist-signup"
                  className={blogTheme.primaryBtn}
                >
                  Start your 7-day free trial
                </a>
              </div>
            </section>

            {/* Section: How Requests Work */}
            <section id="how-requests-work" className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">How Journalist Requests Actually Work (and How Fast They Move)</h2>

              <p className="text-slate-600 mb-6">
                One of the biggest surprises when you first start paying attention to journalist requests on Twitter is just how quickly they fill up.
              </p>

              <p className="text-slate-600 mb-6">
                Most journalists aren't sitting there all day monitoring replies. They'll check the thread, pick a handful of relevant responses, and move on. Once they've got what they need, that request is effectively closed.
              </p>
            </section>

            {/* Section: What to Say */}
            <section id="what-to-say" className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">What to Say When You Reply (and What Not to Say)</h2>

              <img
                src="/assets/pexels-iamloe-722244_1763395878473.jpg"
                alt="Person working on laptop with coffee"
                className="w-full h-48 object-cover rounded-lg border-2 border-black mb-6"
              />

              <p className="text-slate-600 mb-6">
                The goal isn't to impress them. It's to make it obvious, quickly, that you fit what they're asking for.
              </p>

              <p className="text-slate-600 mb-6">
                Short replies tend to work better than long ones. Not because long replies are bad, but because they take longer to process.
              </p>
            </section>

            {/* Section: Speed Matters */}
            <section id="speed-matters" className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">Why Speed Matters More Than the Perfect Pitch</h2>

              <p className="text-slate-600 mb-6">
                You assume the better written reply wins. The smarter angle. The most polished response. But on Twitter, especially with journalist requests, that's often not the case.
              </p>

              <p className="text-slate-600 mb-6">
                Most of the time, the reply that gets picked is simply the one that arrives early and makes sense.
              </p>

              <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-6 my-8">
                <p className="text-slate-600 mb-4">
                  That's why I built ContactJournalists.com around live updates. Instead of hoping you happen to be online when a journalist posts, you see requests as they come in.
                </p>
                <a
                  href="/waitlist-signup"
                  className={blogTheme.primaryBtn}
                >
                  Start your 7-day free trial
                </a>
              </div>
            </section>

            {/* Section: Public vs DM */}
            <section id="public-vs-dm" className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">When to Reply Publicly vs When to Send a DM</h2>

              <p className="text-slate-600 mb-6">
                If a journalist explicitly says "reply here" or posts a public request with a clear brief, replying publicly is usually the safest option.
              </p>

              <p className="text-slate-600 mb-6">
                DMs tend to make more sense when a journalist asks for them directly, or when the request is more sensitive.
              </p>
            </section>

            {/* Section: Mistakes */}
            <section id="mistakes" className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">The Mistakes I Made Early On (So You Don't Have To)</h2>

              <img
                src="/assets/pexels-rdne-7947746_1763372982891.jpg"
                alt="Person writing notes"
                className="w-full h-48 object-cover rounded-lg border-2 border-black mb-6"
              />

              <p className="text-slate-600 mb-6">
                One of the first mistakes was replying to things that weren't really a fit. I'd convince myself I could make almost any request work for my business. I couldn't.
              </p>

              <p className="text-slate-600 mb-6">
                Probably the biggest mistake, though, was treating this like a numbers game. Once I slowed down and focused on relevance, the quality of responses improved almost immediately!
              </p>
            </section>

            {/* Final Section */}
            <section className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">Final Thoughts</h2>

              <p className="text-slate-600 mb-6">
                If you take anything away from this, let it be this: getting press isn't about being loud, polished, or confident. It's about being relevant, paying attention, and showing up at the right moment.
              </p>

              <div className="bg-purple-100 border-2 border-purple-500 rounded-lg p-8 text-center my-8">
                <p className="text-slate-700 mb-6">
                  If you're curious, try it properly. There's a 7-day free trial, and that's intentional.
                </p>
                <a
                  href="/waitlist-signup"
                  className={blogTheme.primaryBtn}
                >
                  Start Your 7-Day Free Trial
                </a>
              </div>

              <p className="text-slate-600 mb-6">
                And if nothing else, I hope this post makes pitching journalists feel a bit less intimidating. It's not a dark art. It's just a skill you build by paying attention.
              </p>

              <p className="text-slate-600 mb-6">
                Good luck, and go for it.
              </p>
            </section>

            {/* Related Blog Posts */}
            <section className="mt-16 pt-8 border-t-2 border-black/10">
              <h2 className="text-2xl md:text-3xl font-bold text-black mb-6">More Founder Guides</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <a
                  href="/blog/the-fastest-ways-to-get-press-coverage-without-an-agency"
                  className={blogTheme.guideCard}
                >
                  <h3 className="text-xl font-semibold text-black mb-2">
                    The Fastest Ways to Get Press Coverage Without an Agency
                  </h3>
                  <p className="text-sm text-slate-600">
                    Learn the fastest ways to get press coverage without hiring a PR agency. Real strategies from a founder.
                  </p>
                </a>

                <a
                  href="/blog/press-pitch-examples-that-get-replies"
                  className={blogTheme.guideCard}
                >
                  <h3 className="text-xl font-semibold text-black mb-2">
                    7 Press Pitch Examples That Actually Get Replies
                  </h3>
                  <p className="text-sm text-slate-600">
                    Real press pitch templates that work in 2025. Copy, customize, and start getting journalist replies.
                  </p>
                </a>
              </div>
            </section>
          </div>
        </article>
      </div>
    </BlogLayout>
  );
};

export default HowToPitchJournalistsTwitter;
