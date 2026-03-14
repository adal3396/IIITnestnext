/**
 * POST /api/ai/predict-risk
 *
 * Predictive Risk Agent — Stage 2 (Weighted Scoring Algorithm)
 *
 * Stage 2 Enhancement: Implements a local deterministic weighted scoring engine
 * BEFORE calling the LLM. This produces consistent, auditable base scores that
 * the LLM then explains with contextual reasoning. This separates the "what"
 * (deterministic score) from the "why" (LLM explanation).
 *
 * SCORING DIMENSIONS (total = 100 points):
 *  - Academic Performance (30 pts)
 *  - Attendance & Engagement (20 pts)
 *  - Behavioral Indicators (20 pts)
 *  - Nutritional & Health Status (15 pts)
 *  - Environmental Stability (15 pts)
 *
 * DPDP Act 2023: All profile data is sanitized. No PII is processed or stored.
 */

import { NextRequest, NextResponse } from "next/server";
import { groq } from "@/lib/groq";
import { sanitizeChildProfile, assertNoPII } from "@/lib/sanitize";
import { logAIAudit } from "@/lib/audit";

// -------------------------------------------------------------------
// Request & Response Types
// -------------------------------------------------------------------
interface PredictRiskRequest {
  profile: {
    // Academic (30 pts)
    avg_grade_percent?: number;       // 0-100
    failed_subjects_count?: number;   // 0-N
    homework_completion_rate?: number; // 0-100 percent

    // Attendance (20 pts)
    attendance_rate?: number;         // 0-100 percent
    consecutive_absences?: number;    // days

    // Behavioral (20 pts)
    disciplinary_incidents_3mo?: number;
    peer_conflict_score?: number;     // 1-5 (1=none, 5=severe)
    self_harm_flag?: boolean;

    // Health / Nutritional (15 pts)
    bmi_status?: "normal" | "underweight" | "severely_underweight" | "overweight";
    chronic_illness?: boolean;
    missed_medical_checkups?: number; // count this year

    // Environmental (15 pts)
    guardian_visit_frequency?: "weekly" | "monthly" | "rarely" | "never" | "no_guardian";
    recent_trauma_event?: boolean;
    years_in_institutional_care?: number;

    // Allow additional anonymized fields
    [key: string]: unknown;
  };
}

interface WeightedScore {
  academic: number;
  attendance: number;
  behavioral: number;
  health: number;
  environmental: number;
  total: number;
}

interface PredictRiskResponse {
  risk_score: number;
  risk_level: "low" | "moderate" | "high" | "critical";
  score_breakdown: WeightedScore;
  risk_factors: string[];
  reasoning: string;
  recommendations: string[];
  dpdp_compliant: boolean;
}

// -------------------------------------------------------------------
// Stage 2: Deterministic Weighted Scoring Engine
// -------------------------------------------------------------------
function computeWeightedScore(profile: PredictRiskRequest["profile"]): {
  scores: WeightedScore;
  flags: string[];
} {
  const flags: string[] = [];
  let academic = 0;
  let attendance = 0;
  let behavioral = 0;
  let health = 0;
  let environmental = 0;

  // ── ACADEMIC (max 30) ────────────────────────────────────────────
  const grade = profile.avg_grade_percent ?? 60;
  if (grade < 35) {
    academic += 30;
    flags.push("Critically low academic performance (below passing threshold)");
  } else if (grade < 50) {
    academic += 20;
    flags.push("Below-average academic performance");
  } else if (grade < 65) {
    academic += 10;
  }

  const failedSubjects = profile.failed_subjects_count ?? 0;
  if (failedSubjects >= 3) {
    academic = Math.min(30, academic + 10);
    flags.push("Multiple subject failures this term");
  }

  const hwRate = profile.homework_completion_rate ?? 75;
  if (hwRate < 50) {
    academic = Math.min(30, academic + 5);
    flags.push("Low homework completion rate");
  }

  // ── ATTENDANCE (max 20) ──────────────────────────────────────────
  const attendance_rate = profile.attendance_rate ?? 80;
  if (attendance_rate < 60) {
    attendance += 20;
    flags.push("Attendance critically low — below 60%");
  } else if (attendance_rate < 75) {
    attendance += 14;
    flags.push("Attendance below recommended minimum (75%)");
  } else if (attendance_rate < 85) {
    attendance += 7;
  }

  const absences = profile.consecutive_absences ?? 0;
  if (absences >= 10) {
    attendance = Math.min(20, attendance + 8);
    flags.push(`${absences} consecutive days absent — immediate follow-up needed`);
  } else if (absences >= 5) {
    attendance = Math.min(20, attendance + 4);
  }

  // ── BEHAVIORAL (max 20) ──────────────────────────────────────────
  const incidents = profile.disciplinary_incidents_3mo ?? 0;
  if (incidents >= 5) {
    behavioral += 12;
    flags.push("High disciplinary incident frequency in last 3 months");
  } else if (incidents >= 2) {
    behavioral += 6;
  }

  const conflictScore = profile.peer_conflict_score ?? 1;
  behavioral += Math.min(5, (conflictScore - 1) * 1.5);
  if (conflictScore >= 4) flags.push("Elevated peer conflict indicators");

  if (profile.self_harm_flag) {
    behavioral += 15;
    flags.push("Self-harm flag raised — urgent clinical assessment required");
  }
  behavioral = Math.min(20, behavioral);

  // ── HEALTH (max 15) ──────────────────────────────────────────────
  const bmiMap: Record<string, number> = {
    normal: 0,
    overweight: 3,
    underweight: 7,
    severely_underweight: 12,
  };
  health += bmiMap[profile.bmi_status ?? "normal"] ?? 0;
  if ((profile.bmi_status ?? "normal") === "severely_underweight") {
    flags.push("Severely underweight — nutritional intervention required");
  }

  if (profile.chronic_illness) {
    health = Math.min(15, health + 5);
    flags.push("Chronic illness requiring ongoing medical management");
  }

  const missedCheckups = profile.missed_medical_checkups ?? 0;
  if (missedCheckups >= 2) {
    health = Math.min(15, health + 3);
    flags.push("Multiple missed medical check-ups this year");
  }

  // ── ENVIRONMENTAL (max 15) ───────────────────────────────────────
  const visitMap: Record<string, number> = {
    weekly: 0,
    monthly: 3,
    rarely: 8,
    never: 12,
    no_guardian: 15,
  };
  environmental += visitMap[profile.guardian_visit_frequency ?? "monthly"] ?? 0;
  if ((profile.guardian_visit_frequency ?? "monthly") === "no_guardian") {
    flags.push("No guardian — fully dependent on institutional support");
  } else if ((profile.guardian_visit_frequency ?? "monthly") === "never") {
    flags.push("Guardian never visits — social isolation risk");
  }

  if (profile.recent_trauma_event) {
    environmental = Math.min(15, environmental + 8);
    flags.push("Recent trauma event reported — counseling support needed");
  }

  const yearsInCare = profile.years_in_institutional_care ?? 0;
  if (yearsInCare >= 10) {
    environmental = Math.min(15, environmental + 3);
    flags.push("Long-term institutionalization (10+ years) — reintegration risk");
  }

  const total = Math.min(100, academic + attendance + behavioral + health + environmental);

  return {
    scores: { academic, attendance, behavioral, health, environmental, total },
    flags,
  };
}

