import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getSupabaseUserFromRequest } from "@/lib/auth-server";

async function getOrphanageIdForUser(userId: string, organizationName: string): Promise<string | null> {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("orphanage_registrations")
    .select("id")
    .ilike("name", organizationName.trim())
    .limit(1)
    .maybeSingle();
  return data?.id ?? null;
}

/**
 * GET /api/orphanage/children/[id] — get one child only if they belong to current orphanage.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSupabaseUserFromRequest(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const orgName = (user.user_metadata?.organization_name as string) || (user.user_metadata?.full_name as string) || "";
    const orphanageId = await getOrphanageIdForUser(user.id, orgName);
    if (!orphanageId) return NextResponse.json({ error: "Orphanage not found" }, { status: 404 });

    const { id } = await params;
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("children")
      .select("id, alias, age, gender, risk_level, is_enrolled_in_school, has_health_insurance, created_at, orphanage_id")
      .eq("id", id)
      .eq("orphanage_id", orphanageId)
      .single();

    if (error || !data) return NextResponse.json({ error: "Child not found" }, { status: 404 });
    return NextResponse.json(data);
  } catch (err) {
    console.error("[orphanage/children/[id]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
