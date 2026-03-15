import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getSupabaseUserFromRequest } from "@/lib/auth-server";

const PLATFORM_FEE_PERCENT = 2.5;

function generateTransactionRef(): string {
  return (
    "TXN-" +
    Date.now().toString(36).toUpperCase() +
    "-" +
    Math.random().toString(36).slice(2, 6).toUpperCase()
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      type,
      amount,
      orphanage_name,
      beneficiary,
      payment_id,
      consent,
    } = body;

    if (!amount || Number(amount) <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid amount." },
        { status: 400 }
      );
    }

    if (
      (type === "sponsorship" || type === "Sponsorship") &&
      !consent
    ) {
      return NextResponse.json(
        { success: false, error: "Consent is required for child sponsorship." },
        { status: 400 }
      );
    }

    const amountNum = Number(amount);
    const feePlatform = Math.round((amountNum * PLATFORM_FEE_PERCENT) / 100 * 100) / 100;
    const tipAmount = 0;
    const amountOrphanage = amountNum - feePlatform - tipAmount;

    let donorId: string | null = null;
    let donorName = "Anonymous Donor";

    const user = await getSupabaseUserFromRequest(request);
    if (user) {
      donorId = user.id;
      donorName =
        (user.user_metadata?.full_name as string) ||
        (user.email ?? "Anonymous Donor");
    }

    const transactionRef = payment_id
      ? `TXN-${String(payment_id).slice(-12).toUpperCase()}`
      : generateTransactionRef();

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("transactions_ledger").insert({
      transaction_ref: transactionRef,
      donor_id: donorId,
      donor_name: donorName,
      orphanage_name: orphanage_name || "NextNest General Fund",
      amount_total: amountNum,
      amount_orphanage: amountOrphanage,
      fee_platform: feePlatform,
      tip_amount: tipAmount,
      status: "Completed",
    });

    if (error) {
      if (error.code === "42P01") {
        return NextResponse.json(
          {
            success: false,
            error:
              "transactions_ledger table not found. Run supabase/schema.sql in your Supabase project.",
          },
          { status: 500 }
        );
      }
      console.error("[record-donation] Supabase error:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      transaction_ref: transactionRef,
      message: `Thank you! Your ${type === "sponsorship" || type === "Sponsorship" ? "sponsorship" : "contribution"} of ₹${amountNum.toLocaleString("en-IN")} has been recorded.`,
    });
  } catch (err) {
    console.error("[record-donation] Error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to record donation." },
      { status: 500 }
    );
  }
}
