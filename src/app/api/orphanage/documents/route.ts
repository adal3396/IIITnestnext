import { NextResponse } from "next/server";
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

export type DocumentRow = {
  id: string;
  child_id: string;
  doc_type: string;
  file_name: string;
  file_path: string | null;
  file_size: number | null;
  status: string;
  created_at: string;
  child_alias?: string;
};

/**
 * GET /api/orphanage/documents — list all documents for current orphanage's children.
 */
export async function GET(request: Request) {
  try {
    const user = await getSupabaseUserFromRequest(request);
    if (!user) return NextResponse.json({ error: "Unauthorized", documents: [] }, { status: 401 });

    const orgName = (user.user_metadata?.organization_name as string) || (user.user_metadata?.full_name as string) || "";
    const orphanageId = await getOrphanageIdForUser(user.id, orgName);
    if (!orphanageId) return NextResponse.json({ documents: [] });

    const supabase = getSupabaseAdmin();
    const { data: childIds } = await supabase
      .from("children")
      .select("id, alias")
      .eq("orphanage_id", orphanageId);
    const ids = (childIds ?? []).map((c) => c.id);
    const aliasMap = Object.fromEntries((childIds ?? []).map((c) => [c.id, c.alias]));

    if (ids.length === 0) return NextResponse.json({ documents: [] });

    const { data: docs, error } = await supabase
      .from("child_documents")
      .select("id, child_id, doc_type, file_name, file_path, file_size, status, created_at")
      .in("child_id", ids)
      .order("created_at", { ascending: false });

    if (error) {
      if (error.code === "42P01") return NextResponse.json({ documents: [] });
      return NextResponse.json({ error: error.message, documents: [] }, { status: 500 });
    }

    const documents = (docs ?? []).map((d) => ({
      ...d,
      child_alias: aliasMap[d.child_id] ?? "—",
    })) as DocumentRow[];
    return NextResponse.json({ documents });
  } catch (err) {
    console.error("[orphanage/documents] GET", err);
    return NextResponse.json({ error: "Internal server error", documents: [] }, { status: 500 });
  }
}