function classifyRisk(score: number): PredictRiskResponse["risk_level"] {
  if (score >= 75) return "critical";
  if (score >= 50) return "high";
  if (score >= 25) return "moderate";
  return "low";
}

// -------------------------------------------------------------------
// Route Handler
// -------------------------------------------------------------------
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: PredictRiskRequest = await request.json();

    if (!body.profile || typeof body.profile !== "object") {
      return NextResponse.json(
        { error: "Missing or invalid 'profile' in request body." },
        { status: 400 }
      );
    }

    // Step 1: Sanitize — strip PII
    const sanitizedProfile = sanitizeChildProfile(body.profile as Record<string, unknown>);
    assertNoPII(sanitizedProfile);

    // Step 2: Run deterministic weighted scoring engine (Stage 2)
    const { scores, flags } = computeWeightedScore(body.profile);

    // Step 3: LLM generates contextual reasoning & recommendations for the score
    const prompt = `
You are a child welfare AI for NextNest (India). A deterministic scoring system has calculated
a risk score for an anonymized child profile. Your job is to:
1. Write a concise, empathetic reasoning paragraph explaining what this score means.
2. Provide 3-5 specific, actionable early intervention recommendations for orphanage staff.

DO NOT re-score. Accept the score as ground truth. NEVER use any PII.

Risk Score: ${scores.total}/100
Risk Level: ${classifyRisk(scores.total).toUpperCase()}
Score Breakdown: Academic=${scores.academic}/30, Attendance=${scores.attendance}/20, Behavioral=${scores.behavioral}/20, Health=${scores.health}/15, Environmental=${scores.environmental}/15
Flagged Dimensions: ${flags.length > 0 ? flags.join("; ") : "None"}

Respond ONLY in valid JSON:
{
  "reasoning": "single paragraph contextual explanation (2-4 sentences, no PII)",
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"]
}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 1024,
    });

    const rawResponse = completion.choices[0]?.message?.content;
    if (!rawResponse) throw new Error("Empty response from Groq API.");

    const aiResult = JSON.parse(rawResponse);

    const response: PredictRiskResponse = {
      risk_score: scores.total,
      risk_level: classifyRisk(scores.total),
      score_breakdown: scores,
      risk_factors: flags,
      reasoning: String(aiResult.reasoning || ""),
      recommendations: Array.isArray(aiResult.recommendations) ? aiResult.recommendations : [],
      dpdp_compliant: true,
    };

    // Stage 3: Fire-and-forget async audit log
    void logAIAudit({
      agent_name: "Predictive Risk Agent",
      action_type: "risk_scoring",
      input_snapshot: sanitizedProfile,
      output_snapshot: { score: scores.total, level: response.risk_level, factors: flags },
      reasoning: response.reasoning,
      dpdp_compliant: true,
    });

    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error.";
    if (message.startsWith("[DPDP VIOLATION]")) {
      return NextResponse.json({ error: message, dpdp_compliant: false }, { status: 403 });
    }
    console.error("[predict-risk] Error:", message);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
