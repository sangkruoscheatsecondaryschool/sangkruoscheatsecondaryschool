import "server-only";
import { createClient } from "@/lib/supabase/server";

export type StatisticsData = {
  students: {
    grade_level: number;
    total: number;
    male: number;
    female: number;
  }[];
  teachers: {
    total: number;
    male: number;
    female: number;
  };
  grades: {
    A: number;
    B: number;
    C: number;
    D: number;
    E: number;
    F: number;
  };
  attendance: {
    present: number;
    permission: number;
    unpermitted: number;
  };
};

export async function fetchSchoolStatistics(
  yearId: string,
): Promise<StatisticsData | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_school_statistics", {
    p_academic_year_id: yearId,
  });

  if (error) throw new Error(error.message);
  return (data as StatisticsData | null) ?? null;
}