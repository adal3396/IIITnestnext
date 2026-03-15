import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export type MedicalCaseProgress = {
  id: string;
  case_id: string;
  update_date: string;
  title: string;
  description: string;
  created_at: string;
};

export type DonorMedicalCase = {
  id: string;
  child_alias: string;
  orphanage_name: string;
  condition: string;
  target_amount: number;
  urgency: string;
  ai_flag: string;
  submitted_date: string;
  progress_updates: MedicalCaseProgress[];
};

/**
 * GET /api/donor/medical-cases
 * Returns approved medical crowdfunding cases for donors, with encrypted (non-PII) progress updates.
 */
export async function GET() {
  try {
    const { data: cases, error: casesError } = await supabase
      .from("medical_cases")
      .select("id, child_alias, orphanage_name, condition, target_amount, urgency, ai_flag, submitted_date")
      .eq("status", "approved")
      .order("submitted_date", { ascending: false });

    if (casesError) {
      console.error("[donor/medical-cases] Error:", casesError);
      return NextResponse.json({ error: casesError.message }, { status: 500 });
    }

    const list = (cases ?? []) as Omit<DonorMedicalCase, "progress_updates">[];

    const withProgress: DonorMedicalCase[] = await Promise.all(
      list.map(async (c) => {
        try {
          const { data: updates } = await supabase
            .from("medical_case_progress")
            .select("id, case_id, update_date, title, description, created_at")
            .eq("case_id", c.id)
            .order("update_date", { ascending: false });
          return {
            ...c,
            progress_updates: (updates ?? []) as MedicalCaseProgress[],
          };
        } catch {
          return { ...c, progress_updates: [] };
        }
      })
    );

    return NextResponse.json(withProgress);
  } catch (err) {
    console.error("[donor/medical-cases] Error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
