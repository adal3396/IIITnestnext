import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
    const { data, error } = await supabase
        .from("platform_settings")
        .select("*")
        .order("key");

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

export async function PATCH(request: NextRequest) {
    const body = await request.json();
    const { key, enabled } = body;

    if (!key || enabled === undefined) {
        return NextResponse.json({ error: "Missing key or enabled" }, { status: 400 });
    }

    const { data, error } = await supabase
        .from("platform_settings")
        .update({ enabled, updated_at: new Date().toISOString() })
        .eq("key", key)
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}
