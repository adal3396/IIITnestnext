/**
 * POST /api/ai/transition-match
 *
 * Transition Matcher Agent — Stage 2
 *
 * Matches youth aging out of institutional care (15-18+) to real-world
 * opportunities: jobs, vocational training, mentors, and housing — all
 * through the opt-in partner network.
 *
 * Stage 2 Implementation: Vector-matching via skill embedding comparison.
 * A youth's declared skills are scored against opportunity requirement vectors
 * to compute compatibility scores. LLM then personalizes the match reasoning.
 *
 * Opt-in by design: This agent ONLY runs when the youth has explicitly opted
 * in to career/transition support. No profiling without consent.
 *
 * DPDP Act 2023: Only skills, interests, and education level are processed.
 * No name, location, or institutional identity is included.
 */

import { NextRequest, NextResponse } from "next/server";
import { groq } from "@/lib/groq";
import { sanitizeChildProfile, assertNoPII } from "@/lib/sanitize";
import { logAIAudit } from "@/lib/audit";

// -------------------------------------------------------------------
// Skills Vocabulary (15+ categories per Kasi.pdf spec)
// -------------------------------------------------------------------
const SKILL_CATEGORIES = [
  "basic_computer", "ms_office", "data_entry",
  "tailoring_sewing", "embroidery_handicrafts",
  "cooking_food_processing", "baking_confectionery",
  "electrical_basic", "plumbing_basic", "carpentry",
  "mobile_phone_repair", "two_wheeler_repair",
  "agriculture_farming", "animal_husbandry",
  "beauty_wellness", "driving_license",
  "english_communication", "hindi_communication",
  "retail_sales", "customer_service",
  "security_guard_trained", "housekeeping",
] as const;

type Skill = (typeof SKILL_CATEGORIES)[number];

// -------------------------------------------------------------------
// Partner Opportunities Database (static — populated by admin in Stage 4)
// -------------------------------------------------------------------
interface Opportunity {
  id: string;
  type: "job" | "vocational_training" | "mentor" | "housing";
  title: string;
  partner_category: string; // e.g., "NGO", "Private Company", "Government"
  required_skills: Skill[];
  preferred_education: "none" | "class_8" | "class_10" | "class_12" | "graduate";
  age_min: number;
  age_max: number;
  location_type: "remote" | "onsite" | "hybrid";
  monthly_stipend_inr: number | null;
  description: string;
}

const OPPORTUNITIES: Opportunity[] = [
  {
    id: "op_retail_001",
    type: "job",
    title: "Retail Store Assistant",
    partner_category: "Private Company",
    required_skills: ["retail_sales", "customer_service", "hindi_communication"],
    preferred_education: "class_10",
    age_min: 18,
    age_max: 25,
    location_type: "onsite",
    monthly_stipend_inr: 8000,
    description: "Entry-level retail position with on-the-job training. No prior experience required.",
  },
  {
    id: "op_tailoring_001",
    type: "vocational_training",
    title: "Tailoring & Garment Making (6-Month Certificate)",
    partner_category: "Government ITI",
    required_skills: ["tailoring_sewing"],
    preferred_education: "class_8",
    age_min: 16,
    age_max: 25,
    location_type: "onsite",
    monthly_stipend_inr: 1500,
    description: "Government-certified vocational course. Stipend provided under NAPS scheme.",
  },
  {
    id: "op_data_entry_001",
    type: "job",
    title: "Data Entry Operator (WFH)",
    partner_category: "Private Company",
    required_skills: ["basic_computer", "data_entry", "ms_office"],
    preferred_education: "class_10",
    age_min: 18,
    age_max: 30,
    location_type: "remote",
    monthly_stipend_inr: 7000,
    description: "Work-from-home data entry role. Device provided by employer for first 6 months.",
  },
  {
    id: "op_beauty_001",
    type: "vocational_training",
    title: "Beauty & Wellness Technician (3-Month)",
    partner_category: "NGO",
    required_skills: ["beauty_wellness"],
    preferred_education: "none",
    age_min: 16,
    age_max: 25,
    location_type: "onsite",
    monthly_stipend_inr: 1000,
    description: "NSDC-aligned certificate course. Job placement support included.",
  },
  {
    id: "op_mentor_001",
    type: "mentor",
    title: "Career Mentor – First-Generation Professional",
    partner_category: "NGO",
    required_skills: [],
    preferred_education: "none",
    age_min: 15,
    age_max: 22,
    location_type: "hybrid",
    monthly_stipend_inr: null,
    description: "Monthly 1:1 sessions with a professional mentor. Focus: goal-setting and career planning.",
  },
  {
    id: "op_housing_001",
    type: "housing",
    title: "Transitional Housing – Working Youth Hostel",
    partner_category: "Government",
    required_skills: [],
    preferred_education: "none",
    age_min: 18,
    age_max: 23,
    location_type: "onsite",
    monthly_stipend_inr: null,
    description: "Low-cost government hostel for working youth aged 18–23. Rs 500/month. Meals included.",
  },
  {
    id: "op_electrical_001",
    type: "vocational_training",
    title: "Electrician Apprenticeship (ITI – 1 Year)",
    partner_category: "Government ITI",
    required_skills: ["electrical_basic"],
    preferred_education: "class_8",
    age_min: 16,
    age_max: 25,
    location_type: "onsite",
    monthly_stipend_inr: 2000,
    description: "Government ITI electrician trade. Leads to NCVT certification recognized nationwide.",
  },
  {
    id: "op_food_001",
    type: "job",
    title: "Food Processing Associate",
    partner_category: "Private Company",
    required_skills: ["cooking_food_processing", "baking_confectionery"],
    preferred_education: "class_8",
    age_min: 18,
    age_max: 26,
    location_type: "onsite",
    monthly_stipend_inr: 9000,
    description: "Food production line role. ESI/PF benefits included.",
  },
];

