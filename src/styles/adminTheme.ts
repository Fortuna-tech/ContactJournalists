/**
 * Admin Theme - Matches homepage styling exactly
 * Tokens extracted from src/pages/Index.tsx
 *
 * STYLING ONLY - Do not add any logic, data fetching, or routing here.
 */

export const adminTheme = {
  // Page wrapper (applied by AdminLayout)
  page: "min-h-screen bg-[#F5F5DC] text-slate-800 antialiased",
  bodyStyle: { fontFamily: "'DM Sans', sans-serif" } as React.CSSProperties,

  // Main content area
  content: "flex-1 p-6 sm:p-8",
  container: "mx-auto max-w-6xl",

  // Page header
  pageHeader: "mb-8",
  pageTitle: "text-3xl font-normal text-black mb-2",
  pageTitleStyle: { fontFamily: "'Caprasimo', cursive" } as React.CSSProperties,
  pageSubtitle: "text-slate-500",

  // Cards / Panels
  card: "bg-[#F5F5DC] border-2 border-black rounded-2xl",
  cardWithShadow: "bg-[#F5F5DC] border-2 border-black rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]",
  cardPad: "p-6",
  cardHeader: "pb-4 border-b border-black/10 mb-4",
  cardTitle: "text-lg font-semibold text-black",
  cardHover: "hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-150",

  // Buttons
  primaryBtn: "inline-flex items-center justify-center rounded-full bg-[#D8B4FE] px-5 py-2.5 text-sm font-semibold text-black border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] transition-all duration-150",
  secondaryBtn: "inline-flex items-center justify-center rounded-full bg-[#F5F5DC] px-5 py-2.5 text-sm font-semibold text-black border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] transition-all duration-150",
  outlineBtn: "inline-flex items-center justify-center rounded-full bg-transparent px-5 py-2.5 text-sm font-semibold text-black border-2 border-black hover:bg-black/5 transition-colors",
  iconBtn: "inline-flex items-center justify-center rounded-full bg-[#F5F5DC] p-2.5 text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-150",
  dangerBtn: "inline-flex items-center justify-center rounded-full bg-red-100 px-5 py-2.5 text-sm font-semibold text-red-700 border-2 border-red-500 hover:bg-red-200 transition-colors",

  // Inputs
  input: "w-full bg-white/50 border-2 border-black rounded-xl px-4 py-2.5 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all",
  inputWithIcon: "pl-10",
  inputLabel: "block text-sm font-medium text-black mb-1.5",
  inputError: "text-sm text-red-600 mt-1",

  // Tables
  tableWrapper: "border-2 border-black rounded-2xl overflow-hidden",
  tableHeader: "bg-white/30",
  tableHeaderCell: "text-black font-semibold text-sm",
  tableRow: "border-b border-black/10 hover:bg-white/30 transition-colors",
  tableCell: "text-slate-600",

  // Badges
  badge: "inline-flex items-center rounded-full bg-purple-100 border border-purple-200 px-2.5 py-0.5 text-xs font-semibold text-purple-700",
  badgeSuccess: "inline-flex items-center rounded-full bg-green-100 border border-green-300 px-2.5 py-0.5 text-xs font-semibold text-green-700",
  badgeWarning: "inline-flex items-center rounded-full bg-yellow-100 border border-yellow-300 px-2.5 py-0.5 text-xs font-semibold text-yellow-700",
  badgeError: "inline-flex items-center rounded-full bg-red-100 border border-red-300 px-2.5 py-0.5 text-xs font-semibold text-red-700",
  badgeNeutral: "inline-flex items-center rounded-full bg-slate-100 border border-slate-300 px-2.5 py-0.5 text-xs font-semibold text-slate-600",

  // Sidebar
  sidebar: "bg-[#F5F5DC] border-r-2 border-black",
  sidebarHeader: "flex items-center gap-2 px-4 py-4 border-b border-black/10",
  sidebarTitle: "text-lg font-semibold text-black",
  sidebarIcon: "h-5 w-5 text-purple-600",
  sidebarItem: "flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-white/50 hover:text-black rounded-xl mx-2 transition-colors",
  sidebarItemActive: "flex items-center gap-3 px-4 py-3 bg-[#D8B4FE] text-black font-medium rounded-xl mx-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
  sidebarItemText: "text-sm",

  // Alerts / Messages
  alert: "border-2 border-black rounded-2xl p-4",
  alertSuccess: "bg-green-50 border-green-500",
  alertWarning: "bg-yellow-50 border-yellow-500",
  alertError: "bg-red-50 border-red-500",
  alertInfo: "bg-purple-50 border-purple-500",

  // Loading states
  loadingSpinner: "animate-spin rounded-full h-6 w-6 border-2 border-black border-t-transparent",
  loadingContainer: "flex items-center justify-center py-12",

  // Empty states
  emptyState: "text-center py-12 text-slate-500",

  // Links
  link: "text-purple-600 hover:text-purple-700 hover:underline transition-colors",

  // Stats / Metrics
  statCard: "bg-[#F5F5DC] border-2 border-black rounded-2xl p-6",
  statValue: "text-3xl font-bold text-black",
  statLabel: "text-sm text-slate-500 mt-1",

  // Pagination
  paginationBtn: "inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-white/50 hover:text-black transition-colors",
  paginationBtnActive: "inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm bg-[#D8B4FE] text-black font-medium border-2 border-black",
};

// Font loader for admin pages
export const loadAdminFonts = () => {
  const link = document.createElement("link");
  link.href =
    "https://fonts.googleapis.com/css2?family=Caprasimo&family=DM+Sans:wght@400;500;600;700&display=swap";
  link.rel = "stylesheet";
  document.head.appendChild(link);
  return () => {
    document.head.removeChild(link);
  };
};
