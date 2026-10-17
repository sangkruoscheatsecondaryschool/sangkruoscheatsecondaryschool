"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/require-role";
import { idSchema } from "@/lib/validation/ids";

export type SaveAttendanceResult =
  | {
      ok: true;
      saved: number;
      failed: number;
      errors: { name: string; message: string }[];
    }
  | { ok: false; error: string };

const headerSchema = z.object({
  class_id: idSchema,
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "កាលបរិច្ឆេទមិនត្រឹមត្រូវ។"),
});

const ALLOWED_STATUSES = [
  "present",
  "absent_permission",
  "absent_no_permission",
] as const;

export async function saveAttendanceAction(
  _prev: SaveAttendanceResult | null,
  formData: FormData,
): Promise<SaveAttendanceResult> {
  await requireRole(["teacher", "admin"]);

  const parsed = headerSchema.safeParse({
    class_id: formData.get("class_id"),
    date: formData.get("date"),
  });

  if (!parsed.success) {
    return { ok: false, error: "ទិន្នន័យមិនត្រឹមត្រូវ។" };
  }

  // Collect per-student status: attn__<student_id>
  const records: { student_id: string; status: string }[] = [];
  const names: Record<string, string> = {};

  for (const [key, value] of formData.entries()) {
    if (!key.startsWith("attn__")) continue;
    if (typeof value !== "string") continue;
    const studentId = key.slice("attn__".length);
    if (!idSchema.safeParse(studentId).success) continue;

    const status = value.trim();
    if (!ALLOWED_STATUSES.includes(status as (typeof ALLOWED_STATUSES)[number])) {
      continue;
    }

    records.push({ student_id: studentId, status });
    const name = formData.get(`name__${studentId}`);
    if (typeof name === "string") names[studentId] = name;
  }

  if (records.length === 0) {
    return { ok: true, saved: 0, failed: 0, errors: [] };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("bulk_upsert_attendance", {
    p_class_id: parsed.data.class_id,
    p_date: parsed.data.date,
    p_records: records,
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

  revalidatePath(`/teacher/classes/${parsed.data.class_id}/attendance`);

  return {
    ok: true,
    saved,
    failed: failures.length,
    errors: failures.map((f) => ({
      name: f.student_id ? (names[f.student_id] ?? f.student_id) : "—",
      message: f.error ?? "មិនស្គាល់",
    })),
  };
}