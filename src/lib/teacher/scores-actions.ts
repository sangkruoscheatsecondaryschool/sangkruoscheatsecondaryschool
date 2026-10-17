"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/require-role";
import { idSchema } from "@/lib/validation/ids";

export type SaveScoresResult =
  | { ok: true; saved: number; failed: number; errors: { name: string; message: string }[] }
  | { ok: false; error: string };

const headerSchema = z.object({
  class_id: idSchema,
  subject_id: idSchema,
  term_month_id: idSchema,
});

export async function saveScoresAction(
  _prev: SaveScoresResult | null,
  formData: FormData,
): Promise<SaveScoresResult> {
  await requireRole(["teacher", "admin"]);

  const parsed = headerSchema.safeParse({
    class_id: formData.get("class_id"),
    subject_id: formData.get("subject_id"),
    term_month_id: formData.get("term_month_id"),
  });

  if (!parsed.success) {
    return { ok: false, error: "ទិន្នន័យមិនត្រឹមត្រូវ។" };
  }

  // Collect per-student values from formData: score__<student_id>
  const scores: { student_id: string; score_value: string }[] = [];
  const names: Record<string, string> = {};

  for (const [key, value] of formData.entries()) {
    if (!key.startsWith("score__")) continue;
    if (typeof value !== "string") continue;
    const studentId = key.slice("score__".length);
    if (!idSchema.safeParse(studentId).success) continue;
    scores.push({ student_id: studentId, score_value: value.trim() });
    const name = formData.get(`name__${studentId}`);
    if (typeof name === "string") names[studentId] = name;
  }

  if (scores.length === 0) {
    return { ok: true, saved: 0, failed: 0, errors: [] };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("bulk_upsert_scores", {
    p_class_id: parsed.data.class_id,
    p_subject_id: parsed.data.subject_id,
    p_term_month_id: parsed.data.term_month_id,
    p_scores: scores,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  const result = (data ?? []) as {
    row_index: number;
    ok: boolean;
    student_id: string | null;
    error: string | null;
  }[];

  const failures = result.filter((r) => !r.ok);
  const saved = result.length - failures.length;

  revalidatePath(
    `/teacher/classes/${parsed.data.class_id}/scores`,
  );

  return {
    ok: true,
    saved,
    failed: failures.length,
    errors: failures.map((f) => ({
      name: f.student_id
        ? (names[f.student_id] ?? f.student_id)
        : "—",
      message: f.error ?? "មិនស្គាល់",
    })),
  };
}