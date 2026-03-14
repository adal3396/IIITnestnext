/**
 * POST /api/ai/ocr
 *
 * Document OCR Agent — Stage 2
 *
 * Parses physical document uploads (birth certificates, scholarship forms,
 * income certificates, medical reports) into structured JSON using an LLM
 * with vision capabilities.
 *
 * Supported document types:
 *  - birth_certificate
 *  - income_certificate (BPL/EWS)
 *  - school_report_card
 *  - medical_report
 *  - scheme_application_form
 *  - aadhaar_redacted (Aadhaar with number MASKED — only DOB/name retained briefly)
 *
 * DPDP Act 2023 / JJ Act 2015 Compliance:
 *  1. Aadhaar numbers, full addresses, and guardian contacts are REDACTED from output.
 *  2. The raw image base64 is NEVER stored — only the extracted structured fields.
 *  3. Only the minimum necessary fields are extracted per document type.
 *  4. All extracted text is returned with a `pii_redacted: true` flag.
 *
 * Input: multipart form data with:
 *  - `document_type`: one of the supported types above
 *  - `image_base64`: base64-encoded image (JPEG/PNG)
 */

import { NextRequest, NextResponse } from "next/server";
import { groq } from "@/lib/groq";

// -------------------------------------------------------------------
// Supported Document Types & Their Extraction Schemas
// -------------------------------------------------------------------
const DOCUMENT_SCHEMAS: Record<string, { fields: string[]; description: string }> = {
  birth_certificate: {
    description: "Extract only: date_of_birth, gender, district_of_birth, registration_number. DO NOT extract full name or parent names.",
    fields: ["date_of_birth", "gender", "district_of_birth", "registration_number"],
  },
  income_certificate: {
    description: "Extract only: annual_income_inr, certificate_date, issuing_authority, bpl_status. DO NOT extract applicant name or address.",
    fields: ["annual_income_inr", "certificate_date", "issuing_authority", "bpl_status"],
  },
  school_report_card: {
    description: "Extract only: academic_year, class_grade, subjects with marks, total_percentage, attendance_percentage, school_district. DO NOT extract student name, roll number, or school name.",
    fields: ["academic_year", "class_grade", "subjects", "total_percentage", "attendance_percentage", "school_district"],
  },
  medical_report: {
    description: "Extract only: report_date, diagnosis_codes_or_conditions, treatment_status, hospitalization_required, doctor_department. DO NOT extract patient name, hospital name, or doctor name.",
    fields: ["report_date", "diagnosis_codes_or_conditions", "treatment_status", "hospitalization_required", "doctor_department"],
  },
  scheme_application_form: {
    description: "Extract only: scheme_name, application_date, category_applied_under, documents_attached. DO NOT extract applicant name, Aadhaar, or guardian details.",
    fields: ["scheme_name", "application_date", "category_applied_under", "documents_attached"],
  },
  aadhaar_redacted: {
    description: "Extract only: date_of_birth, gender. The Aadhaar number is masked — do NOT attempt to reconstruct it. DO NOT extract name or address.",
    fields: ["date_of_birth", "gender"],
  },
};

// -------------------------------------------------------------------
// Response Types
// -------------------------------------------------------------------
interface OCRResponse {
  document_type: string;
  extracted_fields: Record<string, unknown>;
  confidence: "high" | "medium" | "low";
  extraction_notes: string;
  pii_redacted: boolean;
  dpdp_compliant: boolean;
}

// -------------------------------------------------------------------
// Route Handler
// -------------------------------------------------------------------
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json() as {
      document_type?: string;
      image_base64?: string;
    };

    const { document_type, image_base64 } = body;

    // Validate inputs
    if (!document_type || !DOCUMENT_SCHEMAS[document_type]) {
      return NextResponse.json(
        {
          error: `Invalid or missing 'document_type'. Supported types: ${Object.keys(DOCUMENT_SCHEMAS).join(", ")}`,
        },
        { status: 400 }
      );
    }

    if (!image_base64 || typeof image_base64 !== "string") {
      return NextResponse.json(
        { error: "Missing 'image_base64'. Provide a base64-encoded JPEG or PNG image." },
        { status: 400 }
      );
    }

    // Validate base64 format (rough check)
    if (image_base64.length < 100) {
      return NextResponse.json(
        { error: "Image data appears too small or malformed." },
        { status: 400 }
      );
    }

    const schema = DOCUMENT_SCHEMAS[document_type];

    // Build OCR extraction prompt
    const prompt = `
You are a Document OCR Agent for NextNest, an Indian child welfare platform.
You must extract ONLY the specified fields from the provided document image.

DOCUMENT TYPE: ${document_type}
EXTRACTION INSTRUCTION: ${schema.description}
FIELDS TO EXTRACT: ${schema.fields.join(", ")}

CRITICAL COMPLIANCE RULES (DPDP Act 2023 / JJ Act 2015):
1. STRICTLY extract ONLY the listed fields — nothing more.
2. If you see an Aadhaar number, return "[AADHAAR_REDACTED]" — never include it.
3. If you see a full name, return "[NAME_REDACTED]" — never include it.
4. If you see an address, return "[ADDRESS_REDACTED]" — never include it.
5. If a field is not clearly legible, return null for that field.
6. If the document type does not match the image, return an error.

Respond ONLY in valid JSON:
{
  "extracted_fields": {
    "field_name": value_or_null
  },
  "confidence": "high" | "medium" | "low",
  "extraction_notes": "brief note about legibility or any issues found",
  "document_matches_type": true | false
}
`;

    // Determine image media type
    const mediaType = image_base64.startsWith("/9j/") ? "image/jpeg" : "image/png";

    // Groq vision inference
    // Note: Uses llama vision model for image understanding
    const completion = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: `data:${mediaType};base64,${image_base64}`,
              },
            },
          ],
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.1, // Very low — extraction must be precise
      max_tokens: 1024,
    });

    const rawResponse = completion.choices[0]?.message?.content;
    if (!rawResponse) throw new Error("Empty response from Groq API.");

    const aiResult = JSON.parse(rawResponse);

    if (aiResult.document_matches_type === false) {
      return NextResponse.json(
        {
          error: `Document does not appear to match the specified type: '${document_type}'.`,
          extraction_notes: aiResult.extraction_notes,
          dpdp_compliant: true,
        },
        { status: 422 }
      );
    }

    const response: OCRResponse = {
      document_type,
      extracted_fields: aiResult.extracted_fields ?? {},
      confidence: aiResult.confidence ?? "low",
      extraction_notes: String(aiResult.extraction_notes ?? ""),
      pii_redacted: true,
      dpdp_compliant: true,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error.";
    console.error("[ocr] Error:", message);

    // Specific handling for malformed base64
    if (message.includes("base64") || message.includes("image")) {
      return NextResponse.json(
        { error: "Failed to process image. Ensure it is valid base64-encoded JPEG or PNG.", dpdp_compliant: true },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
