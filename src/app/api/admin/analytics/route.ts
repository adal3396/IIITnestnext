import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
    // Fetch all transactions for trend analysis
    const { data: transactions, error: txErr } = await supabase
        .from("transactions_ledger")
        .select("orphanage_name, gross_amount, net_amount, created_at, transaction_type")
        .eq("status", "Completed")
        .order("created_at", { ascending: true });

    if (txErr) return NextResponse.json({ error: txErr.message }, { status: 500 });

    // Aggregate by orphanage for resource reallocation
    const orphanageMap: Record<string, { name: string; totalFunded: number; txCount: number }> = {};
    for (const t of transactions ?? []) {
        if (!orphanageMap[t.orphanage_name]) {
            orphanageMap[t.orphanage_name] = { name: t.orphanage_name, totalFunded: 0, txCount: 0 };
        }
        orphanageMap[t.orphanage_name].totalFunded += t.gross_amount;
        orphanageMap[t.orphanage_name].txCount += 1;
    }

    const orphanageFunding = Object.values(orphanageMap).sort((a, b) => b.totalFunded - a.totalFunded);
    const maxFunded = orphanageFunding[0]?.totalFunded ?? 1;

    const reallocationInsights = orphanageFunding.map((o) => ({
        ...o,
        fundingRatio: parseFloat(((o.totalFunded / maxFunded) * 100).toFixed(1)),
        status: o.totalFunded > maxFunded * 0.6 ? "Over-funded" : o.totalFunded < maxFunded * 0.3 ? "Under-funded" : "Balanced",
    }));

    // Build monthly trend (group by YYYY-MM)
    const monthlyMap: Record<string, number> = {};
    for (const t of transactions ?? []) {
        const month = t.created_at.slice(0, 7); // YYYY-MM
        monthlyMap[month] = (monthlyMap[month] ?? 0) + t.gross_amount;
    }
    const monthlyTrend = Object.entries(monthlyMap).map(([month, amount]) => ({ month, amount }));

    // Platform health KPIs
    const { count: totalOrphanages } = await supabase.from("orphanage_registrations").select("*", { count: "exact", head: true }).eq("status", "approved");
    const { count: pendingVerifications } = await supabase.from("orphanage_registrations").select("*", { count: "exact", head: true }).eq("status", "pending");
    const { count: openAlerts } = await supabase.from("fraud_alerts").select("*", { count: "exact", head: true }).eq("status", "Open");
    const { count: openTickets } = await supabase.from("support_tickets").select("*", { count: "exact", head: true }).eq("status", "Open");

    return NextResponse.json({
        reallocationInsights,
        monthlyTrend,
        kpis: {
            totalOrphanages: totalOrphanages ?? 0,
            pendingVerifications: pendingVerifications ?? 0,
            openFraudAlerts: openAlerts ?? 0,
            openTickets: openTickets ?? 0,
        },
    });
}
