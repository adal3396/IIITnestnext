import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
    const { data, error } = await supabase
        .from("support_tickets")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

export async function PATCH(request: NextRequest) {
    const body = await request.json();
    const { id, status, reply } = body;

    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const updates: Record<string, string> = { updated_at: new Date().toISOString() };
    if (status) updates.status = status;
    if (reply) updates.reply = reply;

    const { data, error } = await supabase
        .from("support_tickets")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}
