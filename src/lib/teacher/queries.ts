import "server-only";
import { createClient } from "@/lib/supabase/server";

export type SubjectTaught = {
  id: string;
  subject_name: string;
  code: string;
};

export type TeacherClassCard = {
  class_id: string;
  class_name: string;
  grade_level: number;
  academic_year_id: string;
  is_homeroom: boolean;
  subjects_taught: SubjectTaught[];
  student_count: number;
};

export type TeacherRosterStudent = {
  id: string;
  student_code: string;
  name_kh: string;
  gender: string | null;
  status: string;
};

export type TeacherClassDetail = {
  class_id: string;
  class_name: string;
  grade_level: number;
  academic_year_id: string;
  academic_year_name: string;
  is_homeroom: boolean;
  subjects_taught: SubjectTaught[];
  students: TeacherRosterStudent[];
};

/**
 * Returns every class the given teacher is connected to —
 * either as homeroom teacher, or via a subject assignment.
 * Ordered by grade level then class name.
 */
export async function getTeacherClassCards(
  teacherId: string,
): Promise<TeacherClassCard[]> {
  const supabase = await createClient();

  // 1. Homeroom classes
  const { data: homeroom, error: hmErr } = await supabase
    .from("classes")
    .select("id, class_name, grade_level, academic_year_id, homeroom_teacher_id")
    .eq("homeroom_teacher_id", teacherId);
  if (hmErr) throw new Error(hmErr.message);

  // 2. Subject assignments
  const { data: assigns, error: aErr } = await supabase
    .from("teacher_assignments")
    .select("class_id, subject_id")
    .eq("teacher_id", teacherId);
  if (aErr) throw new Error(aErr.message);

  const assignmentClassIds = Array.from(
    new Set((assigns ?? []).map((a) => a.class_id)),
  );

  const homeroomIds = new Set((homeroom ?? []).map((c) => c.id));
  const missingClassIds = assignmentClassIds.filter(
    (id) => !homeroomIds.has(id),
  );

  // 3. Fetch classes for the missing ids
  const { data: assignedClasses, error: acErr } = missingClassIds.length
    ? await supabase
        .from("classes")
        .select("id, class_name, grade_level, academic_year_id, homeroom_teacher_id")
        .in("id", missingClassIds)
    : { data: [], error: null };
  if (acErr) throw new Error(acErr.message);

  const allClasses = [...(homeroom ?? []), ...(assignedClasses ?? [])];
  if (allClasses.length === 0) return [];

  const classIds = allClasses.map((c) => c.id);

  // 4. Subject lookup — we need subject_id -> { name, code }
  const assignmentSubjectIds = Array.from(
    new Set((assigns ?? []).map((a) => a.subject_id)),
  );
  const { data: subjects } = assignmentSubjectIds.length
    ? await supabase
        .from("subjects")
        .select("id, subject_name, code")
        .in("id", assignmentSubjectIds)
    : { data: [] };

  const subjectById = new Map(
    (subjects ?? []).map((s) => [s.id, s]),
  );

  // 5. Group subjects per class
  const subjectsByClass = new Map<string, SubjectTaught[]>();
  for (const a of assigns ?? []) {
    const s = subjectById.get(a.subject_id);
    if (!s) continue;
    const list = subjectsByClass.get(a.class_id) ?? [];
    if (!list.some((x) => x.id === s.id)) {
      list.push({ id: s.id, subject_name: s.subject_name, code: s.code });
    }
    subjectsByClass.set(a.class_id, list);
  }

  // 6. Student count per class
  const { data: studentRows } = await supabase
    .from("students")
    .select("class_id")
    .in("class_id", classIds);

  const countByClass = new Map<string, number>();
  for (const s of studentRows ?? []) {
    countByClass.set(s.class_id, (countByClass.get(s.class_id) ?? 0) + 1);
  }

  const cards: TeacherClassCard[] = allClasses.map((c) => ({
    class_id: c.id,
    class_name: c.class_name,
    grade_level: c.grade_level,
    academic_year_id: c.academic_year_id,
    is_homeroom: c.homeroom_teacher_id === teacherId,
    subjects_taught: subjectsByClass.get(c.id) ?? [],
    student_count: countByClass.get(c.id) ?? 0,
  }));

  cards.sort((a, b) => {
    if (a.grade_level !== b.grade_level) return a.grade_level - b.grade_level;
    return a.class_name.localeCompare(b.class_name, "km");
  });

  return cards;
}

/**
 * Returns full detail for a class the given teacher teaches.
 * Returns null if the teacher has no access.
 */
export async function getTeacherClassDetail(
  teacherId: string,
  classId: string,
): Promise<TeacherClassDetail | null> {
  const supabase = await createClient();

  // Fetch the class
  const { data: cls, error: cErr } = await supabase
    .from("classes")
    .select(
      "id, class_name, grade_level, academic_year_id, homeroom_teacher_id",
    )
    .eq("id", classId)
    .maybeSingle();
  if (cErr) throw new Error(cErr.message);
  if (!cls) return null;

  const isHomeroom = cls.homeroom_teacher_id === teacherId;

  // Get subjects this teacher teaches in this class
  const { data: assigns } = await supabase
    .from("teacher_assignments")
    .select("subject_id")
    .eq("teacher_id", teacherId)
    .eq("class_id", classId);

  const subjectIds = Array.from(
    new Set((assigns ?? []).map((a) => a.subject_id)),
  );

  // Authorization: must be homeroom OR have at least one assignment
  if (!isHomeroom && subjectIds.length === 0) return null;

  // Fetch subject details
  const { data: subjects } = subjectIds.length
    ? await supabase
        .from("subjects")
        .select("id, subject_name, code")
        .in("id", subjectIds)
    : { data: [] };

  const subjectsTaught: SubjectTaught[] = (subjects ?? [])
    .map((s) => ({ id: s.id, subject_name: s.subject_name, code: s.code }))
    .sort((a, b) => a.subject_name.localeCompare(b.subject_name, "km"));

  // Fetch academic year name
  const { data: year } = await supabase
    .from("academic_years")
    .select("year_name")
    .eq("id", cls.academic_year_id)
    .maybeSingle();

  // Fetch students
  const { data: students, error: sErr } = await supabase
    .from("students")
    .select("id, student_code, name_kh, gender, status")
    .eq("class_id", classId)
    .order("student_code", { ascending: true });
  if (sErr) throw new Error(sErr.message);

  return {
    class_id: cls.id,
    class_name: cls.class_name,
    grade_level: cls.grade_level,
    academic_year_id: cls.academic_year_id,
    academic_year_name: year?.year_name ?? "",
    is_homeroom: isHomeroom,
    subjects_taught: subjectsTaught,
    students: (students ?? []) as TeacherRosterStudent[],
  };
}