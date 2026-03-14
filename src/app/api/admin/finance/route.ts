import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
    const { data, error } = await supabase
        .from("transactions_ledger")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const completedTxns = data?.filter((t) => t.status === "Completed") ?? [];
    const totalGross = completedTxns.reduce((sum, t) => sum + t.gross_amount, 0);
    const totalFees = completedTxns.reduce((sum, t) => sum + t.maintenance_fee, 0);
    const totalTips = completedTxns.reduce((sum, t) => sum + t.donor_tip, 0);
    const totalNet = completedTxns.reduce((sum, t) => sum + t.net_amount, 0);
    const pendingCount = data?.filter((t) => t.status === "Pending").length ?? 0;

    return NextResponse.json({
        transactions: data,
        summary: {
            totalGross,
            totalFees,
            totalTips,
            totalNet,
            platformRevenue: totalFees + totalTips,
            transactionCount: completedTxns.length,
            pendingCount,
        },
    });
}
