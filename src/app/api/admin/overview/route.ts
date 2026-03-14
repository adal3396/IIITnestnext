import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
    try {
        // Total approved orphanages
        const { count: totalOrphanages } = await supabase
            .from("orphanage_registrations")
            .select("*", { count: "exact", head: true })
            .eq("status", "approved");

        // Total pending verifications
        const { count: pendingVerifications } = await supabase
            .from("orphanage_registrations")
            .select("*", { count: "exact", head: true })
            .eq("status", "pending");

        // Total pending medical cases
        const { count: pendingMedical } = await supabase
            .from("medical_cases")
            .select("*", { count: "exact", head: true })
            .eq("status", "pending");

        // Total opportunities
        const { count: totalOpportunities } = await supabase
            .from("transition_opportunities")
            .select("*", { count: "exact", head: true })
            .eq("active", true);

        // Total open support tickets
        const { count: openTickets } = await supabase
            .from("support_tickets")
            .select("*", { count: "exact", head: true })
            .eq("status", "Open");

        // AI audit: latest score (average confidence of Fair decisions)
        const { data: auditData } = await supabase
            .from("ai_audit_logs")
            .select("confidence, status");

        const totalLogs = auditData?.length ?? 0;
        const flaggedCount = auditData?.filter((d) => d.status === "Flagged").length ?? 0;
        const fairScore = totalLogs > 0 ? (((totalLogs - flaggedCount) / totalLogs) * 100).toFixed(1) : "100.0";

        return NextResponse.json({
            totalOrphanages: totalOrphanages ?? 0,
            pendingVerifications: pendingVerifications ?? 0,
            pendingMedical: pendingMedical ?? 0,
            totalOpportunities: totalOpportunities ?? 0,
            openTickets: openTickets ?? 0,
            aiAuditScore: parseFloat(fairScore),
            flaggedDecisions: flaggedCount,
        });
    } catch {
        return NextResponse.json({ error: "Failed to fetch overview" }, { status: 500 });
    }
}
