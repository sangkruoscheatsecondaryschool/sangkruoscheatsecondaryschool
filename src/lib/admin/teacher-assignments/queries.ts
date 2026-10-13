import "server-only";
import { createClient } from "@/lib/supabase/server";

export type TeacherAssignmentRow = {
  id: string;
  teacher_id: string;
  teacher_name_kh: string;
  teacher_name_en: string | null;
  class_id: string;
  class_name: string;
  grade_level: number;
  subject_id: string;
  subject_name: string;
  subject_code: string;
};

export type TeacherOption = {
  id: string;
  full_name_kh: string;
  full_name_en: string | null;
};

export type ClassOption = {
  id: string;
  class_name: string;
  grade_level: number;
};

export type SubjectOption = {
  id: string;
  subject_name: string;
  code: string;
};

export async function listTeacherOptions(): Promise<TeacherOption[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name_kh, full_name_en")
    .eq("role", "teacher")
    .order("full_name_kh", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listClassOptions(
  academicYearId: string,
): Promise<ClassOption[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("classes")
    .select("id, class_name, grade_level")
    .eq("academic_year_id", academicYearId)
    .order("grade_level", { ascending: true })
    .order("class_name", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listSubjectOptions(): Promise<SubjectOption[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("subjects")
    .select("id, subject_name, code")
    .order("subject_name", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listAssignmentsForYear(
  academicYearId: string,
  opts: { teacherId?: string; classId?: string } = {},
): Promise<TeacherAssignmentRow[]> {
  const supabase = await createClient();

  // 1. Classes in year
  const { data: classes, error: cErr } = await supabase
    .from("classes")
    .select("id, class_name, grade_level")
    .eq("academic_year_id", academicYearId);
  if (cErr) throw new Error(cErr.message);
  if (!classes || classes.length === 0) return [];

  const classById = new Map(classes.map((c) => [c.id, c]));
  let classIds = classes.map((c) => c.id);

  if (opts.classId) {
    if (!classById.has(opts.classId)) return [];
    classIds = [opts.classId];
  }

  // 2. Assignments in those classes
  let q = supabase
    .from("teacher_assignments")
    .select("id, teacher_id, class_id, subject_id")
    .in("class_id", classIds);

  if (opts.teacherId) q = q.eq("teacher_id", opts.teacherId);

  const { data: assignments, error: aErr } = await q;
  if (aErr) throw new Error(aErr.message);
  if (!assignments || assignments.length === 0) return [];

  // 3. Look up teachers and subjects in one query each
  const teacherIds = Array.from(new Set(assignments.map((a) => a.teacher_id)));
  const subjectIds = Array.from(new Set(assignments.map((a) => a.subject_id)));

  const [{ data: teachers }, { data: subjects }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name_kh, full_name_en")
      .in("id", teacherIds),
    supabase
      .from("subjects")
      .select("id, subject_name, code")
      .in("id", subjectIds),
  ]);

  const teacherById = new Map((teachers ?? []).map((t) => [t.id, t]));
  const subjectById = new Map((subjects ?? []).map((s) => [s.id, s]));

  return assignments.map((a) => {
    const t = teacherById.get(a.teacher_id);
    const c = classById.get(a.class_id);
    const s = subjectById.get(a.subject_id);
    return {
      id: a.id,
      teacher_id: a.teacher_id,
      teacher_name_kh: t?.full_name_kh ?? "—",
      teacher_name_en: t?.full_name_en ?? null,
      class_id: a.class_id,
      class_name: c?.class_name ?? "—",
      grade_level: c?.grade_level ?? 0,
      subject_id: a.subject_id,
      subject_name: s?.subject_name ?? "—",
      subject_code: s?.code ?? "—",
    };
  });
}

export async function listTakenSubjectsByClass(
  academicYearId: string,
  excludeTeacherId: string,
): Promise<Map<string, Map<string, string>>> {
  const supabase = await createClient();

  const { data: classes, error: cErr } = await supabase
    .from("classes")
    .select("id")
    .eq("academic_year_id", academicYearId);
  if (cErr) throw new Error(cErr.message);
  if (!classes || classes.length === 0) return new Map();

  const classIds = classes.map((c) => c.id);

  const { data: assignments, error } = await supabase
    .from("teacher_assignments")
    .select("class_id, subject_id, teacher_id")
    .in("class_id", classIds)
    .neq("teacher_id", excludeTeacherId);
  if (error) throw new Error(error.message);

  const teacherIds = Array.from(
    new Set((assignments ?? []).map((a) => a.teacher_id)),
  );

  const { data: teachers } = await supabase
    .from("profiles")
    .select("id, full_name_kh")
    .in("id", teacherIds);

  const nameById = new Map(
    (teachers ?? []).map((t) => [t.id, t.full_name_kh]),
  );

  const result = new Map<string, Map<string, string>>();
  for (const a of assignments ?? []) {
    if (!result.has(a.class_id)) result.set(a.class_id, new Map());
    result
      .get(a.class_id)!
      .set(a.subject_id, nameById.get(a.teacher_id) ?? "—");
  }
  return result;
}