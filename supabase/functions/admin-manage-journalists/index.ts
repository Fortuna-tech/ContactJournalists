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
        // Bulk import profiles - no image processing, just insert
        const rows = data as JournalistData[];
        const results: BulkImportResult & {
          profilesWithImages: { profileId: string; url: string }[];
        } = {
          recordsInserted: 0,
          skipped: 0,
          errors: [],
          skippedRows: [],
          profilesWithImages: [],
        };

        // Prepare data for bulk insert
        const insertRows = rows.map((row, index) => {
          const { email_screenshot, ...profileData } = row;
          return {
            _index: index,
            _email: row.email,
            _screenshot: email_screenshot,
            data: {
              role: "journalist",
              onboarding_complete: true,
              ...profileData,
              categories: profileData.categories || [],
              // Store original URL initially
              meta: email_screenshot
                ? { email_screenshot_url: email_screenshot }
                : {},
            },
          };
        });

        // Bulk insert all profiles at once
        const { data: inserted, error: bulkError } = await supabaseAdmin
          .from("profiles")
          .insert(insertRows.map((r) => r.data))
          .select("id, email");

        if (bulkError) {
          // If bulk insert fails (e.g., some duplicates), try individual inserts
          console.log(
            "Bulk insert failed, trying individual inserts:",
            bulkError
          );

          for (let i = 0; i < insertRows.length; i++) {
            const row = insertRows[i];
            const { data: singleInserted, error: singleError } =
              await supabaseAdmin
                .from("profiles")
                .insert(row.data)
                .select("id, email")
                .single();

            if (singleError) {
              if (singleError.code === "23505") {
                results.skipped++;
                results.skippedRows.push({
                  row: i + 1,
                  email: row._email || "unknown",
                });
                // For skipped profiles, look up existing profile ID for image processing
                if (
                  row._email &&
                  row._screenshot &&
                  isGoogleDriveLink(row._screenshot)
                ) {
                  const { data: existingProfile } = await supabaseAdmin
                    .from("profiles")
                    .select("id")
                    .eq("email", row._email)
                    .single();
                  if (existingProfile) {
                    results.profilesWithImages.push({
                      profileId: existingProfile.id,
                      url: row._screenshot,
                    });
                  }
                }
              } else {
                results.errors.push({
                  row: i + 1,
                  message: singleError.message,
                });
              }
            } else if (singleInserted) {
              results.recordsInserted++;
              // Track profiles with Google Drive images
              if (row._screenshot && isGoogleDriveLink(row._screenshot)) {
                results.profilesWithImages.push({
                  profileId: singleInserted.id,
                  url: row._screenshot,
                });
              }
            }
          }
        } else if (inserted) {
          results.recordsInserted = inserted.length;
          // Create a map from email to screenshot URL for proper matching
          const emailToScreenshot = new Map<string, string>();
          for (const row of insertRows) {
            if (
              row._email &&
              row._screenshot &&
              isGoogleDriveLink(row._screenshot)
            ) {
              emailToScreenshot.set(row._email, row._screenshot);
            }
          }
          // Track profiles with Google Drive images using email matching
          for (const profile of inserted) {
            const screenshotUrl = emailToScreenshot.get(profile.email);
            if (screenshotUrl) {
              results.profilesWithImages.push({
                profileId: profile.id,
                url: screenshotUrl,
              });
            }
          }
        }

        return new Response(JSON.stringify(results), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      case "process_images": {
        // Process a batch of images - download from Google Drive, upload to storage
        const items = data as { profileId: string; url: string }[];
        const results: {
          successful: string[];
          failed: { profileId: string; error: string }[];
        } = {
          successful: [],
          failed: [],
        };

        for (const item of items) {
          try {
            if (!isGoogleDriveLink(item.url)) {
              // Not a Google Drive link, skip
              results.successful.push(item.profileId);
              continue;
            }

            const uploadedUrl = await processGoogleDriveImage(
              item.url,
              item.profileId
            );

            if (uploadedUrl) {
              // Update the profile with the storage URL
              const { error: updateError } = await supabaseAdmin
                .from("profiles")
                .update({ meta: { email_screenshot_url: uploadedUrl } })
                .eq("id", item.profileId);

              if (updateError) {
                results.failed.push({
                  profileId: item.profileId,
                  error: updateError.message,
                });
              } else {
                results.successful.push(item.profileId);
              }
            } else {
              results.failed.push({
                profileId: item.profileId,
                error: "Failed to download/upload image",
              });
            }
          } catch (err) {
            results.failed.push({
              profileId: item.profileId,
              error: err instanceof Error ? err.message : "Unknown error",
            });
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
