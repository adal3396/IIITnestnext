/**
 * POST /api/ai/match-scheme
 *
 * Scheme Matcher Agent — Stage 2 (Logic-Rules Database)
 *
 * Stage 2 Enhancement: Replaces pure LLM matching with a local, deterministic
 * rule-evaluation engine that checks each scheme's hard criteria against the
 * profile BEFORE calling the LLM. This ensures:
 *  - No hallucinated scheme eligibility (LLM can't invent criteria)
 *  - Auditable, explainable local decisions
 *  - LLM only adds contextual reasoning for rule-matched schemes
 *
 * DPDP Act 2023: All profile data is sanitized. No PII sent to LLM.
 */

import { NextRequest, NextResponse } from "next/server";
import { groq } from "@/lib/groq";
import { sanitizeChildProfile, assertNoPII } from "@/lib/sanitize";

// -------------------------------------------------------------------
// Types
// -------------------------------------------------------------------
interface SchemeProfile {
  // Demographic
  age?: number;
  gender?: "male" | "female" | "other";
  orphan_type?: "single_parent" | "double_orphan" | "abandoned" | "surrendered";
  orphaned_due_to_covid?: boolean;

  // Education
  is_enrolled_in_school?: boolean;
  current_class?: number;           // 1-12, 13=college
  passed_class_10?: boolean;
  avg_grade_percent?: number;

  // Health
  has_health_insurance?: boolean;
  has_chronic_illness?: boolean;
  needs_hospitalization?: boolean;

  // Care Status
  in_institutional_care?: boolean;
  registered_with_cwc?: boolean;    // Child Welfare Committee

  // Economic
  has_bpl_card?: boolean;           // Below Poverty Line

  [key: string]: unknown;
}

interface SchemeRule {
  id: string;
  name: string;
  ministry: string;
  description: string;
  benefits: string;
  // Returns a score 0-100 based on hard rule evaluation
  evaluate: (p: SchemeProfile) => { score: number; matched: string[]; missed: string[] };
}

