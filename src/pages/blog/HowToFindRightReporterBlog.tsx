import { Helmet } from "react-helmet-async";

const HowToFindRightReporterBlog = () => {
  const today = new Date();
  const publishDate = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-base-900 text-slate-200">
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
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
              How to Find the Right Reporter for Your Story
            </h1>
            <div className="flex items-center gap-4 text-sm text-slate-400 border-b border-white/10 pb-6">
              <time>{publishDate}</time>
              <span>•</span>
              <span>By Fortuna, Founder</span>
            </div>
          </header>

          <div className="prose prose-invert prose-lg max-w-none">
            {/* TL;DR Section */}
            <div className="bg-accent-blue/10 border border-accent-blue/30 rounded-lg p-6 my-8">
              <h2 className="text-xl font-semibold text-white mb-4 mt-0">TL;DR (for exhausted founders who just want the truth)</h2>
              <ul className="text-slate-200 mb-4 list-disc list-inside space-y-2">
                <li>I spent seven exhausting years building and selling a startup.</li>
                <li>PR worked, but figuring it out took months and months of wasted time, stress, and second-guessing.</li>
                <li>So I built <a href="https://contactjournalists.com" className="text-accent-blue hover:text-accent-violet font-semibold">contactjournalists.com</a> to fix that.</li>
                <li>The hardest part of PR isn't writing the pitch, it's finding the right reporter!</li>
                <li>Googling journalists and scrolling Twitter burns so much time, that quite frankly you just don't have.</li>
                <li>The right press builds trust, credibility, and revenue much faster than ads</li>
                <li>You don't need a PR agency, you need relevance and speed</li>
                <li>ContactJournalists.com gives you journalists, bloggers, YouTubers, podcasters, and live press requests in one place</li>
                <li>There's a 7-day free trial so you can take a look around and start getting PR for your business right now</li>
              </ul>
            </div>

            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              If you're trying to figure out how to find the right reporter for your story, you're not alone. Most founders struggle to get press because they pitch the wrong journalists, waste time on outdated media lists, or don't know where to start. This guide breaks down how to find journalists who actually want your story, how to respond to journalist requests quickly, and how to get press without a PR agency.
            </p>

            {/* First Image - Woman working on laptop */}
            <div className="my-10">
              <img
                src="/assets/pexels-element5-973408_1763117889746.jpg"
                alt="Woman working on laptop researching journalists"
                className="w-full h-auto rounded-xl border border-white/10 shadow-lg"
              />
            </div>

            <h2 className="text-2xl font-semibold text-white mb-4">How to Find the Right Reporter for Your Story</h2>

            <p className="text-slate-300 mb-6">
              Hello I'm Fortuna - I'm the founder of <a href="https://contactjournalists.com" className="text-accent-blue hover:text-accent-violet font-semibold">ContactJournalists.com</a>.
            </p>

            <p className="text-slate-300 mb-6">
              If you're here because you're trying to work out how to get press without losing your mind, your time, or your self-belief, you're exactly where I hoped you'd land! If you want to shortcut months of trial and error, there's a 7-day free trial on ContactJournalists.com so you can take a look around and start getting PR for your business right now.
            </p>

            <p className="text-slate-300 mb-6">
              I spent seven exhausting years building a startup, figuring PR out the long, slow, deeply inefficient way, and then decided that whole process needed fixing. If I'd had something like ContactJournalists.com back then, I would have used it immediately as I would have loved Journalist requests to come directly to me and I hit reply - rather than me scouring the internet for hours on end to no avail!
            </p>

            <h2 className="text-2xl font-semibold text-white mb-4">My first business is why this exists</h2>

            <p className="text-slate-300 mb-6">
              Before ContactJournalists.com, I founded It Really Works Vitamins.
            </p>

            <p className="text-slate-300 mb-6">
              I built this supplement brand from scratch (totally bootstrapped woohoo!) over seven years where anything that saved time, stress or emotional bandwidth would have been a lifeline! If you're in need of an easy way to contact journalists and get publicity for your startup - start your 7-day free trial at <a href="https://contactjournalists.com" className="text-accent-blue hover:text-accent-violet font-semibold">ContactJournalists.com</a>
            </p>

            <p className="text-slate-300 mb-6">
              Back to my story - in the early days, I grew It Really Works Vitamins through Instagram. I scaled up the brand through influencer marketing before it became completely oversaturated. I built relationships, sent products, worked closely with creators, and for a long time it worked brilliantly. When that channel worked, I didn't think much about PR, which is exactly where many founders are before they end up on ContactJournalists.com.
            </p>

            <p className="text-slate-300 mb-6">
              Sales grew. The brand grew. Life was fab. Then the instagram algorithm started tightening its grip and all the reach that we took for granted dropped unless you started running ads on instagram / facebook. Ads also became more expensive. Suddenly, a platform I didn't own was deciding how visible my business could be! That moment is exactly why ContactJournalists.com exists.
            </p>

            {/* Second Image - Craftsman/Workshop */}
            <div className="my-10">
              <img
                src="/assets/pexels-rdne-7947746_1763372982891.jpg"
                alt="Craftsman working in workshop representing building a business"
                className="w-full h-auto rounded-xl border border-white/10 shadow-lg"
              />
            </div>

            <h2 className="text-2xl font-semibold text-white mb-4">Why I shifted focus from ads to press</h2>

            <p className="text-slate-300 mb-6">
              With It Really Works Vitamins, paid ads didn't suddenly stop working. They still drove sales. What changed was how fragile the whole setup felt.
            </p>

            <p className="text-slate-300 mb-6">
              Every growth conversation came back to spend. If reach dipped, budget had to rise. If costs increased, margins tightened. The business itself wasn't weaker, but more and more of its visibility sat with platforms I couldn't influence.
            </p>

            <p className="text-slate-300 mb-6">
              Press behaved differently. When people discovered the brand through coverage - they arrived warmer and trusted us faster as they trusted the publication we'd been featured in - I really felt this level of trust compound over time.
            </p>

            <p className="text-slate-300 mb-6">
              This lines up with broader data too. Nielsen consistently finds that earned media is one of the most trusted forms of advertising globally, outperforming paid social and display.
            </p>

            <h2 className="text-2xl font-semibold text-white mb-4">What actually happened once press landed</h2>

            <p className="text-slate-300 mb-6">
              We eventually landed features in Forbes, Coach Magazine, and Men's Health! Yay!
            </p>

            <p className="text-slate-300 mb-6">
              This <a href="https://www.forbes.com/sites/leebelltech/2019/04/27/best-nutrition-innovation-2019/" className="text-accent-blue hover:text-accent-violet font-semibold" target="_blank" rel="noopener noreferrer">Forbes feature</a> was a really nice turning point for us.
            </p>

            <p className="text-slate-300 mb-6">
              Nothing fundamental about the business changed overnight. Adding those logos to our website, emails, packaging, and social profiles made a noticeable difference. Trust came quicker. People were more comfortable buying. Retail conversations moved faster. Revenue followed yay!
            </p>

            {/* Third Image - Professional woman */}
            <div className="my-10">
              <img
                src="/assets/pexels-vlada-karpovich-4050316_1763395875996.jpg"
                alt="Professional woman in creative workspace representing success"
                className="w-full h-auto rounded-xl border border-white/10 shadow-lg"
              />
            </div>

            <h2 className="text-2xl font-semibold text-white mb-4">The part nobody sees</h2>

            <p className="text-slate-300 mb-6">
              What doesn't show up when people see press logos on a homepage is how long it took to get them. It wasn't a good week of pitching. It was months!
            </p>

            <p className="text-slate-300 mb-6">
              My brain was a whole series of tabs open everywhere. Twitter running in the background. Drafts rewritten because maybe the angle wasn't quite right - remembering to follow up - waiting. Following up. Wondering whether silence meant disinterest or bad timing! arrrghhh!
            </p>

            <p className="text-slate-300 mb-6">
              That waiting drains you. Not just time, but mental energy.
            </p>

            <h2 className="text-2xl font-semibold text-white mb-4">The mistake I made for far too long</h2>

            <p className="text-slate-300 mb-6">
              For a long time, I chased publications instead of people. I wanted recognisable names. Forbes. Men's Health. Big logos I could put on the website. So I started with the outlet and tried to work backwards, clicking bylines, guessing who might be relevant, and hoping I'd landed on the right person.
            </p>

            <p className="text-slate-300 mb-6">
              It feels logical. It's also slow.
            </p>

            <p className="text-slate-300 mb-6">
              What actually worked was identifying journalists who were already deep in the space. People who had written about similar topics more than once, who were actively publishing, and who were already asking the kinds of questions our business could help answer.
            </p>

            <p className="text-slate-300 mb-6">
              That's exactly how <a href="https://contactjournalists.com" className="text-accent-blue hover:text-accent-violet font-semibold">contactjournalists.com</a> is structured. Instead of starting with logos, you start with journalists who:
            </p>

            <ul className="text-slate-300 mb-6 space-y-2 list-disc list-inside">
              <li>Regularly cover your niche, not just once in the past</li>
              <li>Are actively writing and publishing right now</li>
              <li>Are open to sources, commentary, and story ideas</li>
              <li>Already understand the space you're operating in</li>
            </ul>

            {/* 7-Day Free Trial Banner */}
            <div className="my-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-accent-blue via-accent-violet to-accent-blue opacity-20 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-accent-blue/20 via-accent-violet/20 to-accent-blue/20 border-2 border-accent-blue/50 rounded-2xl p-8 md:p-12 text-center shadow-2xl shadow-accent-blue/20">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-blue to-accent-violet px-4 py-2 text-sm font-bold text-white uppercase tracking-wider shadow-lg">
                    🚀 Limited Time Offer
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-4 mt-4">
                  Start Your 7-Day Free Trial Today!
                </h3>
                <p className="text-lg text-slate-200 mb-6 max-w-2xl mx-auto">
                  We have a 7-day free trial so you can check us out and start replying to news requests. No credit card required. Cancel anytime.
                </p>
                <a
                  href="/"
                  className="inline-flex items-center gap-3 rounded-xl bg-white px-8 py-4 text-lg font-bold text-black shadow-glow transition-all hover:bg-slate-100 hover:scale-105 active:scale-95"
                >
                  Start Your Free Trial Now
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
                <p className="text-sm text-slate-400 mt-4">Join thousands of founders getting press coverage</p>
              </div>
            </div>

            {/* Fourth Image - Coffee and magazines */}
            <div className="my-10">
              <img
                src="/assets/pexels-iamloe-722244_1763395878473.jpg"
                alt="Professional with coffee and magazines representing press and media"
                className="w-full h-auto rounded-xl border border-white/10 shadow-lg"
              />
            </div>

            <h2 className="text-2xl font-semibold text-white mb-4">Why Google and Twitter weren't enough</h2>

            <p className="text-slate-300 mb-6">
              I spent an unreasonable amount of time doing what most founders do when they decide they want press. Googling journalists. Clicking author names. Opening multiple tabs. Searching Twitter. Telling myself this counted as progress.
            </p>

            <p className="text-slate-300 mb-6">
              It was exhausting, and most of it didn't move anything forward.
            </p>

            <p className="text-slate-300 mb-6">
              The core issue with Google is that it gives you history, not intent. You're looking at articles someone wrote in the past and trying to guess whether they still cover that topic, whether they still work there, and whether they're even open to pitches. You're doing detective work instead of outreach.
            </p>

            <p className="text-slate-300 mb-6">
              That's the gap <a href="https://contactjournalists.com" className="text-accent-blue hover:text-accent-violet font-semibold">contactjournalists.com</a> was built to close - we bring live requests to you! When a journalist in your niche posts a request - we send this directly to you. Just imagine the sheer amount of time saved.
            </p>

            <h2 className="text-2xl font-semibold text-white mb-4">What ContactJournalists.com actually does</h2>

            <p className="text-slate-300 mb-6">
              <a href="https://contactjournalists.com" className="text-accent-blue hover:text-accent-violet font-semibold">contactjournalists.com</a> brings live press requests from journalists actively looking for sources together with a constantly updated database that brings the right journalists and creators to you, rather than sending you down internet rabbit holes or spending evenings hunting people down online.
            </p>

            <p className="text-slate-300 mb-6">
              You can see what journalists are asking for, respond quickly using the AI response writer, tweak the draft if needed, add in your latest news, and send, without overthinking.
            </p>

            <p className="text-slate-300 mb-6">
              The real benefit isn't more PR. It's less wasted time.
            </p>

            <h2 className="text-2xl font-semibold text-white mb-4">A final word, founder to founder</h2>

            <p className="text-slate-300 mb-6">
              If you're weighing it up, here's what I want you to take away. You don't need a perfect press pitch - you don't need to be "PR ready" or be very polished. And best of all you don't need a PR agency or a massive budget!
            </p>

            <p className="text-slate-300 mb-6">
              What most founders actually need is a simpler way to find the right reporter for their story, understand which journalists are relevant to their business, and respond to journalist requests without it becoming another full-time job.
            </p>

            <p className="text-slate-300 mb-6">
              That's exactly why <a href="https://contactjournalists.com" className="text-accent-blue hover:text-accent-violet font-semibold">contactjournalists.com</a> exists. I built it after years of trying to get press the hard way, pitching the wrong journalists, wasting evenings on Google and Twitter, and wondering why something so important felt so unnecessarily difficult.
            </p>

            <p className="text-slate-300 mb-6">
              Take your time. Read through the guides. Get familiar with how journalists think. And when you're ready to start getting press for your business in a way that feels manageable, you'll know exactly where to go :) see you soon
            </p>

            {/* Final CTA */}
            <div className="bg-accent-blue/10 border border-accent-blue/30 rounded-lg p-6 my-8">
              <h3 className="text-xl font-semibold text-white mb-4">Ready to find the right reporters?</h3>
              <p className="text-slate-200 mb-4">
                Start your 7-day free trial of ContactJournalists.com and see how different PR feels when relevance comes first.
              </p>
              <a
                href="/"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold hover:opacity-95 transition-opacity text-black"
              >
                👉 Start your 7-day free trial of ContactJournalists.com
              </a>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default HowToFindRightReporterBlog;

