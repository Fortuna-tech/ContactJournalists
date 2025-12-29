/**
 * Comprehensive SEO scoring engine for blog posts
 * Implements the full SEO rubric with detailed breakdown
 */

export interface SEOBreakdown {
  meta: {
    score: number;
    max: number;
    items: {
      meta_title?: SEOItem;
      meta_description?: SEOItem;
      canonical?: SEOItem;
      open_graph?: SEOItem;
    };
  };
  url: {
    score: number;
    max: number;
    items: {
      clean_slug?: SEOItem;
      slug_length?: SEOItem;
      not_noindexed?: SEOItem;
    };
  };
  headings: {
    score: number;
    max: number;
    items: {
      h1?: SEOItem;
      h2_count?: SEOItem;
      heading_order?: SEOItem;
      toc?: SEOItem;
    };
  };
  content: {
    score: number;
    max: number;
    items: {
      word_count?: SEOItem;
      includes_example?: SEOItem;
      clear_intro?: SEOItem;
    };
  };
  internal_links: {
    score: number;
    max: number;
    items: {
      link_count?: SEOItem;
      money_page_link?: SEOItem;
      anchor_text?: SEOItem;
    };
  };
  images: {
    score: number;
    max: number;
    items: {
      has_images?: SEOItem;
      alt_text?: SEOItem;
      descriptive_alt?: SEOItem;
    };
  };
  readability: {
    score: number;
    max: number;
    items: {
      short_paragraphs?: SEOItem;
      has_lists?: SEOItem;
      clear_cta?: SEOItem;
    };
  };
  penalties: {
    score: number;
    items: {
      keyword_stuffing?: SEOItem;
      title_mismatch?: SEOItem;
      broken_links?: SEOItem;
      missing_dates?: SEOItem;
      no_subheadings_early?: SEOItem;
    };
  };
}

export interface SEOItem {
  score: number;
  max?: number;
  status: "green" | "amber" | "red";
  reason?: string;
}

export interface BlogSEOInput {
  title: string;
  slug: string;
  metaDescription?: string;
  content: string;
  publishDate?: string | null;
  lastUpdated?: string | null;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
}

export interface SEOResult {
  score: number;
  breakdown: SEOBreakdown;
  flags: string[];
}

/**
 * Calculate comprehensive SEO score
 */
export function calculateSEOScore(input: BlogSEOInput): SEOResult {
  const breakdown: SEOBreakdown = {
    meta: { score: 0, max: 20, items: {} },
    url: { score: 0, max: 10, items: {} },
    headings: { score: 0, max: 15, items: {} },
    content: { score: 0, max: 20, items: {} },
    internal_links: { score: 0, max: 15, items: {} },
    images: { score: 0, max: 10, items: {} },
    readability: { score: 0, max: 10, items: {} },
    penalties: { score: 0, items: {} },
  };

  const flags: string[] = [];

  // A) Core metadata (20 pts)
  scoreMetadata(input, breakdown.meta, flags);

  // B) URL & indexability (10 pts)
  scoreURL(input, breakdown.url, flags);

  // C) Structure & headings (15 pts)
  scoreHeadings(input, breakdown.headings, flags);

  // D) Content depth (20 pts)
  scoreContent(input, breakdown.content, flags);

  // E) Internal linking (15 pts)
  scoreInternalLinks(input, breakdown.internal_links, flags);

  // F) Images & accessibility (10 pts)
  scoreImages(input, breakdown.images, flags);

  // G) Readability & UX (10 pts)
  scoreReadability(input, breakdown.readability, flags);

  // Penalties
  scorePenalties(input, breakdown.penalties, flags);

  // Calculate total score
  const baseScore =
    breakdown.meta.score +
    breakdown.url.score +
    breakdown.headings.score +
    breakdown.content.score +
    breakdown.internal_links.score +
    breakdown.images.score +
    breakdown.readability.score;

  const penaltyScore = breakdown.penalties.score;
  const finalScore = Math.max(0, Math.min(100, baseScore + penaltyScore));

  return {
    score: finalScore,
    breakdown,
    flags,
  };
}

