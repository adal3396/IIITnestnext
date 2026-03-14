/**
 * GET /api/ai
 *
 * NextNest AI Engine — Health & Discovery Endpoint
 *
 * Returns status of all deployed AI agents and their endpoints.
 * No authentication required for this route (public health check).
 */

import { NextResponse } from "next/server";

const STAGE = 1;

const AGENTS = [
  {
    name: "Predictive Risk Agent",
    endpoint: "/api/ai/predict-risk",
    method: "POST",
    stage: 1,
    status: "active",
    description:
      "Analyzes anonymized behavioral and academic indicators to produce a 0–100 dropout/vulnerability risk score.",
    dpdp_compliant: true,
  },
  {
    name: "Scheme Matcher",
    endpoint: "/api/ai/match-scheme",
    method: "POST",
    stage: 1,
    status: "active",
    description:
      "Maps anonymized child profile data against Indian Government welfare schemes (PM CARES, NSP, Ayushman Bharat, etc.).",
    dpdp_compliant: true,
  },
  {
    name: "Philanthropy Advisor",
    endpoint: "/api/ai/advisor",
    method: "POST",
    stage: 1,
    status: "active",
    description:
      "Guides donors toward highest-impact giving opportunities using aggregated orphanage statistics. No individual PII processed.",
    dpdp_compliant: true,
  },
  {
    name: "Document OCR Agent",
    endpoint: "/api/ai/ocr",
    method: "POST",
    stage: 2,
    status: "planned",
    description: "Parses physical document uploads into structured JSON using Vision APIs.",
    dpdp_compliant: true,
  },
  {
    name: "Transition Matcher",
    endpoint: "/api/ai/transition-match",
    method: "POST",
    stage: 2,
    status: "planned",
    description:
      "Vector-matches youth skills to real-world job, mentor, and housing opportunities for post-18 support.",
    dpdp_compliant: true,
  },
];

export async function GET() {
  return NextResponse.json({
    service: "NextNest AI Engine",
    current_stage: STAGE,
    total_agents: AGENTS.length,
    active_agents: AGENTS.filter((a) => a.status === "active").length,
    compliance: "DPDP Act 2023 | JJ Act 2015",
    agents: AGENTS,
  });
}
