import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Create admin client with service role key (bypasses RLS)
const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

// Create regular client to verify caller is staff
const supabaseAuth = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_ANON_KEY") ?? ""
);

const STORAGE_BUCKET = "email_proof";

interface JournalistData {
  full_name?: string;
  email?: string;
  press?: string;
  company?: string;
  website?: string;
  linkedin?: string;
  x_handle?: string;
  categories?: string[];
  email_screenshot?: string;
}

interface BulkImportResult {
  recordsInserted: number;
  skipped: number;
  errors: { row: number; message: string }[];
  skippedRows: { row: number; email: string }[];
}

/**
 * Check if URL is a Google Drive view/share link
 */
function isGoogleDriveLink(url: string): boolean {
  if (!url) return false;
  return (
    url.includes("drive.google.com/file/d/") ||
    url.includes("drive.google.com/open?id=")
  );
}

/**
 * Extract file ID from Google Drive link
 */
function extractGoogleDriveFileId(url: string): string | null {
  // Format: https://drive.google.com/file/d/{FILE_ID}/view...
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) return fileMatch[1];

  // Format: https://drive.google.com/open?id={FILE_ID}
  const openMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (openMatch) return openMatch[1];

  return null;
}

/**
 * Convert Google Drive view link to direct download URL
 */
function getGoogleDriveDownloadUrl(fileId: string): string {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

/**
 * Detect content type from response headers or default to image/jpeg
 */
function getContentType(response: Response): string {
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.startsWith("image/")) {
    return contentType;
  }
  return "image/jpeg"; // Default assumption for screenshots
}

/**
 * Get file extension from content type
 */
function getExtension(contentType: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
  };
  return map[contentType] || "jpg";
}

/**
 * Download image from Google Drive and upload to Supabase Storage
 * Returns the public URL of the uploaded file, or null if failed
 */
