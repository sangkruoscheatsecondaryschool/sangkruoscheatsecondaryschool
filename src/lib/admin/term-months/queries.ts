import "server-only";
import { createClient } from "@/lib/supabase/server";

export type TermMonth = {
  id: string;
  academic_term_id: string;
  month_number: number;
  month_name_kh: string;
  is_semester_exam: boolean;
  display_order: number;
};

export type TermWithMonths = {
  id: string;
  term_number: number;
  term_name_kh: string;
  months: TermMonth[];
};

export async function listTermsWithMonths(
  academicYearId: string,
): Promise<TermWithMonths[]> {
  const supabase = await createClient();

  const { data: terms, error: termErr } = await supabase
    .from("academic_terms")
    .select("id, term_number, term_name_kh")
    .eq("academic_year_id", academicYearId)
    .order("term_number", { ascending: true });

  if (termErr) throw new Error(termErr.message);
  if (!terms || terms.length === 0) return [];

  const termIds = terms.map((t) => t.id);

  const { data: months, error: monthErr } = await supabase
    .from("term_months")
    .select(
      "id, academic_term_id, month_number, month_name_kh, is_semester_exam, display_order",
    )
    .in("academic_term_id", termIds)
    .order("display_order", { ascending: true });

  if (monthErr) throw new Error(monthErr.message);

  const byTerm = new Map<string, TermMonth[]>();
  for (const m of months ?? []) {
    const list = byTerm.get(m.academic_term_id) ?? [];
    list.push(m);
    byTerm.set(m.academic_term_id, list);
  }

  return terms.map((t) => ({
    id: t.id,
    term_number: t.term_number,
    term_name_kh: t.term_name_kh,
    months: byTerm.get(t.id) ?? [],
  }));
}