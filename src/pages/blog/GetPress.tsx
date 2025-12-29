import { ArrowLeft } from "lucide-react";

const BlogPost = () => {
  return (
    <div className="bg-base-900 text-slate-200 antialiased selection:bg-accent-blue/20 selection:text-white min-h-screen">
      {/* Header */}
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
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </a>
        </nav>
      </header>

      <main className="relative">
        <div className="pointer-events-none absolute inset-0 bg-darkgradient"></div>

        <article className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          {/* Article Header */}
          <header className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-semibold text-accent-blue uppercase tracking-wide">
                Featured Guide
              </span>
              <span className="text-sm text-slate-500">•</span>
              <span className="text-sm text-slate-400">2025 Edition</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">
              How to Get Press for Your Brand Without a PR Agency
            </h1>

            <div className="flex items-center gap-4 text-sm text-slate-400 mb-8">
              <time>January 2025</time>
              <span>•</span>
              <span>15 min read</span>
            </div>

            {/* Hero Image */}
            <div className="relative rounded-2xl overflow-hidden mb-8 border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&h=600&fit=crop"
                alt="Journalist working on laptop with coffee"
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

          {/* Article Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <img
              src="/assets/fortuna-founder-balloons.jpg"
              alt="Fortuna, founder of ContactJournalists.com"
              className="w-full md:w-2/3 lg:w-1/2 rounded-2xl mb-6"
            />
            <p className="text-xl text-slate-300 leading-relaxed mb-8">
              Hi, I'm Fortuna, the founder of ContactJournalists.com. I started
              this platform because I've lived the pain of trying to get press
              without a PR budget.
            </p>

            <p className="text-slate-300 mb-6">
              Back in 2015, I launched my own supplements brand. When I began
              looking for PR support, one well-known agency quoted me a £1,000
              per month retainer — and that was the low end of the market. They
              couldn't even promise they'd get me featured anywhere. It felt
              like a huge slap in the face.
            </p>

            <p className="text-slate-300 mb-6">
              So, I did it myself. I spent hours finding journalists, reading
              what they wrote, and reaching out one by one. It worked, but it
              was so exhausting!
            </p>

            <p className="text-slate-300 mb-6">
              Seven years later, after I sold that brand, I already knew what I
              wanted to build next. I'd seen the gap in the market. I knew this
              was a problem that needed solving and I was the woman to do it!
            </p>

            <p className="text-slate-300 mb-6">
              Fast forward to now, and here we are: ContactJournalists.com
            </p>

            <p className="text-slate-300 mb-6">
              I'm active on Reddit and I've been using it to collect real
              feedback from our beta users. Every update, every feature, every
              improvement comes from what solo devs, solopreneurs and small
              brand owners tell me they actually need.
            </p>

            <p className="text-slate-300 mb-6">
              ContactJournalists.com is built for anyone with a dream: whether
              you're building a SaaS, running a beauty brand, launching an Etsy
              shop, or trying to get your story into Vogue, Men's Health, The
              Guardian, or the blogs you love!
            </p>

            <p className="text-slate-300 mb-6">
              This platform exists because I've been where you are. I've done it
              the hard way, and I built the tool I wish I'd had back then.
            </p>

            <blockquote className="border-l-4 border-accent-blue/50 bg-base-800/50 rounded-r-xl pl-6 pr-4 py-4 my-8 italic text-lg text-slate-200">
              From one small business owner to another, (who actually got her
              tiny brand into Men's Health Magazine) - you can do it 💪🏽
            </blockquote>

            <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6">
              Introduction: That Morning You'll Never Forget
            </h2>

            <p className="text-slate-300 mb-6">
              Imagine waking up one morning, checking your phone, and your
              screen is going crazy.
            </p>

            <p className="text-slate-300 mb-6">
              Hundreds of notifications. Stripe emails stacking up faster than
              you can swipe. "New order." "New order." "New order."
            </p>

            <p className="text-slate-300 mb-6">
              You just stare at it. Half-asleep. Half in shock.
            </p>

            <p className="text-slate-300 mb-6">
              Because three weeks ago, you were plodding along with one sale
              every few days and honestly you were absolutely thrilled. You even
              posted a little screenshot on Reddit like, "Got my first 4
              customers!" and it felt massive.
            </p>

            <div className="rounded-xl overflow-hidden my-8 border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=500&fit=crop"
                alt="Business analytics dashboard showing growth"
                className="w-full h-auto object-cover"
              />
            </div>

            <p className="text-slate-300 mb-6">
              But now it's not even breakfast time and you've already made more
              in revenue than you did the whole of last month.
            </p>

            <p className="text-slate-300 mb-6">
              You open Google Analytics and your jaw just drops.
            </p>

            <p className="text-slate-300 mb-6">
              Traffic pouring in. All from American Men's Health Magazine.
            </p>

            <p className="text-slate-300 mb-6">
              And the maddest part of all this is you didn't even know it was
              coming. Two weeks earlier, you'd replied to a journalist request
              on ContactJournalists.com. The journalist never confirmed they'd
              seen it. No reply, no heads-up, nothing.
            </p>

            <p className="text-slate-300 mb-6">
              But here you are, in your pyjamas watching Stripe explode because
              someone, somewhere, decided to feature you.
            </p>

            <blockquote className="border-l-4 border-accent-blue/50 bg-base-800/50 rounded-r-xl pl-6 pr-4 py-4 my-8 italic text-lg text-slate-200">
              That's the power of getting in front of the right journalist at
              the right time. No ad spend. No influencer deal. No viral TikTok.
              Just one perfect story landing in the perfect inbox at exactly the
              right moment.
            </blockquote>

            <div className="rounded-xl overflow-hidden my-8 border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&h=500&fit=crop"
                alt="Magazine publications and media"
                className="w-full h-auto object-cover"
              />
            </div>

            <p className="text-slate-300 mb-6">
              This is how small brands end up in massive publications out of
              nowhere (and this is actually what happened to me with my own
              supplement brand).
            </p>

            <p className="text-slate-300 mb-6">
              It's how you go from one sale a week to waking up to "New order.
              New order. New order."
            </p>

            <p className="text-slate-300 mb-6">
              In this guide, I'll be breaking down every platform that helps you
              make that happen. From HARO (Help a Reporter Out) and
              ResponseSource to MuckRack, Roxhill Media, and the new generation
              of AI-driven tools like my very own ContactJournalists.com.
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6">
              Why Finding the Right Contacts Matters More Than Ever
            </h2>

            <p className="text-slate-300 mb-6">
              Ok so let's step into the shoes of a journalist for a minute.
              They're bombarded with hundreds of pitches daily. Most are
              generic, irrelevant, or poorly timed. The ones that stand out?
              They're personalized, timely, and come from people who've done
              their homework.
            </p>

            <p className="text-slate-300 mb-6">
              That's where the right platform comes in. It's not just about
              having email addresses - it's about understanding who covers what,
              when they're looking for stories, and how to approach them
              effectively.
            </p>

            {/* Mid-Article CTA */}
            <div className="my-10 p-8 rounded-2xl border border-accent-blue/30 bg-gradient-to-r from-accent-blue/10 to-accent-violet/10 text-center">
              <h3 className="text-xl font-bold text-white mb-4">
                Ready to Get Started?
              </h3>
              <p className="text-slate-300 mb-6">
                Join ContactJournalists.com and connect with journalists who
                want to hear your story.
              </p>
              <a
                href="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-violet px-8 py-4 text-lg font-semibold text-white shadow-glow hover:opacity-95 transition-opacity"
              >
                Sign Up Now - Free Beta Access
              </a>
            </div>

            {/* Final CTA */}
            <div className="mt-12 p-8 rounded-2xl border border-accent-blue/30 bg-gradient-to-r from-accent-blue/10 to-accent-violet/10">
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to get started?
              </h3>
              <p className="text-slate-300 mb-6">
                Join thousands of founders and PR professionals already on the
                waiting list for ContactJournalists.com. Get free beta access
                and start pitching journalists today.
              </p>
              <a
                href="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-violet px-6 py-3 font-semibold text-white shadow-glow hover:opacity-95 transition-opacity"
              >
                Sign Up Now - Free Beta Access
              </a>
            </div>
          </div>
        </article>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-white/5 bg-base-800/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="text-sm text-slate-400">
            © 2025 ContactJournalists.com. Built in London with ☕️
          </p>
        </div>
      </footer>
    </div>
  );
};

export default BlogPost;
