import "server-only";
import { createClient } from "@/lib/supabase/server";

export type RankedColumn = {
  key: string;
  label: string;
  code?: string;
  bold?: boolean;
  group?: string;
};

export type RankedStudent = {
  student_id: string;
  student_code: string;
  name_kh: string;
  gender: string | null;
  values: Record<string, number | null>;
  average: number | null;
  rank: number | null;
  khmer_grade: string | null;
  english_grade: string | null;
};

export type GradeBucket = {
  letter: "A" | "B" | "C" | "D" | "E" | "F";
  count: number;
  male: number;
  female: number;
};

export type KhmerGradeBucket = {
  label: string; // ល្អ / ល្អបង្គួរ / មធ្យម / ខ្សោយ
  count: number;
  male: number;
  female: number;
};

export type RankingSummary = {
  total: number;
  male: number;
  female: number;
  pass: number;
  fail: number;
  grades: GradeBucket[];
  khmer_grades: KhmerGradeBucket[];
};

export type RankingReport = {
  mode: "monthly" | "semester" | "annual";
  title: string;
  subtitle: string;
  class_name: string;
  grade_level: number;
  academic_year_name: string;
  homeroom_teacher_name: string | null;
  layout: "compact" | "wide";
  columns: RankedColumn[];
  students: RankedStudent[];
  summary: RankingSummary;
};

export async function fetchMonthlyRanking(
  classId: string,
  termMonthId: string,
): Promise<RankingReport | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_class_ranking_monthly", {
    p_class_id: classId,
    p_term_month_id: termMonthId,
  });
  if (error) throw new Error(error.message);
  return (data as RankingReport | null) ?? null;
}

export async function fetchSemesterRanking(
  classId: string,
  academicTermId: string,
): Promise<RankingReport | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_class_ranking_semester", {
    p_class_id: classId,
    p_academic_term_id: academicTermId,
  });
  if (error) throw new Error(error.message);
  return (data as RankingReport | null) ?? null;
}

export async function fetchAnnualRanking(
  classId: string,
  academicYearId: string,
  layout: "compact" | "wide" = "compact",
): Promise<RankingReport | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_class_ranking_annual", {
    p_class_id: classId,
    p_academic_year_id: academicYearId,
    p_layout: layout,
  });
  if (error) throw new Error(error.message);
  return (data as RankingReport | null) ?? null;
}