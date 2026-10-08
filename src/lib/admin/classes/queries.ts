import "server-only";
import { createClient } from "@/lib/supabase/server";

export type TeacherOption = {
  id: string;
  full_name_kh: string;
  full_name_en: string | null;
};

export type ClassRow = {
  id: string;
  class_name: string;
  grade_level: number;
  homeroom_teacher_id: string | null;
  academic_year_id: string;
  created_at: string;
  teacher_name_kh: string | null;
  student_count: number;
};

export async function listTeachers(): Promise<TeacherOption[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name_kh, full_name_en")
    .eq("role", "teacher")
    .order("full_name_kh", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listClassesForYear(
  academicYearId: string,
): Promise<ClassRow[]> {
  const supabase = await createClient();

  const { data: classes, error } = await supabase
    .from("classes")
    .select(
      "id, class_name, grade_level, homeroom_teacher_id, academic_year_id, created_at",
    )
    .eq("academic_year_id", academicYearId)
    .order("grade_level", { ascending: true })
    .order("class_name", { ascending: true });

  if (error) throw new Error(error.message);
  if (!classes || classes.length === 0) return [];

  const teacherIds = Array.from(
    new Set(
      classes
        .map((c) => c.homeroom_teacher_id)
        .filter((v): v is string => Boolean(v)),
    ),
  );

  const { data: teachers, error: teacherErr } = teacherIds.length
    ? await supabase
        .from("profiles")
        .select("id, full_name_kh")
        .in("id", teacherIds)
    : { data: [], error: null };

  if (teacherErr) throw new Error(teacherErr.message);

  const teacherMap = new Map((teachers ?? []).map((t) => [t.id, t.full_name_kh]));

  // Student count per class
  const classIds = classes.map((c) => c.id);
  const { data: studentRows, error: studentErr } = await supabase
    .from("students")
    .select("class_id")
    .in("class_id", classIds);

  if (studentErr) throw new Error(studentErr.message);

  const countByClass = new Map<string, number>();
  for (const s of studentRows ?? []) {
    countByClass.set(s.class_id, (countByClass.get(s.class_id) ?? 0) + 1);
  }

  return classes.map((c) => ({
    ...c,
    teacher_name_kh: c.homeroom_teacher_id
      ? teacherMap.get(c.homeroom_teacher_id) ?? null
      : null,
    student_count: countByClass.get(c.id) ?? 0,
  }));
}

export async function getClassById(id: string): Promise<ClassRow | null> {
  const supabase = await createClient();

  const { data: cls, error } = await supabase
    .from("classes")
    .select(
      "id, class_name, grade_level, homeroom_teacher_id, academic_year_id, created_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!cls) return null;

  let teacher_name_kh: string | null = null;
  if (cls.homeroom_teacher_id) {
    const { data: t } = await supabase
      .from("profiles")
      .select("full_name_kh")
      .eq("id", cls.homeroom_teacher_id)
      .maybeSingle();
    teacher_name_kh = t?.full_name_kh ?? null;
  }

  return { ...cls, teacher_name_kh, student_count: 0 };
}