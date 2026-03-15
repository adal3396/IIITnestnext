import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
    try {
        const { name, email, password, role, orgName, consent } = await request.json();

        if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
            return NextResponse.json(
                { error: "Bypass failed: SUPABASE_SERVICE_ROLE_KEY is missing from environment variables." },
                { status: 500 }
            );
        }

        const supabaseAdmin = getSupabaseAdmin();

        // 1. Create the user using admin privileges (bypasses rate limits & auth confirmation)
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true, // Auto-confirm the email
            user_metadata: {
                full_name: name,
                role: role,
                organization_name: orgName,
                consent_given: consent
            }
        });

        if (authError) {
            console.error("[Register API] Auth Error:", authError);
            return NextResponse.json({ error: authError.message }, { status: 400 });
        }

        // 2. Gap 2 Fix: If registering as orphanage, auto-create a pending registration
        //    so it appears in the admin verification queue immediately.
        if (role === "orphanage" && orgName?.trim()) {
            const { error: regError } = await supabaseAdmin
                .from("orphanage_registrations")
                .insert({
                    name: orgName.trim(),
                    state: "Pending Verification",
                    registration_no: `PORTAL-${authData.user?.id?.slice(0, 8)?.toUpperCase() ?? "UNKNOWN"}`,
                    contact_person: name || email,
                    status: "pending",
                    ai_status: "Needs Review",
                    ai_confidence: 50,
                    documents: [],
                });
            if (regError) {
                // Non-fatal: user was still created, log but continue
                console.warn("[Register API] Could not create orphanage_registrations row:", regError.message);
            } else {
                console.log(`[Register API] Created pending orphanage_registrations entry for "${orgName}"`);
            }
        }

        console.log(`[Register API] Successfully registered ${email} as ${role}`);

        return NextResponse.json({
            success: true,
            user: authData.user,
            message: "Registration successful"
        });

    } catch (error: any) {
        console.error("[Register API] Catch Error:", error);
        return NextResponse.json(
            { error: "Internal server error during registration." },
            { status: 500 }
        );
    }
}
