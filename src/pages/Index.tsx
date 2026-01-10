import { useEffect, useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  Zap,
  ListChecks,
  Shield,
  MapPin,
} from "lucide-react";

const ROTATING_WORDS = ["Journalists", "YouTubers", "Tiktokers", "Influencers"];

const Index = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showPitchGen, setShowPitchGen] = useState(false);

  useEffect(() => {
    // Update document with scroll-smooth class
    document.documentElement.classList.add("scroll-smooth");

    const rotationInterval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
    }, 2500); // Change word every 2.5 seconds

    // Countdown timer
    const targetDate = new Date("2026-01-31T09:00:00").getTime();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    calculateTimeLeft();
    const countdownInterval = setInterval(calculateTimeLeft, 1000);

    return () => {
      document.documentElement.classList.remove("scroll-smooth");
      clearInterval(rotationInterval);
      clearInterval(countdownInterval);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleBilling = () => {
    setIsAnnual(!isAnnual);
  };

  const getPriceDisplay = (monthlyPrice: string, annualPrice: string) => {
    return isAnnual ? annualPrice : monthlyPrice;
  };

  const handleSearch = () => {
    // Dummy search logic
    const dummyResults = [
      { name: "Alice Smith", outlet: "The Guardian", beat: "Tech" },
      { name: "Bob Johnson", outlet: "Wired UK", beat: "Gadgets" },
      { name: "Charlie Brown", outlet: "BBC News", beat: "Business" },
    ];
    setResults(
      dummyResults.filter(
        (result) =>
          result.beat.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.outlet.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="bg-base-900 text-slate-200 antialiased selection:bg-accent-blue/20 selection:text-white">
      {/* Skip link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 bg-base-700 px-3 py-2 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-blue focus-visible:outline-offset-2"
      >
        Skip to content
      </a>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-base-900/70 border-b border-white/5">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <a
            href="#"
            className="flex items-center gap-2 font-extrabold text-lg tracking-tight"
            data-testid="link-logo"
          >
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-gradient-to-br from-accent-blue to-accent-violet"></span>
            Contact<span className="text-slate-400">Journalists</span>
          </a>
          <button
            id="navToggle"
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded hover:bg-white/5"
            aria-expanded={mobileMenuOpen}
            aria-controls="primaryNav"
            aria-label="Open menu"
            data-testid="button-menu-toggle"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <ul
            id="primaryNav"
            className="hidden md:flex items-center gap-6 text-sm"
          >
            <li>
              <a
                className="hover:text-white/90 text-slate-300"
                href="#features"
                data-testid="link-features"
              >
                Features
              </a>
            </li>
            <li>
              <a
                className="hover:text-white/90 text-slate-300"
                href="#how"
                data-testid="link-how"
              >
                How it Works
              </a>
            </li>
            <li>
              <a
                className="hover:text-white/90 text-slate-300"
                href="#pricing"
                data-testid="link-pricing"
              >
                Pricing
              </a>
            </li>
            <li>
              <a
                className="hover:text-white/90 text-slate-300"
                href="#blog"
                data-testid="link-blog"
              >
                Blog
              </a>
            </li>
            <li>
              <a
                className="hover:text-white/90 text-slate-300"
                href="#faq"
                data-testid="link-faq"
              >
                FAQ
              </a>
            </li>
            <li>
              <a
                className="hover:text-white/90 text-slate-300"
                href="/affiliates"
                data-testid="link-affiliates"
              >
                Affiliates
              </a>
            </li>
            <li>
              <a
                className="hover:text-white/90 text-slate-300"
                href="/auth"
                data-testid="link-login"
              >
                Login
              </a>
            </li>
            <li>
              <a
                className="ml-2 inline-flex items-center rounded-xl bg-gradient-to-r from-accent-blue to-accent-violet px-4 py-2 font-semibold text-white shadow-glow hover:opacity-95"
                href="/waitlist-signup"
                data-testid="button-get-started"
              >
                Get Started
              </a>
            </li>
          </ul>
        </nav>
        {/* mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-base-900 border-b border-white/5 shadow-xl">
            <div className="space-y-1 px-2 pb-3 pt-2">
              <a
                href="#features"
                onClick={closeMobileMenu}
                className="block rounded-lg px-3 py-2 text-base font-medium text-slate-300 hover:bg-base-800 hover:text-white"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={closeMobileMenu}
                className="block rounded-lg px-3 py-2 text-base font-medium text-slate-300 hover:bg-base-800 hover:text-white"
              >
                How it Works
              </a>
              <a
                href="#pricing"
                onClick={closeMobileMenu}
                className="block rounded-lg px-3 py-2 text-base font-medium text-slate-300 hover:bg-base-800 hover:text-white"
              >
                Pricing
              </a>
              <a
                href="#blog"
                onClick={closeMobileMenu}
                className="block rounded-lg px-3 py-2 text-base font-medium text-slate-300 hover:bg-base-800 hover:text-white"
              >
                Blog
              </a>
              <a
                href="#faq"
                onClick={closeMobileMenu}
                className="block rounded-lg px-3 py-2 text-base font-medium text-slate-300 hover:bg-base-800 hover:text-white"
              >
                FAQ
              </a>
              <a
                href="/affiliates"
                onClick={closeMobileMenu}
                className="block rounded-lg px-3 py-2 text-base font-medium text-slate-300 hover:bg-base-800 hover:text-white"
              >
                Affiliates
              </a>
              <a
                href="/auth"
                onClick={closeMobileMenu}
                className="block rounded-lg px-3 py-2 text-base font-medium text-slate-300 hover:bg-base-800 hover:text-white"
              >
                Login
              </a>
              <a
                href="/waitlist-signup"
                onClick={closeMobileMenu}
                className="mt-2 block rounded-xl bg-gradient-to-r from-accent-blue to-accent-violet px-4 py-2.5 text-center font-semibold text-white shadow-glow hover:opacity-95 transition-opacity"
              >
                Get Started
              </a>
            </div>
          </div>
        )}
      </header>

      <main id="main" className="relative">
        {/* background glow */}
        <div className="pointer-events-none absolute inset-0 bg-darkgradient"></div>

        {/* Hero */}
        <section className="relative overflow-hidden pb-12 pt-20 md:pb-24 md:pt-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
            <h1 className="mb-6 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-6xl lg:text-7xl">
              Find{" "}
              <span className="inline-block relative min-w-[150px] sm:min-w-[200px]">
                <span
                  key={currentWordIndex}
                  className="rotating-text bg-gradient-to-r from-accent-blue to-accent-violet bg-clip-text text-transparent"
                >
                  {ROTATING_WORDS[currentWordIndex]}
                </span>
              </span>
              . <span className="block sm:inline">Pitch better.</span>{" "}
              <span className="block sm:inline">Get press.</span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-sm text-slate-300 sm:text-base md:text-lg px-4">
              AI-powered media outreach for brands and SaaS worldwide — verified
              contacts, smart pitch templates, and fast lists in minutes.
              Database growing daily.
            </p>
            <div className="mb-6 flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-emerald-400/20 px-4 py-2 backdrop-blur-sm border border-emerald-400/30">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-sm sm:text-base font-semibold text-emerald-400">
                  Beta Testers Wanted 🚀
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 px-4">
              <a
                href="/waitlist-signup"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-accent-blue to-accent-violet px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white shadow-glow hover:opacity-95 transition-opacity w-full sm:w-auto"
                data-testid="hero-get-started"
              >
                Get Started
              </a>
              <button
                onClick={() => setShowPitchGen(!showPitchGen)}
                className="inline-flex items-center justify-center rounded-xl border-2 border-white/20 bg-white/5 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white hover:bg-white/10 transition-colors backdrop-blur-sm w-full sm:w-auto"
                data-testid="hero-try-pitch"
              >
                Try the Pitch Generator
              </button>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs text-slate-400">
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>{" "}
                Worldwide Coverage
              </span>
              <span>GDPR-conscious</span>
              <span>Growing Daily</span>
            </div>

            {/* Countdown Timer */}
            <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-base-800/50 p-4 sm:p-6 backdrop-blur-sm">
              <div className="mb-2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-400">
                Launch Countdown
              </div>
              <div className="flex justify-around gap-2 sm:gap-4">
                <div className="text-center">
                  <div className="text-2xl sm:text-4xl font-bold text-white">
                    {timeLeft.days}
                  </div>
                  <div className="mt-1 text-xs text-slate-400">Days</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-4xl font-bold text-white">
                    {String(timeLeft.hours).padStart(2, "0")}
                  </div>
                  <div className="mt-1 text-xs text-slate-400">Hours</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-4xl font-bold text-white">
                    {String(timeLeft.minutes).padStart(2, "0")}
                  </div>
                  <div className="mt-1 text-xs text-slate-400">Minutes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-4xl font-bold text-white">
                    {String(timeLeft.seconds).padStart(2, "0")}
                  </div>
                  <div className="mt-1 text-xs text-slate-400">Seconds</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="relative py-16 md:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="mb-3 text-2xl font-bold text-white sm:text-3xl md:text-4xl px-4">
                How it works
              </h2>
              <p className="mx-auto mb-10 md:mb-12 max-w-2xl text-sm sm:text-base text-slate-400 px-4">
                Three simple steps to coverage.
              </p>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-base-700/50 p-6 shadow-glow">
                <div className="text-sm text-slate-400">Step 1</div>
                <h3 className="mt-1 font-semibold">Search</h3>
                <p className="mt-2 text-slate-300">
                  Find the right journalists & bloggers by beat, location, and
                  outlet.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-base-700/50 p-6 shadow-glow">
                <div className="text-sm text-slate-400">Step 2</div>
                <h3 className="mt-1 font-semibold">Refine</h3>
                <p className="mt-2 text-slate-300">
                  Auto-clean lists, remove duplicates, and preview emails before
                  you export.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-base-700/50 p-6 shadow-glow">
                <div className="text-sm text-slate-400">Step 3</div>
                <h3 className="mt-1 font-semibold">Pitch</h3>
                <p className="mt-2 text-slate-300">
                  Generate on-point angles and subject lines that actually get
                  opened.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="relative py-16 md:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <h2 className="mb-3 text-center text-2xl font-bold text-white sm:text-3xl md:text-4xl px-4">
              Why Contact Journalists?
            </h2>
            <p className="mx-auto mb-10 md:mb-12 max-w-2xl text-center text-sm sm:text-base text-slate-400 px-4">
              Everything you need to get your brand in front of the right
              journalists
            </p>
            <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-base-800/50 p-6 md:p-8 backdrop-blur-sm transition-all hover:border-accent-blue/50 hover:shadow-glow-blue">
                <div className="mb-3 md:mb-4 inline-flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-gradient-to-r from-accent-blue to-accent-violet">
                  <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
                <h3 className="mb-2 md:mb-3 text-lg md:text-xl font-semibold text-white">
                  AI-Powered Search
                </h3>
                <p className="text-sm md:text-base text-slate-400">
                  Find the perfect journalists for your story with intelligent
                  AI matching
                </p>
              </div>

              <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-base-800/50 p-6 md:p-8 backdrop-blur-sm transition-all hover:border-accent-violet/50 hover:shadow-glow-violet">
                <div className="mb-3 md:mb-4 inline-flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-gradient-to-r from-accent-violet to-accent-mint">
                  <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
                <h3 className="mb-2 md:mb-3 text-lg md:text-xl font-semibold text-white">
                  Verified Contacts
                </h3>
                <p className="text-sm md:text-base text-slate-400">
                  Access up-to-date, verified email addresses and contact
                  information
                </p>
              </div>

              <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-base-800/50 p-6 md:p-8 backdrop-blur-sm transition-all hover:border-accent-mint/50 hover:shadow-glow-mint">
                <div className="mb-3 md:mb-4 inline-flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-gradient-to-r from-accent-mint to-accent-blue">
                  <Zap className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
                <h3 className="mb-2 md:mb-3 text-lg md:text-xl font-semibold text-white">
                  Smart Pitch Templates
                </h3>
                <p className="text-sm md:text-base text-slate-400">
                  AI-generated pitch templates tailored to each journalist's
                  interests
                </p>
              </div>

              <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-base-800/50 p-6 md:p-8 backdrop-blur-sm transition-all hover:border-accent-blue/50 hover:shadow-glow-blue">
                <div className="mb-3 md:mb-4 inline-flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-gradient-to-r from-accent-blue to-accent-violet">
                  <ListChecks className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
                <h3 className="mb-2 md:mb-3 text-lg md:text-xl font-semibold text-white">
                  Fast Lists
                </h3>
                <p className="text-sm md:text-base text-slate-400">
                  Generate comprehensive media lists in minutes, not hours
                </p>
              </div>

              <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-base-800/50 p-6 md:p-8 backdrop-blur-sm transition-all hover:border-accent-violet/50 hover:shadow-glow-violet">
                <div className="mb-3 md:mb-4 inline-flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-gradient-to-r from-accent-violet to-accent-mint">
                  <Shield className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
                <h3 className="mb-2 md:mb-3 text-lg md:text-xl font-semibold text-white">
                  GDPR Compliant
                </h3>
                <p className="text-sm md:text-base text-slate-400">
                  Built in London with privacy and compliance at the core
                </p>
              </div>

              <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-base-800/50 p-6 md:p-8 backdrop-blur-sm transition-all hover:border-accent-mint/50 hover:shadow-glow-mint">
                <div className="mb-3 md:mb-4 inline-flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-gradient-to-r from-accent-mint to-accent-blue">
                  <MapPin className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
                <h3 className="mb-2 md:mb-3 text-lg md:text-xl font-semibold text-white">
                  Worldwide Coverage
                </h3>
                <p className="text-sm md:text-base text-slate-400">
                  Global database of journalists and media outlets, growing
                  daily
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Media Finder */}
        <section id="media-finder" className="relative py-16 md:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-10 md:mb-12 text-center">
              <div className="mb-3 md:mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-blue/20 to-accent-violet/20 px-3 md:px-4 py-1.5 md:py-2 backdrop-blur-sm">
                <div className="flex gap-1">
                  <div className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-accent-blue animate-pulse"></div>
                  <div className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-accent-violet animate-pulse [animation-delay:0.2s]"></div>
                  <div className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-accent-mint animate-pulse [animation-delay:0.4s]"></div>
                </div>
                <span className="text-xs md:text-sm font-semibold text-white">
                  Media Finder
                </span>
              </div>
              <h2 className="mb-3 md:mb-4 text-2xl font-bold text-white sm:text-3xl md:text-4xl px-4">
                Find Your Perfect Journalist
              </h2>
              <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-400 px-4">
                Search our database of verified UK journalists and get instant
                results
              </p>
            </div>
            <div className="mx-auto max-w-4xl">
              <div className="relative mb-6 md:mb-8 overflow-hidden rounded-2xl border border-white/10 bg-base-800/50 p-4 md:p-8 backdrop-blur-sm">
                <div className="relative">
                  <svg
                    className="absolute left-3 md:left-4 top-1/2 h-4 w-4 md:h-5 md:w-5 -translate-y-1/2 text-slate-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="M21 21l-4.3-4.3" />
                  </svg>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tech retail journalists in the UK"
                    className="w-full rounded-xl border border-white/10 bg-base-900/50 py-3 md:py-4 pl-10 md:pl-12 pr-3 md:pr-32 text-sm md:text-base text-white placeholder-slate-500 focus:border-accent-blue focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
                    data-testid="media-finder-search"
                  />
                  <button
                    onClick={handleSearch}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-gradient-to-r from-accent-blue to-accent-violet px-4 md:px-6 py-1.5 md:py-2 text-sm md:text-base font-semibold text-white hover:opacity-90 transition-opacity"
                    data-testid="media-finder-search-button"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
            {results.length > 0 && (
              <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-white/10 bg-base-800/50 p-4 backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        alt="avatar"
                        className="h-8 w-8 rounded-full"
                        src={`https://i.pravatar.cc/32?img=${index + 1}`}
                      />
                      <div>
                        <h3 className="font-semibold text-white">
                          {result.name}
                        </h3>
                        <p className="text-xs text-slate-400">
                          {result.outlet}
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-slate-300">
                      Beat: {result.beat}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="relative py-16 md:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <h2 className="mb-3 md:mb-4 text-center text-2xl font-bold text-white sm:text-3xl md:text-4xl px-4">
              Simple, Transparent Pricing
            </h2>
            <p className="mx-auto mb-10 md:mb-12 max-w-2xl text-center text-sm sm:text-base text-slate-400 px-4">
              Choose the plan that fits your needs
            </p>

            <div className="mt-6 flex items-center justify-center gap-3 text-sm">
              <span className="text-slate-400">Monthly</span>
              <button
                id="toggleBilling"
                onClick={toggleBilling}
                className="relative inline-flex h-7 w-12 items-center rounded-full bg-white/10"
                data-testid="button-billing-toggle"
              >
                <span
                  id="toggleDot"
                  className={`inline-block h-5 w-5 rounded-full bg-white transition-transform ${
                    isAnnual ? "translate-x-6" : "translate-x-1"
                  }`}
                ></span>
              </button>
              <span className="text-slate-400">
                Annually{" "}
                <span className="ml-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-400 text-xs">
                  Save 2 months
                </span>
              </span>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-base-700/50 p-6 shadow-glow">
                <h3 className="font-semibold">Starter</h3>
                <p className="mt-1 text-slate-400">
                  For freelancers and solo founders.
                </p>
                <div className="mt-4 text-3xl font-extrabold">
                  <span className="price" data-testid="text-price-starter">
                    {getPriceDisplay("£45", "£450")}
                  </span>
                  <span className="text-base font-medium text-slate-400">
                    {isAnnual ? "/yr" : "/mo"}
                  </span>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-slate-300">
                  <li>300 searches/mo</li>
                  <li>1 user</li>
                  <li>Pitch Generator (daily sample)</li>
                </ul>
                <a
                  href="#"
                  className="mt-6 inline-flex w-full justify-center rounded-xl bg-gradient-to-r from-accent-blue to-accent-violet px-4 py-2 font-semibold"
                  data-testid="button-starter"
                >
                  Start Free
                </a>
              </div>
              <div className="relative rounded-2xl border border-accent-blue/40 bg-base-700/60 p-6 shadow-glow ring-2 ring-accent-blue/60">
                <span className="absolute -top-3 right-4 rounded-full bg-accent-blue/20 px-2 py-1 text-xs text-accent-blue">
                  Most popular
                </span>
                <h3 className="font-semibold">Growth</h3>
                <p className="mt-1 text-slate-400">
                  For startups and growing agencies.
                </p>
                <div className="mt-4 text-3xl font-extrabold">
                  <span className="price" data-testid="text-price-growth">
                    {getPriceDisplay("£99", "£990")}
                  </span>
                  <span className="text-base font-medium text-slate-400">
                    {isAnnual ? "/yr" : "/mo"}
                  </span>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-slate-300">
                  <li>1,500 searches/mo</li>
                  <li>Up to 3 users</li>
                  <li>Full Pitch Generator, saved lists</li>
                  <li>Affiliate dashboard access</li>
                </ul>
                <a
                  href="#"
                  className="mt-6 inline-flex w-full justify-center rounded-xl bg-gradient-to-r from-accent-blue to-accent-violet px-4 py-2 font-semibold text-white"
                  data-testid="button-growth"
                >
                  Start Free
                </a>
              </div>
              <div className="rounded-2xl border border-white/10 bg-base-700/50 p-6 shadow-glow">
                <h3 className="font-semibold">Team</h3>
                <p className="mt-1 text-slate-400">
                  For established agencies and marketing departments.
                </p>
                <div className="mt-4 text-3xl font-extrabold">
                  <span className="price" data-testid="text-price-team">
                    {getPriceDisplay("£199", "£1990")}
                  </span>
                  <span className="text-base font-medium text-slate-400">
                    {isAnnual ? "/yr" : "/mo"}
                  </span>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-slate-300">
                  <li>Unlimited searches</li>
                  <li>Up to 10 users</li>
                  <li>Priority support, early feature access</li>
                  <li>Custom integrations</li>
                </ul>
                <a
                  href="#"
                  className="mt-6 inline-flex w-full justify-center rounded-xl bg-gradient-to-r from-accent-blue to-accent-violet px-4 py-2 font-semibold"
                  data-testid="button-team"
                >
                  Start Free
                </a>
              </div>
            </div>
            <p className="mt-6 text-center text-sm text-slate-400">
              <span className="inline-flex items-center gap-2 text-emerald-400 font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                Beta Testers Wanted 🚀
              </span>
              <span className="block mt-2">
                Founders' Launch Offer — lock your plan at today's price for
                life. Need more?{" "}
                <a
                  className="underline decoration-dotted underline-offset-4 hover:text-white"
                  href="#contact"
                  data-testid="link-contact"
                >
                  Contact us
                </a>{" "}
                for custom solutions.
              </span>
            </p>
          </div>
        </section>

        {/* Blog */}
        <section id="blog" className="relative py-16 md:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-10 md:mb-12">
              <h2 className="mb-3 text-2xl font-bold text-white sm:text-3xl md:text-4xl px-4">
                Blog
              </h2>
              <p className="text-sm sm:text-base text-slate-400 px-4">
                Insights and guides for better PR outreach
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Featured Blog Post – Latest Guide */}
              <article className="md:col-span-2 lg:col-span-3 rounded-2xl border border-accent-mint/30 bg-base-800/50 p-6 md:p-8 backdrop-blur-sm hover:border-accent-mint/50 transition-all relative">
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-accent-blue to-accent-mint px-3 py-1.5 rounded-full text-xs font-bold text-white uppercase tracking-wide shadow-lg">
                  🆕 Latest
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-semibold text-accent-mint uppercase tracking-wide">
                    Featured Guide
                  </span>
                  <span className="text-xs text-slate-500">•</span>
                  <span className="text-xs text-slate-400">January 2026</span>
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
                  How to Find the Right Reporter for Your Story
                </h3>

                <div className="prose prose-invert max-w-none">
                  <p className="text-slate-300 mb-4">
                    Most founders struggle to get press because they pitch the wrong journalists. 
                    This guide breaks down how to find journalists who actually want your story, 
                    how to respond to journalist requests quickly, and how to get press without a PR agency.
                  </p>

                  <p className="text-slate-300 mb-4">
                    From my seven years building and selling a startup, I learned PR the hard way. 
                    Now I&apos;m sharing exactly how to find the right reporters—without wasting months 
                    on Google and Twitter.
                  </p>

                  <a
                    href="/blog/how-to-find-the-right-reporter-for-your-story"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href =
                        "/blog/how-to-find-the-right-reporter-for-your-story";
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-violet px-6 py-3 font-semibold text-white shadow-glow hover:opacity-95 transition-opacity"
                  >
                    Read Full Guide
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </a>
                </div>
              </article>

              {/* How To Pitch Journalists on Twitter Blog Post - Latest */}
              <article className="rounded-2xl border border-white/10 bg-base-800/50 p-6 backdrop-blur-sm hover:border-accent-blue/50 transition-all">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-semibold text-accent-violet uppercase tracking-wide">
                    Twitter PR Guide
                  </span>
                  <span className="text-xs text-slate-500">•</span>
                  <span className="text-xs text-slate-400">Founder Guide</span>
                </div>

                <h3 className="text-lg md:text-xl font-bold text-white mb-3">
                  How To Pitch Journalists on Twitter (Full Breakdown)
                </h3>

                <p className="text-sm text-slate-300 mb-4">
                  Learn how to pitch journalists on Twitter. Real strategies from a founder who got press coverage through Twitter. Full breakdown of what works and what doesn't.
                </p>

                <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
                  <time>December 27, 2025</time>
                  <span>•</span>
                  <span>15 min read</span>
                </div>

                <a
                  href="/blog/how-to-pitch-journalists-on-twitter"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href =
                      "/blog/how-to-pitch-journalists-on-twitter";
                  }}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-accent-blue hover:text-accent-mint transition-colors"
                >
                  Read Full Guide
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              </article>

              {/* Featured Blog Post – Ultimate Guide */}
              <article className="rounded-2xl border border-white/10 bg-base-800/50 p-6 md:p-8 backdrop-blur-sm hover:border-accent-blue/50 transition-all">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-semibold text-accent-blue uppercase tracking-wide">
                    Featured Guide
                  </span>
                  <span className="text-xs text-slate-500">•</span>
                  <span className="text-xs text-slate-400">Ultimate Guide</span>
                </div>

                <h3 className="text-lg md:text-xl font-bold text-white mb-3">
                  The Ultimate Guide to the Best Platforms for Contacting
                  Journalists in 2026
                </h3>

                <p className="text-sm text-slate-300 mb-4">
                  Deep dive into PR tools, media databases, and outreach
                  platforms so you can choose the right way to reach journalists
                  (without wasting budget or energy).
                </p>

                <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
                  <time>December 1, 2025</time>
                  <span>•</span>
                  <span>15 min read</span>
                </div>

                <a
                  href="/blog/ultimate-guide-best-platforms-contacting-journalists-2026"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href =
                      "/blog/ultimate-guide-best-platforms-contacting-journalists-2026";
                  }}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-accent-blue hover:text-accent-mint transition-colors"
                >
                  Read Ultimate Guide
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              </article>

              {/* P&L Template Blog Post */}
              <article className="rounded-2xl border border-white/10 bg-base-800/50 p-6 backdrop-blur-sm hover:border-accent-blue/50 transition-all">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-semibold text-accent-mint uppercase tracking-wide">
                    Free Resource
                  </span>
                  <span className="text-xs text-slate-500">•</span>
                  <span className="text-xs text-slate-400">Founder Tools</span>
                </div>

                <h3 className="text-lg md:text-xl font-bold text-white mb-3">
                  Free Small Business P&L Template (Google Sheets + Excel)
                </h3>

                <p className="text-sm text-slate-300 mb-4">
                  Track your revenue, expenses, and profit with ease. Simple,
                  clean, currency-agnostic P&L template made for founders who
                  don't have time to wrestle with spreadsheets.
                </p>

                <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
                  <time>November 15, 2025</time>
                  <span>•</span>
                  <span>8 min read</span>
                </div>

                <a
                  href="/blog/free-small-business-pl-template-google-sheets-excel"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href =
                      "/blog/free-small-business-pl-template-google-sheets-excel";
                  }}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-accent-blue hover:text-accent-mint transition-colors"
                  data-testid="link-blog-pl-template"
                >
                  Download Free Template
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              </article>

              {/* Press Pitch Examples Blog Post */}
              <article className="rounded-2xl border border-white/10 bg-base-800/50 p-6 backdrop-blur-sm hover:border-accent-blue/50 transition-all">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-semibold text-accent-violet uppercase tracking-wide">
                    Pitch Templates
                  </span>
                  <span className="text-xs text-slate-500">•</span>
                  <span className="text-xs text-slate-400">Founder Guide</span>
                </div>

                <h3 className="text-lg md:text-xl font-bold text-white mb-3">
                  7 Press Pitch Examples That Actually Get Replies
                </h3>

                <p className="text-sm text-slate-300 mb-4">
                  Real press pitch templates that work in 2025. Copy, customize,
                  and start getting journalist replies with these
                  founder-friendly pitch examples and timing strategies.
                </p>

                <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
                  <time>Sunday, November 16, 2025</time>
                  <span>•</span>
                  <span>12 min read</span>
                </div>

                <a
                  href="/blog/press-pitch-examples-that-get-replies"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href =
                      "/blog/press-pitch-examples-that-get-replies";
                  }}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-accent-blue hover:text-accent-mint transition-colors"
                  data-testid="link-blog-press-pitch"
                >
                  Get Pitch Templates
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              </article>

              {/* The Fastest Ways to Get Press Coverage Without an Agency */}
              <article className="rounded-2xl border border-white/10 bg-base-800/50 p-6 backdrop-blur-sm hover:border-accent-blue/50 transition-all">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-semibold text-accent-blue uppercase tracking-wide">
                    PR Playbook
                  </span>
                  <span className="text-xs text-slate-500">•</span>
                  <span className="text-xs text-slate-400">2026 Edition</span>
                </div>

                <h3 className="text-lg md:text-xl font-bold text-white mb-3">
                  The Fastest Ways to Get Press Coverage Without an Agency
                </h3>

                <p className="text-sm text-slate-300 mb-4">
                  A founder-led playbook on landing press fast—without retainers, 
                  guesswork, or noisy outreach. Learn how to respond to live journalist 
                  requests and turn momentum into coverage.
                </p>

                <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
                  <time>December 2025</time>
                  <span>•</span>
                  <span>18 min read</span>
                </div>

                <a
                  href="/blog/the-fastest-ways-to-get-press-coverage-without-an-agency"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href =
                      "/blog/the-fastest-ways-to-get-press-coverage-without-an-agency";
                  }}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-accent-blue hover:text-accent-mint transition-colors"
                >
                  Read Full Guide
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              </article>

              {/* How to Get Press for Your Brand Without a PR Agency */}
              <article className="rounded-2xl border border-white/10 bg-base-800/50 p-6 backdrop-blur-sm hover:border-accent-blue/50 transition-all">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-semibold text-accent-mint uppercase tracking-wide">
                    Founder Guide
                  </span>
                  <span className="text-xs text-slate-500">•</span>
                  <span className="text-xs text-slate-400">PR Strategy</span>
                </div>

                <h3 className="text-lg md:text-xl font-bold text-white mb-3">
                  How to Get Press for Your Brand Without a PR Agency
                </h3>

                <p className="text-sm text-slate-300 mb-4">
                  The complete guide to DIY PR for founders. Learn how to build media 
                  relationships, craft compelling pitches, and get featured in top 
                  publications without hiring expensive agencies.
                </p>

                <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
                  <time>November 2025</time>
                  <span>•</span>
                  <span>15 min read</span>
                </div>

                <a
                  href="/blog/how-to-get-press-for-your-brand-without-a-pr-agency"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href =
                      "/blog/how-to-get-press-for-your-brand-without-a-pr-agency";
                  }}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-accent-blue hover:text-accent-mint transition-colors"
                >
                  Read Full Guide
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              </article>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="relative py-16 md:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-3 text-2xl font-bold text-white sm:text-3xl md:text-4xl text-center px-4">
                FAQ
              </h2>
              <div className="mt-8 divide-y divide-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <details className="group open:bg-white/5">
                  <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-left font-medium hover:bg-white/5">
                    Where do the contacts come from?
                    <span className="ml-4 text-slate-400 group-open:rotate-180 transition">
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-5 pb-5 text-slate-300">
                    We combine verified sources, public data, and user feedback
                    loops to keep lists accurate and useful.
                  </div>
                </details>
                <details className="group">
                  <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-left font-medium hover:bg-white/5">
                    Is this compliant with GDPR?
                    <span className="ml-4 text-slate-400 group-open:rotate-180 transition">
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-5 pb-5 text-slate-300">
                    Yes. We respect inboxes and provide opt-out friendly
                    exports. Always send relevant, non-spammy pitches.
                  </div>
                </details>
                <details className="group">
                  <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-left font-medium hover:bg-white/5">
                    Do you cover bloggers as well as journalists?
                    <span className="ml-4 text-slate-400 group-open:rotate-180 transition">
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-5 pb-5 text-slate-300">
                    Absolutely. We include bloggers, podcasters, and influencers
                    with an editorial focus.
                  </div>
                </details>
                <details className="group">
                  <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-left font-medium hover:bg-white/5">
                    Can I cancel anytime?
                    <span className="ml-4 text-slate-400 group-open:rotate-180 transition">
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-5 pb-5 text-slate-300">
                    Yes. No contracts or commitments. Just cancel from your
                    account settings whenever you're done.
                  </div>
                </details>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative border-t border-white/5 bg-base-800/60">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <a
                  href="#"
                  className="flex items-center gap-2 font-extrabold text-lg tracking-tight"
                >
                  <span className="inline-block h-2.5 w-2.5 rounded-sm bg-gradient-to-br from-accent-blue to-accent-violet"></span>
                  Contact<span className="text-slate-400">Journalists</span>
                </a>
                <p className="mt-3 text-sm text-slate-400">
                  AI-powered media outreach for brands worldwide.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-sm">Product</h4>
                <ul className="mt-3 space-y-2 text-sm text-slate-400">
                  <li>
                    <a
                      className="hover:text-white"
                      href="#features"
                      data-testid="link-footer-features"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      className="hover:text-white"
                      href="#pricing"
                      data-testid="link-footer-pricing"
                    >
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a
                      className="hover:text-white"
                      href="#blog"
                      data-testid="link-footer-blog"
                    >
                      Blog
                    </a>
                  </li>
                  <li>
                    <a
                      className="hover:text-white"
                      href="/affiliates"
                      data-testid="link-footer-affiliates"
                    >
                      Affiliates
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-sm">Company</h4>
                <ul className="mt-3 space-y-2 text-sm text-slate-400">
                  <li>
                    <a
                      className="hover:text-white"
                      href="#about"
                      data-testid="link-footer-about"
                    >
                      About
                    </a>
                  </li>
                  <li>
                    <a
                      className="hover:text-white"
                      href="#contact"
                      data-testid="link-footer-contact"
                    >
                      Contact
                    </a>
                  </li>
                  <li>
                    <a
                      className="hover:text-white"
                      href="#privacy"
                      data-testid="link-footer-privacy"
                    >
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a
                      className="hover:text-white"
                      href="#terms"
                      data-testid="link-footer-terms"
                    >
                      Terms
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 border-t border-white/5 pt-8 text-center text-sm text-slate-400">
              <p className="mb-2">
                Questions? Ping us a message at{" "}
                <a
                  href="mailto:hello@contactjournalists.com"
                  className="text-accent-blue hover:underline"
                >
                  hello@contactjournalists.com
                </a>
              </p>
              <p>© 2025 ContactJournalists.com. Built in London with ☕️</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
