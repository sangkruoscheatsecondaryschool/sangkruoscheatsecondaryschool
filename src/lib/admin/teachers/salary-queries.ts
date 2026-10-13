import "server-only";
import { createClient } from "@/lib/supabase/server";

export type SalaryPosition = {
  id: string;
  cadre_code: string;
  class_number: number;
  rank_number: number | null;
  display_label: string;
  sort_order: number;
};

export type SalaryHistoryRow = {
  id: string;
  position_id: string;
  position_label: string;
  start_date: string;
  end_date: string | null;
  decision_number: string | null;
  notes: string | null;
};

export async function listSalaryPositions(): Promise<SalaryPosition[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("salary_positions")
    .select("id, cadre_code, class_number, rank_number, display_label, sort_order")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getSalaryHistory(
  teacherId: string,
): Promise<SalaryHistoryRow[]> {
  const supabase = await createClient();

  const { data: history, error } = await supabase
    .from("teacher_salary_history")
    .select(
      "id, position_id, start_date, end_date, decision_number, notes",
    )
    .eq("teacher_id", teacherId)
    .order("start_date", { ascending: false });

  if (error) throw new Error(error.message);
  if (!history || history.length === 0) return [];

  const positionIds = Array.from(new Set(history.map((h) => h.position_id)));
  const { data: positions } = await supabase
    .from("salary_positions")
    .select("id, display_label")
    .in("id", positionIds);

  const labelById = new Map(
    (positions ?? []).map((p) => [p.id, p.display_label]),
  );

  return history.map((h) => ({
    id: h.id,
    position_id: h.position_id,
    position_label: labelById.get(h.position_id) ?? "—",
    start_date: h.start_date,
    end_date: h.end_date,
    decision_number: h.decision_number,
    notes: h.notes,
  }));
}