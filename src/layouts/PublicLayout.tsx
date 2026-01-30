import { useEffect, useState, ReactNode } from "react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import { blogTheme, loadBlogFonts } from "@/styles/blogTheme";

interface PublicLayoutProps {
  children: ReactNode;
}

/**
 * PublicLayout - Shared wrapper for public pages (legal, etc.)
 * 
 * Includes:
 * - Site header with navigation (matches homepage/blog)
 * - Footer
 * - Font loading
 * 
 * LAYOUT ONLY - Does not touch routing, data fetching, or SEO.
 */
const PublicLayout = ({ children }: PublicLayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    return loadBlogFonts();
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className={blogTheme.page} style={blogTheme.bodyStyle}>
      {/* Header - matches homepage navigation */}
      <header className={blogTheme.header}>
        <nav className={blogTheme.headerNav}>
          <Link to="/" className={blogTheme.logo}>
            <span className={blogTheme.logoIcon}></span>
            Contact<span className={blogTheme.logoText}>Journalists</span>
          </Link>
          
          {/* Mobile menu toggle */}
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

          {/* Desktop navigation */}
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
              <a className="hover:text-black text-slate-600" href="/#blog">
                Blog
              </a>
            </li>
            <li>
              <a className="hover:text-black text-slate-600" href="/#faq">
                FAQ
              </a>
            </li>
            <li>
              <Link className="hover:text-black text-slate-600" to="/affiliates">
                Affiliates
              </Link>
            </li>
            <li>
              <Link className="hover:text-black text-slate-600" to="/auth">
                Login
              </Link>
            </li>
            <li>
              <Link
                className="ml-2 inline-flex items-center rounded-full bg-black px-4 py-2 font-semibold text-white hover:bg-black/90 transition-colors"
                to="/auth"
              >
                Get Started
              </Link>
            </li>
          </ul>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-[#F5F5DC] border-b border-black/5 shadow-xl z-50">
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
                href="/#blog"
                onClick={closeMobileMenu}
                className="block rounded-lg px-3 py-2 text-base font-medium text-slate-600 hover:bg-black/5 hover:text-black"
              >
                Blog
              </a>
              <a
                href="/#faq"
                onClick={closeMobileMenu}
                className="block rounded-lg px-3 py-2 text-base font-medium text-slate-600 hover:bg-black/5 hover:text-black"
              >
                FAQ
              </a>
              <Link
                to="/affiliates"
                onClick={closeMobileMenu}
                className="block rounded-lg px-3 py-2 text-base font-medium text-slate-600 hover:bg-black/5 hover:text-black"
              >
                Affiliates
              </Link>
              <Link
                to="/auth"
                onClick={closeMobileMenu}
                className="block rounded-lg px-3 py-2 text-base font-medium text-slate-600 hover:bg-black/5 hover:text-black"
              >
                Login
              </Link>
              <Link
                to="/auth"
                onClick={closeMobileMenu}
                className="mt-2 block rounded-full bg-black px-4 py-2.5 text-center font-semibold text-white hover:bg-black/90 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <Footer variant="full" />
    </div>
  );
};

export default PublicLayout;