function scoreMetadata(
  input: BlogSEOInput,
  category: SEOBreakdown["meta"],
  flags: string[]
) {
  // Meta title present + length 40-60 chars: 6
  const titleLength = input.title.length;
  if (titleLength >= 40 && titleLength <= 60) {
    category.items.meta_title = {
      score: 6,
      max: 6,
      status: "green",
    };
    category.score += 6;
  } else if (titleLength > 0) {
    category.items.meta_title = {
      score: 3,
      max: 6,
      status: "amber",
      reason: `Title is ${titleLength} chars (recommended: 40-60)`,
    };
    category.score += 3;
    flags.push("meta_title_length");
  } else {
    category.items.meta_title = {
      score: 0,
      max: 6,
      status: "red",
      reason: "Missing meta title",
    };
    flags.push("missing_meta_title");
  }

  // Meta description present + length 120-160 chars: 6
  const descLength = input.metaDescription?.length || 0;
  if (descLength >= 120 && descLength <= 160) {
    category.items.meta_description = {
      score: 6,
      max: 6,
      status: "green",
    };
    category.score += 6;
  } else if (descLength > 0) {
    category.items.meta_description = {
      score: 3,
      max: 6,
      status: "amber",
      reason: `Description is ${descLength} chars (recommended: 120-160)`,
    };
    category.score += 3;
    flags.push("meta_description_length");
  } else {
    category.items.meta_description = {
      score: 0,
      max: 6,
      status: "red",
      reason: "Missing meta description",
    };
    flags.push("missing_meta_description");
  }

  // Canonical URL present: 4
  if (input.canonicalUrl) {
    category.items.canonical = {
      score: 4,
      max: 4,
      status: "green",
    };
    category.score += 4;
  } else {
    category.items.canonical = {
      score: 0,
      max: 4,
      status: "red",
      reason: "Missing canonical URL",
    };
    flags.push("missing_canonical");
  }

  // Open Graph title + description present: 4
  const hasOGTitle = !!input.ogTitle;
  const hasOGDesc = !!input.ogDescription;
  if (hasOGTitle && hasOGDesc) {
    category.items.open_graph = {
      score: 4,
      max: 4,
      status: "green",
    };
    category.score += 4;
  } else if (hasOGTitle || hasOGDesc) {
    category.items.open_graph = {
      score: 2,
      max: 4,
      status: "amber",
      reason: hasOGTitle ? "OG description missing" : "OG title missing",
    };
    category.score += 2;
    flags.push("incomplete_open_graph");
  } else {
    category.items.open_graph = {
      score: 0,
      max: 4,
      status: "red",
      reason: "Missing Open Graph tags",
    };
    flags.push("missing_open_graph");
  }
}

function scoreURL(
  input: BlogSEOInput,
  category: SEOBreakdown["url"],
  flags: string[]
) {
  // Clean slug (lowercase, hyphens): 4
  const isClean = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.slug);
  if (isClean) {
    category.items.clean_slug = {
      score: 4,
      max: 4,
      status: "green",
    };
    category.score += 4;
  } else {
    category.items.clean_slug = {
      score: 0,
      max: 4,
      status: "red",
      reason: "Slug contains invalid characters (use lowercase, hyphens only)",
    };
    flags.push("invalid_slug");
  }

  // Slug length 3-8 words: 2
  const wordCount = input.slug.split("-").length;
  if (wordCount >= 3 && wordCount <= 8) {
    category.items.slug_length = {
      score: 2,
      max: 2,
      status: "green",
    };
    category.score += 2;
  } else {
    category.items.slug_length = {
      score: 0,
      max: 2,
      status: "amber",
      reason: `Slug has ${wordCount} words (recommended: 3-8)`,
    };
    flags.push("slug_length");
  }

  // Not noindexed: 4 (assume not noindexed unless explicitly set)
  category.items.not_noindexed = {
    score: 4,
    max: 4,
    status: "green",
  };
  category.score += 4;
}

