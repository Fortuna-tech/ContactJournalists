import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { FOOTER_LINKS } from "@/components/Footer";

export default function Affiliate() {
  const [refStarter, setRefStarter] = useState(5);
  const [refGrowth, setRefGrowth] = useState(10);
  const [refTeam, setRefTeam] = useState(3);
  const [showAnnual, setShowAnnual] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load Google Fonts
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

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    try {
      const { error } = await supabase.from("affiliates").insert({ email });

      if (!error) {
        setSubmitMessage("✓ Thanks! We'll notify you when we launch.");
        (e.target as HTMLFormElement).reset();
      } else {
        if (error.code === "23505") {
          setSubmitMessage("You are already subscribed!");
        } else {
          setSubmitMessage("Something went wrong. Please try again.");
        }
      }
    } catch (error) {
      setSubmitMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const COMM = 0.2;
  const PRICES = { starter: 45, growth: 99, team: 199 };

  const currency = (n: number) => {
    const value = Math.round(n * 100) / 100;
    return (
      "£" +
      value.toLocaleString("en-GB", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })
    );
  };

  const earnS = refStarter * PRICES.starter * COMM;
  const earnG = refGrowth * PRICES.growth * COMM;
  const earnT = refTeam * PRICES.team * COMM;

  const monthly = earnS + earnG + earnT;
  const annual = monthly * 12;

  const max = Math.max(earnS, earnG, earnT, 1);

  const handlePreset = (
    tier: "starter" | "growth" | "team",
    action: string
  ) => {
    if (action === "reset") {
      if (tier === "starter") setRefStarter(0);
      else if (tier === "growth") setRefGrowth(0);
      else if (tier === "team") setRefTeam(0);
    } else {
      const delta = Number(action);
      if (tier === "starter")
        setRefStarter((prev) => Math.min(200, prev + delta));
      else if (tier === "growth")
        setRefGrowth((prev) => Math.min(200, prev + delta));
      else if (tier === "team")
        setRefTeam((prev) => Math.min(200, prev + delta));
    }
  };

  // Heading style for Caprasimo font
  const headingStyle = { fontFamily: "'Caprasimo', cursive" };
  // Body style for DM Sans font
  const bodyStyle = { fontFamily: "'DM Sans', sans-serif" };

  // Button classes matching homepage
  const primaryButtonClass =
    "inline-flex items-center justify-center rounded-full bg-[#D8B4FE] px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-black border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F5DC] transition-all duration-150";
  const secondaryButtonClass =
    "inline-flex items-center justify-center rounded-full bg-[#F5F5DC] px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-black border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F5DC] transition-all duration-150";

  // Preset button class
  const presetButtonClass =
    "rounded-full bg-white/50 px-3 py-1 text-xs font-medium text-slate-600 border border-black/20 hover:bg-white hover:text-black transition-all";

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div
      className="min-h-screen bg-[#F5F5DC] text-slate-800 antialiased selection:bg-purple-200 selection:text-purple-900"
      style={bodyStyle}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-[#F5F5DC]/90 border-b border-black/5">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <a
            href="/"
            className="flex items-center gap-2 font-extrabold text-lg tracking-tight text-black"
          >
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-gradient-to-br from-purple-500 to-violet-600"></span>
            Contact<span className="text-slate-500">Journalists</span>
          </a>
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded hover:bg-black/5"
            aria-expanded={mobileMenuOpen}
            aria-label="Open menu"
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
          <ul className="hidden md:flex items-center gap-6 text-sm">
            <li>
              <a className="hover:text-black text-slate-600" href="/#features">
                Features
              </a>
            </li>
            <li>
              <a className="hover:text-black text-slate-600" href="/#how">
                How it Works
              </a>
            </li>
            <li>
              <a className="hover:text-black text-slate-600" href="/#pricing">
                Pricing
              </a>
            </li>
            <li>
              <a className="hover:text-black text-slate-600" href="/#faq">
                FAQ
              </a>
            </li>
            <li>
              <a
                className="ml-2 inline-flex items-center rounded-full bg-black px-4 py-2 font-semibold text-white hover:bg-black/90 transition-colors"
                href="/auth"
              >
                Get Started
              </a>
            </li>
          </ul>
        </nav>
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-[#F5F5DC] border-b border-black/5 shadow-xl">
            <div className="space-y-1 px-2 pb-3 pt-2">
              <a
                href="/#features"
                onClick={closeMobileMenu}
                className="block rounded-lg px-3 py-2 text-base font-medium text-slate-600 hover:bg-black/5 hover:text-black"
              >
                Features
              </a>
              <a
                href="/#how"
                onClick={closeMobileMenu}
                className="block rounded-lg px-3 py-2 text-base font-medium text-slate-600 hover:bg-black/5 hover:text-black"
              >
                How it Works
              </a>
              <a
                href="/#pricing"
                onClick={closeMobileMenu}
                className="block rounded-lg px-3 py-2 text-base font-medium text-slate-600 hover:bg-black/5 hover:text-black"
              >
                Pricing
              </a>
              <a
                href="/#faq"
                onClick={closeMobileMenu}
                className="block rounded-lg px-3 py-2 text-base font-medium text-slate-600 hover:bg-black/5 hover:text-black"
              >
                FAQ
              </a>
              <a
                href="/auth"
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
        {/* HERO */}
        <section className="relative py-16 md:py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left content */}
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 border border-purple-200 px-3 py-1 text-xs font-semibold text-purple-700 uppercase tracking-wide mb-6">
                  Affiliate Program
                </div>
                <h1
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal leading-tight tracking-tight text-black mb-6"
                  style={headingStyle}
                >
                  Earn 20% Recurring Commission
                </h1>
                <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-xl mx-auto lg:mx-0">
                  Help founders get press coverage and earn{" "}
                  <span className="font-semibold text-black">
                    20% recurring commission
                  </span>{" "}
                  on every referral — with verified contacts, AI pitch
                  templates, and export-ready lists.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <a href="#apply" className={primaryButtonClass}>
                    Apply Now
                  </a>
                  <a href="#how" className={secondaryButtonClass}>
                    How It Works
                  </a>
                </div>
                <div className="mt-8 flex flex-wrap items-center gap-4 justify-center lg:justify-start text-sm text-slate-500">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>{" "}
                    Built in The UK
                  </span>
                  <span>GDPR-respectful</span>
                  <span className="hidden sm:inline">Trusted by founders</span>
                </div>
              </div>

              {/* Right: Commission Calculator Preview Card */}
              <div className="bg-[#F5F5DC] border-2 border-black rounded-2xl p-6 sm:p-8 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                  <div className="flex gap-1">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400"></span>
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-400"></span>
                    <span className="h-2.5 w-2.5 rounded-full bg-green-400"></span>
                  </div>
                  <span>Affiliate Earnings Preview</span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Growth plan (£99/mo)</span>
                    <span className="font-semibold text-black">£19.80/mo</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Team plan (£199/mo)</span>
                    <span className="font-semibold text-black">£39.80/mo</span>
                  </div>
                  <div className="rounded-xl border-2 border-black/10 bg-white/50 p-4">
                    <p className="mb-1 text-slate-600">
                      Refer 10 Growth users →{" "}
                      <span className="font-semibold text-black">£198/mo</span>{" "}
                      recurring
                    </p>
                    <p className="text-slate-600">
                      Refer 10 Team users →{" "}
                      <span className="font-semibold text-black">£398/mo</span>{" "}
                      recurring
                    </p>
                  </div>
                </div>
                <a
                  href="#apply"
                  className={`${primaryButtonClass} w-full justify-center mt-6`}
                >
                  Start Earning
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* WHY JOIN */}
        <section id="why" className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2
                className="text-2xl sm:text-3xl md:text-4xl font-normal text-black mb-4"
                style={headingStyle}
              >
                Why join now
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Be an early partner in a fast-growing SaaS platform. Your
                audience gets a tool that works. You get predictable, recurring
                income.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-[#F5F5DC] border-2 border-black rounded-2xl p-6">
                <div className="mb-4 inline-flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 text-purple-600">
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 3v18M3 12h18" />
                  </svg>
                </div>
                <h3 className="font-bold text-black mb-2">20% recurring</h3>
                <p className="text-slate-600 text-sm">
                  Earn every month your referrals stay subscribed. No caps, no
                  expiry.
                </p>
              </div>
              <div className="bg-[#F5F5DC] border-2 border-black rounded-2xl p-6">
                <div className="mb-4 inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-600">
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 12l6 6L21 6" />
                  </svg>
                </div>
                <h3 className="font-bold text-black mb-2">High conversion</h3>
                <p className="text-slate-600 text-sm">
                  Real value: verified contacts, AI pitch templates,
                  export-ready lists.
                </p>
              </div>
              <div className="bg-[#F5F5DC] border-2 border-black rounded-2xl p-6">
                <div className="mb-4 inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600">
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 3" />
                  </svg>
                </div>
                <h3 className="font-bold text-black mb-2">Fast setup</h3>
                <p className="text-slate-600 text-sm">
                  Unique link, ready-made assets, and a dashboard with live
                  stats.
                </p>
              </div>
              <div className="bg-[#F5F5DC] border-2 border-black rounded-2xl p-6">
                <div className="mb-4 inline-flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 text-yellow-600">
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 2l3 7h7l-5.5 4 2 7L12 17l-6.5 3 2-7L2 9h7z" />
                  </svg>
                </div>
                <h3 className="font-bold text-black mb-2">Founder support</h3>
                <p className="text-slate-600 text-sm">
                  Get priority help, feature input, and co-marketing for top
                  partners.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* EARNINGS CALCULATOR */}
        <section id="earnings" className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2
                className="text-2xl sm:text-3xl md:text-4xl font-normal text-black mb-4"
                style={headingStyle}
              >
                Affiliate earnings calculator
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                See what you'll earn with{" "}
                <span className="font-semibold text-black">
                  20% recurring commission
                </span>
                . Adjust your expected active referrals by plan.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-12">
              {/* Controls */}
              <div className="lg:col-span-7 bg-[#F5F5DC] border-2 border-black rounded-2xl p-6 sm:p-8">
                {/* Starter */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <label htmlFor="refStarter" className="font-semibold text-black">
                      Starter (£45/mo)
                    </label>
                    <div className="text-sm text-slate-500">
                      Active referrals:{" "}
                      <span className="text-black font-semibold">
                        {refStarter}
                      </span>
                    </div>
                  </div>
                  <input
                    id="refStarter"
                    type="range"
                    min="0"
                    max="200"
                    value={refStarter}
                    onChange={(e) => setRefStarter(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none bg-black/10 accent-purple-500 cursor-pointer"
                  />
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handlePreset("starter", "1")}
                      className={presetButtonClass}
                    >
                      +1
                    </button>
                    <button
                      onClick={() => handlePreset("starter", "5")}
                      className={presetButtonClass}
                    >
                      +5
                    </button>
                    <button
                      onClick={() => handlePreset("starter", "10")}
                      className={presetButtonClass}
                    >
                      +10
                    </button>
                    <button
                      onClick={() => handlePreset("starter", "reset")}
                      className={presetButtonClass}
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {/* Growth */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <label htmlFor="refGrowth" className="font-semibold text-black flex items-center gap-2">
                      Growth (£99/mo){" "}
                      <span className="rounded-full bg-green-100 border border-green-200 px-2 py-0.5 text-xs font-bold text-green-700">
                        Most popular
                      </span>
                    </label>
                    <div className="text-sm text-slate-500">
                      Active referrals:{" "}
                      <span className="text-black font-semibold">
                        {refGrowth}
                      </span>
                    </div>
                  </div>
                  <input
                    id="refGrowth"
                    type="range"
                    min="0"
                    max="200"
                    value={refGrowth}
                    onChange={(e) => setRefGrowth(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none bg-black/10 accent-purple-500 cursor-pointer"
                  />
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handlePreset("growth", "1")}
                      className={presetButtonClass}
                    >
                      +1
                    </button>
                    <button
                      onClick={() => handlePreset("growth", "5")}
                      className={presetButtonClass}
                    >
                      +5
                    </button>
                    <button
                      onClick={() => handlePreset("growth", "10")}
                      className={presetButtonClass}
                    >
                      +10
                    </button>
                    <button
                      onClick={() => handlePreset("growth", "reset")}
                      className={presetButtonClass}
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {/* Team */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <label htmlFor="refTeam" className="font-semibold text-black">
                      Team (£199/mo)
                    </label>
                    <div className="text-sm text-slate-500">
                      Active referrals:{" "}
                      <span className="text-black font-semibold">
                        {refTeam}
                      </span>
                    </div>
                  </div>
                  <input
                    id="refTeam"
                    type="range"
                    min="0"
                    max="200"
                    value={refTeam}
                    onChange={(e) => setRefTeam(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none bg-black/10 accent-purple-500 cursor-pointer"
                  />
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handlePreset("team", "1")}
                      className={presetButtonClass}
                    >
                      +1
                    </button>
                    <button
                      onClick={() => handlePreset("team", "5")}
                      className={presetButtonClass}
                    >
                      +5
                    </button>
                    <button
                      onClick={() => handlePreset("team", "10")}
                      className={presetButtonClass}
                    >
                      +10
                    </button>
                    <button
                      onClick={() => handlePreset("team", "reset")}
                      className={presetButtonClass}
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {/* Annual toggle */}
                <div className="flex items-center gap-3 pt-4 border-t border-black/10">
                  <span className="text-sm text-slate-600">
                    Show annual estimate
                  </span>
                  <button
                    onClick={() => setShowAnnual(!showAnnual)}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full border-2 border-black transition-colors ${
                      showAnnual ? "bg-purple-500" : "bg-white/50"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 rounded-full bg-white border border-black/20 transition-transform ${
                        showAnnual ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    ></span>
                  </button>
                </div>

                <p className="mt-4 text-xs text-slate-500">
                  * Estimates assume{" "}
                  <span className="font-semibold text-slate-700">
                    20% recurring commission
                  </span>{" "}
                  on live subscriptions. Actual results vary by audience and
                  promotion.
                </p>
              </div>

              {/* Results */}
              <div className="lg:col-span-5 bg-[#F5F5DC] border-2 border-black rounded-2xl p-6 sm:p-8 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                  <div className="flex gap-1">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400"></span>
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-400"></span>
                    <span className="h-2.5 w-2.5 rounded-full bg-green-400"></span>
                  </div>
                  <span>Earnings Preview</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="rounded-xl border-2 border-black/20 bg-white/50 p-4">
                    <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">
                      Monthly
                    </div>
                    <div
                      className={`text-2xl sm:text-3xl font-bold break-all ${
                        showAnnual ? "text-slate-400" : "text-black"
                      }`}
                    >
                      {currency(monthly)}
                    </div>
                  </div>
                  <div className="rounded-xl border-2 border-black/20 bg-white/50 p-4">
                    <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">
                      Annual
                    </div>
                    <div
                      className={`text-2xl sm:text-3xl font-bold break-all ${
                        showAnnual ? "text-black" : "text-slate-400"
                      }`}
                    >
                      {currency(annual)}
                    </div>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="rounded-xl border-2 border-black/10 bg-white/30 p-4 mb-6">
                  <div className="text-sm font-semibold text-black mb-3">
                    Breakdown
                  </div>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex justify-between">
                      <span>Starter:</span>
                      <span className="font-semibold text-black">
                        {currency(earnS)}/mo
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span>Growth:</span>
                      <span className="font-semibold text-black">
                        {currency(earnG)}/mo
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span>Team:</span>
                      <span className="font-semibold text-black">
                        {currency(earnT)}/mo
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Progress bars */}
                <div className="space-y-3 mb-6">
                  <div className="text-xs text-slate-500 mb-2">
                    Relative earnings by tier
                  </div>

                  <div className="h-2.5 rounded-full bg-black/10 overflow-hidden">
                    <div
                      className="h-2.5 rounded-full bg-slate-400 transition-all"
                      style={{ width: `${(earnS / max) * 100}%` }}
                    ></div>
                  </div>
                  <div className="h-2.5 rounded-full bg-black/10 overflow-hidden">
                    <div
                      className="h-2.5 rounded-full bg-purple-500 transition-all"
                      style={{ width: `${(earnG / max) * 100}%` }}
                    ></div>
                  </div>
                  <div className="h-2.5 rounded-full bg-black/10 overflow-hidden">
                    <div
                      className="h-2.5 rounded-full bg-green-500 transition-all"
                      style={{ width: `${(earnT / max) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <a
                  href="#apply"
                  className={`${primaryButtonClass} w-full justify-center`}
                >
                  Apply & start earning
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT YOU'RE PROMOTING */}
        <section id="promote" className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2
                className="text-2xl sm:text-3xl md:text-4xl font-normal text-black mb-4"
                style={headingStyle}
              >
                What you're promoting
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                ContactJournalists.com helps founders get press without
                expensive retainers.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <article className="bg-[#F5F5DC] border-2 border-black rounded-2xl p-6 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-150">
                <h3 className="font-bold text-black mb-2">
                  Verified Contacts
                </h3>
                <p className="text-slate-600 text-sm">
                  Global database of journalists, influencers, and anyone with a
                  platform — cleaned and deduped.
                </p>
              </article>
              <article className="bg-[#F5F5DC] border-2 border-black rounded-2xl p-6 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-150">
                <h3 className="font-bold text-black mb-2">
                  AI Pitch Generator
                </h3>
                <p className="text-slate-600 text-sm">
                  Angles and subject lines that actually get opened.
                </p>
              </article>
              <article className="bg-[#F5F5DC] border-2 border-black rounded-2xl p-6 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-150">
                <h3 className="font-bold text-black mb-2">
                  Smart Exports
                </h3>
                <p className="text-slate-600 text-sm">
                  Google Sheets & CSV with notes and easy follow-up flows.
                </p>
              </article>
              <article className="bg-[#F5F5DC] border-2 border-black rounded-2xl p-6 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-150">
                <h3 className="font-bold text-black mb-2">
                  Reply Templates
                </h3>
                <p className="text-slate-600 text-sm">
                  Faster responses to journalist tweets and press queries.
                </p>
              </article>
              <article className="bg-[#F5F5DC] border-2 border-black rounded-2xl p-6 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-150">
                <h3 className="font-bold text-black mb-2">
                  GDPR-respectful
                </h3>
                <p className="text-slate-600 text-sm">
                  We respect inboxes. Export responsibly and honor opt-outs.
                </p>
              </article>
              <article className="bg-[#F5F5DC] border-2 border-black rounded-2xl p-6 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-150">
                <h3 className="font-bold text-black mb-2">
                  Built in The UK
                </h3>
                <p className="text-slate-600 text-sm">
                  Founder-led, responsive support, early feature access.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* WHO IT'S FOR + HOW IT WORKS */}
        <section id="how" className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div>
                <h2
                  className="text-2xl sm:text-3xl md:text-4xl font-normal text-black mb-6"
                  style={headingStyle}
                >
                  Who it's perfect for
                </h2>
                <ul className="space-y-4 text-slate-600">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-purple-500 flex-shrink-0"></span>
                    Newsletter writers and business creators
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-purple-500 flex-shrink-0"></span>
                    Marketing coaches and PR agencies
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-purple-500 flex-shrink-0"></span>
                    Startup community owners and growth consultants
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-purple-500 flex-shrink-0"></span>
                    LinkedIn educators and YouTube creators
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-purple-500 flex-shrink-0"></span>
                    Founders recommending tools they actually use
                  </li>
                </ul>
              </div>
              <div>
                <h2
                  className="text-2xl sm:text-3xl md:text-4xl font-normal text-black mb-6"
                  style={headingStyle}
                >
                  How it works
                </h2>
                <ol className="space-y-4 text-slate-600">
                  <li className="flex items-start gap-3">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-purple-100 text-purple-700 text-sm font-bold flex-shrink-0">
                      1
                    </span>
                    <span>
                      <span className="font-semibold text-black">Apply</span>{" "}
                      using the form below (free to join).
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-purple-100 text-purple-700 text-sm font-bold flex-shrink-0">
                      2
                    </span>
                    <span>
                      <span className="font-semibold text-black">
                        Get your unique link
                      </span>{" "}
                      and ready-to-use assets.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-purple-100 text-purple-700 text-sm font-bold flex-shrink-0">
                      3
                    </span>
                    <span>
                      <span className="font-semibold text-black">Share</span> in
                      newsletters, socials, client docs, or trainings.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-purple-100 text-purple-700 text-sm font-bold flex-shrink-0">
                      4
                    </span>
                    <span>
                      <span className="font-semibold text-black">
                        Earn 20% monthly
                      </span>{" "}
                      for every active subscriber you refer.
                    </span>
                  </li>
                </ol>
                <div className="mt-8 bg-purple-50 border-2 border-purple-300 rounded-2xl p-6">
                  <p className="text-slate-600">
                    <span className="font-semibold text-black">
                      ✨ Early Partner Advantage:
                    </span>{" "}
                    join now to lock in 20% lifetime commission. We'll never
                    reduce your rate.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* APPLY FORM */}
        <section id="apply" className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-12">
              <h2
                className="text-2xl sm:text-3xl md:text-4xl font-normal text-black mb-4"
                style={headingStyle}
              >
                Apply to join
              </h2>
              <p className="text-lg text-slate-600">
                We approve partners who genuinely help founders and growing
                brands.
              </p>
            </div>

            {/* Custom Styled Form */}
            <div className="mx-auto max-w-xl">
              <div className="bg-[#F5F5DC] border-2 border-black rounded-2xl p-6 sm:p-8 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-lg font-bold text-black mb-2">
                  Affiliates: Turn those links into 20% revenue!
                </h3>
                <p className="text-sm text-slate-600 mb-6">
                  Enter your email address to find out when we launch
                  <span className="text-red-500">*</span>
                </p>

                <form
                  id="affiliate-form"
                  className="space-y-4"
                  onSubmit={handleFormSubmit}
                >
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="EMAIL"
                      required
                      disabled={isSubmitting}
                      className="w-full rounded-xl border-2 border-black bg-white/50 px-4 py-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 disabled:opacity-50 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`${primaryButtonClass} w-full justify-center disabled:opacity-50`}
                  >
                    {isSubmitting ? "SUBSCRIBING..." : "SUBSCRIBE"}
                  </button>

                  {submitMessage && (
                    <p
                      className={`text-sm text-center ${
                        submitMessage.startsWith("✓")
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {submitMessage}
                    </p>
                  )}
                </form>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500">
                We'll reply within 2 business days. By applying you agree to our{" "}
                <a
                  href="/terms-of-service"
                  className="text-purple-600 hover:text-purple-700 hover:underline transition-colors"
                >
                  terms
                </a>
                .
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <h2
                className="text-2xl sm:text-3xl md:text-4xl font-normal text-black text-center mb-12"
                style={headingStyle}
              >
                Affiliate FAQ
              </h2>
              <div className="divide-y divide-black/10 border-2 border-black rounded-2xl overflow-hidden">
                <details className="group">
                  <summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-left font-semibold text-black hover:bg-white/50 transition-colors">
                    Is 20% really recurring?
                    <span className="ml-4 text-slate-400 group-open:rotate-180 transition-transform">
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                        />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-6 pb-5 text-slate-600">
                    Yes. You earn 20% every month your referral remains
                    subscribed. It's not a one-time bounty.
                  </div>
                </details>
                <details className="group">
                  <summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-left font-semibold text-black hover:bg-white/50 transition-colors">
                    How do I get paid?
                    <span className="ml-4 text-slate-400 group-open:rotate-180 transition-transform">
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                        />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-6 pb-5 text-slate-600">
                    Monthly via Stripe or PayPal. Your dashboard shows live
                    clicks, trials, and conversions.
                  </div>
                </details>
                <details className="group">
                  <summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-left font-semibold text-black hover:bg-white/50 transition-colors">
                    Any promotion rules?
                    <span className="ml-4 text-slate-400 group-open:rotate-180 transition-transform">
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                        />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-6 pb-5 text-slate-600">
                    Be honest. Don't run misleading ads. Disclose affiliate
                    links where required. Keep it GDPR-friendly.
                  </div>
                </details>
                <details className="group">
                  <summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-left font-semibold text-black hover:bg-white/50 transition-colors">
                    Do you offer custom deals for big partners?
                    <span className="ml-4 text-slate-400 group-open:rotate-180 transition-transform">
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                        />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-6 pb-5 text-slate-600">
                    Yes. If you can drive meaningful volume, we'll discuss
                    tiered rates and co-marketing.
                  </div>
                </details>
              </div>
            </div>
          </div>
        </section>

        {/* CTA STRIP */}
        <section className="border-t-2 border-black bg-purple-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-700 text-center sm:text-left">
              Ready to partner with a tool founders love?{" "}
              <span className="text-slate-500">
                Earn 20% recurring for every referral.
              </span>
            </p>
            <a href="#apply" className={secondaryButtonClass}>
              Apply to the Affiliate Program
            </a>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-black/10 bg-[#F5F5DC]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid gap-8 grid-cols-2 lg:grid-cols-4">
            <div className="col-span-2 lg:col-span-1">
              <a
                href="/"
                className="flex items-center gap-2 font-extrabold text-lg tracking-tight text-black"
              >
                <span className="inline-block h-2.5 w-2.5 rounded-sm bg-gradient-to-br from-purple-500 to-violet-600"></span>
                Contact<span className="text-slate-500">Journalists</span>
              </a>
              <p className="mt-3 text-sm text-slate-600">
                Made in London. GDPR-respectful outreach.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-black">Product</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>
                  <a
                    className="hover:text-black transition-colors"
                    href="/#features"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-black transition-colors"
                    href="/#pricing"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a className="hover:text-black transition-colors" href="#">
                    Roadmap
                  </a>
                </li>
                <li>
                  <a className="hover:text-black transition-colors" href="#">
                    Changelog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-black">Company</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>
                  <a className="hover:text-black transition-colors" href="#">
                    About
                  </a>
                </li>
                <li>
                  <a className="hover:text-black transition-colors" href="#">
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-black transition-colors"
                    href="mailto:hello@contactjournalists.com"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-black">Legal</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {FOOTER_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link className="hover:text-black transition-colors" to={link.href}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-black/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500">
            <p>
              © {new Date().getFullYear()} ContactJournalists.com · London, UK
            </p>
            <a
              className="text-purple-600 hover:text-purple-700 hover:underline transition-colors"
              href="/"
            >
              Back to Home
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
