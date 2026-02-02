/**
 * Smart Topics System
 * 
 * Infers topic labels from journalist data using keyword matching.
 * No database changes required - pure frontend logic.
 */

// All available topics for filtering and display
export const TOPIC_LIST = [
  "AI",
  "ADHD",
  "Mental Health",
  "Parenting",
  "Motherhood",
  "Fatherhood",
  "Men's Health",
  "Women's Health",
  "Fashion",
  "Beauty",
  "Wellness",
  "Fitness",
  "Startups",
  "Marketing",
  "Finance",
  "Careers",
  "Relationships",
  "Travel",
  "Food",
  "Business",
  "Technology",
  "Healthcare",
  "Lifestyle",
  "Entertainment",
  "Sports",
  "Education",
  "Science",
  "Politics",
  "Environment",
  "Real Estate",
] as const;

export type Topic = (typeof TOPIC_LIST)[number];

// Keyword rules for topic inference
// Each topic has keywords that, if found in journalist data, suggest that topic
const TOPIC_KEYWORDS: Record<Topic, string[]> = {
  AI: [
    "ai",
    "artificial intelligence",
    "machine learning",
    "ml",
    "chatgpt",
    "openai",
    "llm",
    "deep learning",
    "neural",
    "automation",
    "gpt",
    "generative",
  ],
  ADHD: ["adhd", "attention deficit", "neurodivergent", "neurodiversity", "add"],
  "Mental Health": [
    "mental health",
    "psychology",
    "therapy",
    "counseling",
    "anxiety",
    "depression",
    "wellbeing",
    "mindfulness",
    "psychiatry",
    "psychologist",
  ],
  Parenting: [
    "parenting",
    "parent",
    "children",
    "kids",
    "family",
    "child",
    "baby",
    "toddler",
    "childcare",
  ],
  Motherhood: ["motherhood", "mother", "mom", "mum", "maternal", "pregnancy", "pregnant"],
  Fatherhood: ["fatherhood", "father", "dad", "paternal", "dads"],
  "Men's Health": ["men's health", "mens health", "male health", "prostate", "testosterone"],
  "Women's Health": [
    "women's health",
    "womens health",
    "female health",
    "menopause",
    "fertility",
    "reproductive",
    "gynecology",
  ],
  Fashion: ["fashion", "style", "clothing", "apparel", "designer", "couture", "vogue", "runway"],
  Beauty: ["beauty", "cosmetic", "skincare", "makeup", "hair", "nail", "grooming"],
  Wellness: ["wellness", "wellbeing", "self-care", "holistic", "mindful", "meditation", "yoga"],
  Fitness: ["fitness", "exercise", "workout", "gym", "training", "athlete", "sports medicine"],
  Startups: [
    "startup",
    "startups",
    "founder",
    "entrepreneurship",
    "venture",
    "vc",
    "seed",
    "series a",
    "techcrunch",
    "y combinator",
  ],
  Marketing: [
    "marketing",
    "advertising",
    "brand",
    "social media",
    "seo",
    "content",
    "digital marketing",
    "pr",
    "public relations",
  ],
  Finance: [
    "finance",
    "financial",
    "banking",
    "investment",
    "stock",
    "crypto",
    "cryptocurrency",
    "bitcoin",
    "trading",
    "wealth",
    "money",
    "economics",
    "wall street",
    "fintech",
  ],
  Careers: ["career", "job", "employment", "hiring", "recruitment", "workplace", "hr", "human resources"],
  Relationships: ["relationship", "dating", "love", "marriage", "divorce", "couples", "romance"],
  Travel: ["travel", "tourism", "vacation", "holiday", "destination", "hotel", "airline", "flight"],
  Food: [
    "food",
    "restaurant",
    "cooking",
    "recipe",
    "chef",
    "cuisine",
    "dining",
    "culinary",
    "nutrition",
    "diet",
  ],
  Business: [
    "business",
    "corporate",
    "enterprise",
    "commerce",
    "industry",
    "management",
    "ceo",
    "executive",
    "forbes",
    "bloomberg",
  ],
  Technology: [
    "tech",
    "technology",
    "software",
    "hardware",
    "computer",
    "digital",
    "cyber",
    "internet",
    "app",
    "mobile",
    "gadget",
    "wired",
    "verge",
    "techradar",
  ],
  Healthcare: [
    "healthcare",
    "health care",
    "medical",
    "medicine",
    "hospital",
    "doctor",
    "nurse",
    "patient",
    "clinical",
    "pharma",
  ],
  Lifestyle: ["lifestyle", "living", "home", "interior", "design", "decor"],
  Entertainment: [
    "entertainment",
    "celebrity",
    "movie",
    "film",
    "tv",
    "television",
    "music",
    "streaming",
    "netflix",
    "hollywood",
  ],
  Sports: ["sport", "sports", "football", "basketball", "soccer", "baseball", "nfl", "nba", "espn", "athletic"],
  Education: ["education", "school", "university", "college", "learning", "teacher", "student", "academic"],
  Science: ["science", "research", "scientific", "laboratory", "physics", "chemistry", "biology", "nature"],
  Politics: ["politics", "political", "government", "policy", "election", "congress", "senate", "washington"],
  Environment: [
    "environment",
    "climate",
    "sustainability",
    "green",
    "eco",
    "renewable",
    "carbon",
    "pollution",
  ],
  "Real Estate": ["real estate", "property", "housing", "mortgage", "rental", "landlord", "realtor"],
};