// -------------------------------------------------------------------
// Stage 2: Scheme Logic-Rules Database
// -------------------------------------------------------------------
const SCHEME_RULES: SchemeRule[] = [
  {
    id: "pm_cares_children",
    name: "PM CARES for Children",
    ministry: "Ministry of Women & Child Development",
    description: "Comprehensive support for children orphaned due to COVID-19.",
    benefits: "Free education till Class 12 or ITI/Diploma, health cover under Ayushman Bharat, Rs 10 lakh lump sum at age 23.",
    evaluate(p) {
      const matched: string[] = [];
      const missed: string[] = [];
      let score = 0;
      if (p.orphaned_due_to_covid) { score += 70; matched.push("Orphaned due to COVID-19"); }
      else missed.push("Must be orphaned due to COVID-19");
      if ((p.age ?? 99) < 18) { score += 20; matched.push("Age under 18"); }
      else missed.push("Age must be under 18");
      if (p.orphan_type === "double_orphan") { score += 10; matched.push("Both parents deceased"); }
      return { score, matched, missed };
    },
  },
  {
    id: "icps",
    name: "ICPS – Integrated Child Protection Scheme",
    ministry: "Ministry of Women & Child Development",
    description: "Financial assistance, residential care, and rehabilitation.",
    benefits: "Monthly maintenance allowance, non-institutional care support, reintegration services.",
    evaluate(p) {
      const matched: string[] = [];
      const missed: string[] = [];
      let score = 0;
      if (p.in_institutional_care) { score += 50; matched.push("Currently in institutional care"); }
      else missed.push("Must be in registered institutional care");
      if (p.registered_with_cwc) { score += 30; matched.push("Registered with Child Welfare Committee"); }
      else missed.push("Registration with CWC recommended");
      if (["double_orphan", "abandoned", "surrendered"].includes(p.orphan_type ?? "")) {
        score += 20;
        matched.push("Child in need of care and protection");
      }
      return { score, matched, missed };
    },
  },
  {
    id: "nsp_scholarship",
    name: "National Scholarship Portal (NSP) Schemes",
    ministry: "Ministry of Education",
    description: "Central and state scholarships for disadvantaged students.",
    benefits: "Annual scholarship of Rs 10,000–25,000 for school/college students.",
    evaluate(p) {
      const matched: string[] = [];
      const missed: string[] = [];
      let score = 0;
      if (p.is_enrolled_in_school) { score += 40; matched.push("Currently enrolled in school/college"); }
      else missed.push("Must be enrolled in a recognized school or college");
      if ((p.avg_grade_percent ?? 0) >= 50) { score += 30; matched.push("Meets minimum academic criteria (50%+)"); }
      else missed.push("Requires at least 50% marks in previous exam");
      if (p.has_bpl_card || p.in_institutional_care) { score += 20; matched.push("Financial need criteria met"); }
      if (p.orphan_type === "double_orphan" || p.orphan_type === "single_parent") {
        score += 10;
        matched.push("Orphan status qualifies for priority category");
      }
      return { score, matched, missed };
    },
  },
  {
    id: "post_matric_scholarship",
    name: "Post-Matric Scholarship (State Government)",
    ministry: "State Social Welfare Department",
    description: "Financial support for students who cleared Class 10.",
    benefits: "Course fees + maintenance allowance for Classes 11-12 and beyond.",
    evaluate(p) {
      const matched: string[] = [];
      const missed: string[] = [];
      let score = 0;
      if (p.passed_class_10) { score += 50; matched.push("Passed Class 10 exam"); }
      else missed.push("Must have passed Class 10 (Matriculation)");
      if ((p.current_class ?? 0) >= 11) { score += 30; matched.push("Currently in Class 11+ or higher education"); }
      else missed.push("Must be enrolled in Class 11 or above");
      if (p.has_bpl_card || p.in_institutional_care) { score += 20; matched.push("Financial need criteria met"); }
      return { score, matched, missed };
    },
  },
  {
    id: "ayushman_bharat",
    name: "Ayushman Bharat – PM-JAY",
    ministry: "Ministry of Health and Family Welfare",
    description: "Health insurance for secondary and tertiary hospitalization.",
    benefits: "Rs 5 lakh per year health cover per family/individual.",
    evaluate(p) {
      const matched: string[] = [];
      const missed: string[] = [];
      let score = 0;
      if (!p.has_health_insurance) { score += 40; matched.push("No existing health insurance coverage"); }
      if (p.has_bpl_card || p.in_institutional_care) { score += 35; matched.push("Income/care criteria met"); }
      else missed.push("BPL card or institutional care status needed");
      if (p.has_chronic_illness || p.needs_hospitalization) {
        score += 25;
        matched.push("Active health need identified");
      }
      return { score, matched, missed };
    },
  },
  {
    id: "bal_swaraj",
    name: "Bal Swaraj Portal (NCPCR)",
    ministry: "National Commission for Protection of Child Rights",
    description: "Online tracking and case management for children in need of care.",
    benefits: "Case tracking, entitlement linking, and district-level intervention coordination.",
    evaluate(p) {
      const matched: string[] = [];
      const missed: string[] = [];
      let score = 0;
      if (p.in_institutional_care) { score += 50; matched.push("Child in institutional care — registration required"); }
      else missed.push("Must be in a registered institutional care facility");
      if (!p.registered_with_cwc) { score += 30; matched.push("Not yet CWC-registered — registration through Bal Swaraj needed"); }
      else { score += 10; matched.push("Already CWC-registered — profile update recommended"); }
      if ((p.age ?? 99) < 18) { score += 20; matched.push("Under 18 — eligible for CNCP tracking"); }
      return { score, matched, missed };
    },
  },
  {
    id: "antyodaya_anna_yojana",
    name: "Antyodaya Anna Yojana",
    ministry: "Ministry of Consumer Affairs, Food & Public Distribution",
    description: "Subsidized food grain for the poorest households.",
    benefits: "35 kg food grain per month at Rs 2/kg (wheat) and Rs 3/kg (rice).",
    evaluate(p) {
      const matched: string[] = [];
      const missed: string[] = [];
      let score = 0;
      if (p.has_bpl_card) { score += 50; matched.push("BPL card holder — meets primary criteria"); }
      else missed.push("BPL/Antyodaya card required");
      if (p.orphan_type === "double_orphan" || p.orphan_type === "abandoned") {
        score += 30;
        matched.push("Destitute/full orphan — priority AAY category");
      }
      if (p.in_institutional_care) { score += 20; matched.push("In institutional care — bulk allocation possible"); }
      return { score, matched, missed };
    },
  },
];

