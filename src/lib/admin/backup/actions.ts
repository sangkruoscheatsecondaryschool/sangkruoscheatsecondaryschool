"use server";

import { requireRole } from "@/lib/auth/require-role";
import { createClient } from "@/lib/supabase/server";
import { getGoogleSheetsClient, overwriteSheetTab } from "./google-sheets";
import type { ActionResult } from "@/lib/actions/types";

export async function runBackupAction(): Promise<ActionResult> {
  await requireRole("admin");

  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId) return { ok: false, error: "Missing GOOGLE_SHEET_ID in env." };

  try {
    const supabase = await createClient();
    const sheets = await getGoogleSheetsClient();

    // 1. Fetch Data (Flattened for Sheets)
    const { data: students } = await supabase
      .from("students")
      .select(`
        student_code, name_kh, gender, dob, status, phone:contact_number,
        classes(class_name, grade_level)
      `)
      .order("student_code");

    const { data: scores } = await supabase
      .from("scores")
      .select(`
        score_value, score_type, created_at,
        students(student_code, name_kh),
        subjects(subject_name),
        term_months(month_name_kh, academic_terms(term_name_kh, academic_years(year_name)))
      `)
      .order("created_at");

    const { data: attendance } = await supabase
      .from("attendance")
      .select(`
        date, status,
        students(student_code, name_kh)
      `)
      .order("date");

    // 2. Format as 2D Arrays
    const studentData = [
      ["Student Code", "Name (KH)", "Gender", "DOB", "Class", "Grade Level", "Status", "Phone"],
      ...(students ?? []).map((s) => {
        const cls = s.classes as any;
        return [
          s.student_code, s.name_kh, s.gender, s.dob,
          cls?.class_name ?? "", cls?.grade_level ?? "", s.status, s.phone ?? ""
        ];
      })
    ];

    const scoreData = [
      ["Student Code", "Name (KH)", "Subject", "Year", "Term", "Month", "Score", "Type"],
      ...(scores ?? []).map((s) => {
        const stu = s.students as any;
        const sub = s.subjects as any;
        const tm = s.term_months as any;
        const at = tm?.academic_terms as any;
        const ay = at?.academic_years as any;
        return [
          stu?.student_code ?? "", stu?.name_kh ?? "", sub?.subject_name ?? "",
          ay?.year_name ?? "", at?.term_name_kh ?? "", tm?.month_name_kh ?? "",
          s.score_value, s.score_type
        ];
      })
    ];

    const attData = [
      ["Date", "Student Code", "Name (KH)", "Status"],
      ...(attendance ?? []).map((a) => {
        const stu = a.students as any;
        return [a.date, stu?.student_code ?? "", stu?.name_kh ?? "", a.status];
      })
    ];

    // 3. Push to Google Sheets
    await overwriteSheetTab(sheets, sheetId, "Students", studentData);
    await overwriteSheetTab(sheets, sheetId, "Scores", scoreData);
    await overwriteSheetTab(sheets, sheetId, "Attendance", attData);

    return { ok: true };
  } catch (error: any) {
    console.error("Backup failed:", error);
    return { ok: false, error: error.message ?? "Backup failed." };
  }
}