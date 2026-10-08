import "server-only";
import { createClient } from "@/lib/supabase/server";

export type AcademicYear = {
  id: string;
  year_name: string;
  is_current: boolean;
  created_at: string;
};

export async function listAcademicYears(): Promise<AcademicYear[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("academic_years")
    .select("id, year_name, is_current, created_at")
    .order("year_name", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getAcademicYear(
  id: string,
): Promise<AcademicYear | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("academic_years")
    .select("id, year_name, is_current, created_at")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

export async function getCurrentAcademicYear(): Promise<AcademicYear | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("academic_years")
    .select("id, year_name, is_current, created_at")
    .eq("is_current", true)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}