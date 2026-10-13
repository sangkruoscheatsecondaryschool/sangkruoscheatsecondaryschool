"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/require-role";
import { idSchema } from "@/lib/validation/ids";
import type { ActionResult } from "@/lib/actions/types";

function revalidate(teacherId: string) {
  revalidatePath(`/admin/teachers/${teacherId}`);
  revalidatePath("/admin/teachers");
}

const nullableString = (max: number) =>
  z
    .union([z.string(), z.literal(""), z.null()])
    .transform((v) => (v === "" || v === null ? null : v))
    .refine((v) => v === null || v.length <= max, "វាយអក្សរវែងពេក។");

const addSchema = z.object({
  teacher_id: idSchema,
  position_id: idSchema,
  start_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "សូមបញ្ចូលកាលបរិច្ឆេទត្រឹមត្រូវ។"),
  decision_number: nullableString(100),
  notes: nullableString(500),
});

export async function addPromotionAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireRole("admin");

  const parsed = addSchema.safeParse({
    teacher_id: formData.get("teacher_id"),
    position_id: formData.get("position_id"),
    start_date: formData.get("start_date"),
    decision_number: formData.get("decision_number"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "ទិន្នន័យមិនត្រឹមត្រូវ។",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("add_salary_promotion", {
    p_teacher_id: parsed.data.teacher_id,
    p_position_id: parsed.data.position_id,
    p_start_date: parsed.data.start_date,
    p_decision_number: parsed.data.decision_number,
    p_notes: parsed.data.notes,
  });

  if (error) {
    if (error.message.includes("must be after")) {
      return {
        ok: false,
        error:
          "កាលបរិច្ឆេទចាប់ផ្ដើមត្រូវតែក្រោយកាលបរិច្ឆេទនៃកាំប្រាក់បច្ចុប្បន្ន។",
      };
    }
    return { ok: false, error: error.message };
  }

  revalidate(parsed.data.teacher_id);
  return { ok: true };
}

export async function deleteSalaryHistoryAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireRole("admin");

  const parsed = z
    .object({
      history_id: idSchema,
      teacher_id: idSchema,
    })
    .safeParse({
      history_id: formData.get("history_id"),
      teacher_id: formData.get("teacher_id"),
    });

  if (!parsed.success) {
    return { ok: false, error: "លេខសម្គាល់មិនត្រឹមត្រូវ។" };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("delete_current_salary_position", {
    p_history_id: parsed.data.history_id,
  });

  if (error) {
    if (error.message.includes("current position")) {
      return {
        ok: false,
        error: "អាចលុបបានតែកាំប្រាក់បច្ចុប្បន្នប៉ុណ្ណោះ។",
      };
    }
    return { ok: false, error: error.message };
  }

  revalidate(parsed.data.teacher_id);
  return { ok: true };
}