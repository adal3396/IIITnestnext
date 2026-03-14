// AI Engine Developer Working Directory
// This is your working area for all AI-related API routes.
//
// Use the Groq client from src/lib/groq.ts for AI inference (server-side only).
// Use the Supabase client from src/lib/supabase.ts for database access.
//
// Example: POST /api/ai
// Add your AI routes here or create sub-folders like:
//   src/app/api/ai/match/route.ts
//   src/app/api/ai/recommend/route.ts

import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({ message: "AI Engine API is ready." });
}