function scoreHeadings(
  input: BlogSEOInput,
  category: SEOBreakdown["headings"],
  flags: string[]
) {
  const content = input.content || "";

  // Count H1s
  const h1Matches = content.match(/<h1[^>]*>|text-[234]xl[^>]*font-bold/gi) || [];
  const h1Count = h1Matches.length;

  // Exactly one H1: 5
  if (h1Count === 1) {
    category.items.h1 = {
      score: 5,
      max: 5,
      status: "green",
    };
    category.score += 5;
  } else if (h1Count > 1) {
    category.items.h1 = {
      score: 2,
      max: 5,
      status: "amber",
      reason: `Found ${h1Count} H1s (should be exactly 1)`,
    };
    category.score += 2;
    flags.push("multiple_h1");
  } else {
    category.items.h1 = {
      score: 0,
      max: 5,
      status: "red",
      reason: "No H1 found",
    };
    flags.push("missing_h1");
  }

  // ≥4 H2s: 4
  const h2Matches = content.match(/<h2[^>]*>|text-xl[^>]*font-semibold/gi) || [];
  const h2Count = h2Matches.length;
  if (h2Count >= 4) {
    category.items.h2_count = {
      score: 4,
      max: 4,
      status: "green",
    };
    category.score += 4;
  } else if (h2Count >= 2) {
    category.items.h2_count = {
      score: 2,
      max: 4,
      status: "amber",
      reason: `Only ${h2Count} H2s found (recommended: 4+)`,
    };
    category.score += 2;
    flags.push("low_h2_count");
  } else {
    category.items.h2_count = {
      score: 0,
      max: 4,
      status: "red",
      reason: `Only ${h2Count} H2s found (recommended: 4+)`,
    };
    flags.push("low_h2_count");
  }

  // Logical heading order: 3 (simplified check)
  category.items.heading_order = {
    score: 3,
    max: 3,
    status: "green", // Assume correct order unless we detect issues
  };
  category.score += 3;

  // Table of contents / jump links: 3
  const hasTOC =
    content.includes("table of contents") ||
    content.includes("Table of Contents") ||
    content.includes("quick navigation") ||
    content.includes("Quick Navigation") ||
    content.match(/<a[^>]*href=["']#[^"']+["']/gi)?.length || 0 > 0;
  if (hasTOC) {
    category.items.toc = {
      score: 3,
      max: 3,
      status: "green",
    };
    category.score += 3;
  } else {
    category.items.toc = {
      score: 0,
      max: 3,
      status: "red",
      reason: "No table of contents or jump links found",
    };
    flags.push("no_table_of_contents");
  }
}

