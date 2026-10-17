import "server-only";
import { createClient } from "@/lib/supabase/server";

export type PeriodRow = {
  id: string;
  academic_year_id: string;
  period_number: number;
  start_time: string; // "HH:MM:SS"
  end_time: string;
  label: string | null;
};

export type TimetableCell = {
  day_of_week: number;
  period_id: string;
  subject_id: string;
  subject_name: string;
  subject_code: string;
  teacher_id: string;
  teacher_name_kh: string;
};

export async function listPeriods(
  academicYearId: string,
): Promise<PeriodRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("periods")
    .select("id, academic_year_id, period_number, start_time, end_time, label")
    .eq("academic_year_id", academicYearId)
    .order("period_number", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listTimetableForClass(
  classId: string,
): Promise<TimetableCell[]> {
  const supabase = await createClient();

  const { data: entries, error } = await supabase
    .from("timetable_entries")
    .select("day_of_week, period_id, subject_id, teacher_id")
    .eq("class_id", classId);
  if (error) throw new Error(error.message);
  if (!entries || entries.length === 0) return [];

  const subjectIds = Array.from(new Set(entries.map((e) => e.subject_id)));
  const teacherIds = Array.from(new Set(entries.map((e) => e.teacher_id)));

  const [{ data: subjects }, { data: teachers }] = await Promise.all([
    supabase
      .from("subjects")
      .select("id, subject_name, code")
      .in("id", subjectIds),
    supabase
      .from("profiles")
      .select("id, full_name_kh")
      .in("id", teacherIds),
  ]);

  const subjectMap = new Map((subjects ?? []).map((s) => [s.id, s]));
  const teacherMap = new Map((teachers ?? []).map((t) => [t.id, t]));

  return entries.map((e) => {
    const s = subjectMap.get(e.subject_id);
    const t = teacherMap.get(e.teacher_id);
    return {
      day_of_week: e.day_of_week,
      period_id: e.period_id,
      subject_id: e.subject_id,
      subject_name: s?.subject_name ?? "—",
      subject_code: s?.code ?? "—",
      teacher_id: e.teacher_id,
      teacher_name_kh: t?.full_name_kh ?? "—",
    };
  });
}

export async function listAssignableSubjects(
  classId: string,
): Promise<
  { subject_id: string; subject_name: string; subject_code: string }[]
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("teacher_assignments")
    .select("subject_id, subjects(id, subject_name, code)")
    .eq("class_id", classId);

  if (error) throw new Error(error.message);
  if (!data) return [];

  // Flatten — Supabase returns joined rows as nested objects
  const seen = new Set<string>();
  const result: {
    subject_id: string;
    subject_name: string;
    subject_code: string;
  }[] = [];

  for (const row of data as unknown as {
    subject_id: string;
    subjects: { id: string; subject_name: string; code: string } | null;
  }[]) {
    if (!row.subjects || seen.has(row.subject_id)) continue;
    seen.add(row.subject_id);
    result.push({
      subject_id: row.subject_id,
      subject_name: row.subjects.subject_name,
      subject_code: row.subjects.code,
    });
  }

  return result.sort((a, b) =>
    a.subject_name.localeCompare(b.subject_name, "km"),
  );
}