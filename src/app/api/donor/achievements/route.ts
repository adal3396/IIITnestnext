import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export type Achievement = {
  id: string;
  title: string;
  description_anon: string;
  category: string;
  created_at: string;
};

/**
 * GET /api/donor/achievements
 * Returns anonymized milestones for the achievement portal (no PII).
 */
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("achievements")
      .select("id, title, description_anon, category, created_at")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      if (error.code === "42P01") {
        return NextResponse.json([]);
      }
      console.error("[donor/achievements] Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json((data ?? []) as Achievement[]);
  } catch (err) {
    console.error("[donor/achievements] Error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
