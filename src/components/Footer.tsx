import { Link } from "react-router-dom";

/**
 * Shared footer links configuration
 * Labels in normal case, no dashes, using absolute paths
 */
export const FOOTER_LINKS = [
  { label: "Privacy policy", href: "/privacy-policy" },
  { label: "Privacy & data", href: "/privacy-and-data" },
  { label: "Cookie policy", href: "/cookie-policy" },
  { label: "Terms of service", href: "/terms-of-service" },
  { label: "Request removal", href: "/request-removal" },
] as const;

interface FooterProps {
  /** Optional: use minimal variant for dashboards */
  variant?: "full" | "minimal";
}

/**
 * Shared Footer component used site-wide
 * - Homepage: full variant with Product + Legal sections
 * - Dashboards & Blog: minimal variant with legal links only
 */
const Footer = ({ variant = "minimal" }: FooterProps) => {
  if (variant === "full") {
    return (
      <footer className="relative border-t border-black/10 bg-[#F5F5DC]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid gap-6 sm:gap-8 grid-cols-2 lg:grid-cols-3">
            <div className="col-span-2 lg:col-span-1">
              <a
                href="/"
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
                  <a className="hover:text-black" href="#features">
                    Features
                  </a>
                </li>
                <li>
                  <a className="hover:text-black" href="#pricing">
                    Pricing
                  </a>
                </li>
                <li>
                  <a className="hover:text-black" href="#blog">
                    Blog
                  </a>
                </li>
                <li>
                  <a className="hover:text-black" href="/affiliates">
                    Affiliates
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-xs sm:text-sm text-black">Legal</h4>
              <ul className="mt-2 sm:mt-3 space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-slate-600">
                {FOOTER_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link className="hover:text-black" to={link.href}>
                      {link.label}
                    </Link>
                  </li>
                ))}
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
    );
  }

  // Minimal variant for dashboards and blog pages
  return (
    <footer className="border-t border-black/10 bg-[#F5F5DC] p-6 mt-auto">
      <div className="container mx-auto">
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
        <div className="text-center text-xs sm:text-sm text-slate-600">
          <p className="mb-1">
            Questions?{" "}
            <a
              href="mailto:hello@contactjournalists.com"
              className="text-purple-600 hover:underline"
            >
              hello@contactjournalists.com
            </a>
          </p>
          <p>© 2026 ContactJournalists.com. Built in London with ☕️</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
