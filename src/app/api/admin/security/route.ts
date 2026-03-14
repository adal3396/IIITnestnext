import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
    const { data, error } = await supabase
        .from("fraud_alerts")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const total = data?.length ?? 0;
    const open = data?.filter((d) => d.status === "Open").length ?? 0;
    const critical = data?.filter((d) => d.severity === "Critical").length ?? 0;
    const investigating = data?.filter((d) => d.status === "Investigating").length ?? 0;

    return NextResponse.json({ alerts: data, stats: { total, open, critical, investigating } });
}

export async function PATCH(req: NextRequest) {
    const { id, status, admin_note } = await req.json();
    if (!id || !status) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

    const { data, error } = await supabase
        .from("fraud_alerts")
        .update({ status, admin_note, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}