function scoreContent(
  input: BlogSEOInput,
  category: SEOBreakdown["content"],
  flags: string[]
) {
  const content = input.content || "";
  const wordCount = content
    .replace(/<[^>]*>/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  // Word count scoring
  if (wordCount >= 7000) {
    category.items.word_count = {
      score: 10,
      max: 10,
      status: "green",
    };
    category.score += 10;
  } else if (wordCount >= 4000) {
    category.items.word_count = {
      score: 8,
      max: 10,
      status: "green",
    };
    category.score += 8;
  } else if (wordCount >= 2000) {
    category.items.word_count = {
      score: 6,
      max: 10,
      status: "amber",
      reason: `${wordCount} words (recommended: 4000+)`,
    };
    category.score += 6;
    flags.push("low_word_count");
  } else if (wordCount >= 1200) {
    category.items.word_count = {
      score: 3,
      max: 10,
      status: "amber",
      reason: `${wordCount} words (recommended: 2000+)`,
    };
    category.score += 3;
    flags.push("low_word_count");
  } else {
    category.items.word_count = {
      score: 0,
      max: 10,
      status: "red",
      reason: `Only ${wordCount} words (recommended: 1200+)`,
    };
    flags.push("low_word_count");
  }

  // Includes example/template/script: 5
  const hasExample =
    content.includes("example") ||
    content.includes("template") ||
    content.includes("script") ||
    content.includes("Example") ||
    content.includes("Template");
  if (hasExample) {
    category.items.includes_example = {
      score: 5,
      max: 5,
      status: "green",
    };
    category.score += 5;
  } else {
    category.items.includes_example = {
      score: 0,
      max: 5,
      status: "red",
      reason: "No examples, templates, or scripts found",
    };
    flags.push("no_examples");
  }

  // Clear what/why/how in first 200 words: 5
  const first200 = content
    .replace(/<[^>]*>/g, " ")
    .substring(0, 200)
    .toLowerCase();
  const hasWhat = first200.includes("what") || first200.includes("learn");
  const hasWhy = first200.includes("why") || first200.includes("because");
  const hasHow = first200.includes("how") || first200.includes("guide");
  if (hasWhat && (hasWhy || hasHow)) {
    category.items.clear_intro = {
      score: 5,
      max: 5,
      status: "green",
    };
    category.score += 5;
  } else {
    category.items.clear_intro = {
      score: 2,
      max: 5,
      status: "amber",
      reason: "Introduction could be clearer (add what/why/how)",
    };
    category.score += 2;
    flags.push("unclear_intro");
  }
}

function scoreInternalLinks(
  input: BlogSEOInput,
  category: SEOBreakdown["internal_links"],
  flags: string[]
) {
  const content = input.content || "";
  const internalLinks =
    content.match(/href=["'](\/blog\/[^"']+|#[^"']+|https?:\/\/[^"']*contactjournalists[^"']*)["']/gi) || [];

  const linkCount = internalLinks.length;

  // Internal links scoring
  if (linkCount >= 5) {
    category.items.link_count = {
      score: 8,
      max: 8,
      status: "green",
    };
    category.score += 8;
  } else if (linkCount >= 3) {
    category.items.link_count = {
      score: 6,
      max: 8,
      status: "amber",
      reason: `${linkCount} internal links (recommended: 5+)`,
    };
    category.score += 6;
    flags.push("low_internal_links");
  } else if (linkCount >= 1) {
    category.items.link_count = {
      score: 3,
      max: 8,
      status: "amber",
      reason: `Only ${linkCount} internal links (recommended: 5+)`,
    };
    category.score += 3;
    flags.push("low_internal_links");
  } else {
    category.items.link_count = {
      score: 0,
      max: 8,
      status: "red",
      reason: "No internal links found",
    };
    flags.push("no_internal_links");
  }

  // ≥1 link to money page: 4
  const hasMoneyPageLink =
    content.includes("/waitlist-signup") ||
    content.includes("/#pricing") ||
    content.includes("contactjournalists.com") ||
    internalLinks.some((link) => link.includes("contactjournalists"));
  if (hasMoneyPageLink) {
    category.items.money_page_link = {
      score: 4,
      max: 4,
      status: "green",
    };
    category.score += 4;
  } else {
    category.items.money_page_link = {
      score: 0,
      max: 4,
      status: "red",
      reason: "No link to main site/money page",
    };
    flags.push("no_money_page_link");
  }

  // Descriptive anchor text: 3
  const anchorTexts = content.match(/<a[^>]*>([^<]+)<\/a>/gi) || [];
  const descriptiveAnchors = anchorTexts.filter(
    (anchor) =>
      !anchor.match(/(click here|read more|here|link)/i) &&
      anchor.length > 5
  );
  if (descriptiveAnchors.length >= linkCount * 0.7) {
    category.items.anchor_text = {
      score: 3,
      max: 3,
      status: "green",
    };
    category.score += 3;
  } else {
    category.items.anchor_text = {
      score: 1,
      max: 3,
      status: "amber",
      reason: "Some links use generic anchor text",
    };
    category.score += 1;
    flags.push("generic_anchor_text");
  }
}

function scoreImages(
  input: BlogSEOInput,
  category: SEOBreakdown["images"],
  flags: string[]
) {
  const content = input.content || "";
  const images = content.match(/<img[^>]*>/gi) || [];
  const imageCount = images.length;

  // At least 1 image: 3
  if (imageCount >= 1) {
    category.items.has_images = {
      score: 3,
      max: 3,
      status: "green",
    };
    category.score += 3;
  } else {
    category.items.has_images = {
      score: 0,
      max: 3,
      status: "red",
      reason: "No images found",
    };
    flags.push("no_images");
  }

  // All images have alt text: 5
  const imagesWithAlt = images.filter((img) => img.includes('alt='));
  if (imagesWithAlt.length === imageCount && imageCount > 0) {
    category.items.alt_text = {
      score: 5,
      max: 5,
      status: "green",
    };
    category.score += 5;
  } else if (imageCount > 0) {
    const missingAlt = imageCount - imagesWithAlt.length;
    category.items.alt_text = {
      score: Math.max(0, 5 - missingAlt * 2),
      max: 5,
      status: "amber",
      reason: `${missingAlt} image(s) missing alt text`,
    };
    category.score += Math.max(0, 5 - missingAlt * 2);
    flags.push("missing_alt_text");
  } else {
    category.items.alt_text = {
      score: 0,
      max: 5,
      status: "red",
      reason: "No images to check",
    };
  }

  // Alt text descriptive (not spam): 2
  if (imageCount > 0) {
    const altTexts = images
      .map((img) => {
        const altMatch = img.match(/alt=["']([^"']+)["']/i);
        return altMatch ? altMatch[1] : "";
      })
      .filter((alt) => alt.length > 0);
    const descriptiveAlts = altTexts.filter(
      (alt) => alt.length > 10 && !alt.match(/^(image|photo|img|picture)$/i)
    );
    if (descriptiveAlts.length >= altTexts.length * 0.8) {
      category.items.descriptive_alt = {
        score: 2,
        max: 2,
        status: "green",
      };
      category.score += 2;
    } else {
      category.items.descriptive_alt = {
        score: 0,
        max: 2,
        status: "amber",
        reason: "Some alt text is too generic",
      };
      flags.push("generic_alt_text");
    }
  } else {
    category.items.descriptive_alt = {
      score: 0,
      max: 2,
      status: "red",
      reason: "No images to check",
    };
  }
}

function scoreReadability(
  input: BlogSEOInput,
  category: SEOBreakdown["readability"],
  flags: string[]
) {
  const content = input.content || "";

  // Short paragraphs (<4 lines): 3
  const paragraphs = content.split(/<\/p>|<p[^>]*>/gi).filter((p) => p.trim().length > 0);
  const shortParagraphs = paragraphs.filter((p) => {
    const lines = p.split(/\n/).length;
    return lines < 4;
  });
  const shortParagraphRatio = paragraphs.length > 0 ? shortParagraphs.length / paragraphs.length : 0;
  if (shortParagraphRatio >= 0.7) {
    category.items.short_paragraphs = {
      score: 3,
      max: 3,
      status: "green",
    };
    category.score += 3;
  } else {
    category.items.short_paragraphs = {
      score: 1,
      max: 3,
      status: "amber",
      reason: "Some paragraphs are too long",
    };
    category.score += 1;
    flags.push("long_paragraphs");
  }

  // Bullets/lists present: 3
  const hasLists =
    content.includes("<ul>") ||
    content.includes("<ol>") ||
    content.includes("<li>") ||
    content.match(/[-*•]\s/);
  if (hasLists) {
    category.items.has_lists = {
      score: 3,
      max: 3,
      status: "green",
    };
    category.score += 3;
  } else {
    category.items.has_lists = {
      score: 0,
      max: 3,
      status: "red",
      reason: "No lists or bullets found",
    };
    flags.push("no_lists");
  }

  // Clear CTA section: 4
  const hasCTA =
    content.includes("CTA") ||
    content.includes("call to action") ||
    content.includes("free trial") ||
    content.includes("Start your") ||
    content.includes("Get started") ||
    content.match(/<a[^>]*class[^>]*button/i);
  if (hasCTA) {
    category.items.clear_cta = {
      score: 4,
      max: 4,
      status: "green",
    };
    category.score += 4;
  } else {
    category.items.clear_cta = {
      score: 0,
      max: 4,
      status: "red",
      reason: "No clear call-to-action found",
    };
    flags.push("no_cta");
  }
}

function scorePenalties(
  input: BlogSEOInput,
  category: SEOBreakdown["penalties"],
  flags: string[]
) {
  const content = input.content || "";
  const title = input.title.toLowerCase();

  // Keyword stuffing detected: -10
  const words = content
    .replace(/<[^>]*>/g, " ")
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 3);
  const wordFreq: Record<string, number> = {};
  words.forEach((word) => {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  });
  const maxFreq = Math.max(...Object.values(wordFreq));
  const totalWords = words.length;
  const stuffingRatio = maxFreq / totalWords;
  if (stuffingRatio > 0.05 && totalWords > 500) {
    category.items.keyword_stuffing = {
      score: -10,
      status: "red",
      reason: "Potential keyword stuffing detected",
    };
    category.score -= 10;
    flags.push("keyword_stuffing");
  }

  // Title mismatch / clickbait: -8 (simplified check)
  const titleWords = title.split(/\s+/);
  const contentStart = content
    .replace(/<[^>]*>/g, " ")
    .toLowerCase()
    .substring(0, 200);
  const titleInContent = titleWords.some((word) =>
    contentStart.includes(word.toLowerCase())
  );
  if (!titleInContent && titleWords.length > 3) {
    category.items.title_mismatch = {
      score: -8,
      status: "red",
      reason: "Title may not match content",
    };
    category.score -= 8;
    flags.push("title_mismatch");
  }

  // Broken internal links: -5 (simplified - would need actual link checking)
  // For now, assume no broken links unless we detect obvious issues
  const brokenLinkPattern = /href=["'](?!https?:\/\/|#|\/)[^"']+["']/gi;
  if (brokenLinkPattern.test(content)) {
    category.items.broken_links = {
      score: -5,
      status: "red",
      reason: "Potential broken links detected",
    };
    category.score -= 5;
    flags.push("broken_links");
  }

  // Missing publish or updated date: -3
  if (!input.publishDate && !input.lastUpdated) {
    category.items.missing_dates = {
      score: -3,
      status: "red",
      reason: "Missing publish or updated date",
    };
    category.score -= 3;
    flags.push("missing_dates");
  }

  // No subheadings in first 500 words: -3
  const first500 = content.substring(0, 500);
  const hasEarlySubheading =
    first500.includes("<h2") ||
    first500.includes("text-xl") ||
    first500.includes("font-semibold");
  if (!hasEarlySubheading && content.length > 1000) {
    category.items.no_subheadings_early = {
      score: -3,
      status: "red",
      reason: "No subheadings in first 500 words",
    };
    category.score -= 3;
    flags.push("no_subheadings_early");
  }
}
