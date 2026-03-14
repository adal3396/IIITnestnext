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
    const flagged = data?.filter((d) => !d.dpdp_compliant).length ?? 0;
    const dpdpScore = total > 0 ? (((total - flagged) / total) * 100).toFixed(1) : "100.0";
    const overrides = data?.filter((d) => d.human_override_applied).length ?? 0;

    return NextResponse.json({
        logs: data,
        metrics: {
            dpdpScore: parseFloat(dpdpScore),
            flaggedCount: flagged,
            totalLogs: total,
            overridesCount: overrides,
        },
    });
}
