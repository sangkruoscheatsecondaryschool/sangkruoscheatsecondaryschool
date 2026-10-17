import "server-only";
import { createClient } from "@/lib/supabase/server";

export type AttendanceStatus =
  | "present"
  | "absent_permission"
  | "absent_no_permission";

export type AttendanceStudentRow = {
  id: string;
  student_code: string;
  name_kh: string;
  gender: string | null;
  status: AttendanceStatus | null;
};

export type AttendanceContext = {
  class_id: string;
  class_name: string;
  grade_level: number;
  academic_year_id: string;
  date: string; // YYYY-MM-DD
  students: AttendanceStudentRow[];
};

export async function getAttendanceContext(
  classId: string,
  date: string,
): Promise<AttendanceContext | null> {
  const supabase = await createClient();

  const { data: cls } = await supabase
    .from("classes")
    .select("id, class_name, grade_level, academic_year_id")
    .eq("id", classId)
    .maybeSingle();
  if (!cls) return null;

  const { data: students, error: sErr } = await supabase
    .from("students")
    .select("id, student_code, name_kh, gender")
    .eq("class_id", classId)
    .order("name_kh", { ascending: true });
  if (sErr) throw new Error(sErr.message);

  const { data: existing, error: aErr } = await supabase
    .from("attendance")
    .select("student_id, status")
    .eq("date", date)
    .in(
      "student_id",
      (students ?? []).map((s) => s.id),
    );
  if (aErr) throw new Error(aErr.message);

  const statusById = new Map(
    (existing ?? []).map((r) => [
      r.student_id,
      r.status as AttendanceStatus,
    ]),
  );

  return {
    class_id: cls.id,
    class_name: cls.class_name,
    grade_level: cls.grade_level,
    academic_year_id: cls.academic_year_id,
    date,
    students: (students ?? []).map((s) => ({
      id: s.id,
      student_code: s.student_code,
      name_kh: s.name_kh,
      gender: s.gender,
      status: statusById.get(s.id) ?? null,
    })),
  };
}

/**
 * Returns the last N school days (Mon–Sat) up to and including today,
 * excluding Sundays. Used for quick date shortcuts.
 */
export function recentSchoolDays(count = 5): string[] {
  const days: string[] = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);

  while (days.length < count) {
    // JS getDay: 0=Sun, 1=Mon..6=Sat
    if (d.getDay() !== 0) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      days.push(`${y}-${m}-${dd}`);
    }
    d.setDate(d.getDate() - 1);
  }

  return days;
}