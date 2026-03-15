import { NextResponse } from "next/server";

/** GET /api/donor/payment-status — whether Razorpay is configured (for showing demo vs live pay). */
export async function GET() {
  const configured =
    !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID &&
    !!process.env.RAZORPAY_KEY_SECRET;
  return NextResponse.json({ razorpayConfigured: configured });
}