async function processGoogleDriveImage(
  url: string,
  profileIdOrEmail: string
): Promise<string | null> {
  try {
    const fileId = extractGoogleDriveFileId(url);
    if (!fileId) {
      console.error("Could not extract file ID from Google Drive URL:", url);
      return null;
    }

    const downloadUrl = getGoogleDriveDownloadUrl(fileId);

    // Fetch the image from Google Drive
    const response = await fetch(downloadUrl, {
      headers: {
        // Some user agent to avoid blocks
        "User-Agent":
          "Mozilla/5.0 (compatible; ContactJournalists/1.0; +https://contactjournalists.com)",
      },
    });

    if (!response.ok) {
      console.error(
        `Failed to download from Google Drive: ${response.status} ${response.statusText}`
      );
      return null;
    }

    // Check if we got an HTML page (virus scan warning for large files)
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("text/html")) {
      console.error(
        "Google Drive returned HTML (possibly virus scan warning or access denied)"
      );
      return null;
    }

    const imageData = await response.arrayBuffer();
    const imageContentType = getContentType(response);
    const extension = getExtension(imageContentType);

    // Generate a unique filename
    const timestamp = Date.now();
    const sanitizedId = profileIdOrEmail
      .replace(/[^a-zA-Z0-9]/g, "_")
      .substring(0, 50);
    const filename = `${sanitizedId}_${timestamp}.${extension}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .upload(filename, imageData, {
        contentType: imageContentType,
        upsert: true,
      });

    if (uploadError) {
      console.error("Failed to upload to storage:", uploadError);
      return null;
    }

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from(STORAGE_BUCKET).getPublicUrl(filename);

    return publicUrl;
  } catch (error) {
    console.error("Error processing Google Drive image:", error);
    return null;
  }
}

/**
 * Check if URL is already a valid image URL (not a Google Drive link)
 */
function isDirectImageUrl(url: string): boolean {
  if (!url) return false;
  // Check for common image extensions or storage URLs
  const lowerUrl = url.toLowerCase();
  return (
    lowerUrl.includes(".jpg") ||
    lowerUrl.includes(".jpeg") ||
    lowerUrl.includes(".png") ||
    lowerUrl.includes(".gif") ||
    lowerUrl.includes(".webp") ||
    lowerUrl.includes("/storage/v1/object/") // Supabase storage
  );
}

// Verify the caller is a staff member
async function verifyStaffAccess(authHeader: string): Promise<boolean> {
  try {
    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error,
    } = await supabaseAuth.auth.getUser(token);

    if (error || !user) return false;

    const { data: staffRecord } = await supabaseAdmin
      .from("staff_privileges")
      .select("user_id")
      .eq("user_id", user.id)
      .single();

    return !!staffRecord;
  } catch {
    return false;
  }
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Verify staff access
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    const isStaff = await verifyStaffAccess(authHeader);
    if (!isStaff) {
      throw new Error("Unauthorized: Staff access required");
    }

    const { action, data, id } = await req.json();

    switch (action) {
      case "create": {
        const profileData = data as JournalistData;
        const { email_screenshot, ...insertData } = profileData;

        const { data: created, error } = await supabaseAdmin
          .from("profiles")
          .insert({
            role: "journalist",
            onboarding_complete: true,
            ...insertData,
            categories: insertData.categories || [],
          })
          .select()
          .single();

        if (error) throw error;

        return new Response(JSON.stringify(created), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      case "update": {
        if (!id) throw new Error("ID is required for update");

        const { data: updated, error } = await supabaseAdmin
          .from("profiles")
          .update(data)
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;

        return new Response(JSON.stringify(updated), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      case "bulk_import": {
        const rows = data as JournalistData[];
        const results: BulkImportResult = {
          recordsInserted: 0,
          skipped: 0,
          errors: [],
          skippedRows: [],
        };

        // Track successfully inserted profiles that need image processing
        const profilesNeedingImages: {
          id: string;
          email: string;
          email_screenshot: string;
        }[] = [];

        // STEP 1: Insert all profiles first (without processing images)
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          const { email_screenshot, ...profileData } = row;

          const insertData = {
            role: "journalist",
            onboarding_complete: true,
            ...profileData,
            categories: profileData.categories || [],
            // Store original URL initially, will be updated after image processing
            meta: email_screenshot
              ? { email_screenshot_url: email_screenshot }
              : {},
          };

          const { data: inserted, error: insertError } = await supabaseAdmin
            .from("profiles")
            .insert(insertData)
            .select("id")
            .single();

          if (insertError) {
            // Check if it's a unique constraint violation (duplicate)
            if (insertError.code === "23505") {
              results.skipped++;
              results.skippedRows.push({
                row: i + 1,
                email: row.email || "unknown",
              });
            } else {
              results.errors.push({
                row: i + 1,
                message: insertError.message,
              });
            }
          } else {
            results.recordsInserted++;
            // Track this profile for image processing if it has a Google Drive link
            if (email_screenshot && isGoogleDriveLink(email_screenshot)) {
              profilesNeedingImages.push({
                id: inserted.id,
                email: row.email || `profile_${inserted.id}`,
                email_screenshot,
              });
            }
          }
        }

        // STEP 2: Process images for successfully inserted profiles (async, non-blocking)
        // This happens after all profiles are inserted
        for (const profile of profilesNeedingImages) {
          try {
            const uploadedUrl = await processGoogleDriveImage(
              profile.email_screenshot,
              profile.email
            );

            if (uploadedUrl) {
              // Update the profile with the storage URL
              await supabaseAdmin
                .from("profiles")
                .update({ meta: { email_screenshot_url: uploadedUrl } })
                .eq("id", profile.id);
            }
            // If upload failed, the original URL is already stored
          } catch (imageError) {
            // Log but don't affect results - original URL is already stored
            console.error(
              `Image processing error for ${profile.email}:`,
              imageError
            );
          }
        }

        return new Response(JSON.stringify(results), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      case "get_all": {
        const { page = 1, pageSize = 20, search = "" } = data || {};

        let query = supabaseAdmin
          .from("profiles")
          .select(
            "id, email, full_name, role, press, company, website, linkedin, x_handle, categories, created_at, meta, billing_accounts(status, plan_id, current_period_end, cancel_at_period_end)",
            { count: "exact" }
          )
          .eq("role", "journalist")
          .order("created_at", { ascending: false });

        if (search) {
          query = query.or(
            `email.ilike.%${search}%,full_name.ilike.%${search}%,press.ilike.%${search}%`
          );
        }

        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;
        query = query.range(from, to);

        const { data: profiles, error, count } = await query;
        if (error) throw error;

        return new Response(JSON.stringify({ data: profiles, count }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
