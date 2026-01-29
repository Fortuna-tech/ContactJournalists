import { useEffect, ReactNode } from "react";
import { loadBlogFonts, blogTheme } from "@/styles/blogTheme";

interface BlogLayoutProps {
  children: ReactNode;
}

/**
 * BlogLayout - Shared wrapper for all blog pages
 * 
 * Handles:
 * - Font loading (Caprasimo + DM Sans) - runs once per mount
 * - Page background and body styling
 * 
 * STYLING ONLY - Does not touch routing, data fetching, or SEO.
 */
const BlogLayout = ({ children }: BlogLayoutProps) => {
  useEffect(() => {
    return loadBlogFonts();
  }, []);

  return (
    <div className={blogTheme.page} style={blogTheme.bodyStyle}>
      {children}
    </div>
  );
};

export default BlogLayout;
