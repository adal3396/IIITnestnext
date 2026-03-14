import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
    const { data, error } = await supabase
        .from("medical_cases")
        .select("*")
        .eq("status", "pending")
        .order("submitted_date", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

export async function PATCH(request: NextRequest) {
    const body = await request.json();
    const { id, action, admin_note } = body;

    if (!id || !action) {
        return NextResponse.json({ error: "Missing id or action" }, { status: 400 });
    }

    const status = action === "approve" ? "approved" : "rejected";

    const { data, error } = await supabase
        .from("medical_cases")
        .update({ status, admin_note: admin_note ?? null, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}