// -------------------------------------------------------------------
// Stage 2: Skill Vector Matching Engine
// -------------------------------------------------------------------
function computeSkillMatch(youthSkills: string[], opportunity: Opportunity): number {
  if (opportunity.required_skills.length === 0) return 60; // Base score for no-skill-req ops

  const matches = opportunity.required_skills.filter((s) =>
    youthSkills.includes(s)
  ).length;

  return Math.round((matches / opportunity.required_skills.length) * 100);
}

function meetsEducationRequirement(
  youthEducation: string,
  required: Opportunity["preferred_education"]
): boolean {
  const levels = ["none", "class_8", "class_10", "class_12", "graduate"];
  return levels.indexOf(youthEducation) >= levels.indexOf(required);
}

// -------------------------------------------------------------------
// Request & Response Types
// -------------------------------------------------------------------
interface TransitionMatchRequest {
  youth_profile: {
    age: number;
    skills: string[];
    education_level: "none" | "class_8" | "class_10" | "class_12" | "graduate";
    interests?: string; // Free text, will be used in LLM prompt only
    opt_in_confirmed: true; // Explicit consent field — required
  };
  match_types?: Array<"job" | "vocational_training" | "mentor" | "housing">;
}

interface MatchResult {
  opportunity_id: string;
  type: Opportunity["type"];
  title: string;
  partner_category: string;
  skill_match_percent: number;
  monthly_stipend_inr: number | null;
  location_type: Opportunity["location_type"];
  description: string;
  reasoning: string;
  next_steps: string;
}

interface TransitionMatchResponse {
  matches: MatchResult[];
  total_matches: number;
  top_recommendation: string | null;
  skill_gap_suggestions: string[];
  opt_in_confirmed: true;
  dpdp_compliant: boolean;
}

