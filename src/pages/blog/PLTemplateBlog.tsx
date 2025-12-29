import { ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet-async";
import calculatorImage from "@assets/pexels-karola-g-4476375_1763372979022.jpg";
import revenueReportImage from "@assets/pexels-rdne-7947746_1763372982891.jpg";

const PLTemplateBlogPost = () => {
  return (
    <>
      <Helmet>
        <title>
          Free Small Business P&L Template (Google Sheets + Excel) |
          ContactJournalists.com
        </title>
        <meta
          name="description"
          content="Free small business Profit & Loss template for Google Sheets and Excel. Track revenue, expenses and profit easily. Built for founders, startups and solopreneurs."
        />
        <meta
          property="og:title"
          content="Free Small Business P&L Template (Google Sheets + Excel)"
        />
        <meta
          property="og:description"
          content="Free small business Profit & Loss template for Google Sheets and Excel. Track revenue, expenses and profit easily. Built for founders, startups and solopreneurs."
        />
        <meta property="og:type" content="article" />
        <meta
          property="og:url"
          content="https://contactjournalists.com/blog/free-small-business-pl-template-google-sheets-excel"
        />
      </Helmet>

      <div className="bg-base-900 text-slate-200 antialiased selection:bg-accent-blue/20 selection:text-white min-h-screen">
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
            <header className="mb-12">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-semibold text-accent-blue uppercase tracking-wide">
                  Free Resource
                </span>
                <span className="text-sm text-slate-500">•</span>
                <span className="text-sm text-slate-400">Founder Tools</span>
              </div>

              <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Free Small Business P&L Template (Google Sheets + Excel)
              </h1>

              <p className="text-xl text-slate-400 mb-6">
                Startup, Solopreneur & SaaS-Friendly | Founder-Made | Free
                Download
              </p>

              <div className="flex items-center gap-4 text-sm text-slate-400 mb-8">
                <time>November 15, 2025</time>
                <span>•</span>
                <span>8 min read</span>
              </div>

              <div className="relative rounded-2xl overflow-hidden mb-8 border border-white/10">
                <img
                  src={calculatorImage}
                  alt="Solopreneur calculating business finances with ContactJournalists.com free P&L template to track startup revenue and expenses for small business growth"
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

            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                📥 Download Your Free P&L Template
              </h2>
              <p className="text-slate-300 mb-6">
                ✔ Google Sheets & Excel versions ✔ Works with any currency ✔ Founder-friendly layout ✔ Clear structure with no clutter. Enter your email to get instant access.
              </p>
              <iframe 
                width="540" 
                height="905" 
                src="https://db7e141b.sibforms.com/serve/MUIFAIIYRzBhiFb-31a5HL2cvFXdCnjhfOkbM3UtVhQYpC4OrwDrZ7zdRVPVmir5QP9J-9DMGEbXHJ543NcHker5aYHMSkTy0nw6kDLrOw4aMsPpFVojDeG6G9A838NpSxuqIUAuQJn0eaRojqoKVMmFqF4B-XhzMv3QBXz4Y-lYvXxSDhZeeFKW5Owl-51vMAMokzcs08lhJE1s" 
                frameBorder="0" 
                scrolling="auto" 
                allowFullScreen 
                style={{ display: "block", marginLeft: "auto", marginRight: "auto", maxWidth: "100%" }}
              ></iframe>
            </div>

            <div className="prose prose-invert prose-lg max-w-none">
              <p className="text-xl text-slate-300 leading-relaxed mb-6 mt-0">
                If you're a founder, solopreneur or small business owner trying
                to keep your finances organised, you need a P&L template that
                works in real life: simple, clean, easy to update and made for
                people who don't have time to wrestle with spreadsheets.
              </p>

              <p className="text-slate-300 mb-6">
                This free Profit & Loss Template (Google Sheets + Excel) is
                exactly that.
              </p>

              <p className="text-slate-300 mb-6">
                I built it because almost everything I create for founders has
                the same heartbeat — making life easier for the people who are
                doing everything alone.
              </p>

              <p className="text-slate-300 mb-6">
                That's exactly why I'm building{" "}
                <a
                  href="https://contactjournalists.com"
                  className="text-accent-blue hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ContactJournalists.com
                </a>
                .
              </p>

              <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6">
                What Is ContactJournalists.com?
              </h2>

              <p className="text-slate-300 mb-4">
                <a
                  href="https://contactjournalists.com"
                  className="text-accent-blue hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ContactJournalists.com
                </a>{" "}
                is a simple, founder-friendly platform that helps you get press
                without:
              </p>

              <ul className="list-disc list-inside text-slate-300 mb-6 space-y-2">
                <li>PR retainers</li>
                <li>expensive databases</li>
                <li>hours of Googling</li>
                <li>feeling like you're shouting into the void</li>
              </ul>

              <p className="text-slate-300 mb-4">It helps you:</p>

              <ul className="list-disc list-inside text-slate-300 mb-6 space-y-2">
                <li>find up-to-date journalist contact details</li>
                <li>
                  receive live alerts when journalists request expert comments
                </li>
                <li>write strong, human, founder-specific pitches using AI</li>
                <li>track who you've contacted and who opened your email</li>
                <li>
                  learn how to pitch your story in a way that doesn't feel
                  awkward or spammy
                </li>
              </ul>

              <p className="text-slate-300 mb-6">
                If you haven't read it yet, here is the latest guide that pairs
                perfectly with this template:
              </p>

              <p className="text-slate-300 mb-6">
                👉{" "}
                <a
                  href="/blog/ultimate-guide-best-platforms-contacting-journalists-2026"
                  className="text-accent-blue hover:underline font-semibold"
                >
                  Ultimate Guide: Best Platforms for Contacting Journalists in
                  2026
                </a>
              </p>

              <p className="text-slate-300 mb-6">
                And while{" "}
                <a
                  href="https://contactjournalists.com"
                  className="text-accent-blue hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ContactJournalists.com
                </a>{" "}
                is built to give you clarity with your visibility, this free P&L
                template gives you clarity with your money.
              </p>

              <p className="text-slate-300 mb-6">
                Both matter. Both shape the outcome of your business.
              </p>

              <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6">
                Quick Refresh: What Is a P&L?
              </h2>

              <p className="text-slate-300 mb-4">
                A Profit & Loss Statement shows:
              </p>

              <ul className="list-disc list-inside text-slate-300 mb-6 space-y-2">
                <li>what your business earned</li>
                <li>what it spent</li>
                <li>whether you made a profit</li>
                <li>how that changed month by month</li>
              </ul>

              <p className="text-slate-300 mb-6">
                It's the simplest snapshot of your business health.
              </p>

              <p className="text-slate-300 mb-6">
                It's also the document every investor, buyer, lender and advisor
                asks for first.
              </p>

              <div className="rounded-2xl overflow-hidden my-8 border border-white/10">
                <img
                  src={revenueReportImage}
                  alt="Small business revenue report and financial planning tools showing how ContactJournalists.com helps startups track profit and loss for sustainable solopreneur growth"
                  className="w-full h-auto object-cover"
                />
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6">
                Running a Business Means You're Constantly Switching Hats
              </h2>

              <p className="text-slate-300 mb-6">
                One minute you're the marketing team.
              </p>

              <p className="text-slate-300 mb-6">Then customer service.</p>

              <p className="text-slate-300 mb-6">Then operations.</p>

              <p className="text-slate-300 mb-6">Then branding.</p>

              <p className="text-slate-300 mb-6">Then packaging.</p>

              <p className="text-slate-300 mb-6">Then sales.</p>

              <p className="text-slate-300 mb-6">Then tech support.</p>

              <p className="text-slate-300 mb-6">Then accounts.</p>

              <p className="text-slate-300 mb-6">
                Then the person quietly holding everything together because if
                you don't, no one will.
              </p>

              <p className="text-slate-300 mb-6">
                And somewhere in that overwhelming, never-ending to-do list sits
                the task we all avoid:
              </p>

              <p className="text-slate-300 mb-6 font-semibold italic">
                Sort out my finances.
              </p>

              <p className="text-slate-300 mb-4">
                Most of us don't start businesses because we enjoy spreadsheets.
                But understanding your numbers changes everything:
              </p>

              <ul className="list-disc list-inside text-slate-300 mb-6 space-y-2">
                <li>your confidence</li>
                <li>your decisions</li>
                <li>your peace of mind</li>
                <li>your direction</li>
              </ul>

              <p className="text-slate-300 mb-6">
                That's why I created this free Small Business P&L Template. It's
                simple, clean, currency-agnostic and actually usable in daily
                founder life.
              </p>

              <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6">
                What's Inside the Template
              </h2>

              <ul className="list-none text-slate-300 mb-6 space-y-2">
                <li>✔ Monthly revenue tracker</li>
                <li>✔ COGS calculator</li>
                <li>✔ Automatic profit calculation</li>
                <li>✔ Expense categories you can customise</li>
                <li>✔ Annual summary tab</li>
                <li>✔ Protected formulas</li>
                <li>✔ Clean, minimalist design</li>
                <li>✔ No locked currency symbols</li>
              </ul>

              <p className="text-slate-300 mb-6">
                Everything you need. Nothing you don't.
              </p>

              <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6">
                Why This Template Works (and Why Founders Love It)
              </h2>

              <p className="text-slate-300 mb-6">
                Most online P&L templates feel like they were made by
                accountants for other accountants.
              </p>

              <p className="text-slate-300 mb-4">
                This one was created by a founder for other founders, which
                means:
              </p>

              <ul className="list-disc list-inside text-slate-300 mb-6 space-y-2">
                <li>you don't need to be a spreadsheet expert</li>
                <li>you won't be hit with 200 irrelevant categories</li>
                <li>you can update it in minutes</li>
                <li>you won't feel overwhelmed before you even begin</li>
              </ul>

              <p className="text-slate-300 mb-6">It's literally just:</p>

              <p className="text-slate-300 mb-6 font-semibold">
                Revenue → COGS → Expenses → Monthly Profit
              </p>

              <p className="text-slate-300 mb-6">Simple. Clear. Calm.</p>

              <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6">
                Who This Template Is Perfect For
              </h2>

              <p className="text-slate-300 mb-4">
                This P&L template is ideal if you are:
              </p>

              <ul className="list-disc list-inside text-slate-300 mb-6 space-y-2">
                <li>a first-time founder</li>
                <li>a solopreneur juggling ten roles</li>
                <li>a SaaS founder watching burn rate</li>
                <li>an ecommerce store owner with seasonal spikes</li>
                <li>a coach or creator with variable income</li>
                <li>a service-based business with fluctuating revenue</li>
                <li>a bootstrapped startup building slowly and steadily</li>
              </ul>

              <p className="text-slate-300 mb-6">
                If you want clarity without complexity, this template is for
                you.
              </p>

              <div className="mt-12">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Get Your Free P&L Template Now
                </h2>
                <p className="text-slate-300 mb-6">
                  Perfect for first-time founders, solopreneurs, SaaS founders, and bootstrapped startups. Download both Google Sheets and Excel versions instantly.
                </p>
                <iframe 
                  width="540" 
                  height="905" 
                  src="https://db7e141b.sibforms.com/serve/MUIFAIIYRzBhiFb-31a5HL2cvFXdCnjhfOkbM3UtVhQYpC4OrwDrZ7zdRVPVmir5QP9J-9DMGEbXHJ543NcHker5aYHMSkTy0nw6kDLrOw4aMsPpFVojDeG6G9A838NpSxuqIUAuQJn0eaRojqoKVMmFqF4B-XhzMv3QBXz4Y-lYvXxSDhZeeFKW5Owl-51vMAMokzcs08lhJE1s" 
                  frameBorder="0" 
                  scrolling="auto" 
                  allowFullScreen 
                  style={{ display: "block", marginLeft: "auto", marginRight: "auto", maxWidth: "100%" }}
                ></iframe>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6">
                A Founder Confession: Why I Find This Weirdly Therapeutic
              </h2>

              <p className="text-slate-300 mb-4">
                At the end of each month, I sit down with tea, open this P&L
                and:
              </p>

              <ul className="list-disc list-inside text-slate-300 mb-6 space-y-2">
                <li>add every cost</li>
                <li>add every bit of revenue</li>
                <li>watch the totals update</li>
                <li>take a breath</li>
                <li>feel grounded again</li>
              </ul>

              <p className="text-slate-300 mb-6">
                There's something cleansing about it.
              </p>

              <p className="text-slate-300 mb-6">A ritual of honesty.</p>

              <p className="text-slate-300 mb-6">
                A moment where everything becomes clear again.
              </p>

              <p className="text-slate-300 mb-6">
                When you know your numbers, nothing feels as chaotic.
              </p>

              <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6">
                The Long-Term Reason This Matters
              </h2>

              <p className="text-slate-300 mb-4">
                One day, whether in two years or ten, you may consider:
              </p>

              <ul className="list-disc list-inside text-slate-300 mb-6 space-y-2">
                <li>selling your business</li>
                <li>bringing on partners</li>
                <li>raising investment</li>
                <li>applying for grants</li>
                <li>taking out a loan</li>
                <li>proving traction</li>
              </ul>

              <p className="text-slate-300 mb-4">
                Beautifully clean P&L records make you look:
              </p>

              <ul className="list-disc list-inside text-slate-300 mb-6 space-y-2">
                <li>prepared</li>
                <li>professional</li>
                <li>credible</li>
                <li>investable</li>
                <li>exit-ready</li>
              </ul>

              <p className="text-slate-300 mb-6">
                Future you will be grateful.
              </p>

              <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6">
                How This Template Helps You Right Now
              </h2>

              <p className="text-slate-300 mb-4">
                Using it once a month gives you instant clarity:
              </p>

              <ul className="list-disc list-inside text-slate-300 mb-6 space-y-2">
                <li>Are you truly profitable?</li>
                <li>Which months outperform?</li>
                <li>Are expenses creeping up quietly?</li>
                <li>Did that marketing test work?</li>
                <li>Is your idea financially sustainable?</li>
                <li>When can you pay yourself more?</li>
                <li>Where is money disappearing?</li>
              </ul>

              <p className="text-slate-300 mb-6">Clarity creates momentum.</p>

              <p className="text-slate-300 mb-6">
                Momentum creates confidence.
              </p>

              <p className="text-slate-300 mb-6">
                Confidence creates better decisions.
              </p>

              <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6">
                A Quick Note About ContactJournalists.com
              </h2>

              <p className="text-slate-300 mb-6">
                Just like your P&L gives you financial clarity,{" "}
                <a
                  href="https://contactjournalists.com"
                  className="text-accent-blue hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ContactJournalists.com
                </a>{" "}
                gives you visibility clarity.
              </p>

              <p className="text-slate-300 mb-6">
                Both tools exist for the same purpose:
              </p>

              <p className="text-slate-300 mb-6 font-semibold">
                To make the founder journey easier, lighter and more successful.
              </p>

              <p className="text-slate-300 mb-6">
                If you haven't yet explored how to get your first press
                features, start here:
              </p>

              <p className="text-slate-300 mb-6">
                👉{" "}
                <a
                  href="/blog/ultimate-guide-best-platforms-contacting-journalists-2026"
                  className="text-accent-blue hover:underline font-semibold"
                >
                  Ultimate Guide: Best Platforms for Contacting Journalists in
                  2026
                </a>
              </p>

              <p className="text-slate-300 mb-6">
                And if you want to begin building visibility today, you can{" "}
                <a
                  href="/signup"
                  className="text-accent-blue hover:underline font-semibold"
                >
                  Start Free on ContactJournalists.com
                </a>
                .
              </p>

              <div className="mt-12">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Claim Your Free P&L Template
                </h2>
                <p className="text-slate-300 mb-6">
                  Join hundreds of founders who've downloaded this template. Get both Google Sheets and Excel versions sent to your inbox instantly. Track revenue, expenses, and profit with ease.
                </p>
                <iframe 
                  width="540" 
                  height="905" 
                  src="https://db7e141b.sibforms.com/serve/MUIFAIIYRzBhiFb-31a5HL2cvFXdCnjhfOkbM3UtVhQYpC4OrwDrZ7zdRVPVmir5QP9J-9DMGEbXHJ543NcHker5aYHMSkTy0nw6kDLrOw4aMsPpFVojDeG6G9A838NpSxuqIUAuQJn0eaRojqoKVMmFqF4B-XhzMv3QBXz4Y-lYvXxSDhZeeFKW5Owl-51vMAMokzcs08lhJE1s" 
                  frameBorder="0" 
                  scrolling="auto" 
                  allowFullScreen 
                  style={{ display: "block", marginLeft: "auto", marginRight: "auto", maxWidth: "100%" }}
                ></iframe>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6">
                More Free Tools for Founders
              </h2>

              <p className="text-slate-300 mb-4">
                If this template helps, you'll love these too:
              </p>

              <ul className="list-disc list-inside text-slate-300 mb-6 space-y-2">
                <li>How to Find a Journalist's Email in 2025</li>
                <li>How to Write a Press Pitch That Actually Gets Replies</li>
                <li>The Complete Founder's Guide to PR on a Budget</li>
              </ul>

              <p className="text-slate-300 mb-6">
                Each one supports how{" "}
                <a
                  href="https://contactjournalists.com"
                  className="text-accent-blue hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ContactJournalists.com
                </a>{" "}
                helps you grow.
              </p>

              <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6">
                Final Thoughts From One Founder to Another
              </h2>

              <p className="text-slate-300 mb-6">
                If you're bootstrapping, multitasking and trying to build
                something meaningful, I see you.
              </p>

              <p className="text-slate-300 mb-6">
                We're all doing the job of an entire team most days.
              </p>

              <p className="text-slate-300 mb-6">
                We're all figuring it out as we go.
              </p>

              <p className="text-slate-300 mb-6">We're all doing our best.</p>

              <p className="text-slate-300 mb-6">
                This template won't solve everything, but it will give you
                clarity.
              </p>

              <p className="text-slate-300 mb-6">
                And clarity changes the way you move.
              </p>

              <p className="text-slate-300 mb-6">The P&L is free.</p>

              <p className="text-slate-300 mb-6">
                <a
                  href="https://contactjournalists.com"
                  className="text-accent-blue hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ContactJournalists.com
                </a>{" "}
                is growing.
              </p>

              <p className="text-slate-300 mb-6">
                And both exist to support founders like you.
              </p>

              <p className="text-slate-300 mb-6">
                If you want help getting into the press, you can{" "}
                <a
                  href="/signup"
                  className="text-accent-blue hover:underline font-semibold"
                >
                  Start Free anytime at ContactJournalists.com
                </a>
                .
              </p>
            </div>
          </article>

          <footer className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 border-t border-white/10 text-center text-sm text-slate-400">
            © 2025 ContactJournalists.com. Built in London with ☕️
          </footer>
        </main>
      </div>
    </>
  );
};

export default PLTemplateBlogPost;
