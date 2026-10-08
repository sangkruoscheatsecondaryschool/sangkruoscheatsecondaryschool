import "server-only";
import { createClient } from "@/lib/supabase/server";

export type SubjectGradeConfig = {
  grade_level: number;
  max_score: number;
};

export type SubjectWithConfigs = {
  id: string;
  subject_name: string;
  code: string;
  created_at: string;
  configs: SubjectGradeConfig[];
};

function emptyConfigs(): SubjectGradeConfig[] {
  return [
    { grade_level: 7, max_score: 0 },
    { grade_level: 8, max_score: 0 },
    { grade_level: 9, max_score: 0 },
  ];
}

export async function listSubjectsWithConfigs(): Promise<SubjectWithConfigs[]> {
  const supabase = await createClient();

  const [subjectsRes, configsRes] = await Promise.all([
    supabase
      .from("subjects")
      .select("id, subject_name, code, created_at")
      .order("subject_name", { ascending: true }),
    supabase
      .from("subject_grade_configs")
      .select("subject_id, grade_level, max_score"),
  ]);

  if (subjectsRes.error) throw new Error(subjectsRes.error.message);
  if (configsRes.error) throw new Error(configsRes.error.message);

  const bySubject = new Map<string, SubjectGradeConfig[]>();
  for (const c of configsRes.data ?? []) {
    const list = bySubject.get(c.subject_id) ?? emptyConfigs();
    const idx = list.findIndex((x) => x.grade_level === c.grade_level);
    if (idx >= 0) list[idx] = { grade_level: c.grade_level, max_score: c.max_score };
    bySubject.set(c.subject_id, list);
  }

  return (subjectsRes.data ?? []).map((s) => ({
    ...s,
    configs: bySubject.get(s.id) ?? emptyConfigs(),
  }));
}

export async function getSubjectWithConfigs(
  id: string,
): Promise<SubjectWithConfigs | null> {
  const supabase = await createClient();

  const [subjectRes, configsRes] = await Promise.all([
    supabase
      .from("subjects")
      .select("id, subject_name, code, created_at")
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("subject_grade_configs")
      .select("grade_level, max_score")
      .eq("subject_id", id),
  ]);

  if (subjectRes.error) throw new Error(subjectRes.error.message);
  if (!subjectRes.data) return null;
  if (configsRes.error) throw new Error(configsRes.error.message);

  const configs = emptyConfigs();
  for (const c of configsRes.data ?? []) {
    const idx = configs.findIndex((x) => x.grade_level === c.grade_level);
    if (idx >= 0) configs[idx] = { grade_level: c.grade_level, max_score: c.max_score };
  }

  return { ...subjectRes.data, configs };
}