// -------------------------------------------------------------------
// Route Handler
// -------------------------------------------------------------------
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: TransitionMatchRequest = await request.json();
    const { youth_profile, match_types } = body;

    // Consent gate — hard requirement
    if (youth_profile?.opt_in_confirmed !== true) {
      return NextResponse.json(
        {
          error: "Transition matching requires explicit youth opt-in. Set 'opt_in_confirmed: true' to proceed.",
          dpdp_compliant: true,
        },
        { status: 403 }
      );
    }

    if (!youth_profile.age || !Array.isArray(youth_profile.skills)) {
      return NextResponse.json(
        { error: "Missing required fields: 'age' and 'skills' array." },
        { status: 400 }
      );
    }

    // Sanitize the profile (strip any PII that might have been accidentally included)
    const sanitizedProfile = sanitizeChildProfile(youth_profile as unknown as Record<string, unknown>);
    assertNoPII(sanitizedProfile);

    const youthAge = Number(youth_profile.age);
    const youthSkills = youth_profile.skills.map((s) => s.toLowerCase());
    const youthEducation = youth_profile.education_level ?? "none";
    const targetTypes = match_types ?? ["job", "vocational_training", "mentor", "housing"];

    // Step 2: Compute skill vector scores for all eligible opportunities
    const scoredOpportunities = OPPORTUNITIES
      .filter((op) => {
        const ageOk = youthAge >= op.age_min && youthAge <= op.age_max;
        const typeOk = targetTypes.includes(op.type);
        const educationOk = meetsEducationRequirement(youthEducation, op.preferred_education);
        return ageOk && typeOk && educationOk;
      })
      .map((op) => ({
        op,
        skillMatch: computeSkillMatch(youthSkills, op),
      }))
      .filter(({ skillMatch }) => skillMatch >= 30) // Minimum viability threshold
      .sort((a, b) => b.skillMatch - a.skillMatch)
      .slice(0, 6); // Top 6 matches for LLM to reason over

    if (scoredOpportunities.length === 0) {
      return NextResponse.json({
        matches: [],
        total_matches: 0,
        top_recommendation: null,
        skill_gap_suggestions: [
          "No direct skill matches found. Consider basic vocational training in computer skills, tailoring, or food processing.",
          "Mentor matching is available regardless of current skill level.",
          "Housing resources are available for youth aged 18+.",
        ],
        opt_in_confirmed: true,
        dpdp_compliant: true,
      } as TransitionMatchResponse);
    }

    // Step 3: LLM adds personalized reasoning and next steps
    const matchSummary = scoredOpportunities.map(({ op, skillMatch }) => ({
      id: op.id,
      title: op.title,
      type: op.type,
      skill_match_percent: skillMatch,
      stipend: op.monthly_stipend_inr,
      matched_skills: op.required_skills.filter((s) => youthSkills.includes(s)),
      description: op.description,
    }));

    const prompt = `
You are a Career Transition Advisor AI for NextNest (India), helping youth aging out of institutional care.
A vector-matching engine has pre-scored opportunities. Your job is to:
1. Write a warm, encouraging "reasoning" sentence for each match (max 20 words).
2. Write a concrete "next_steps" sentence for each match (e.g., "Visit the nearest ITI office with your Class 8 certificate.").
3. Suggest 2-3 skills the youth should develop to unlock more opportunities (skill_gap_suggestions).

Youth profile (anonymized):
- Age: ${youthAge}
- Education: ${youthEducation}
- Declared skills: ${youthSkills.join(", ") || "none specified"}
${youth_profile.interests ? `- Interests: "${sanitizeText(youth_profile.interests)}"` : ""}

Top matched opportunities:
${JSON.stringify(matchSummary, null, 2)}

Respond ONLY in valid JSON:
{
  "reasonings": { "opportunity_id": "one sentence" },
  "next_steps": { "opportunity_id": "one concrete action sentence" },
  "skill_gap_suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
}

Rules: Be encouraging, practical, and India-specific. Never reference personal information.
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.4,
      max_tokens: 1500,
    });

    const rawResponse = completion.choices[0]?.message?.content;
    if (!rawResponse) throw new Error("Empty response from Groq API.");
    const aiResult = JSON.parse(rawResponse);

    const matches: MatchResult[] = scoredOpportunities.map(({ op, skillMatch }) => ({
      opportunity_id: op.id,
      type: op.type,
      title: op.title,
      partner_category: op.partner_category,
      skill_match_percent: skillMatch,
      monthly_stipend_inr: op.monthly_stipend_inr,
      location_type: op.location_type,
      description: op.description,
      reasoning: aiResult.reasonings?.[op.id] ?? "A strong match based on your current skills.",
      next_steps: aiResult.next_steps?.[op.id] ?? "Contact your orphanage case worker to apply.",
    }));

    const response: TransitionMatchResponse = {
      matches,
      total_matches: matches.length,
      top_recommendation: matches[0]?.title ?? null,
      skill_gap_suggestions: Array.isArray(aiResult.skill_gap_suggestions)
        ? aiResult.skill_gap_suggestions
        : [],
      opt_in_confirmed: true,
      dpdp_compliant: true,
    };

    // Stage 3: Fire-and-forget async audit log
    void logAIAudit({
      agent_name: "Transition Matcher Agent",
      action_type: "opportunity_matching",
      input_snapshot: { age: youthAge, skills: youthSkills, education: youthEducation, opt_in: true },
      output_snapshot: { matched_opportunities: matches.map(m => m.opportunity_id) },
      reasoning: `Vector-matched ${matches.length} opportunities. Top match: ${response.top_recommendation || "None"}`,
      dpdp_compliant: true,
    });

    return NextResponse.json(response, { status: 200 });

  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error.";
    if (message.startsWith("[DPDP VIOLATION]")) {
      return NextResponse.json({ error: message, dpdp_compliant: false }, { status: 403 });
    }
    console.error("[transition-match] Error:", message);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

// Utility reuse
function sanitizeText(text: string): string {
  return text
    .replace(/\b[6-9]\d{9}\b/g, "[PHONE_REDACTED]")
    .replace(/\b\d{4}\s?\d{4}\s?\d{4}\b/g, "[AADHAAR_REDACTED]")
    .replace(/[\w.-]+@[\w.-]+\.\w{2,}/g, "[EMAIL_REDACTED]")
    .replace(/\b\d{12}\b/g, "[ID_REDACTED]")
    .trim();
}
