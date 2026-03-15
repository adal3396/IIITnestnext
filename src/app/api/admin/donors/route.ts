import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

/**
 * GET /api/admin/donors
 * Returns all donors from transactions_ledger (aggregated by donor name)
 * plus summary stats.
 */
export async function GET() {
  try {
    // Get all transactions to derive donor list
    const { data: txns, error } = await supabaseAdmin
      .from("transactions_ledger")
      .select("donor_name, donor_id, orphanage_name, amount_total, status, created_at")
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Aggregate per donor
    const donorMap = new Map<string, {
      donor_name: string;
      donor_id: string | null;
      total_donated: number;
      transaction_count: number;
      last_donation: string;
      orphanages: Set<string>;
      statuses: string[];
    }>();

    for (const t of txns ?? []) {
      const key = t.donor_name;
      if (!donorMap.has(key)) {
        donorMap.set(key, {
          donor_name: t.donor_name,
          donor_id: t.donor_id ?? null,
          total_donated: 0,
          transaction_count: 0,
          last_donation: t.created_at,
          orphanages: new Set(),
          statuses: [],
        });
      }
      const d = donorMap.get(key)!;
      d.total_donated += Number(t.amount_total);
      d.transaction_count += 1;
      if (new Date(t.created_at) > new Date(d.last_donation)) d.last_donation = t.created_at;
      if (t.orphanage_name) d.orphanages.add(t.orphanage_name);
      d.statuses.push(t.status);
    }

    const donors = Array.from(donorMap.values()).map((d) => ({
      donor_name: d.donor_name,
      donor_id: d.donor_id,
      total_donated: parseFloat(d.total_donated.toFixed(2)),
      transaction_count: d.transaction_count,
      last_donation: d.last_donation,
      orphanages_supported: d.orphanages.size,
      is_active: d.statuses.some((s) => s === "Completed"),
    })).sort((a, b) => b.total_donated - a.total_donated);

    const totalVolume = donors.reduce((s, d) => s + d.total_donated, 0);
    const activeDonors = donors.filter((d) => d.is_active).length;

    return NextResponse.json({
      donors,
      summary: {
        total_donors: donors.length,
        active_donors: activeDonors,
        total_volume: parseFloat(totalVolume.toFixed(2)),
        avg_donation: donors.length > 0 ? parseFloat((totalVolume / donors.length).toFixed(2)) : 0,
      },
    });
  } catch (err) {
    console.error("[admin/donors] Error:", err);
    return NextResponse.json({ error: "Failed to fetch donor data." }, { status: 500 });
  }
}
