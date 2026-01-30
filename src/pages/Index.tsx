import { useState, useEffect } from "react";

const Index = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFeatureTab, setActiveFeatureTab] = useState<
    "journalist-finder" | "media-requests" | "ai-pitch" | "easy-lists"
  >("journalist-finder");

  // Load Google Fonts for homepage only
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Caprasimo&family=DM+Sans:wght@400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Button style classes for Webflow tactile shadow button appearance
  const primaryButtonClass =
    "inline-flex items-center justify-center rounded-full bg-[#D8B4FE] px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-black border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F5DC] transition-all duration-150";
  const secondaryButtonClass =
    "inline-flex items-center justify-center rounded-full bg-[#F5F5DC] px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-black border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F5DC] transition-all duration-150";
  const outlineButtonClass =
    "inline-flex items-center justify-center rounded-full bg-[#F5F5DC] px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-black border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F5DC] transition-all duration-150";

  // Heading style for Caprasimo font
  const headingStyle = { fontFamily: "'Caprasimo', cursive" };
  // Body style for DM Sans font
  const bodyStyle = { fontFamily: "'DM Sans', sans-serif" };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const featureTabContent = {
    "journalist-finder": {
      image: "/assets/we-connect-you-with-top-journalists.png",
      title: "Find your media match",
      description: "Search by topic or outlet. No spreadsheets, no stress.",
      cta: "Start searching for free",
      ctaLink: "/auth",
    },
    "media-requests": {
      image: "/assets/new-media-requests-on-desk.png",
      title: "See what journalists are asking for right now",
      description:
        "New media requests appear in real time, so you can respond while the opportunity is still hot.",
      cta: "Try AI",
      ctaLink: "/auth",
    },
    "ai-pitch": {
      image: "/assets/ai-pitch-suggestions.png",
      title: "Pitch smarter, not harder",
      description:
        "Use AI to draft clear, relevant pitches in seconds — then tweak them to sound like you.",
      cta: "Start your free trial",
      ctaLink: "/auth",
    },
    "easy-lists": {
      image: "/assets/live-requests-on-macbook.png",
      title: "Keep everything in one place",
      description:
        "Save journalists, requests, and pitches into simple lists, so nothing slips through the cracks.",
      cta: "Start organising for free",
      ctaLink: "/auth",
    },
  };

  return (
    <div
      className="bg-[#F5F5DC] text-slate-800 antialiased selection:bg-purple-200 selection:text-purple-900 min-h-screen"
      style={bodyStyle}
    >
      {/* Skip link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 bg-white px-3 py-2 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-purple-500 focus-visible:outline-offset-2"
      >
        Skip to content
      </a>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-[#F5F5DC]/90 border-b border-black/5">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <a
            href="#"
            className="flex items-center gap-2 font-extrabold text-lg tracking-tight text-black"
            data-testid="link-logo"
          >
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-gradient-to-br from-purple-500 to-violet-600"></span>
            Contact<span className="text-slate-500">Journalists</span>
          </a>
          <button
            id="navToggle"
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded hover:bg-black/5"
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
                className="hover:text-black text-slate-600"
                href="#features"
                data-testid="link-features"
              >
                Features
              </a>
            </li>
            <li>
              <a
                className="hover:text-black text-slate-600"
                href="#how"
                data-testid="link-how"
              >
                How it Works
              </a>
            </li>
            <li>
              <a
                className="hover:text-black text-slate-600"
                href="#pricing"
                data-testid="link-pricing"
              >
                Pricing
              </a>
            </li>
            <li>
              <a
                className="hover:text-black text-slate-600"
                href="#blog"
                data-testid="link-blog"
              >
                Blog
              </a>
            </li>
            <li>
              <a
                className="hover:text-black text-slate-600"
                href="#faq"
                data-testid="link-faq"
              >
                FAQ
              </a>
            </li>
            <li>
              <a
                className="hover:text-black text-slate-600"
                href="/affiliates"
                data-testid="link-affiliates"
              >
                Affiliates
              </a>
            </li>
            <li>
              <a
                className="hover:text-black text-slate-600"
                href="/auth"
                data-testid="link-login"
              >
                Login
              </a>
            </li>
            <li>
              <a
                className="ml-2 inline-flex items-center rounded-full bg-black px-4 py-2 font-semibold text-white hover:bg-black/90 transition-colors"
                href="/pricing"
                data-testid="button-get-started"
              >
                Get Started
              </a>
            </li>
          </ul>
        </nav>
        {/* mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-[#F5F5DC] border-b border-black/5 shadow-xl">
            <div className="space-y-1 px-2 pb-3 pt-2">
              <a
                href="#features"
                onClick={closeMobileMenu}
                className="block rounded-lg px-3 py-2 text-base font-medium text-slate-600 hover:bg-black/5 hover:text-black"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={closeMobileMenu}
                className="block rounded-lg px-3 py-2 text-base font-medium text-slate-600 hover:bg-black/5 hover:text-black"
              >
                How it Works
              </a>
              <a
                href="#pricing"
                onClick={closeMobileMenu}
                className="block rounded-lg px-3 py-2 text-base font-medium text-slate-600 hover:bg-black/5 hover:text-black"
              >
                Pricing
              </a>
              <a
                href="#blog"
                onClick={closeMobileMenu}
                className="block rounded-lg px-3 py-2 text-base font-medium text-slate-600 hover:bg-black/5 hover:text-black"
              >
                Blog
              </a>
              <a
                href="#faq"
                onClick={closeMobileMenu}
                className="block rounded-lg px-3 py-2 text-base font-medium text-slate-600 hover:bg-black/5 hover:text-black"
              >
                FAQ
              </a>
              <a
                href="/affiliates"
                onClick={closeMobileMenu}
                className="block rounded-lg px-3 py-2 text-base font-medium text-slate-600 hover:bg-black/5 hover:text-black"
              >
                Affiliates
              </a>
              <a
                href="/auth"
                onClick={closeMobileMenu}
                className="block rounded-lg px-3 py-2 text-base font-medium text-slate-600 hover:bg-black/5 hover:text-black"
              >
                Login
              </a>
              <a
                href="/pricing"
                onClick={closeMobileMenu}
                className="mt-2 block rounded-full bg-black px-4 py-2.5 text-center font-semibold text-white hover:bg-black/90 transition-colors"
              >
                Get Started
              </a>
            </div>
          </div>
        )}
      </header>

      <main id="main" className="relative">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left content */}
              <div className="text-center lg:text-left">
                <h1
                  className="text-4xl sm:text-5xl md:text-6xl font-normal leading-tight tracking-tight text-black mb-6"
                  style={headingStyle}
                >
                  Get live requests from journalists
                </h1>
                <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-xl mx-auto lg:mx-0">
                  Discover how our platform makes PR simple and affordable for
                  startups and small teams.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <a
                    href="/pricing"
                    className={primaryButtonClass}
                    data-testid="hero-start-trial"
                  >
                    Start free trial
                  </a>
                  <a
                    href="#pricing"
                    className={secondaryButtonClass}
                    data-testid="hero-see-pricing"
                  >
                    See pricing
                  </a>
                </div>
              </div>

              {/* Right content - Feature cards with image */}
              <div className="relative pb-20 sm:pb-24 lg:pb-0">
                <div className="rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="/assets/live-requests-on-macbook.png"
                    alt="Live requests on a macbook"
                    className="w-full h-auto"
                  />
                </div>
                {/* Feature cards overlay */}
                <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 sm:translate-y-1/3 px-2 sm:px-4">
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <div className="bg-[#F5F5DC] border-2 border-black rounded-xl p-3 sm:p-4 shadow-lg">
                      <span className="text-xl sm:text-2xl mb-1 sm:mb-2 block">⚡</span>
                      <p className="font-semibold text-xs sm:text-sm text-black">
                        Instant journalist requests
                      </p>
                    </div>
                    <div className="bg-[#F5F5DC] border-2 border-black rounded-xl p-3 sm:p-4 shadow-lg">
                      <span className="text-xl sm:text-2xl mb-1 sm:mb-2 block">📁</span>
                      <p className="font-semibold text-xs sm:text-sm text-black">
                        Access our database of journalists & bloggers
                      </p>
                    </div>
                    <div className="bg-[#F5F5DC] border-2 border-black rounded-xl p-3 sm:p-4 shadow-lg">
                      <span className="text-xl sm:text-2xl mb-1 sm:mb-2 block">✍️</span>
                      <p className="font-semibold text-xs sm:text-sm text-black">
                        AI Pitch Assistant
                      </p>
                    </div>
                    <div className="bg-[#F5F5DC] border-2 border-black rounded-xl p-3 sm:p-4 shadow-lg">
                      <span className="text-xl sm:text-2xl mb-1 sm:mb-2 block">📂</span>
                      <p className="font-semibold text-xs sm:text-sm text-black">
                        Saved media lists
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Logo Bar Section */}
        <section className="py-16 sm:py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-center text-xs sm:text-sm font-medium tracking-wider text-slate-500 uppercase mb-8 sm:mb-12 px-4">
              CONTRIBUTORS FROM THESE PUBLICATIONS (AND MORE!) POST REQUESTS
              WITH US:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
              {/* Men's Fitness */}
              <div className="bg-[#F5F5DC] border-2 border-black rounded-xl p-3 sm:p-4 flex items-center justify-center">
                <div
                  className="flex items-center justify-center w-full"
                  style={{ height: "40px" }}
                >
                  <img
                    src="/assets/mens-fitness-transparent.png"
                    alt="Men's Fitness"
                    className="max-h-full max-w-full h-auto w-auto object-contain"
                  />
                </div>
              </div>
              {/* Men's Health */}
              <div className="bg-[#F5F5DC] border-2 border-black rounded-xl p-3 sm:p-4 flex items-center justify-center">
                <div
                  className="flex items-center justify-center w-full"
                  style={{ height: "40px" }}
                >
                  <img
                    src="/assets/Men_s_Health_logo_black.png"
                    alt="Men's Health"
                    className="max-h-full max-w-full h-auto w-auto object-contain"
                  />
                </div>
              </div>
              {/* BBC */}
              <div className="bg-[#F5F5DC] border-2 border-black rounded-xl p-3 sm:p-4 flex items-center justify-center">
                <div
                  className="flex items-center justify-center w-full"
                  style={{ height: "40px" }}
                >
                  <img
                    src="/assets/bbc-logo.png"
                    alt="BBC"
                    className="max-h-full max-w-full h-auto w-auto object-contain scale-[2.0] sm:scale-[2.8]"
                  />
                </div>
              </div>
              {/* The Guardian */}
              <div className="bg-[#F5F5DC] border-2 border-black rounded-xl p-3 sm:p-4 flex items-center justify-center">
                <div
                  className="flex items-center justify-center w-full"
                  style={{ height: "40px" }}
                >
                  <img
                    src="/assets/theguardian-logo.png"
                    alt="The Guardian"
                    className="max-h-full max-w-full h-auto w-auto object-contain"
                  />
                </div>
              </div>
              {/* marie claire */}
              <div className="bg-[#F5F5DC] border-2 border-black rounded-xl p-3 sm:p-4 flex items-center justify-center">
                <div
                  className="flex items-center justify-center w-full"
                  style={{ height: "40px" }}
                >
                  <img
                    src="/assets/marie-claire-logo-transparent.png"
                    alt="marie claire"
                    className="max-h-full max-w-full h-auto w-auto object-contain scale-[1.8] sm:scale-[2.5]"
                  />
                </div>
              </div>
              {/* Forbes */}
              <div className="bg-[#F5F5DC] border-2 border-black rounded-xl p-3 sm:p-4 flex items-center justify-center">
                <div
                  className="flex items-center justify-center w-full"
                  style={{ height: "40px" }}
                >
                  <img
                    src="/assets/forbes-black-solid.png"
                    alt="Forbes"
                    className="max-h-full max-w-full h-auto w-auto object-contain scale-[2.8] sm:scale-[4.0]"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PR Tools Section */}
        <section id="features" className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-normal text-black mb-4"
                style={headingStyle}
              >
                PR tools for founders, made easy
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Search journalists, spot live media needs, and write winning
                pitches—no agency, no stress. Fast, simple, and affordable.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Card 1 - Journalist search */}
              <div className="text-center">
                <div className="rounded-2xl overflow-hidden mb-6 shadow-lg">
                  <img
                    src="/assets/find-journalists.png"
                    alt="Search & find journalists fast"
                    className="w-full h-auto"
                  />
                </div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
                  Journalist search
                </p>
                <h3 className="text-xl font-bold text-black mb-3">
                  Find contacts in seconds
                </h3>
                <p className="text-slate-600 mb-4">
                  Easily search and filter journalists by topic, outlet, or
                  location. Skip the spreadsheets and connect with the right
                  people fast.
                </p>
                <a
                  href="/pricing"
                  className="inline-flex items-center justify-center rounded-full bg-[#D8B4FE] px-5 py-2.5 text-sm font-semibold text-black border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] transition-all duration-150"
                >
                  Start Free Trial
                </a>
              </div>

              {/* Card 2 - Live requests */}
              <div className="text-center">
                <div className="rounded-2xl overflow-hidden mb-6 shadow-lg">
                  <img
                    src="/assets/new-media-requests-on-desk.png"
                    alt="Live Requests"
                    className="w-full h-auto"
                  />
                </div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
                  Live requests
                </p>
                <h3 className="text-xl font-bold text-black mb-3">
                  Spot media opportunities live
                </h3>
                <p className="text-slate-600 mb-4">
                  See what journalists need right now. Reply directly and get
                  your story in front of the press.
                </p>
                <a
                  href="/pricing"
                  className="inline-flex items-center justify-center rounded-full bg-[#D8B4FE] px-5 py-2.5 text-sm font-semibold text-black border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] transition-all duration-150"
                >
                  Start Free Trial
                </a>
              </div>

              {/* Card 3 - AI pitch writing */}
              <div className="text-center">
                <div className="rounded-2xl overflow-hidden mb-6 shadow-lg">
                  <img
                    src="/assets/pitches-that-get-results.png"
                    alt="Pitches That Get Results"
                    className="w-full h-auto"
                  />
                </div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
                  AI pitch writing
                </p>
                <h3 className="text-xl font-bold text-black mb-3">
                  Instant, clear pitch drafts
                </h3>
                <p className="text-slate-600 mb-4">
                  Let AI help you write strong, relevant pitches in moments.
                  Save time and boost your chances of getting featured.
                </p>
                <a
                  href="/pricing"
                  className="inline-flex items-center justify-center rounded-full bg-[#D8B4FE] px-5 py-2.5 text-sm font-semibold text-black border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] transition-all duration-150"
                >
                  Start Free Trial
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-sm font-medium tracking-wider text-slate-500 uppercase mb-3">
                AFFORDABLE PLANS FOR EVERY FOUNDER
              </p>
              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-normal text-black mb-4"
                style={headingStyle}
              >
                Choose your plan
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Explore our flexible pricing options to find the perfect fit for
                your needs.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
              {/* Starter Plan */}
              <div className="bg-[#F5F5DC] border-2 border-black rounded-2xl p-5 sm:p-8">
                <h3 className="text-lg sm:text-xl font-bold text-black mb-2">Starter</h3>
                <div className="mb-3 sm:mb-4">
                  <span className="text-3xl sm:text-4xl font-bold text-black">£45</span>
                  <span className="text-base sm:text-lg text-slate-600">/mo</span>
                </div>
                <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6">
                  Ideal for Solopreneurs, Freelance PRs and small teams.
                </p>

                <p className="text-xs font-medium tracking-wider text-slate-500 uppercase mb-3 sm:mb-4">
                  JUST WHAT YOU NEED
                </p>

                <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                  <li className="flex items-start gap-2 sm:gap-3">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span className="text-sm sm:text-base text-slate-700">300 journalist searches</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span className="text-sm sm:text-base text-slate-700">
                      Unlimited live journalist requests in your niche
                    </span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span className="text-sm sm:text-base text-slate-700">
                      Basic AI-assisted pitch writing
                    </span>
                  </li>
                </ul>

                <a
                  href="/pricing"
                  className="block w-full text-center rounded-full bg-[#D8B4FE] px-6 py-3 font-semibold text-black border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] transition-all duration-150"
                >
                  Start Your Free Trial
                </a>
              </div>

              {/* Pro Plan */}
              <div className="bg-[#F5F5DC] border-2 border-green-500 rounded-2xl p-5 sm:p-8 relative">
                <h3 className="text-lg sm:text-xl font-bold text-black mb-2">Pro</h3>
                <div className="mb-3 sm:mb-4">
                  <span className="text-3xl sm:text-4xl font-bold text-black">£99</span>
                  <span className="text-base sm:text-lg text-slate-600">/mo</span>
                </div>
                <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6">
                  Perfect for growing businesses.
                </p>

                <p className="text-xs font-medium tracking-wider text-slate-500 uppercase mb-3 sm:mb-4">
                  PRO USERS SEE NEW REQUESTS FIRST
                </p>

                <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                  <li className="flex items-start gap-2 sm:gap-3">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span className="text-sm sm:text-base text-slate-700">700 journalist searches</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span className="text-sm sm:text-base text-slate-700">
                      Unlimited live journalist requests in your niche
                    </span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span className="text-sm sm:text-base text-slate-700">
                      Advanced pitch templates
                    </span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span className="text-sm sm:text-base text-slate-700">
                      Priority access to live requests
                    </span>
                  </li>
                </ul>

                <a
                  href="/pricing"
                  className="block w-full text-center rounded-full bg-[#D8B4FE] px-6 py-3 font-semibold text-black border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] transition-all duration-150"
                >
                  Start Your Free Trial
                </a>
              </div>

              {/* Done-For-You Plan */}
              <div className="bg-[#F5F5DC] border-2 border-black rounded-2xl p-5 sm:p-8 sm:col-span-2 lg:col-span-1">
                <h3 className="text-lg sm:text-xl font-bold text-black mb-2">
                  Done-For-You Human Outreach
                </h3>
                <div className="mb-3 sm:mb-4">
                  <span className="text-3xl sm:text-4xl font-bold text-black">£249</span>
                </div>
                <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6">
                  For founders who want hands-off outreach
                </p>

                <p className="text-xs font-medium tracking-wider text-slate-500 uppercase mb-3 sm:mb-4">
                  AN ACTUAL HUMAN (NOT AI) TAKES CARE OF PRESS OUTREACH
                </p>

                <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                  <li className="flex items-start gap-2 sm:gap-3">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span className="text-sm sm:text-base text-slate-700">
                      Unlimited journalist searches
                    </span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span className="text-sm sm:text-base text-slate-700">
                      Unlimited live journalist requests in your niche
                    </span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span className="text-sm sm:text-base text-slate-700">
                      Not AI: our team manually reaches out to relevant podcasts
                      and newsletters
                    </span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span className="text-sm sm:text-base text-slate-700">
                      Minimum 100 personalised pitches per month
                    </span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span className="text-sm sm:text-base text-slate-700">
                      Clear tracking via a shared Google Sheet
                    </span>
                  </li>
                </ul>

                <a
                  href="/pricing"
                  className="block w-full text-center rounded-full bg-[#D8B4FE] px-6 py-3 font-semibold text-black border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] transition-all duration-150"
                >
                  Coming Soon!
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Tabs Section */}
        <section id="how" className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-normal text-black mb-4"
                style={headingStyle}
              >
                Get press. Skip the hassle.
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Search journalists, pitch fast, and track media requests—all in
                one easy platform. No agencies. No overwhelm.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center mb-6 sm:mb-8">
              {/* Left - Image */}
              <div className="rounded-2xl overflow-hidden shadow-xl order-2 lg:order-1">
                <img
                  src={featureTabContent[activeFeatureTab].image}
                  alt={featureTabContent[activeFeatureTab].title}
                  className="w-full h-auto"
                />
              </div>

              {/* Right - Content */}
              <div className="bg-[#F5F5DC] border-2 border-black rounded-2xl p-5 sm:p-8 order-1 lg:order-2">
                <h3 className="text-xl sm:text-2xl font-bold text-black mb-3 sm:mb-4">
                  {featureTabContent[activeFeatureTab].title}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6">
                  {featureTabContent[activeFeatureTab].description}
                </p>
                <a
                  href={featureTabContent[activeFeatureTab].ctaLink}
                  className={outlineButtonClass}
                >
                  {featureTabContent[activeFeatureTab].cta}
                </a>
              </div>
            </div>

            {/* Tabs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 border-t border-black/10 pt-6 sm:pt-8">
              <button
                onClick={() => setActiveFeatureTab("journalist-finder")}
                className={`text-left p-3 sm:p-4 rounded-lg transition-colors ${
                  activeFeatureTab === "journalist-finder"
                    ? "bg-black/5 border-2 border-black/20"
                    : "hover:bg-black/5 border-2 border-transparent"
                }`}
              >
                <h4
                  className={`font-bold text-sm sm:text-base mb-0.5 sm:mb-1 ${
                    activeFeatureTab === "journalist-finder"
                      ? "text-black"
                      : "text-slate-500"
                  }`}
                >
                  Journalist finder
                </h4>
                <p
                  className={`text-xs sm:text-sm hidden sm:block ${
                    activeFeatureTab === "journalist-finder"
                      ? "text-slate-700"
                      : "text-slate-400"
                  }`}
                >
                  Find the right contacts in seconds.
                </p>
              </button>

              <button
                onClick={() => setActiveFeatureTab("media-requests")}
                className={`text-left p-3 sm:p-4 rounded-lg transition-colors ${
                  activeFeatureTab === "media-requests"
                    ? "bg-black/5 border-2 border-black/20"
                    : "hover:bg-black/5 border-2 border-transparent"
                }`}
              >
                <h4
                  className={`font-bold text-sm sm:text-base mb-0.5 sm:mb-1 ${
                    activeFeatureTab === "media-requests"
                      ? "text-black"
                      : "text-slate-500"
                  }`}
                >
                  Media requests
                </h4>
                <p
                  className={`text-xs sm:text-sm hidden sm:block ${
                    activeFeatureTab === "media-requests"
                      ? "text-slate-700"
                      : "text-slate-400"
                  }`}
                >
                  Spot new press opportunities instantly.
                </p>
              </button>

              <button
                onClick={() => setActiveFeatureTab("ai-pitch")}
                className={`text-left p-3 sm:p-4 rounded-lg transition-colors ${
                  activeFeatureTab === "ai-pitch"
                    ? "bg-black/5 border-2 border-black/20"
                    : "hover:bg-black/5 border-2 border-transparent"
                }`}
              >
                <h4
                  className={`font-bold text-sm sm:text-base mb-0.5 sm:mb-1 ${
                    activeFeatureTab === "ai-pitch"
                      ? "text-black"
                      : "text-slate-500"
                  }`}
                >
                  AI pitch help
                </h4>
                <p
                  className={`text-xs sm:text-sm hidden sm:block ${
                    activeFeatureTab === "ai-pitch"
                      ? "text-slate-700"
                      : "text-slate-400"
                  }`}
                >
                  Write strong, clear pitches fast.
                </p>
              </button>

              <button
                onClick={() => setActiveFeatureTab("easy-lists")}
                className={`text-left p-3 sm:p-4 rounded-lg transition-colors ${
                  activeFeatureTab === "easy-lists"
                    ? "bg-black/5 border-2 border-black/20"
                    : "hover:bg-black/5 border-2 border-transparent"
                }`}
              >
                <h4
                  className={`font-bold text-sm sm:text-base mb-0.5 sm:mb-1 ${
                    activeFeatureTab === "easy-lists"
                      ? "text-black"
                      : "text-slate-500"
                  }`}
                >
                  Easy lists
                </h4>
                <p
                  className={`text-xs sm:text-sm hidden sm:block ${
                    activeFeatureTab === "easy-lists"
                      ? "text-slate-700"
                      : "text-slate-400"
                  }`}
                >
                  Save contacts and manage outreach simply.
                </p>
              </button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div className="text-center lg:text-left">
                <p className="text-xs sm:text-sm font-medium tracking-wider text-slate-500 uppercase mb-2 sm:mb-3">
                  PR FOR FOUNDERS, MADE EASY
                </p>
                <h2
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal text-black mb-4 sm:mb-6"
                  style={headingStyle}
                >
                  Get noticed. Grow faster.
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-6 sm:mb-8">
                  Connect with journalists, send pitches, and share your
                  story—no agencies, no stress. Simple, fast, and built for you.
                </p>
                <a
                  href="/pricing"
                  className="inline-flex items-center justify-center rounded-full bg-[#D8B4FE] px-8 py-4 text-lg font-semibold text-black border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] transition-all duration-150 w-full md:w-auto"
                >
                  Try free
                </a>
                <p className="mt-4 text-sm text-slate-500">
                  7-day free trial. Cancel anytime
                </p>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="/assets/save-lists.png"
                  alt="Save Lists feature"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-sm font-medium tracking-wider text-slate-500 uppercase mb-3">
                TRUSTED BY FOUNDERS AND SMALL TEAMS
              </p>
              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-normal text-black"
                style={headingStyle}
              >
                Press wins made simple
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-[#F5F5DC] border-2 border-black rounded-2xl p-5 sm:p-8"
                >
                  <h3 className="text-lg sm:text-xl font-bold text-black mb-3 sm:mb-4">
                    Beta user feedback coming soon
                  </h3>
                  <div className="border-t border-dashed border-slate-400 pt-3 sm:pt-4 mt-3 sm:mt-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                        <img
                          src={`https://i.pravatar.cc/48?img=${i + 10}`}
                          alt="User avatar"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-slate-600 text-xs sm:text-sm">
                        Feedback from real founders using ContactJournalists
                        will appear here shortly.
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section id="blog" className="relative py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-10 md:mb-12">
              <h2 className="mb-3 text-2xl font-bold text-black sm:text-3xl md:text-4xl px-4">
                Blog
              </h2>
              <p className="text-sm sm:text-base text-slate-600 px-4">
                Insights and guides for better PR outreach
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Featured Blog Post – How to Reach Food, Fitness, Beauty & Tech Journalists */}
              <article className="md:col-span-2 lg:col-span-3 rounded-2xl border-2 border-green-500 bg-[#F5F5DC] p-4 sm:p-6 md:p-8 hover:shadow-lg transition-all relative">
                <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 bg-gradient-to-r from-purple-500 to-green-500 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold text-white uppercase tracking-wide shadow-lg">
                  Latest Guide
                </div>
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <span className="text-[10px] sm:text-xs font-semibold text-green-600 uppercase tracking-wide">
                    Featured Guide
                  </span>
                  <span className="text-[10px] sm:text-xs text-slate-500">•</span>
                  <span className="text-[10px] sm:text-xs text-slate-500">January 2026</span>
                </div>

                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-black mb-3 sm:mb-4">
                  How to Reach{" "}
                  <mark className="bg-green-200 text-green-800 px-1 sm:px-2 py-0.5 sm:py-1 rounded text-base sm:text-lg md:text-2xl">
                    Food, Fitness, Beauty & Tech
                  </mark>{" "}
                  Journalists
                </h3>

                <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
                  <img
                    src="/assets/fortuna-founder-feathers.png"
                    alt="Fortuna Burke, founder of ContactJournalists.com"
                    className="w-full md:w-48 h-40 sm:h-48 object-cover rounded-xl flex-shrink-0"
                  />
                  <div className="flex-1">
                    <p className="text-sm sm:text-base text-slate-600 mb-3 sm:mb-4">
                      If you're trying to reach food, fitness, beauty, or tech
                      journalists, the hardest part isn't writing a pitch — it's
                      finding the{" "}
                      <mark className="bg-purple-200 text-purple-800 px-1 rounded">
                        right people, in the right places, at the right moment
                      </mark>
                      .
                    </p>

                    <p className="text-sm sm:text-base text-slate-600 mb-3 sm:mb-4">
                      This guide breaks down where journalists in each niche
                      actually hang out now, how they prefer to be contacted,
                      and why journalist requests flip PR from "guessing" to
                      "responding".
                    </p>

                    <a
                      href="/blog/how-to-reach-food-fitness-beauty-tech-journalists"
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href =
                          "/blog/how-to-reach-food-fitness-beauty-tech-journalists";
                      }}
                      className="inline-flex items-center gap-2 rounded-full bg-[#D8B4FE] px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-black border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] transition-all duration-150"
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
                </div>
              </article>

              {/* How to Build a Media List - NEW */}
              <article className="rounded-2xl border-2 border-purple-500 bg-[#F5F5DC] p-4 sm:p-6 hover:shadow-lg transition-all relative">
                <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 bg-gradient-to-r from-purple-500 to-green-500 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold text-white uppercase tracking-wide shadow-lg">
                  New
                </div>
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <span className="text-[10px] sm:text-xs font-semibold text-purple-600 uppercase tracking-wide">
                    Featured Guide
                  </span>
                  <span className="text-[10px] sm:text-xs text-slate-500">•</span>
                  <span className="text-[10px] sm:text-xs text-slate-500">January 2026</span>
                </div>

                <h3 className="text-base sm:text-lg md:text-xl font-bold text-black mb-2 sm:mb-3">
                  How to Build a Media List That Actually Gets Results
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 mb-3 sm:mb-4">
                  Most media lists fail quietly. Learn how to build a media list
                  journalists actually respond to, based on real founder experience
                  plus newsroom-backed research, not PR theory.
                </p>

                <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-slate-500 mb-3 sm:mb-4">
                  <time>January 2026</time>
                  <span>•</span>
                  <span>35 min read</span>
                </div>

                <a
                  href="/blog/how-to-build-a-media-list-that-gets-results"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href =
                      "/blog/how-to-build-a-media-list-that-gets-results";
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-green-500 px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                >
                  Read Full Guide
                  <svg
                    className="h-3 w-3 sm:h-4 sm:w-4"
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

              {/* 20 Places to Find Journalists */}
              <article className="rounded-2xl border-2 border-black bg-[#F5F5DC] p-4 sm:p-6 hover:shadow-lg transition-all">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <span className="text-[10px] sm:text-xs font-semibold text-purple-600 uppercase tracking-wide">
                    Featured Guide
                  </span>
                  <span className="text-[10px] sm:text-xs text-slate-500">•</span>
                  <span className="text-[10px] sm:text-xs text-slate-500">January 2026</span>
                </div>

                <h3 className="text-base sm:text-lg md:text-xl font-bold text-black mb-2 sm:mb-3">
                  20 Places to Find Journalists Covering Your Niche
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 mb-3 sm:mb-4">
                  Most founders don't struggle with PR because their story is
                  bad — they struggle because they're guessing where journalists
                  actually hang out. This guide breaks down 20 real places
                  journalists use.
                </p>

                <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-slate-500 mb-3 sm:mb-4">
                  <time>January 2026</time>
                  <span>•</span>
                  <span>22 min read</span>
                </div>

                <a
                  href="/blog/20-places-to-find-journalists-covering-your-niche"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href =
                      "/blog/20-places-to-find-journalists-covering-your-niche";
                  }}
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-purple-600 hover:text-green-600 transition-colors"
                >
                  Read Full Guide
                  <svg
                    className="h-3 w-3 sm:h-4 sm:w-4"
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

              {/* PR Playbook for Solo Founders */}
              <article className="rounded-2xl border-2 border-black bg-[#F5F5DC] p-4 sm:p-6 hover:shadow-lg transition-all">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <span className="text-[10px] sm:text-xs font-semibold text-purple-600 uppercase tracking-wide">
                    Featured Guide
                  </span>
                  <span className="text-[10px] sm:text-xs text-slate-500">•</span>
                  <span className="text-[10px] sm:text-xs text-slate-500">January 2026</span>
                </div>

                <h3 className="text-base sm:text-lg md:text-xl font-bold text-black mb-2 sm:mb-3">
                  The PR Playbook for Solo Founders
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 mb-3 sm:mb-4">
                  How to get press without an agency, a team, or burning out.
                  Real strategies from a founder who's been there—including
                  celebrity outreach wins and journalist request timing.
                </p>

                <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-slate-500 mb-3 sm:mb-4">
                  <time>January 2026</time>
                  <span>•</span>
                  <span>25 min read</span>
                </div>

                <a
                  href="/blog/pr-playbook-for-solo-founders"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "/blog/pr-playbook-for-solo-founders";
                  }}
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-purple-600 hover:text-green-600 transition-colors"
                >
                  Read Full Playbook
                  <svg
                    className="h-3 w-3 sm:h-4 sm:w-4"
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

              {/* Featured Blog Post – Best Time to Email Journalists */}
              <article className="rounded-2xl border-2 border-black bg-[#F5F5DC] p-4 sm:p-6 hover:shadow-lg transition-all">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <span className="text-[10px] sm:text-xs font-semibold text-purple-600 uppercase tracking-wide">
                    Featured Guide
                  </span>
                  <span className="text-[10px] sm:text-xs text-slate-500">•</span>
                  <span className="text-[10px] sm:text-xs text-slate-500">January 2026</span>
                </div>

                <h3 className="text-base sm:text-lg md:text-xl font-bold text-black mb-2 sm:mb-3">
                  The Best Time of Day to Email Journalists (Backed by Data)
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 mb-3 sm:mb-4">
                  There is a better time of day to email journalists. This
                  data-backed guide explains when reporters read emails, why
                  mornings work best, and how to get press without guessing.
                </p>

                <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-slate-500 mb-3 sm:mb-4">
                  <time>January 2026</time>
                  <span>•</span>
                  <span>18 min read</span>
                </div>

                <a
                  href="/blog/best-time-of-day-to-email-journalists"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href =
                      "/blog/best-time-of-day-to-email-journalists";
                  }}
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-purple-600 hover:text-green-600 transition-colors"
                >
                  Read Full Guide
                  <svg
                    className="h-3 w-3 sm:h-4 sm:w-4"
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

              {/* More Guides CTA - Full Width */}
              <a
                href="/guides"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = "/guides";
                }}
                className="md:col-span-2 lg:col-span-3 group relative overflow-hidden rounded-2xl border-2 border-purple-500 hover:border-purple-600 transition-all"
              >
                <div className="absolute inset-0">
                  <img
                    src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1600&q=80"
                    alt="Newspaper and journalism"
                    className="w-full h-full object-cover opacity-20 group-hover:opacity-30 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#F5F5DC] via-[#F5F5DC]/90 to-[#F5F5DC]/70"></div>
                </div>

                <div className="relative p-5 sm:p-8 md:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  <div className="max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <span className="inline-flex items-center gap-1 sm:gap-2 rounded-full bg-purple-100 border border-purple-300 px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-purple-700 uppercase tracking-wide">
                        Resource Hub
                      </span>
                      <span className="text-[10px] sm:text-xs text-slate-500">
                        10 Guides Available
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-2xl md:text-3xl font-bold text-black mb-2 sm:mb-3 group-hover:text-purple-700 transition-colors">
                      Guides: How To Contact Journalists and Get Publicity for
                      Your Start Up
                    </h3>

                    <p className="text-sm sm:text-base text-slate-600 mb-3 sm:mb-4 max-w-xl">
                      Explore our complete library of PR guides, pitch
                      templates, and founder resources. Everything you need to
                      get press coverage—all in one place.
                    </p>

                    <span className="inline-flex items-center gap-2 text-sm sm:text-base text-purple-600 font-semibold group-hover:gap-3 transition-all">
                      Browse All Guides
                      <svg
                        className="h-4 w-4 sm:h-5 sm:w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </span>
                  </div>

                  <div className="hidden lg:flex items-center justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-green-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                      <div className="relative bg-white/50 border-2 border-black rounded-2xl p-6 backdrop-blur">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white/80 rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-black">
                              10
                            </div>
                            <div className="text-xs text-slate-500">Guides</div>
                          </div>
                          <div className="bg-white/80 rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-black">
                              115+
                            </div>
                            <div className="text-xs text-slate-500">
                              Min Read
                            </div>
                          </div>
                          <div className="bg-white/80 rounded-lg p-3 text-center col-span-2">
                            <div className="text-lg font-bold text-green-600">
                              Free
                            </div>
                            <div className="text-xs text-slate-500">
                              All Resources
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-start">
              <div className="text-center lg:text-left">
                <h2
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal text-black mb-3 sm:mb-4"
                  style={headingStyle}
                >
                  PR made simple, answers made easy
                </h2>
                <p className="text-base sm:text-lg text-slate-600 mb-6 sm:mb-8">
                  Find quick help on using our platform, plans, and getting
                  started. We keep PR clear and stress-free.
                </p>
                <a
                  href="/pricing"
                  className={outlineButtonClass}
                >
                  Start free
                </a>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div className="border-b border-black/10 pb-4 sm:pb-6">
                  <h3 className="font-bold text-sm sm:text-base text-black mb-1.5 sm:mb-2">
                    How do I reach journalists?
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600">
                    Search by topic, outlet, or location. See current contacts
                    and live requests instantly.
                  </p>
                </div>

                <div className="border-b border-black/10 pb-4 sm:pb-6">
                  <h3 className="font-bold text-sm sm:text-base text-black mb-1.5 sm:mb-2">
                    Is there a free trial?
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600">
                    Yes! Try every feature free for 7 days. Cancel anytime
                  </p>
                </div>

                <div className="border-b border-black/10 pb-4 sm:pb-6">
                  <h3 className="font-bold text-sm sm:text-base text-black mb-1.5 sm:mb-2">
                    What comes with each plan?
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600">
                    Every plan has searches, unlimited live requests, and AI
                    pitch help. Please scroll up to check out a detailed
                    breakdown under pricing
                  </p>
                </div>

                <div className="border-b border-black/10 pb-4 sm:pb-6">
                  <h3 className="font-bold text-sm sm:text-base text-black mb-1.5 sm:mb-2">
                    Can I cancel anytime?
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600">
                    Yes, you can change or cancel anytime from your dashboard.
                    No hidden fees.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative border-t border-black/10 bg-[#F5F5DC]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="grid gap-6 sm:gap-8 grid-cols-2 lg:grid-cols-3">
              <div className="col-span-2 lg:col-span-1">
                <a
                  href="#"
                  className="flex items-center gap-2 font-extrabold text-base sm:text-lg tracking-tight text-black"
                >
                  <span className="inline-block h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-sm bg-gradient-to-br from-purple-500 to-violet-600"></span>
                  Contact<span className="text-slate-500">Journalists</span>
                </a>
                <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-slate-600">
                  AI-powered media outreach for brands worldwide.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-xs sm:text-sm text-black">Product</h4>
                <ul className="mt-2 sm:mt-3 space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-slate-600">
                  <li>
                    <a
                      className="hover:text-black"
                      href="#features"
                      data-testid="link-footer-features"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      className="hover:text-black"
                      href="#pricing"
                      data-testid="link-footer-pricing"
                    >
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a
                      className="hover:text-black"
                      href="#blog"
                      data-testid="link-footer-blog"
                    >
                      Blog
                    </a>
                  </li>
                  <li>
                    <a
                      className="hover:text-black"
                      href="/affiliates"
                      data-testid="link-footer-affiliates"
                    >
                      Affiliates
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-xs sm:text-sm text-black">Legal</h4>
                <ul className="mt-2 sm:mt-3 space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-slate-600">
                  <li>
                    <a
                      className="hover:text-black"
                      href="/privacy-policy"
                      data-testid="link-footer-privacy-policy"
                    >
                      Privacy policy
                    </a>
                  </li>
                  <li>
                    <a
                      className="hover:text-black"
                      href="/privacy-and-data"
                      data-testid="link-footer-privacy-and-data"
                    >
                      Privacy & data
                    </a>
                  </li>
                  <li>
                    <a
                      className="hover:text-black"
                      href="/cookie-policy"
                      data-testid="link-footer-cookie-policy"
                    >
                      Cookie policy
                    </a>
                  </li>
                  <li>
                    <a
                      className="hover:text-black"
                      href="/terms-of-service"
                      data-testid="link-footer-terms-of-service"
                    >
                      Terms of service
                    </a>
                  </li>
                  <li>
                    <a
                      className="hover:text-black"
                      href="/request-removal"
                      data-testid="link-footer-request-removal"
                    >
                      Request removal
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-6 sm:mt-8 border-t border-black/5 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-slate-600">
              <p className="mb-1.5 sm:mb-2">
                Questions? Ping us a message at{" "}
                <a
                  href="mailto:hello@contactjournalists.com"
                  className="text-purple-600 hover:underline break-all"
                >
                  hello@contactjournalists.com
                </a>
              </p>
              <p>© 2026 ContactJournalists.com. Built in London with ☕️</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
