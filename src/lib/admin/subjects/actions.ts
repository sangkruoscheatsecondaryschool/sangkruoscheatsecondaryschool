"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/require-role";
import { idSchema } from "@/lib/validation/ids";
import type { ActionResult } from "@/lib/actions/types";

function revalidate() {
  revalidatePath("/admin/subjects");
}

// ---------------------------------------------------------
// Base object schema (no transform) so we can reuse .shape.
// ---------------------------------------------------------
const baseFields = {
  subject_name: z
    .string()
    .trim()
    .min(1, "សូមបញ្ចូលឈ្មោះមុខវិជ្ជា។")
    .max(150),
  code: z
    .string()
    .trim()
    .min(1, "សូមបញ្ចូលកូដមុខវិជ្ជា។")
    .max(20)
    .regex(
      /^[A-Za-z0-9_-]+$/,
      "កូដអនុញ្ញាតតែអក្សរអង់គ្លេស លេខ _ និង -។",
    ),
  p_max_grade7: z.coerce
    .number()
    .positive("ពិន្ទុពេញត្រូវធំជាង 0។")
    .max(10000),
  p_max_grade8: z.coerce
    .number()
    .positive("ពិន្ទុពេញត្រូវធំជាង 0។")
    .max(10000),
  p_max_grade9: z.coerce
    .number()
    .positive("ពិន្ទុពេញត្រូវធំជាង 0។")
    .max(10000),
} as const;

const createSchema = z.object(baseFields);
const updateSchema = z.object({
  subject_id: idSchema,
  ...baseFields,
});

function upperCode<T extends { code: string }>(v: T): T {
  return { ...v, code: v.code.toUpperCase() };
}

// ---------------------------------------------------------
// Create
// ---------------------------------------------------------
export async function createSubjectAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireRole("admin");

  const parsed = createSchema.safeParse({
    subject_name: formData.get("subject_name"),
    code: formData.get("code"),
    p_max_grade7: formData.get("p_max_grade7"),
    p_max_grade8: formData.get("p_max_grade8"),
    p_max_grade9: formData.get("p_max_grade9"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "ទិន្នន័យមិនត្រឹមត្រូវ។",
    };
  }

  const v = upperCode(parsed.data);

  const supabase = await createClient();
  const { error } = await supabase.rpc("create_subject_with_configs", {
    p_subject_name: v.subject_name,
    p_code: v.code,
    p_max_grade7: v.p_max_grade7,
    p_max_grade8: v.p_max_grade8,
    p_max_grade9: v.p_max_grade9,
  });

  if (error) {
    if (error.code === "23505") {
      return { ok: false, error: "កូដមុខវិជ្ជានេះមានរួចហើយ។" };
    }
    return { ok: false, error: error.message };
  }

  revalidate();
  return { ok: true };
}

// ---------------------------------------------------------
// Update
// ---------------------------------------------------------
export async function updateSubjectAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireRole("admin");

  const parsed = updateSchema.safeParse({
    subject_id: formData.get("subject_id"),
    subject_name: formData.get("subject_name"),
    code: formData.get("code"),
    p_max_grade7: formData.get("p_max_grade7"),
    p_max_grade8: formData.get("p_max_grade8"),
    p_max_grade9: formData.get("p_max_grade9"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "ទិន្នន័យមិនត្រឹមត្រូវ។",
    };
  }

  const v = upperCode(parsed.data);

  const supabase = await createClient();
  const { error } = await supabase.rpc("update_subject_with_configs", {
    p_subject_id: v.subject_id,
    p_subject_name: v.subject_name,
    p_code: v.code,
    p_max_grade7: v.p_max_grade7,
    p_max_grade8: v.p_max_grade8,
    p_max_grade9: v.p_max_grade9,
  });

  if (error) {
    if (error.code === "23505") {
      return { ok: false, error: "កូដមុខវិជ្ជានេះមានរួចហើយ។" };
    }
    if (error.message.includes("below an existing score")) {
      return {
        ok: false,
        error:
          "ពិន្ទុពេញថ្មីតូចជាងពិន្ទុដែលមានស្រាប់ សម្រាប់ថ្នាក់ដែលបានកំណត់។",
      };
    }
    return { ok: false, error: error.message };
  }

  revalidate();
  return { ok: true };
}

// ---------------------------------------------------------
// Delete
// ---------------------------------------------------------
export async function deleteSubjectAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireRole("admin");

  const parsed = z
    .object({ subject_id: idSchema })
    .safeParse({ subject_id: formData.get("subject_id") });

  if (!parsed.success) {
    return { ok: false, error: "លេខសម្គាល់មិនត្រឹមត្រូវ។" };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("delete_subject_safe", {
    p_subject_id: parsed.data.subject_id,
  });

  if (error) {
    if (error.message.includes("existing scores")) {
      return {
        ok: false,
        error: "មិនអាចលុបបានទេ ព្រោះមុខវិជ្ជានេះមានពិន្ទុរួចហើយ។",
      };
    }
    if (error.message.includes("teacher assignments")) {
      return {
        ok: false,
        error: "មិនអាចលុបបានទេ ព្រោះមុខវិជ្ជានេះមានការចាត់តាំងគ្រូ។",
      };
    }
    return { ok: false, error: error.message };
  }

  revalidate();
  return { ok: true };
}