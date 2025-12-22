/**
 * CSV parsing and mapping utilities for bulk journalist import
 */

export interface ParsedCSV {
  headers: string[];
  rows: string[][];
}

export type FieldMapping =
  | "full_name"
  | "email"
  | "press"
  | "company"
  | "website"
  | "linkedin"
  | "x_handle"
  | "categories"
  | "email_screenshot"
  | "skip";

export const MAPPING_OPTIONS: { value: FieldMapping; label: string }[] = [
  { value: "full_name", label: "Full Name" },
  { value: "email", label: "Email" },
  { value: "press", label: "Publication/Press" },
  { value: "company", label: "Company" },
  { value: "website", label: "Website" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "x_handle", label: "X Handle" },
  { value: "categories", label: "Categories" },
  { value: "email_screenshot", label: "Email Screenshot (Image URL)" },
  { value: "skip", label: "Skip Column" },
];

export interface JournalistImportRow {
  full_name?: string;
  email?: string;
  press?: string;
  company?: string;
  website?: string;
  linkedin?: string;
  x_handle?: string;
  categories?: string[];
  email_screenshot?: string; // URL to image (Google Drive link or direct image URL)
}

export interface RowValidation {
  valid: boolean;
  errors: string[];
}

/**
 * Parse a CSV file into headers and rows
 */
export function parseCSV(file: File): Promise<ParsedCSV> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split(/\r?\n/).filter((line) => line.trim());

        if (lines.length === 0) {
          reject(new Error("CSV file is empty"));
          return;
        }

        const headers = parseCSVLine(lines[0]);
        const rows = lines.slice(1).map((line) => parseCSVLine(line));

        resolve({ headers, rows });
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}

/**
 * Parse a single CSV line, handling quoted values
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());

  return result;
}

/**
 * Auto-detect column mappings based on header names
 */
export function autoDetectMappings(headers: string[]): FieldMapping[] {
  return headers.map((header) => {
    const h = header.toLowerCase().trim();

    if (h.includes("name") || h === "full name" || h === "fullname") {
      return "full_name";
    }
    if (h.includes("email") || h.includes("mail")) {
      return "email";
    }
    if (
      h.includes("press") ||
      h.includes("publication") ||
      h.includes("outlet")
    ) {
      return "press";
    }
    if (h.includes("company") || h.includes("org")) {
      return "company";
    }
    if (h.includes("website") || h.includes("url") || h.includes("site")) {
      return "website";
    }
    if (h.includes("linkedin") || h === "li") {
      return "linkedin";
    }
    if (
      h.includes("twitter") ||
      h.includes("x_handle") ||
      h.includes("x handle") ||
      h === "x"
    ) {
      return "x_handle";
    }
    if (
      h.includes("category") ||
      h.includes("categories") ||
      h.includes("beat")
    ) {
      return "categories";
    }

    return "skip";
  });
}

/**
 * Apply mappings to transform raw rows into journalist data
 */
export function applyMapping(
  rows: string[][],
  headers: string[],
  mappings: FieldMapping[]
): JournalistImportRow[] {
  return rows.map((row) => {
    const result: JournalistImportRow = {};

    mappings.forEach((mapping, index) => {
      if (mapping === "skip" || !row[index]) return;

      const value = row[index].trim();
      if (!value) return;

      if (mapping === "categories") {
        // Split categories by comma or semicolon
        result.categories = value
          .split(/[,;]/)
          .map((c) => c.trim())
          .filter(Boolean);
      } else if (mapping === "email_screenshot") {
        // Store the URL as-is for later processing
        result.email_screenshot = value;
      } else {
        result[mapping] = value;
      }
    });

    return result;
  });
}

/**
 * Validate a single import row
 */
export function validateRow(row: JournalistImportRow): RowValidation {
  const errors: string[] = [];

  // Email is recommended but not strictly required
  if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
    errors.push("Invalid email format");
  }

  // Website should be a valid URL if provided
  if (row.website && !isValidUrl(row.website)) {
    errors.push("Invalid website URL");
  }

  // LinkedIn should be a valid URL if provided
  if (row.linkedin && !isValidUrl(row.linkedin)) {
    errors.push("Invalid LinkedIn URL");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

function isValidUrl(string: string): boolean {
  try {
    // Add protocol if missing
    const urlString = string.startsWith("http") ? string : `https://${string}`;
    new URL(urlString);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get a preview-friendly version of the mapping result
 */
export function getMappedPreview(
  row: string[],
  mappings: FieldMapping[]
): Record<FieldMapping, string> {
  const preview: Record<string, string> = {};

  mappings.forEach((mapping, index) => {
    if (mapping !== "skip" && row[index]) {
      preview[mapping] = row[index];
    }
  });

  return preview as Record<FieldMapping, string>;
}
