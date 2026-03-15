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
