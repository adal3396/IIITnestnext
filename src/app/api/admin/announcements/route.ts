import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
    const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
    const { title, message, target_audience } = await req.json();
    if (!title || !message) return NextResponse.json({ error: "Missing title or message" }, { status: 400 });

    const { data, error } = await supabase
        .from("announcements")
        .insert({ title, message, target_audience: target_audience ?? "All", sent_by: "Super Admin" })
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
}
