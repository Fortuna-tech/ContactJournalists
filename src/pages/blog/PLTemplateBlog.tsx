import { ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet-async";
import calculatorImage from "@assets/pexels-karola-g-4476375_1763372979022.jpg";
import revenueReportImage from "@assets/pexels-rdne-7947746_1763372982891.jpg";
import { blogTheme } from "@/styles/blogTheme";
import BlogLayout from "@/layouts/BlogLayout";

const PLTemplateBlogPost = () => {
  return (
    <BlogLayout>
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
                    Free Resource
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-sm text-slate-500">Founder Tools</span>
                </div>

                <h1 className={blogTheme.h1} style={blogTheme.h1Style}>
                  Free Small Business P&L Template (Google Sheets + Excel)
                </h1>

                <p className="text-xl text-slate-500 mb-6">
                  Startup, Solopreneur & SaaS-Friendly | Founder-Made | Free
                  Download
                </p>

                <div className={blogTheme.metaRow + " mb-8"}>
                  <time>November 15, 2025</time>
                  <span className={blogTheme.metaDivider}>•</span>
                  <span>8 min read</span>
                </div>

                <div className="relative rounded-2xl overflow-hidden mb-8 border-2 border-black">
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
                <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
                  📥 Download Your Free P&L Template
                </h2>
                <p className="text-slate-600 mb-6">
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

              <div className={blogTheme.prose}>
                <p className="text-xl text-slate-600 leading-relaxed mb-6 mt-0">
                  If you're a founder, solopreneur or small business owner trying
                  to keep your finances organised, you need a P&L template that
                  works in real life: simple, clean, easy to update and made for
                  people who don't have time to wrestle with spreadsheets.
                </p>

                <p className="text-slate-600 mb-6">
                  This free Profit & Loss Template (Google Sheets + Excel) is
                  exactly that.
                </p>

                <p className="text-slate-600 mb-6">
                  I built it because almost everything I create for founders has
                  the same heartbeat — making life easier for the people who are
                  doing everything alone.
                </p>

                <p className="text-slate-600 mb-6">
                  That's exactly why I'm building{" "}
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

                <h2 className="text-2xl md:text-3xl font-bold text-black mt-12 mb-6">
                  What Is ContactJournalists.com?
                </h2>

                <p className="text-slate-600 mb-4">
                  <a
                    href="https://contactjournalists.com"
                    className={blogTheme.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ContactJournalists.com
                  </a>{" "}
                  is a simple, founder-friendly platform that helps you get press
                  without PR retainers, expensive databases, hours of Googling, or
                  feeling like you're shouting into the void.
                </p>

                <h2 className="text-2xl md:text-3xl font-bold text-black mt-12 mb-6">
                  Quick Refresh: What Is a P&L?
                </h2>

                <p className="text-slate-600 mb-4">
                  A Profit & Loss Statement shows:
                </p>

                <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
                  <li>what your business earned</li>
                  <li>what it spent</li>
                  <li>whether you made a profit</li>
                  <li>how that changed month by month</li>
                </ul>

                <p className="text-slate-600 mb-6">
                  It's the simplest snapshot of your business health.
                </p>

                <div className="rounded-2xl overflow-hidden my-8 border-2 border-black">
                  <img
                    src={revenueReportImage}
                    alt="Small business revenue report and financial planning tools showing how ContactJournalists.com helps startups track profit and loss for sustainable solopreneur growth"
                    className="w-full h-auto object-cover"
                  />
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-black mt-12 mb-6">
                  Who This Template Is Perfect For
                </h2>

                <p className="text-slate-600 mb-4">
                  This P&L template is ideal if you are:
                </p>

                <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
                  <li>a first-time founder</li>
                  <li>a solopreneur juggling ten roles</li>
                  <li>a SaaS founder watching burn rate</li>
                  <li>an ecommerce store owner with seasonal spikes</li>
                  <li>a coach or creator with variable income</li>
                  <li>a bootstrapped startup building slowly and steadily</li>
                </ul>

                <div className="mt-12">
                  <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
                    Get Your Free P&L Template Now
                  </h2>
                  <p className="text-slate-600 mb-6">
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

                <h2 className="text-2xl md:text-3xl font-bold text-black mt-12 mb-6">
                  Final Thoughts From One Founder to Another
                </h2>

                <p className="text-slate-600 mb-6">
                  If you're bootstrapping, multitasking and trying to build
                  something meaningful, I see you.
                </p>

                <p className="text-slate-600 mb-6">
                  This template won't solve everything, but it will give you
                  clarity. And clarity changes the way you move.
                </p>

                <p className="text-slate-600 mb-6">
                  If you want help getting into the press, you can{" "}
                  <a
                    href="/signup"
                    className={blogTheme.link}
                  >
                    Start Free anytime at ContactJournalists.com
                  </a>
                  .
                </p>
              </div>
            </article>

            <footer className="text-center py-12">
              <p className={blogTheme.footerText}>
                © 2025 ContactJournalists.com. Built in London with ☕️
              </p>
            </footer>
          </div>
        </main>
    </BlogLayout>
  );
};

export default PLTemplateBlogPost;
