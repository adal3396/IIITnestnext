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
 * GET /api/orphanage/children/[id]/documents — list documents for one child (scoped by orphanage).
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSupabaseUserFromRequest(request);
    if (!user) return NextResponse.json({ error: "Unauthorized", documents: [] }, { status: 401 });

    const orgName = (user.user_metadata?.organization_name as string) || (user.user_metadata?.full_name as string) || "";
    const orphanageId = await getOrphanageIdForUser(user.id, orgName);
    if (!orphanageId) return NextResponse.json({ documents: [] });

    const { id: childId } = await params;
    const supabase = getSupabaseAdmin();

    const { data: child } = await supabase
      .from("children")
      .select("id")
      .eq("id", childId)
      .eq("orphanage_id", orphanageId)
      .single();
    if (!child) return NextResponse.json({ error: "Child not found", documents: [] }, { status: 404 });

    const { data: docs, error } = await supabase
      .from("child_documents")
      .select("id, child_id, doc_type, file_name, file_path, file_size, status, created_at")
      .eq("child_id", childId)
      .order("created_at", { ascending: false });

    if (error) {
      if (error.code === "42P01") return NextResponse.json({ documents: [] });
      return NextResponse.json({ error: error.message, documents: [] }, { status: 500 });
    }
    return NextResponse.json({ documents: docs ?? [] });
  } catch (err) {
    console.error("[orphanage/children/[id]/documents]", err);
    return NextResponse.json({ error: "Internal server error", documents: [] }, { status: 500 });
  }
}

/**
 * POST /api/orphanage/children/[id]/documents — upload a document for a child (metadata only; file stored client-side or in storage later).
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSupabaseUserFromRequest(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const orgName = (user.user_metadata?.organization_name as string) || (user.user_metadata?.full_name as string) || "";
    const orphanageId = await getOrphanageIdForUser(user.id, orgName);
    if (!orphanageId) return NextResponse.json({ error: "Orphanage not found" }, { status: 404 });

    const { id: childId } = await params;
    const supabase = getSupabaseAdmin();

    const { data: child } = await supabase
      .from("children")
      .select("id")
      .eq("id", childId)
      .eq("orphanage_id", orphanageId)
      .single();
    if (!child) return NextResponse.json({ error: "Child not found" }, { status: 404 });

    const contentType = request.headers.get("content-type") || "";
    let docType = "Other";
    let fileName = "document";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      docType = (formData.get("doc_type") as string) || docType;
      const file = formData.get("file") as File | null;
      if (file?.name) fileName = file.name;
      const fileSize = file?.size ?? null;
      const filePath = file ? `uploads/${childId}/${Date.now()}-${fileName}` : null;

      const { data: inserted, error } = await supabase
        .from("child_documents")
        .insert({
          child_id: childId,
          doc_type: docType.trim().slice(0, 100),
          file_name: fileName,
          file_path: filePath,
          file_size: fileSize,
          status: "Pending Review",
        })
        .select("id, doc_type, file_name, status, created_at")
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json(inserted);
    }

    const body = await request.json().catch(() => ({}));
    docType = body.doc_type || docType;
    fileName = body.file_name || fileName;

    const { data: inserted, error } = await supabase
      .from("child_documents")
      .insert({
        child_id: childId,
        doc_type: String(docType).trim().slice(0, 100),
        file_name: String(fileName).trim().slice(0, 255),
        file_path: body.file_path || null,
        file_size: body.file_size ?? null,
        status: "Pending Review",
      })
      .select("id, doc_type, file_name, status, created_at")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(inserted);
  } catch (err) {
    console.error("[orphanage/children/[id]/documents] POST", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
