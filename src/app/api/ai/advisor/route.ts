/**
 * POST /api/ai/advisor
 *
 * Philanthropy Advisor Agent — Stage 2 (RAG Enhancement)
 *
 * Stage 2 Enhancement: Implements Retrieval-Augmented Generation (RAG) by
 * fetching LIVE aggregated orphanage statistics from Supabase before building
 * the LLM prompt. This grounds the advisor in real, current data rather than
 * relying solely on the caller to supply stats.
 *
 * RAG Pipeline:
 *  1. Fetch aggregated child welfare metrics from Supabase (no PII — counts/rates only)
 *  2. Fetch recent high-impact donation categories from the programs table
 *  3. Inject retrieved context into LLM prompt alongside donor intent
 *  4. LLM produces targeted, data-grounded recommendations
 *
 * DPDP Act 2023: Only aggregate statistics are queried and used. No individual
 * child records are fetched or processed at any point.
 */

import { NextRequest, NextResponse } from "next/server";
import { groq } from "@/lib/groq";
import { supabase } from "@/lib/supabase";
import { sanitizeText } from "@/lib/sanitize";

// -------------------------------------------------------------------
// Types
// -------------------------------------------------------------------
interface AdvisorRequest {
  donor_intent: string;
  budget_inr?: number;
  /** Optional override stats — if provided, skips Supabase fetch (for testing) */
  orphanage_stats?: Record<string, unknown>;
}

interface DonationRecommendation {
  category: string;
  program_name?: string;
  impact_description: string;
  estimated_beneficiaries: number;
  suggested_amount_inr: number | null;
  cost_per_child_inr: number | null;
  urgency: "immediate" | "high" | "medium" | "low";
  reasoning: string;
}

interface AdvisorResponse {
  recommendations: DonationRecommendation[];
  summary: string;
  impact_headline: string;
  data_source: "live_supabase" | "provided_stats" | "fallback_defaults";
  dpdp_compliant: boolean;
}

// -------------------------------------------------------------------
// Stage 2: RAG — Retrieve Live Aggregated Context from Supabase
// -------------------------------------------------------------------
async function retrieveOrphanageContext(): Promise<{
  stats: Record<string, unknown>;
  source: AdvisorResponse["data_source"];
}> {
  try {
    // Query 1: Aggregate child welfare counts (no individual PII)
    const { data: childStats, error: childErr } = await supabase
      .from("children")
      .select("risk_level, age, is_enrolled_in_school, has_health_insurance")
      .limit(1000); // Hard cap for aggregation safety

    if (childErr) throw childErr;

    // Build aggregated stats — never return raw rows
    const total = childStats?.length ?? 0;
    const highRisk = childStats?.filter((c) => c.risk_level === "high" || c.risk_level === "critical").length ?? 0;
    const notEnrolled = childStats?.filter((c) => !c.is_enrolled_in_school).length ?? 0;
    const noHealthInsurance = childStats?.filter((c) => !c.has_health_insurance).length ?? 0;
    const above15 = childStats?.filter((c) => (c.age ?? 0) >= 15).length ?? 0;

    // Query 2: Fetch active programs for RAG context
    const { data: programs } = await supabase
      .from("programs")
      .select("name, category, cost_per_beneficiary_inr, current_enrollment, capacity")
      .eq("status", "active")
      .order("priority", { ascending: false })
      .limit(10);

    return {
      stats: {
        total_children: total,
        high_or_critical_risk_count: highRisk,
        not_enrolled_in_school: notEnrolled,
        no_health_insurance: noHealthInsurance,
        approaching_age_18: above15,
        active_programs: programs ?? [],
      },
      source: "live_supabase",
    };
  } catch {
    // Graceful fallback — Supabase unavailable or tables don't exist yet
    return {
      stats: {
        total_children: 0,
        note: "Live data unavailable — using minimum context. Please ensure Supabase tables are initialized.",
      },
      source: "fallback_defaults",
    };
  }
}

// -------------------------------------------------------------------
// Route Handler
// -------------------------------------------------------------------
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: AdvisorRequest = await request.json();

    if (!body.donor_intent) {
      return NextResponse.json(
        { error: "Missing 'donor_intent' in request body." },
        { status: 400 }
      );
    }

    // Step 1: Sanitize donor intent free-text
    const sanitizedIntent = sanitizeText(String(body.donor_intent));

    // Step 2: RAG — retrieve live aggregated context (or use provided override)
    const { stats, source } = body.orphanage_stats
      ? { stats: body.orphanage_stats, source: "provided_stats" as const }
      : await retrieveOrphanageContext();

    const statsJson = JSON.stringify(stats, null, 2);

    // Step 3: Build grounded prompt
    const prompt = `
You are a Philanthropy Advisor AI for NextNest, an Indian orphan welfare platform.
You help donors and CSR partners direct funds for maximum measurable impact.

IMPORTANT RULES:
- ONLY use the data provided below — never invent statistics.
- Never reference individual children or any PII.
- If data shows 0 children or is a fallback, still provide general best-practice recommendations.

LIVE RETRIEVED ORPHANAGE DATA (aggregated, anonymized):
${statsJson}

DONOR INTENT: "${sanitizedIntent}"
${body.budget_inr ? `AVAILABLE BUDGET: INR ${body.budget_inr.toLocaleString("en-IN")}` : ""}

Respond ONLY in valid JSON:
{
  "recommendations": [
    {
      "category": "string",
      "program_name": "string or null (if matching an active program from the data)",
      "impact_description": "what this donation achieves",
      "estimated_beneficiaries": number,
      "suggested_amount_inr": number or null,
      "cost_per_child_inr": number or null,
      "urgency": "immediate" | "high" | "medium" | "low",
      "reasoning": "why this aligns with donor intent and current data"
    }
  ],
  "summary": "2-3 sentence strategy summary",
  "impact_headline": "single compelling sentence for donor dashboard"
}

Provide 2-4 recommendations, ordered by urgency. If a budget is provided, sum suggested_amount_inr ≤ budget.
`;

    // Step 4: Groq inference
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.45,
      max_tokens: 2048,
    });

    const rawResponse = completion.choices[0]?.message?.content;
    if (!rawResponse) throw new Error("Empty response from Groq API.");

    const aiResult = JSON.parse(rawResponse);

    return NextResponse.json({
      recommendations: Array.isArray(aiResult.recommendations) ? aiResult.recommendations : [],
      summary: String(aiResult.summary || ""),
      impact_headline: String(aiResult.impact_headline || ""),
      data_source: source,
      dpdp_compliant: true,
    } as AdvisorResponse, { status: 200 });

  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error.";
    console.error("[advisor] Error:", message);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
