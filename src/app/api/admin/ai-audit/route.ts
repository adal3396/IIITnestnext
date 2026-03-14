import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
    const { data, error } = await supabase
        .from("ai_audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Compute aggregate metrics
    const total = data?.length ?? 0;
    const flagged = data?.filter((d) => d.status === "Flagged").length ?? 0;
    const fairScore = total > 0 ? (((total - flagged) / total) * 100).toFixed(1) : "100.0";
    const avgConfidence = total > 0
        ? (data!.reduce((sum, d) => sum + (d.confidence ?? 0), 0) / total).toFixed(1)
        : "0.0";

    return NextResponse.json({
        logs: data,
        metrics: {
            fairScore: parseFloat(fairScore),
            flaggedCount: flagged,
            totalLogs: total,
            avgConfidence: parseFloat(avgConfidence),
        },
    });
}
