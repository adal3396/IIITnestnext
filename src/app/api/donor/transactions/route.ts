import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getSupabaseUserFromRequest } from "@/lib/auth-server";

export type TransactionRow = {
  id: string;
  transaction_ref: string;
  donor_name: string;
  orphanage_name: string;
  amount_total: number;
  amount_orphanage: number;
  fee_platform: number;
  tip_amount: number;
  status: string;
  created_at: string;
};

export async function GET(request: Request) {
  try {
    const user = await getSupabaseUserFromRequest(request);
    const supabase = getSupabaseAdmin();

    if (!user) {
      return NextResponse.json(
        { transactions: [], message: "Sign in to see your contribution history." },
        { status: 200 }
      );
    }

    const { data, error } = await supabase
      .from("transactions_ledger")
      .select("id, transaction_ref, donor_name, orphanage_name, amount_total, amount_orphanage, fee_platform, tip_amount, status, created_at")
      .eq("donor_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      if (error.code === "42P01") {
        return NextResponse.json(
          { transactions: [], message: "Ledger not configured yet." },
          { status: 200 }
        );
      }
      console.error("[transactions] Error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      transactions: (data ?? []) as TransactionRow[],
    });
  } catch (err) {
    console.error("[transactions] Error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