// Marker for explicitly set topics in notes field
const TOPICS_MARKER = "Topics:";

interface JournalistData {
  name?: string;
  full_name?: string;
  press?: string;
  company?: string;
  website?: string;
  linkedin?: string;
  xHandle?: string;
  x_handle?: string;
  categories?: string[];
  meta?: {
    full_name?: string;
    publisherProfile?: string;
    notes?: string;
    [key: string]: unknown;
  };
  notes?: string;
}

/**
 * Extract explicitly set topics from notes field
 * Looks for a line like: "Topics: AI, Parenting, Mental Health"
 */
function extractExplicitTopics(notes: string | undefined): string[] {
  if (!notes) return [];

  const lines = notes.split("\n");
  for (const line of lines) {
    if (line.trim().startsWith(TOPICS_MARKER)) {
      const topicsStr = line.substring(line.indexOf(TOPICS_MARKER) + TOPICS_MARKER.length);
      return topicsStr
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0 && TOPIC_LIST.includes(t as Topic));
    }
  }
  return [];
}

/**
 * Infer topics from journalist data by scanning text fields for keywords
 */
function inferTopicsFromKeywords(journalist: JournalistData): string[] {
  // Combine all text fields into one searchable string
  const textParts: string[] = [];

  if (journalist.name) textParts.push(journalist.name);
  if (journalist.full_name) textParts.push(journalist.full_name);
  if (journalist.press) textParts.push(journalist.press);
  if (journalist.company) textParts.push(journalist.company);
  if (journalist.website) textParts.push(journalist.website);
  if (journalist.linkedin) textParts.push(journalist.linkedin);
  if (journalist.xHandle) textParts.push(journalist.xHandle);
  if (journalist.x_handle) textParts.push(journalist.x_handle);
  if (journalist.meta?.full_name) textParts.push(journalist.meta.full_name);
  if (journalist.meta?.publisherProfile) textParts.push(journalist.meta.publisherProfile);
  if (journalist.meta?.notes) textParts.push(journalist.meta.notes);
  if (journalist.notes) textParts.push(journalist.notes);

  const combinedText = textParts.join(" ").toLowerCase();

  const matchedTopics: string[] = [];

  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    for (const keyword of keywords) {
      // Use word boundary matching for more accurate results
      const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
      if (regex.test(combinedText)) {
        matchedTopics.push(topic);
        break; // Found a match for this topic, move to next
      }
    }
  }

  return matchedTopics;
}

/**
 * Get topics for a journalist
 * 
 * Priority:
 * 1. Existing categories from database (if any)
 * 2. Explicitly set topics in notes field (Topics: ...)
 * 3. Inferred topics from keyword matching
 * 
 * Returns deduplicated array of topic strings
 */
export function getTopicsForJournalist(journalist: JournalistData): string[] {
  const topics = new Set<string>();

  // 1. Add existing categories from database
  if (journalist.categories?.length) {
    journalist.categories.forEach((cat) => topics.add(cat));
  }

  // 2. Check for explicit topics in notes
  const notesText = journalist.notes || journalist.meta?.notes;
  const explicitTopics = extractExplicitTopics(notesText as string | undefined);
  explicitTopics.forEach((t) => topics.add(t));

  // 3. Infer topics from keywords (only if we have few or no topics yet)
  if (topics.size < 3) {
    const inferredTopics = inferTopicsFromKeywords(journalist);
    inferredTopics.forEach((t) => topics.add(t));
  }

  return Array.from(topics);
}

/**
 * Check if a journalist matches the selected topic filters
 */
export function journalistMatchesTopics(
  journalist: JournalistData,
  selectedTopics: string[]
): boolean {
  if (selectedTopics.length === 0) return true;

  const journalistTopics = getTopicsForJournalist(journalist);
  return selectedTopics.some((topic) => journalistTopics.includes(topic));
}

/**
 * Format topics line for storage in notes field
 */
export function formatTopicsLine(topics: string[]): string {
  if (topics.length === 0) return "";
  return `${TOPICS_MARKER} ${topics.join(", ")}`;
}

/**
 * Update notes field with new topics, preserving existing content
 */
export function updateNotesWithTopics(existingNotes: string | undefined, topics: string[]): string {
  const lines = (existingNotes || "").split("\n");
  
  // Remove existing Topics line if present
  const filteredLines = lines.filter((line) => !line.trim().startsWith(TOPICS_MARKER));
  
  // Add new topics line at the beginning if there are topics
  if (topics.length > 0) {
    filteredLines.unshift(formatTopicsLine(topics));
  }
  
  return filteredLines.join("\n").trim();
}
