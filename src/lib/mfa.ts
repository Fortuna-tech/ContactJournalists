import { supabase } from "./supabaseClient";

/**
 * MFA (Multi-Factor Authentication) utility functions for TOTP
 */

export interface TOTPFactor {
  id: string;
  friendly_name: string;
  factor_type: "totp";
  status: "verified" | "unverified";
}

export interface EnrollmentData {
  id: string;
  type: "totp";
  totp: {
    qr_code: string; // Data URL for QR code image
    secret: string; // Base32 encoded secret for manual entry
    uri: string; // otpauth:// URI
  };
}

/**
 * Get all enrolled MFA factors for the current user
 */
export async function getFactors(): Promise<TOTPFactor[]> {
  const { data, error } = await supabase.auth.mfa.listFactors();
  if (error) throw error;
  return (data?.totp || []) as TOTPFactor[];
}

/**
 * Check if user has an enrolled and verified TOTP factor
 */
export async function hasTOTPFactor(): Promise<boolean> {
  const factors = await getFactors();
  return factors.some((f) => f.status === "verified");
}

/**
 * Get the first verified TOTP factor
 */
export async function getVerifiedTOTPFactor(): Promise<TOTPFactor | null> {
  const factors = await getFactors();
  return factors.find((f) => f.status === "verified") || null;
}

/**
 * Start TOTP enrollment - returns QR code and secret
 */
export async function enrollTOTP(
  friendlyName: string = "Authenticator App"
): Promise<EnrollmentData> {
  const { data, error } = await supabase.auth.mfa.enroll({
    factorType: "totp",
    friendlyName,
  });
  if (error) throw error;
  return data as EnrollmentData;
}

/**
 * Verify TOTP code during enrollment to complete the enrollment
 */
export async function verifyTOTPEnrollment(
  factorId: string,
  code: string
): Promise<void> {
  // First create a challenge
  const { data: challengeData, error: challengeError } =
    await supabase.auth.mfa.challenge({ factorId });
  if (challengeError) throw challengeError;

  // Then verify the code
  const { error: verifyError } = await supabase.auth.mfa.verify({
    factorId,
    challengeId: challengeData.id,
    code,
  });
  if (verifyError) throw verifyError;
}

/**
 * Create a challenge for TOTP verification (used during login)
 */
export async function createChallenge(
  factorId: string
): Promise<{ id: string }> {
  const { data, error } = await supabase.auth.mfa.challenge({ factorId });
  if (error) throw error;
  return { id: data.id };
}

/**
 * Verify TOTP code (used during login after challenge is created)
 */
export async function verifyTOTP(
  factorId: string,
  challengeId: string,
  code: string
): Promise<void> {
  const { error } = await supabase.auth.mfa.verify({
    factorId,
    challengeId,
    code,
  });
  if (error) throw error;
}

/**
 * Get current Authenticator Assurance Level
 * - aal1: Single factor (password/magic link only)
 * - aal2: Two factors (MFA verified)
 */
export async function getAAL(): Promise<{
  currentLevel: "aal1" | "aal2" | null;
  nextLevel: "aal1" | "aal2" | null;
}> {
  const {
    data: { currentLevel, nextLevel },
    error,
  } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (error) throw error;
  return { currentLevel, nextLevel };
}

/**
 * Check if user is staff (has record in staff_privileges table)
 */
export async function isStaffUser(userId: string): Promise<boolean> {
  const { data } = await supabase
    .from("staff_privileges")
    .select("user_id")
    .eq("user_id", userId)
    .single();
  return !!data;
}

/**
 * Unenroll a TOTP factor (for account recovery or changing device)
 */
export async function unenrollTOTP(factorId: string): Promise<void> {
  const { error } = await supabase.auth.mfa.unenroll({ factorId });
  if (error) throw error;
}
