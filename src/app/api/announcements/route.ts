import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/**
 * GET /api/announcements?audience=Donors|Orphanages|All
 * Returns announcements for the given audience (and "All").
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const audience = searchParams.get("audience") || "All";

    const { data, error } = await supabase
      .from("announcements")
      .select("id, title, message, target_audience, created_at")
      .or(`target_audience.eq.${audience},target_audience.eq.All`)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (err: unknown) {
    console.error("[announcements]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch" },
      { status: 500 }
    );
  }
}
