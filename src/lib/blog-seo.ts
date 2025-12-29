/**
 * Calculate SEO score for a blog post based on content analysis
 */
export interface BlogSEOData {
  title: string;
  metaDescription?: string;
  content: string;
  h1Count: number;
  h2Count: number;
  internalLinks: number;
  externalLinks: number;
  wordCount: number;
}

export function calculateSEOScore(data: BlogSEOData): number {
  let score = 0;

  // Title length 50-60 characters = +20
  const titleLength = data.title.length;
  if (titleLength >= 50 && titleLength <= 60) {
    score += 20;
  }

  // Meta description present = +20
  if (data.metaDescription && data.metaDescription.trim().length > 0) {
    score += 20;
  }

  // H1 present = +10
  if (data.h1Count > 0) {
    score += 10;
  }

  // At least 5 H2 headings = +15
  if (data.h2Count >= 5) {
    score += 15;
  }

  // Word count > 1,500 = +15
  if (data.wordCount > 1500) {
    score += 15;
  }

  // At least 3 internal links = +10
  if (data.internalLinks >= 3) {
    score += 10;
  }

  // At least 2 external links = +10
  if (data.externalLinks >= 2) {
    score += 10;
  }

  return Math.min(score, 100); // Cap at 100
}

/**
 * Extract SEO data from blog content (HTML/JSX string)
 */
export function extractSEOData(
  title: string,
  metaDescription: string | undefined,
  content: string
): BlogSEOData {
  // Count words (simple word count)
  const wordCount = content
    .replace(/<[^>]*>/g, " ") // Remove HTML tags
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  // Count headings (handle both HTML and JSX patterns)
  const h1Matches = content.match(/<h1[^>]*>|<h1\s/gi) || [];
  const h2Matches = content.match(/<h2[^>]*>|<h2\s/gi) || [];
  
  // Also check for JSX className patterns that might indicate headings
  const h1ClassMatches = content.match(/className=["'][^"']*text-[^"']*h1|text-[234]xl[^"']*["']/gi) || [];
  const h2ClassMatches = content.match(/className=["'][^"']*text-[^"']*h2|text-xl[^"']*["']/gi) || [];

  // Count internal links (links to /blog/ or relative paths, handle both HTML and JSX)
  const internalLinkMatches =
    content.match(/href=["'](\/blog\/[^"']+|#[^"']+)["']|to=["'](\/blog\/[^"']+)["']/gi) || [];

  // Count external links (http/https, handle both HTML and JSX)
  const externalLinkMatches =
    content.match(/href=["']https?:\/\/[^"']+["']/gi) || [];

  return {
    title,
    metaDescription,
    content,
    h1Count: Math.max(h1Matches.length, h1ClassMatches.length > 0 ? 1 : 0),
    h2Count: h2Matches.length + Math.floor(h2ClassMatches.length / 2), // Approximate H2 count from class names
    internalLinks: internalLinkMatches.length,
    externalLinks: externalLinkMatches.length,
    wordCount,
  };
}

