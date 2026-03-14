import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/donor/create-order
 * Creates a Razorpay order server-side (needs secret key, never on the client).
 * Returns { orderId, amount, currency } to the frontend to open the checkout modal.
 */
export async function POST(request: NextRequest) {
    try {
        const { amount, currency = "INR", receipt } = await request.json();

        if (!amount || Number(amount) <= 0) {
            return NextResponse.json(
                { error: "Invalid amount." },
                { status: 400 }
            );
        }

        const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;

        if (!keyId || !keySecret) {
            return NextResponse.json(
                { error: "Razorpay credentials not configured." },
                { status: 500 }
            );
        }

        // Razorpay amount is in the smallest currency unit (paise for INR)
        const razorpayAmount = Math.round(Number(amount) * 100);

        const response = await fetch("https://api.razorpay.com/v1/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization:
                    "Basic " +
                    Buffer.from(`${keyId}:${keySecret}`).toString("base64"),
            },
            body: JSON.stringify({
                amount: razorpayAmount,
                currency,
                receipt: receipt ?? `rcpt_${Date.now()}`,
                notes: {
                    platform: "NextNest",
                    compliance: "DPDP Act 2023",
                },
            }),
        });

        if (!response.ok) {
            const err = await response.json();
            console.error("[create-order] Razorpay error:", err);
            return NextResponse.json(
                { error: "Failed to create Razorpay order." },
                { status: 500 }
            );
        }

        const order = await response.json();

        return NextResponse.json({
            orderId: order.id,
            amount: order.amount,        // in paise
            currency: order.currency,
        });
    } catch (error) {
        console.error("[create-order] Error:", error);
        return NextResponse.json(
            { error: "Internal server error." },
            { status: 500 }
        );
    }
}
