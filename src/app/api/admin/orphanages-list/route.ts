import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

/**
 * GET /api/admin/orphanages-list
 * Returns all orphanages with their registration info and donation summary.
 */
export async function GET() {
  try {
    const { data: orgs, error } = await supabaseAdmin
      .from("orphanage_registrations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Enrich with transaction totals per orphanage
    const { data: txns } = await supabaseAdmin
      .from("transactions_ledger")
      .select("orphanage_name, amount_total, status");

    const fundMap = new Map<string, { total: number; count: number }>();
    for (const t of txns ?? []) {
      const key = t.orphanage_name?.split(",")[0]?.trim() ?? "";
      if (!fundMap.has(key)) fundMap.set(key, { total: 0, count: 0 });
      fundMap.get(key)!.total += Number(t.amount_total);
      fundMap.get(key)!.count += 1;
    }

    // Count children per orphanage
    const { data: children } = await supabaseAdmin
      .from("children")
      .select("orphanage_id");

    const childMap = new Map<string, number>();
    for (const c of children ?? []) {
      if (c.orphanage_id) childMap.set(c.orphanage_id, (childMap.get(c.orphanage_id) ?? 0) + 1);
    }

    const enriched = (orgs ?? []).map((o) => {
      const nameKey = o.name?.split(",")[0]?.trim() ?? "";
      const funds = fundMap.get(nameKey) ?? { total: 0, count: 0 };
      return {
        ...o,
        total_received: parseFloat(funds.total.toFixed(2)),
        donation_count: funds.count,
        child_count: childMap.get(o.id) ?? 0,
      };
    });

    const totalApproved = enriched.filter((o) => o.status === "approved").length;
    const totalPending = enriched.filter((o) => o.status === "pending").length;
    const totalFunds = enriched.reduce((s, o) => s + o.total_received, 0);

    return NextResponse.json({
      orphanages: enriched,
      summary: {
        total: enriched.length,
        approved: totalApproved,
        pending: totalPending,
        rejected: enriched.filter((o) => o.status === "rejected").length,
        total_funds_disbursed: parseFloat(totalFunds.toFixed(2)),
      },
    });
  } catch (err) {
    console.error("[admin/orphanages-list] Error:", err);
    return NextResponse.json({ error: "Failed to fetch orphanage data." }, { status: 500 });
  }
}