// -------------------------------------------------------------------
// Response Types
// -------------------------------------------------------------------
interface SchemeMatchResult {
  scheme_id: string;
  scheme_name: string;
  ministry: string;
  benefits: string;
  eligibility_score: number;
  matched_criteria: string[];
  missing_criteria: string[];
  application_priority: "immediate" | "recommended" | "optional";
  reasoning: string;
}

interface MatchSchemeResponse {
  matched_schemes: SchemeMatchResult[];
  total_matches: number;
  top_priority_scheme: string | null;
  missing_documents_hint: string[];
  dpdp_compliant: boolean;
}

function getPriority(score: number): SchemeMatchResult["application_priority"] {
  if (score >= 70) return "immediate";
  if (score >= 45) return "recommended";
  return "optional";
}

// -------------------------------------------------------------------
// Route Handler
// -------------------------------------------------------------------
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: { profile: SchemeProfile } = await request.json();

    if (!body.profile || typeof body.profile !== "object") {
      return NextResponse.json(
        { error: "Missing or invalid 'profile' in request body." },
        { status: 400 }
      );
    }

    // Step 1: Sanitize
    const sanitizedProfile = sanitizeChildProfile(body.profile as Record<string, unknown>);
    assertNoPII(sanitizedProfile);

    // Step 2: Evaluate all schemes via local logic rules (deterministic)
    const ruleResults = SCHEME_RULES.map((scheme) => {
      const result = scheme.evaluate(body.profile);
      return { scheme, result };
    })
      .filter(({ result }) => result.score >= 40)
      .sort((a, b) => b.result.score - a.result.score);

    if (ruleResults.length === 0) {
      return NextResponse.json({
        matched_schemes: [],
        total_matches: 0,
        top_priority_scheme: null,
        missing_documents_hint: ["No schemes matched with ≥40% eligibility based on available profile data."],
        dpdp_compliant: true,
      } as MatchSchemeResponse);
    }

    // Step 3: LLM adds humanized reasoning for each matched scheme
    const schemesSummary = ruleResults.map(({ scheme, result }) => ({
      id: scheme.id,
      name: scheme.name,
      score: result.score,
      matched: result.matched,
      missing: result.missed,
    }));

    const prompt = `
You are a Government Scheme eligibility advisor for NextNest (India).
A rule engine has already determined eligibility. Your job is ONLY to write a single, concise
reasoning sentence for each scheme explaining the match in plain language for orphanage staff.
NEVER include any PII. Each reasoning must reference only the matched criteria provided.

Schemes matched by rule engine:
${JSON.stringify(schemesSummary, null, 2)}

Respond ONLY in valid JSON:
{
  "reasonings": {
    "scheme_id": "one sentence reasoning for this scheme"
  },
  "missing_documents_hint": ["document or action needed to fully apply"]
}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.2,
      max_tokens: 1024,
    });

    const rawResponse = completion.choices[0]?.message?.content;
    if (!rawResponse) throw new Error("Empty response from Groq API.");
    const aiResult = JSON.parse(rawResponse);
    const reasonings: Record<string, string> = aiResult.reasonings ?? {};

    // Step 4: Compose final response
    const matchedSchemes: SchemeMatchResult[] = ruleResults.map(({ scheme, result }) => ({
      scheme_id: scheme.id,
      scheme_name: scheme.name,
      ministry: scheme.ministry,
      benefits: scheme.benefits,
      eligibility_score: result.score,
      matched_criteria: result.matched,
      missing_criteria: result.missed,
      application_priority: getPriority(result.score),
      reasoning: reasonings[scheme.id] ?? "Eligibility confirmed by rule evaluation.",
    }));

    const topPriority = matchedSchemes.find((m) => m.application_priority === "immediate");

    return NextResponse.json({
      matched_schemes: matchedSchemes,
      total_matches: matchedSchemes.length,
      top_priority_scheme: topPriority?.scheme_name ?? null,
      missing_documents_hint: Array.isArray(aiResult.missing_documents_hint)
        ? aiResult.missing_documents_hint
        : [],
      dpdp_compliant: true,
    } as MatchSchemeResponse, { status: 200 });

  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error.";
    if (message.startsWith("[DPDP VIOLATION]")) {
      return NextResponse.json({ error: message, dpdp_compliant: false }, { status: 403 });
    }
    console.error("[match-scheme] Error:", message);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
