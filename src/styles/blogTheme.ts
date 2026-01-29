/**
 * Blog Theme - Matches homepage styling exactly
 * Tokens extracted from src/pages/Index.tsx
 * 
 * STYLING ONLY - Do not add any logic, data fetching, or routing here.
 */

export const blogTheme = {
  // Page wrapper
  page: "min-h-screen bg-[#F5F5DC] text-slate-800 antialiased selection:bg-purple-200 selection:text-purple-900",
  
  // Header
  header: "sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-[#F5F5DC]/90 border-b border-black/5",
  headerNav: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16",
  logo: "flex items-center gap-2 font-extrabold text-lg tracking-tight text-black",
  logoIcon: "inline-block h-2.5 w-2.5 rounded-sm bg-gradient-to-br from-purple-500 to-violet-600",
  logoText: "text-slate-500",
  navLink: "flex items-center gap-2 text-sm text-slate-600 hover:text-black transition-colors",
  
  // Containers
  container: "mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8",
  containerWide: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
  
  // Cards
  card: "bg-[#F5F5DC] border-2 border-black rounded-2xl",
  cardWithShadow: "bg-[#F5F5DC] border-2 border-black rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]",
  cardPad: "p-6 sm:p-8",
  cardHover: "hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-150",
  
  // Typography - Headings (Caprasimo)
  h1: "text-3xl md:text-4xl font-normal text-black mb-6",
  h1Style: { fontFamily: "'Caprasimo', cursive" } as React.CSSProperties,
  h2: "text-2xl md:text-3xl font-normal text-black mb-4",
  h2Style: { fontFamily: "'Caprasimo', cursive" } as React.CSSProperties,
  h3: "text-xl md:text-2xl font-normal text-black mb-3",
  h3Style: { fontFamily: "'Caprasimo', cursive" } as React.CSSProperties,
  
  // Typography - Body (DM Sans loaded via page)
  bodyStyle: { fontFamily: "'DM Sans', sans-serif" } as React.CSSProperties,
  bodyText: "text-slate-600",
  mutedText: "text-slate-500 text-sm",
  
  // Article meta row
  metaRow: "flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-4",
  metaDivider: "text-slate-400",
  
  // Article border
  articleHeaderBorder: "border-b border-black/10 pb-6 mb-8",
  
  // Prose container for markdown/HTML content (beige-friendly, homepage-matched)
  prose: "prose prose-lg max-w-none prose-headings:text-black prose-headings:font-normal prose-p:text-slate-600 prose-a:text-black prose-a:underline prose-a:decoration-black/40 hover:prose-a:decoration-black prose-strong:text-black prose-blockquote:border-2 prose-blockquote:border-black prose-blockquote:border-l-4 prose-blockquote:border-l-purple-500 prose-blockquote:rounded-r-2xl prose-blockquote:bg-purple-50/50 prose-blockquote:text-slate-700 prose-blockquote:pl-6 prose-blockquote:pr-4 prose-blockquote:py-4 prose-blockquote:not-italic prose-code:text-purple-700 prose-code:bg-purple-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:border prose-code:border-purple-200 prose-pre:bg-slate-900 prose-pre:text-slate-200 prose-pre:border-2 prose-pre:border-black prose-pre:rounded-2xl prose-pre:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] prose-li:text-slate-600 prose-li:marker:text-slate-400 prose-img:border-2 prose-img:border-black prose-img:rounded-2xl",
  
  // Links
  link: "text-purple-600 hover:text-purple-700 hover:underline transition-colors",
  linkSubtle: "text-slate-600 hover:text-black transition-colors",
  
  // Buttons
  primaryBtn: "inline-flex items-center justify-center rounded-full bg-[#D8B4FE] px-5 py-3 text-sm font-semibold text-black border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] transition-all duration-150",
  secondaryBtn: "inline-flex items-center justify-center rounded-full bg-[#F5F5DC] px-5 py-3 text-sm font-semibold text-black border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] transition-all duration-150",
  
  // Badges / Tags
  badge: "inline-flex items-center rounded-full bg-purple-100 border border-purple-200 px-3 py-1 text-xs font-semibold text-purple-700 uppercase tracking-wide",
  badgeNew: "inline-flex items-center rounded-full bg-green-100 border border-green-200 px-2 py-0.5 text-xs font-bold text-green-700 uppercase",
  badgeCategory: "text-xs font-semibold text-purple-600 uppercase tracking-wide",
  
  // Footer
  footer: "border-t border-black/10 bg-[#F5F5DC]",
  footerInner: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12",
  footerText: "text-sm text-slate-600",
  footerLink: "text-purple-600 hover:underline",
  
  // Guide cards (for Guides.tsx listing)
  guideCard: "bg-[#F5F5DC] border-2 border-black rounded-2xl p-6 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-150",
  guideCardFeatured: "bg-[#F5F5DC] border-2 border-purple-500 rounded-2xl p-6 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-150",
  
  // Search input (for Guides.tsx)
  searchInput: "w-full pl-12 pr-4 py-4 rounded-2xl bg-white/50 border-2 border-black text-black placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all",
  
  // Category pills (for Guides.tsx)
  categoryPill: "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
  categoryPillActive: "bg-[#D8B4FE] text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
  categoryPillInactive: "bg-white/50 text-slate-600 border-2 border-black/20 hover:bg-white hover:text-black",
};

// Font loader snippet - add to useEffect in blog pages
export const loadBlogFonts = () => {
  const link = document.createElement("link");
  link.href =
    "https://fonts.googleapis.com/css2?family=Caprasimo&family=DM+Sans:wght@400;500;600;700&display=swap";
  link.rel = "stylesheet";
  document.head.appendChild(link);
  return () => {
    document.head.removeChild(link);
  };
};
