import { NextRequest, NextResponse } from "next/server";

function generateTransactionId(): string {
    return (
        "TXN-" +
        Date.now().toString(36).toUpperCase() +
        "-" +
        Math.random().toString(36).slice(2, 6).toUpperCase()
    );
}

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { type, amount, consent } = body;

        if (!amount || Number(amount) <= 0) {
            return NextResponse.json(
                { success: false, error: "Invalid donation amount." },
                { status: 400 }
            );
        }

        if (type === "sponsorship" && !consent) {
            return NextResponse.json(
                { success: false, error: "Consent is required for child sponsorship." },
                { status: 400 }
            );
        }

        // Simulate payment processing delay
        await sleep(800);

        const transactionId = generateTransactionId();
        console.log(`[Donate] ${type} | ₹${amount} | ${transactionId}`);

        return NextResponse.json({
            success: true,
            transactionId,
            message: `Thank you! Your ${type === "sponsorship" ? "sponsorship" : "contribution"} of ₹${Number(amount).toLocaleString("en-IN")} has been recorded. Transaction ID: ${transactionId}`,
        });
    } catch (error) {
        console.error("[Donate] Error:", error);
        return NextResponse.json(
            { success: false, error: "Payment processing failed. Please try again." },
            { status: 500 }
        );
    }
}
