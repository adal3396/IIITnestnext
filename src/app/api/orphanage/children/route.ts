import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getSupabaseUserFromRequest } from "@/lib/auth-server";

/**
 * Resolve current user's orphanage_id from organization_name (lookup or create).
 */
async function getOrphanageIdForUser(userId: string, organizationName: string): Promise<string | null> {
  const supabase = getSupabaseAdmin();

  const { data: existing } = await supabase
    .from("orphanage_registrations")
    .select("id")
    .ilike("name", organizationName.trim())
    .limit(1)
    .maybeSingle();

  if (existing?.id) return existing.id;

  const { data: created, error } = await supabase
    .from("orphanage_registrations")
    .insert({
      name: organizationName.trim() || "Unnamed Orphanage",
      state: "N/A",
      registration_no: `TEMP-${userId.slice(0, 8)}`,
      contact_person: "Registered via portal",
      status: "pending",
    })
    .select("id")
    .single();

  if (error || !created?.id) return null;
  return created.id;
}

export type ChildRow = {
  id: string;
  alias: string;
  age: number | null;
  gender: string | null;
  risk_level: string;
  is_enrolled_in_school: boolean;
  has_health_insurance: boolean;
  created_at: string;
};

/**
 * GET /api/orphanage/children — list children for the current orphanage only.
 */
export async function GET(request: Request) {
  try {
    const user = await getSupabaseUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized", children: [] }, { status: 401 });
    }

    const orgName = (user.user_metadata?.organization_name as string) || (user.user_metadata?.full_name as string) || "";
    if (!orgName.trim()) {
      return NextResponse.json({ children: [], message: "No organization linked. Update profile with organization name." });
    }

    const orphanageId = await getOrphanageIdForUser(user.id, orgName);
    if (!orphanageId) {
      return NextResponse.json({ children: [], message: "Could not resolve orphanage." });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("children")
      .select("id, alias, age, gender, risk_level, is_enrolled_in_school, has_health_insurance, created_at")
      .eq("orphanage_id", orphanageId)
      .order("created_at", { ascending: false });

    if (error) {
      if (error.code === "42P01") return NextResponse.json({ children: [], message: "Table not found. Run schema.sql." });
      return NextResponse.json({ error: error.message, children: [] }, { status: 500 });
    }

    return NextResponse.json({ children: (data ?? []) as ChildRow[] });
  } catch (err) {
    console.error("[orphanage/children] GET", err);
    return NextResponse.json({ error: "Internal server error", children: [] }, { status: 500 });
  }
}

/**
 * POST /api/orphanage/children — create a child for the current orphanage only.
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getSupabaseUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orgName = (user.user_metadata?.organization_name as string) || (user.user_metadata?.full_name as string) || "";
    if (!orgName.trim()) {
      return NextResponse.json({ error: "No organization linked." }, { status: 400 });
    }

    const orphanageId = await getOrphanageIdForUser(user.id, orgName);
    if (!orphanageId) {
      return NextResponse.json({ error: "Could not resolve orphanage." }, { status: 400 });
    }

    const body = await request.json();
    const { alias, age, gender } = body;

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("children")
      .insert({
        orphanage_id: orphanageId,
        alias: (alias || "Child").trim().slice(0, 255),
        age: age != null ? Number(age) : null,
        gender: gender ? String(gender).trim().slice(0, 50) : null,
        risk_level: "low",
        is_enrolled_in_school: true,
        has_health_insurance: true,
      })
      .select("id, alias, age, gender, risk_level, created_at")
      .single();

    if (error) {
      if (error.code === "42P01") return NextResponse.json({ error: "Table not found." }, { status: 500 });
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("[orphanage/children] POST", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
