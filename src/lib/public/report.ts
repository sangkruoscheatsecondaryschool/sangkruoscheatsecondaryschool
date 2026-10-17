import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";

// =========================================================
// Response types (matches get_public_report JSON shape)
// =========================================================
export type RankInfo = { rank: number; total: number };

export type PublicScore = {
  month_number: number;
  month_name_kh: string;
  is_semester_exam: boolean;
  score_value: number | null;
  score_type: string | null;
  rank_info: RankInfo | null;
};

export type PublicSubject = {
  subject_id: string;
  subject_name: string;
  code: string;
  max_score: number | null;
  monthly_average: number | null;
  exam_average: number | null;
  average: number | null;
  khmer_grade: string | null;
  english_grade: string | null;
  scores: PublicScore[];
};

export type PublicTerm = {
  term_number: number;
  term_name_kh: string;
  monthly_average: number | null;
  exam_average: number | null;
  overall_average: number | null;
  khmer_grade: string | null;
  english_grade: string | null;
  rank_info: RankInfo | null;
  subjects: PublicSubject[];
};

export type AttendanceSummary = {
  total: number;
  present: number;
  absent_permission: number;
  absent_no_permission: number;
};

export type PublicReport = {
  student: {
    student_code: string;
    name_kh: string;
    gender: string | null;
    dob: string;
  };
  class: {
    class_name: string;
    grade_level: number;
  };
  academic_year: {
    id: string;
    year_name: string;
  };
  annual_average: number | null;
  annual_khmer_grade: string | null;
  annual_english_grade: string | null;
  annual_rank_info: RankInfo | null;
  attendance: AttendanceSummary;
  terms: PublicTerm[];
};

// =========================================================
// Cached fetcher
// =========================================================
export async function fetchPublicReport(
  code: string,
  dob: string,
): Promise<PublicReport | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag(`public-report:${code}`);

  const supabase = createPublicClient();
  const { data, error } = await supabase.rpc("get_public_report", {
    p_student_code: code,
    p_dob: dob,
  });

  if (error || !data) return null;

  if (typeof data === "object" && data !== null && "error" in data) {
    return null;
  }

  return data as unknown as PublicReport;
}