import "server-only";
import { createClient } from "@/lib/supabase/server";

export type AttendanceStudentRow = {
  student_id: string;
  student_code: string;
  name_kh: string;
  gender: string | null;
  daily_status: Record<string, "present" | "absent_permission" | "absent_no_permission">;
  present_count: number;
  permission_count: number;
  unpermitted_count: number;
};

export type MonthlyAttendanceReport = {
  class_name: string;
  grade_level: number;
  academic_year_name: string;
  homeroom_teacher_name: string | null;
  month: string; // YYYY-MM
  days_in_month: number;
  students: AttendanceStudentRow[];
};

export async function fetchClassAttendanceMonth(
  classId: string,
  month: string,
): Promise<MonthlyAttendanceReport | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_class_attendance_monthly", {
    p_class_id: classId,
    p_month: month,
  });

  if (error) throw new Error(error.message);
  return (data as MonthlyAttendanceReport | null) ?? null;
}