import "server-only";
import { createClient } from "@/lib/supabase/server";

export type SubjectOption = {
  id: string;
  subject_name: string;
  code: string;
};

export type TermMonthGroup = {
  term_number: number;
  term_name_kh: string;
  months: {
    id: string;
    month_number: number;
    month_name_kh: string;
    is_semester_exam: boolean;
  }[];
};

export type ScoreEntryStudent = {
  id: string;
  student_code: string;
  name_kh: string;
  gender: string | null;
  existing_score: number | null;
};

export type ScoreEntryContext = {
  class_id: string;
  class_name: string;
  grade_level: number;
  academic_year_id: string;
  subject_id: string;
  subject_name: string;
  subject_code: string;
  term_month_id: string;
  month_name_kh: string;
  is_semester_exam: boolean;
  max_score: number;
  students: ScoreEntryStudent[];
};

// ---------------------------------------------------------
// Subjects available to this teacher in this class
// ---------------------------------------------------------
export async function listSubjectsForScoreEntry(
  teacherId: string,
  classId: string,
  isHomeroom: boolean,
): Promise<SubjectOption[]> {
  const supabase = await createClient();

  if (isHomeroom) {
    const { data: cls } = await supabase
      .from("classes")
      .select("grade_level")
      .eq("id", classId)
      .maybeSingle();
    if (!cls) return [];

    const { data } = await supabase
      .from("subject_grade_configs")
      .select("subject_id, subjects(id, subject_name, code)")
      .eq("grade_level", cls.grade_level);

    const rows = (data ?? []) as unknown as {
      subject_id: string;
      subjects: { id: string; subject_name: string; code: string } | null;
    }[];

    const seen = new Set<string>();
    const out: SubjectOption[] = [];
    for (const r of rows) {
      if (!r.subjects || seen.has(r.subject_id)) continue;
      seen.add(r.subject_id);
      out.push({
        id: r.subjects.id,
        subject_name: r.subjects.subject_name,
        code: r.subjects.code,
      });
    }
    return out.sort((a, b) =>
      a.subject_name.localeCompare(b.subject_name, "km"),
    );
  }

  const { data } = await supabase
    .from("teacher_assignments")
    .select("subject_id, subjects(id, subject_name, code)")
    .eq("teacher_id", teacherId)
    .eq("class_id", classId);

  const rows = (data ?? []) as unknown as {
    subject_id: string;
    subjects: { id: string; subject_name: string; code: string } | null;
  }[];

  const seen = new Set<string>();
  const out: SubjectOption[] = [];
  for (const r of rows) {
    if (!r.subjects || seen.has(r.subject_id)) continue;
    seen.add(r.subject_id);
    out.push({
      id: r.subjects.id,
      subject_name: r.subjects.subject_name,
      code: r.subjects.code,
    });
  }
  return out.sort((a, b) =>
    a.subject_name.localeCompare(b.subject_name, "kh"),
  );
}

// ---------------------------------------------------------
// Term months for the class's academic year
// ---------------------------------------------------------
export async function listTermMonthsForYear(
  academicYearId: string,
): Promise<TermMonthGroup[]> {
  const supabase = await createClient();

  const { data: terms, error: tErr } = await supabase
    .from("academic_terms")
    .select("id, term_number, term_name_kh")
    .eq("academic_year_id", academicYearId)
    .order("term_number", { ascending: true });
  if (tErr) throw new Error(tErr.message);
  if (!terms || terms.length === 0) return [];

  const termIds = terms.map((t) => t.id);
  const { data: months, error: mErr } = await supabase
    .from("term_months")
    .select(
      "id, academic_term_id, month_number, month_name_kh, is_semester_exam, display_order",
    )
    .in("academic_term_id", termIds)
    .order("display_order", { ascending: true });
  if (mErr) throw new Error(mErr.message);

  return terms.map((t) => ({
    term_number: t.term_number,
    term_name_kh: t.term_name_kh,
    months: (months ?? [])
      .filter((m) => m.academic_term_id === t.id)
      .map((m) => ({
        id: m.id,
        month_number: m.month_number,
        month_name_kh: m.month_name_kh,
        is_semester_exam: m.is_semester_exam,
      })),
  }));
}

// ---------------------------------------------------------
// Full score entry context
// ---------------------------------------------------------
export async function getScoreEntryContext(
  classId: string,
  subjectId: string,
  termMonthId: string,
): Promise<ScoreEntryContext | null> {
  const supabase = await createClient();

  const { data: cls } = await supabase
    .from("classes")
    .select("id, class_name, grade_level, academic_year_id")
    .eq("id", classId)
    .maybeSingle();
  if (!cls) return null;

  const { data: subject } = await supabase
    .from("subjects")
    .select("id, subject_name, code")
    .eq("id", subjectId)
    .maybeSingle();
  if (!subject) return null;

  const { data: month } = await supabase
    .from("term_months")
    .select("id, month_name_kh, is_semester_exam, academic_term_id")
    .eq("id", termMonthId)
    .maybeSingle();
  if (!month) return null;

  // Max score
  const { data: cfg } = await supabase
    .from("subject_grade_configs")
    .select("max_score")
    .eq("subject_id", subjectId)
    .eq("grade_level", cls.grade_level)
    .maybeSingle();
  if (!cfg) return null;

  // Students
  const { data: students, error: sErr } = await supabase
    .from("students")
    .select("id, student_code, name_kh, gender")
    .eq("class_id", classId)
    .order("name_kh", { ascending: true });
  if (sErr) throw new Error(sErr.message);

  // Existing scores for this cell
  const { data: existing } = await supabase
    .from("scores")
    .select("student_id, score_value")
    .eq("subject_id", subjectId)
    .eq("term_month_id", termMonthId);

  const existingMap = new Map(
    (existing ?? []).map((r) => [r.student_id, Number(r.score_value)]),
  );

  return {
    class_id: cls.id,
    class_name: cls.class_name,
    grade_level: cls.grade_level,
    academic_year_id: cls.academic_year_id,
    subject_id: subject.id,
    subject_name: subject.subject_name,
    subject_code: subject.code,
    term_month_id: month.id,
    month_name_kh: month.month_name_kh,
    is_semester_exam: month.is_semester_exam,
    max_score: Number(cfg.max_score),
    students: (students ?? []).map((s) => ({
      id: s.id,
      student_code: s.student_code,
      name_kh: s.name_kh,
      gender: s.gender,
      existing_score: existingMap.get(s.id) ?? null,
    })),
  };
}