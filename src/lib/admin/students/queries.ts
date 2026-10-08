import "server-only";
import { createClient } from "@/lib/supabase/server";

export type StudentRow = {
  id: string;
  student_code: string;
  name_kh: string;
  gender: string | null;
  dob: string;
  class_id: string;
  class_name: string;
  grade_level: number;
  place_of_birth_village_id: string | null;
  current_address_village_id: string | null;
  current_address_detail: string | null;
  mother_name: string | null;
  father_name: string | null;
  contact_number: string | null;
  status: "active" | "dropped_s1" | "dropped_s2" | "graduated";
};

export type ClassOption = {
  id: string;
  class_name: string;
  grade_level: number;
};

export async function listClassesInYear(
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

export async function listStudentsByYear(
  academicYearId: string,
  opts: { classId?: string; q?: string } = {},
): Promise<StudentRow[]> {
  const supabase = await createClient();

  // ----- 1. Fetch classes (only simple filter: academic_year_id) -----
  const { data: classes, error: classErr } = await supabase
    .from("classes")
    .select("id, class_name, grade_level")
    .eq("academic_year_id", academicYearId);

  if (classErr) throw new Error(classErr.message);
  if (!classes || classes.length === 0) return [];

  // Filter by class in JS — avoids chaining the wrong filter onto the query.
  const filteredClasses = opts.classId
    ? classes.filter((c) => c.id === opts.classId)
    : classes;
  if (filteredClasses.length === 0) return [];

  const classIds = filteredClasses.map((c) => c.id);
  const classById = new Map(classes.map((c) => [c.id, c]));

  // ----- 2. Fetch students -----
  let studentQuery = supabase
    .from("students")
    .select(
      "id, student_code, name_kh, gender, dob, class_id, place_of_birth_village_id, current_address_village_id, current_address_detail, mother_name, father_name, contact_number, status",
    )
    .in("class_id", classIds)
    .order("student_code", { ascending: true });

  if (opts.q && opts.q.trim().length > 0) {
    const like = `%${opts.q.trim()}%`;
    studentQuery = studentQuery.or(
      `name_kh.ilike.${like},student_code.ilike.${like}`,
    );
  }

  const { data: students, error: studentErr } = await studentQuery;
  if (studentErr) throw new Error(studentErr.message);

  return (students ?? []).map((s) => {
    const cls = classById.get(s.class_id);
    return {
      ...s,
      class_name: cls?.class_name ?? "",
      grade_level: cls?.grade_level ?? 0,
      status: s.status as StudentRow["status"],
    };
  });
}

export async function getStudentById(id: string): Promise<StudentRow | null> {
  const supabase = await createClient();

  const { data: student, error } = await supabase
    .from("students")
    .select(
      "id, student_code, name_kh, gender, dob, class_id, place_of_birth_village_id, current_address_village_id, current_address_detail, mother_name, father_name, contact_number, status",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!student) return null;

  const { data: cls } = await supabase
    .from("classes")
    .select("class_name, grade_level")
    .eq("id", student.class_id)
    .maybeSingle();

  return {
    ...student,
    class_name: cls?.class_name ?? "",
    grade_level: cls?.grade_level ?? 0,
    status: student.status as StudentRow["status"],
  };
}