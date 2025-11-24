import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Affiliate() {
  const [refStarter, setRefStarter] = useState(5);
  const [refGrowth, setRefGrowth] = useState(10);
  const [refTeam, setRefTeam] = useState(3);
  const [showAnnual, setShowAnnual] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

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

  return (
    <div className="min-h-screen bg-base-900 text-slate-200">
      {/* Decorative background */}
      <div className="pointer-events-none fixed inset-0 bg-darkgradient"></div>

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
          <ul className="hidden md:flex items-center gap-6 text-sm">
            <li>
              <a
                className="hover:text-white/90 text-slate-300"
                href="/#features"
              >
                Features
              </a>
            </li>
            <li>
              <a className="hover:text-white/90 text-slate-300" href="/#how">
                How it Works
              </a>
            </li>
            <li>
              <a
                className="hover:text-white/90 text-slate-300"
                href="/#pricing"
              >
                Pricing
              </a>
            </li>
            <li>
              <a className="hover:text-white/90 text-slate-300" href="/#faq">
                FAQ
              </a>
            </li>
            <li>
              <a
                className="ml-2 inline-flex items-center rounded-xl bg-gradient-to-r from-accent-blue to-accent-violet px-4 py-2 font-semibold text-white shadow-glow hover:opacity-95"
                href="/#pricing"
              >
                Get Started
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main id="main" className="relative">
        {/* HERO */}
        <section className="relative overflow-hidden">
          {/* subtle SVG vectors */}
          <svg
            className="absolute -top-24 -right-24 w-[520px] h-[520px] opacity-30 animate-floaty"
            viewBox="0 0 200 200"
            fill="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.6" />
              </linearGradient>
            </defs>
            <path
              d="M80 10C120 20 160 60 170 100s-10 70-60 80-90-10-100-50S40 0 80 10Z"
              fill="url(#g1)"
            />
          </svg>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 lg:pt-24 pb-8 sm:pb-12">
            <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 items-center">
              <div className="lg:col-span-7">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight break-words">
                  Earn 20%{" "}
                  <span className="relative inline-block">
                    Recurring
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-accent-blue to-accent-violet animate-[slideIn_1s_ease-out]"></span>
                  </span>{" "}
                  Commission with{" "}
                  <span className="whitespace-nowrap">
                    ContactJournalists.com
                  </span>
                </h1>
                <p className="mt-4 text-sm sm:text-base lg:text-lg text-slate-300">
                  Earn{" "}
                  <span className="font-semibold text-white">
                    20% recurring commission
                  </span>{" "}
                  helping brands get press — with verified contacts, AI pitch
                  templates, and export-ready lists.
                </p>
                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap gap-3">
                  <a
                    href="#apply"
                    className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-accent-blue to-accent-violet px-5 py-3 font-semibold text-sm sm:text-base text-white shadow-glow hover:opacity-95"
                  >
                    Apply Now
                  </a>
                  <a
                    href="#how"
                    className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-sm sm:text-base text-slate-200 hover:bg-white/10"
                  >
                    How It Works
                  </a>
                </div>
                <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-400">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>{" "}
                    Built in The UK
                  </span>
                  <span>GDPR-respectful</span>
                  <span className="hidden sm:inline">Trusted by founders</span>
                </div>
              </div>

              {/* Card: Commission Calculator */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl border border-white/10 bg-base-700/60 shadow-glow p-4 sm:p-6 animate-glow">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 rounded-full bg-red-500/70"></span>
                      <span className="h-2 w-2 rounded-full bg-yellow-400/70"></span>
                      <span className="h-2 w-2 rounded-full bg-emerald-400/70"></span>
                    </div>
                    <span className="truncate">Affiliate Earnings Preview</span>
                  </div>
                  <div className="mt-4 space-y-3 text-xs sm:text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs sm:text-sm">
                        Growth plan (£99/mo)
                      </span>
                      <span className="font-semibold whitespace-nowrap text-xs sm:text-sm">
                        £19.80/mo
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs sm:text-sm">
                        Team plan (£199/mo)
                      </span>
                      <span className="font-semibold whitespace-nowrap text-xs sm:text-sm">
                        £39.80/mo
                      </span>
                    </div>
                    <div className="mt-3 rounded-lg border border-white/10 bg-black/30 p-3 text-slate-300 text-xs sm:text-sm">
                      <p className="mb-1">
                        Refer 10 Growth users →{" "}
                        <span className="font-semibold text-white">
                          £198/mo
                        </span>{" "}
                        recurring
                      </p>
                      <p>
                        Refer 10 Team users →{" "}
                        <span className="font-semibold text-white">
                          £398/mo
                        </span>{" "}
                        recurring
                      </p>
                    </div>
                  </div>
                  <a
                    href="#apply"
                    className="mt-5 inline-flex w-full justify-center rounded-xl bg-gradient-to-r from-accent-blue to-accent-violet px-4 py-2 font-semibold text-sm"
                  >
                    Start Earning
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHY JOIN */}
        <section id="why" className="relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="max-w-2xl">
              <h2 className="text-2xl sm:text-3xl font-bold">Why join now</h2>
              <p className="mt-3 text-sm sm:text-base text-slate-300">
                Be an early partner in a fast-growing SaaS platform. Your
                audience gets a tool that works. You get predictable, recurring
                income.
              </p>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-base-700/50 p-6">
                <div className="mb-3 text-accent-blue">
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M12 3v18M3 12h18" />
                  </svg>
                </div>
                <h3 className="font-semibold">20% recurring</h3>
                <p className="mt-2 text-slate-300">
                  Earn every month your referrals stay subscribed. No caps, no
                  expiry.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-base-700/50 p-6">
                <div className="mb-3 text-accent-blue">
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M3 12l6 6L21 6" />
                  </svg>
                </div>
                <h3 className="font-semibold">High conversion</h3>
                <p className="mt-2 text-slate-300">
                  Real value: verified contacts, AI pitch templates,
                  export-ready lists.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-base-700/50 p-6">
                <div className="mb-3 text-accent-blue">
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 3" />
                  </svg>
                </div>
                <h3 className="font-semibold">Fast setup</h3>
                <p className="mt-2 text-slate-300">
                  Unique link, ready-made assets, and a dashboard with live
                  stats.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-base-700/50 p-6">
                <div className="mb-3 text-accent-blue">
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M12 2l3 7h7l-5.5 4 2 7L12 17l-6.5 3 2-7L2 9h7z" />
                  </svg>
                </div>
                <h3 className="font-semibold">Founder support</h3>
                <p className="mt-2 text-slate-300">
                  Get priority help, feature input, and co-marketing for top
                  partners.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* EARNINGS CALCULATOR */}
        <section id="earnings" className="relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="max-w-2xl">
              <h2 className="text-2xl sm:text-3xl font-bold">
                Affiliate earnings calculator
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-300">
                See what you'll earn with{" "}
                <span className="font-semibold text-white">
                  20% recurring commission
                </span>
                . Adjust your expected active referrals by plan.
              </p>
            </div>

            <div className="mt-6 sm:mt-8 grid gap-4 sm:gap-6 lg:grid-cols-12">
              {/* Controls */}
              <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-base-700/60 p-4 sm:p-6 shadow-glow">
                {/* Starter */}
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    <label htmlFor="refStarter" className="block font-medium">
                      Starter (£45/mo)
                    </label>
                    <div className="text-sm text-slate-400">
                      Active referrals:{" "}
                      <span
                        id="valStarter"
                        className="text-slate-200 font-semibold"
                      >
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
                    className="w-full mt-3 h-2 rounded-lg appearance-none bg-white/10 accent-current"
                  />
                  <div className="mt-2 flex gap-2 text-xs">
                    <button
                      onClick={() => handlePreset("starter", "1")}
                      className="preset badge"
                    >
                      +1
                    </button>
                    <button
                      onClick={() => handlePreset("starter", "5")}
                      className="preset badge"
                    >
                      +5
                    </button>
                    <button
                      onClick={() => handlePreset("starter", "10")}
                      className="preset badge"
                    >
                      +10
                    </button>
                    <button
                      onClick={() => handlePreset("starter", "reset")}
                      className="preset badge"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {/* Growth */}
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    <label htmlFor="refGrowth" className="block font-medium">
                      Growth (£99/mo){" "}
                      <span className="ml-2 rounded-full bg-accent-blue/20 px-2 py-0.5 text-xs text-accent-blue">
                        Most popular
                      </span>
                    </label>
                    <div className="text-sm text-slate-400">
                      Active referrals:{" "}
                      <span
                        id="valGrowth"
                        className="text-slate-200 font-semibold"
                      >
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
                    className="w-full mt-3 h-2 rounded-lg appearance-none bg-white/10 accent-current"
                  />
                  <div className="mt-2 flex gap-2 text-xs">
                    <button
                      onClick={() => handlePreset("growth", "1")}
                      className="preset badge"
                    >
                      +1
                    </button>
                    <button
                      onClick={() => handlePreset("growth", "5")}
                      className="preset badge"
                    >
                      +5
                    </button>
                    <button
                      onClick={() => handlePreset("growth", "10")}
                      className="preset badge"
                    >
                      +10
                    </button>
                    <button
                      onClick={() => handlePreset("growth", "reset")}
                      className="preset badge"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {/* Team */}
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    <label htmlFor="refTeam" className="block font-medium">
                      Team (£199/mo)
                    </label>
                    <div className="text-sm text-slate-400">
                      Active referrals:{" "}
                      <span
                        id="valTeam"
                        className="text-slate-200 font-semibold"
                      >
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
                    className="w-full mt-3 h-2 rounded-lg appearance-none bg-white/10 accent-current"
                  />
                  <div className="mt-2 flex gap-2 text-xs">
                    <button
                      onClick={() => handlePreset("team", "1")}
                      className="preset badge"
                    >
                      +1
                    </button>
                    <button
                      onClick={() => handlePreset("team", "5")}
                      className="preset badge"
                    >
                      +5
                    </button>
                    <button
                      onClick={() => handlePreset("team", "10")}
                      className="preset badge"
                    >
                      +10
                    </button>
                    <button
                      onClick={() => handlePreset("team", "reset")}
                      className="preset badge"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {/* Annual toggle */}
                <div className="mt-6 flex items-center gap-3">
                  <span className="text-sm text-slate-400">
                    Show annual estimate
                  </span>
                  <button
                    onClick={() => setShowAnnual(!showAnnual)}
                    className="relative inline-flex h-7 w-12 items-center rounded-full bg-white/10"
                  >
                    <span
                      id="annualDot"
                      className={`inline-block h-5 w-5 translate-x-1 rounded-full bg-white transition ${
                        showAnnual ? "ml-6" : ""
                      }`}
                    ></span>
                  </button>
                </div>

                <p className="mt-3 text-xs text-slate-400">
                  * Estimates assume{" "}
                  <span className="font-semibold text-slate-300">
                    20% recurring commission
                  </span>{" "}
                  on live subscriptions. Actual results vary by audience and
                  promotion.
                </p>
              </div>

              {/* Results */}
              <div className="lg:col-span-5 rounded-2xl border border-white/10 bg-base-700/60 p-4 sm:p-6 shadow-glow">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-red-500/70"></span>
                    <span className="h-2 w-2 rounded-full bg-yellow-400/70"></span>
                    <span className="h-2 w-2 rounded-full bg-emerald-400/70"></span>
                  </div>
                  <span className="truncate">Earnings Preview</span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="rounded-xl border border-white/10 bg-black/30 p-3 sm:p-4">
                    <div className="text-[10px] sm:text-xs uppercase tracking-wide text-slate-400">
                      Monthly
                    </div>
                    <div
                      id="outMonthly"
                      className={`mt-1 text-xl sm:text-2xl lg:text-3xl font-extrabold break-all ${
                        showAnnual ? "text-slate-400" : "text-white"
                      }`}
                    >
                      {currency(monthly)}
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/30 p-3 sm:p-4">
                    <div className="text-[10px] sm:text-xs uppercase tracking-wide text-slate-400">
                      Annual
                    </div>
                    <div
                      id="outAnnual"
                      className={`mt-1 text-xl sm:text-2xl lg:text-3xl font-extrabold break-all ${
                        showAnnual ? "text-white" : "text-slate-400"
                      }`}
                    >
                      {currency(annual)}
                    </div>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="mt-4 sm:mt-6 rounded-xl border border-white/10 bg-black/20 p-3 sm:p-4">
                  <div className="text-xs sm:text-sm font-semibold">
                    Breakdown
                  </div>
                  <ul className="mt-2 space-y-1 text-xs sm:text-sm text-slate-300">
                    <li className="break-all">
                      Starter:{" "}
                      <span
                        id="breakStarter"
                        className="font-semibold text-white"
                      >
                        {currency(earnS)}/mo
                      </span>
                    </li>
                    <li className="break-all">
                      Growth:{" "}
                      <span
                        id="breakGrowth"
                        className="font-semibold text-white"
                      >
                        {currency(earnG)}/mo
                      </span>
                    </li>
                    <li className="break-all">
                      Team:{" "}
                      <span id="breakTeam" className="font-semibold text-white">
                        {currency(earnT)}/mo
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Progress bars */}
                <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
                  <div className="text-[10px] sm:text-xs text-slate-400">
                    Relative earnings by tier
                  </div>

                  <div className="h-2 rounded bg-white/10">
                    <div
                      id="barStarter"
                      className="h-2 rounded bg-white/40"
                      style={{ width: `${(earnS / max) * 100}%` }}
                    ></div>
                  </div>
                  <div className="h-2 rounded bg-white/10">
                    <div
                      id="barGrowth"
                      className="h-2 rounded bg-accent-blue/70"
                      style={{ width: `${(earnG / max) * 100}%` }}
                    ></div>
                  </div>
                  <div className="h-2 rounded bg-white/10">
                    <div
                      id="barTeam"
                      className="h-2 rounded bg-accent-violet/70"
                      style={{ width: `${(earnT / max) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <a
                  href="#apply"
                  className="mt-4 sm:mt-6 inline-flex w-full justify-center rounded-xl bg-gradient-to-r from-accent-blue to-accent-violet px-4 py-2 text-sm sm:text-base font-semibold"
                >
                  Apply & start earning
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT YOU'RE PROMOTING */}
        <section id="promote" className="relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="max-w-2xl">
              <h2 className="text-2xl sm:text-3xl font-bold">
                What you're promoting
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-300">
                ContactJournalists.com helps founders get press without
                expensive retainers.
              </p>
            </div>
            <div className="mt-8 sm:mt-10 grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <article className="rounded-2xl border border-white/10 bg-base-700/50 p-4 sm:p-6 hover:bg-white/5 transition">
                <h3 className="font-semibold text-sm sm:text-base">
                  Verified Contacts
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-300">
                  Global database of journalists, influencers, and anyone with a
                  platform — cleaned and deduped.
                </p>
              </article>
              <article className="rounded-2xl border border-white/10 bg-base-700/50 p-4 sm:p-6 hover:bg-white/5 transition">
                <h3 className="font-semibold text-sm sm:text-base">
                  AI Pitch Generator
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-300">
                  Angles and subject lines that actually get opened.
                </p>
              </article>
              <article className="rounded-2xl border border-white/10 bg-base-700/50 p-4 sm:p-6 hover:bg-white/5 transition">
                <h3 className="font-semibold text-sm sm:text-base">
                  Smart Exports
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-300">
                  Google Sheets & CSV with notes and easy follow-up flows.
                </p>
              </article>
              <article className="rounded-2xl border border-white/10 bg-base-700/50 p-4 sm:p-6 hover:bg-white/5 transition">
                <h3 className="font-semibold text-sm sm:text-base">
                  Reply Templates
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-300">
                  Faster responses to journalist tweets and press queries.
                </p>
              </article>
              <article className="rounded-2xl border border-white/10 bg-base-700/50 p-4 sm:p-6 hover:bg-white/5 transition">
                <h3 className="font-semibold text-sm sm:text-base">
                  GDPR-respectful
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-300">
                  We respect inboxes. Export responsibly and honor opt-outs.
                </p>
              </article>
              <article className="rounded-2xl border border-white/10 bg-base-700/50 p-4 sm:p-6 hover:bg-white/5 transition">
                <h3 className="font-semibold text-sm sm:text-base">
                  Built in The UK
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-300">
                  Founder-led, responsive support, early feature access.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* WHO IT'S FOR + HOW IT WORKS */}
        <section id="how" className="relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
              <div className="lg:col-span-6">
                <h2 className="text-2xl sm:text-3xl font-bold">
                  Who it's perfect for
                </h2>
                <ul className="mt-6 space-y-3 text-sm sm:text-base text-slate-300">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent-blue"></span>{" "}
                    Newsletter writers and business creators
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent-blue"></span>{" "}
                    Marketing coaches and PR agencies
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent-blue"></span>{" "}
                    Startup community owners and growth consultants
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent-blue"></span>{" "}
                    LinkedIn educators and YouTube creators
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent-blue"></span>{" "}
                    Founders recommending tools they actually use
                  </li>
                </ul>
              </div>
              <div className="lg:col-span-6">
                <h2 className="text-2xl sm:text-3xl font-bold">How it works</h2>
                <ol className="mt-6 space-y-3 text-sm sm:text-base text-slate-300 list-decimal list-inside">
                  <li>
                    <span className="font-semibold text-white">Apply</span>{" "}
                    using the form below (free to join).
                  </li>
                  <li>
                    <span className="font-semibold text-white">
                      Get your unique link
                    </span>{" "}
                    and ready-to-use assets.
                  </li>
                  <li>
                    <span className="font-semibold text-white">Share</span> in
                    newsletters, socials, client docs, or trainings.
                  </li>
                  <li>
                    <span className="font-semibold text-white">
                      Earn 20% monthly
                    </span>{" "}
                    for every active subscriber you refer.
                  </li>
                </ol>
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-slate-300">
                    ✨{" "}
                    <span className="font-semibold text-white">
                      Early Partner Advantage:
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
        <section id="apply" className="relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl sm:text-3xl font-bold">Apply to join</h2>
              <p className="mt-3 text-sm sm:text-base text-slate-300">
                We approve partners who genuinely help founders and growing
                brands.
              </p>
            </div>

            {/* Custom Styled Form */}
            <div className="mx-auto mt-6 sm:mt-8 max-w-xl">
              <div className="rounded-2xl border border-white/10 bg-base-700/60 p-4 sm:p-8 shadow-glow">
                <h3 className="text-base sm:text-lg font-semibold mb-2">
                  Affiliates: Turn those links into 20% revenue!
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mb-4 sm:mb-6">
                  Enter your email address to find out when we launch
                  <span className="text-red-400">*</span>
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
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm placeholder:text-slate-500 focus:outline-none focus-visible:outline-2 focus-visible:outline-accent-blue focus-visible:outline-offset-2 disabled:opacity-50"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-xl bg-gradient-to-r from-accent-blue to-accent-violet px-6 py-3 font-semibold text-white shadow-glow hover:opacity-95 transition-opacity disabled:opacity-50"
                  >
                    {isSubmitting ? "SUBSCRIBING..." : "SUBSCRIBE"}
                  </button>

                  {submitMessage && (
                    <p
                      className={`text-sm text-center ${
                        submitMessage.startsWith("✓")
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {submitMessage}
                    </p>
                  )}
                </form>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-slate-400">
                We'll reply within 2 business days. By applying you agree to our{" "}
                <a
                  href="#"
                  className="underline decoration-dotted underline-offset-4"
                >
                  terms
                </a>
                .
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-center">
                Affiliate FAQ
              </h2>
              <div className="mt-8 divide-y divide-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <details className="group open:bg-white/5">
                  <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-left font-medium hover:bg-white/5">
                    Is 20% really recurring?
                    <span className="ml-4 text-slate-400 group-open:rotate-180 transition">
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
                  <div className="px-5 pb-5 text-slate-300">
                    Yes. You earn 20% every month your referral remains
                    subscribed. It's not a one-time bounty.
                  </div>
                </details>
                <details className="group">
                  <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-left font-medium hover:bg-white/5">
                    How do I get paid?
                    <span className="ml-4 text-slate-400 group-open:rotate-180 transition">
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
                  <div className="px-5 pb-5 text-slate-300">
                    Monthly via Stripe or PayPal. Your dashboard shows live
                    clicks, trials, and conversions.
                  </div>
                </details>
                <details className="group">
                  <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-left font-medium hover:bg-white/5">
                    Any promotion rules?
                    <span className="ml-4 text-slate-400 group-open:rotate-180 transition">
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
                  <div className="px-5 pb-5 text-slate-300">
                    Be honest. Don't run misleading ads. Disclose affiliate
                    links where required. Keep it GDPR-friendly.
                  </div>
                </details>
                <details className="group">
                  <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-left font-medium hover:bg-white/5">
                    Do you offer custom deals for big partners?
                    <span className="ml-4 text-slate-400 group-open:rotate-180 transition">
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
                  <div className="px-5 pb-5 text-slate-300">
                    Yes. If you can drive meaningful volume, we'll discuss
                    tiered rates and co-marketing.
                  </div>
                </details>
              </div>
            </div>
          </div>
        </section>

        {/* CTA STRIP */}
        <section className="border-t border-white/5 bg-gradient-to-r from-accent-blue/10 to-accent-violet/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-200">
              Ready to partner with a tool founders love?{" "}
              <span className="text-slate-400">
                Earn 20% recurring for every referral.
              </span>
            </p>
            <a
              href="#apply"
              className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 font-semibold hover:bg-white/10"
            >
              Apply to the Affiliate Program
            </a>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 text-sm">
          <div>
            <div className="font-extrabold text-lg">
              Contact<span className="text-slate-400">Journalists</span>
            </div>
            <p className="mt-3 text-slate-400">
              Made in London. GDPR-respectful outreach.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Product</h3>
            <ul className="mt-3 space-y-2 text-slate-300">
              <li>
                <a
                  className="hover:underline underline-offset-4"
                  href="/#features"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  className="hover:underline underline-offset-4"
                  href="/#pricing"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a className="hover:underline underline-offset-4" href="#">
                  Roadmap
                </a>
              </li>
              <li>
                <a className="hover:underline underline-offset-4" href="#">
                  Changelog
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Company</h3>
            <ul className="mt-3 space-y-2 text-slate-300">
              <li>
                <a className="hover:underline underline-offset-4" href="#">
                  About
                </a>
              </li>
              <li>
                <a className="hover:underline underline-offset-4" href="#">
                  Careers
                </a>
              </li>
              <li>
                <a
                  className="hover:underline underline-offset-4"
                  href="mailto:hello@contactjournalists.com"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Resources</h3>
            <ul className="mt-3 space-y-2 text-slate-300">
              <li>
                <a className="hover:underline underline-offset-4" href="#faq">
                  Affiliate FAQ
                </a>
              </li>
              <li>
                <a className="hover:underline underline-offset-4" href="#">
                  Press Kit
                </a>
              </li>
              <li>
                <a className="hover:underline underline-offset-4" href="#">
                  Privacy
                </a>
              </li>
              <li>
                <a className="hover:underline underline-offset-4" href="#">
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <p>
              © {new Date().getFullYear()} ContactJournalists.com · London, UK
            </p>
            <a className="hover:underline underline-offset-4" href="/">
              Back to Home
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
