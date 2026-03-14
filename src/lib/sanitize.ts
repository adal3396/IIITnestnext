/**
 * DPDP Act 2023 Compliant Data Sanitization Utilities
 *
 * PURPOSE: All child profile data MUST pass through these functions before
 * being injected into any LLM prompt or sent to an external service.
 *
 * RULES (JJ Act 2015 + DPDP Act 2023):
 *  - No real names, guardian names, or contact details allowed in prompts.
 *  - No Aadhaar, birth cert, or document IDs allowed in prompts.
 *  - No orphanage name or location granular enough to identify a child.
 *  - All IDs must be replaced with internal anonymized tokens.
 */

// Fields that are strictly forbidden from LLM prompts or external calls.
const PII_FIELDS = [
  "name",
  "full_name",
  "first_name",
  "last_name",
  "guardian_name",
  "guardian_contact",
  "phone",
  "email",
  "aadhaar",
  "aadhaar_number",
  "birth_certificate",
  "document_id",
  "address",
  "orphanage_name",
  "orphanage_address",
  "photo_url",
  "image_url",
];

/**
 * Strips all PII fields from a child profile object before LLM injection.
 * Returns a sanitized, anonymized copy safe for use in AI prompts.
 *
 * @param profile - Raw child profile object from Supabase
 * @returns Sanitized profile with all PII removed and ID anonymized
 */
export function sanitizeChildProfile(profile: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(profile)) {
    const lowerKey = key.toLowerCase();

    // Block all PII fields
    if (PII_FIELDS.some((pii) => lowerKey.includes(pii))) {
      continue;
    }

    // Anonymize any raw ID fields — replace with a non-reversible token
    if (lowerKey === "id" || lowerKey === "child_id") {
      sanitized["anon_token"] = anonymizeId(String(value));
      continue;
    }

    sanitized[key] = value;
  }

  return sanitized;
}

/**
 * Strips PII from a batch of child profiles.
 */
export function sanitizeChildProfiles(
  profiles: Record<string, unknown>[]
): Record<string, unknown>[] {
  return profiles.map(sanitizeChildProfile);
}

/**
 * Sanitizes free-form text by removing patterns that look like PII.
 * Removes phone numbers, email addresses, and Aadhaar patterns.
 *
 * @param text - Raw input text
 * @returns Sanitized text string
 */
export function sanitizeText(text: string): string {
  return text
    .replace(/\b[6-9]\d{9}\b/g, "[PHONE_REDACTED]")             // Indian phone numbers
    .replace(/\b\d{4}\s?\d{4}\s?\d{4}\b/g, "[AADHAAR_REDACTED]") // Aadhaar
    .replace(/[\w.-]+@[\w.-]+\.\w{2,}/g, "[EMAIL_REDACTED]")      // Email addresses
    .replace(/\b\d{12}\b/g, "[ID_REDACTED]")                      // 12-digit IDs
    .trim();
}

/**
 * Creates a non-reversible anonymized token from a raw ID.
 * Uses a simple hash — sufficient for prompt isolation (not a security hash).
 *
 * @param id - Raw database ID
 * @returns Anonymized token string
 */
export function anonymizeId(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    const char = id.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `ANON_${Math.abs(hash).toString(36).toUpperCase()}`;
}

/**
 * Validates that a sanitized object contains no PII before prompt injection.
 * Throws an error if any PII field is detected (fail-safe guard).
 *
 * @param obj - Object to audit
 */
export function assertNoPII(obj: Record<string, unknown>): void {
  for (const key of Object.keys(obj)) {
    if (PII_FIELDS.some((pii) => key.toLowerCase().includes(pii))) {
      throw new Error(
        `[DPDP VIOLATION] PII field detected in prompt payload: "${key}". ` +
          `Sanitize all data before AI injection.`
      );
    }
  }
}
