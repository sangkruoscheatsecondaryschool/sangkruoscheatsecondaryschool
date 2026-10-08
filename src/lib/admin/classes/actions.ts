"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/require-role";
import { idSchema } from "@/lib/validation/ids";
import type { ActionResult } from "@/lib/actions/types";

function revalidate() {
  revalidatePath("/admin/classes");
}

const nullableId = z
  .union([z.string(), z.literal(""), z.null()])
  .transform((v) => (v === "" || v === null ? null : v))
  .refine(
    (v) => v === null || /^[0-9a-fA-F-]{36}$/.test(v),
    "លេខសម្គាល់គ្រូមិនត្រឹមត្រូវ។",
  );

const baseFields = {
  class_name: z
    .string()
    .trim()
    .min(1, "សូមបញ្ចូលឈ្មោះថ្នាក់។")
    .max(50),
  grade_level: z.coerce
    .number()
    .int()
    .refine((v) => [7, 8, 9].includes(v), "កម្រិតថ្នាក់ត្រូវជា 7, 8, ឬ 9។"),
  homeroom_teacher_id: nullableId,
} as const;

const createSchema = z.object({
  academic_year_id: idSchema,
  ...baseFields,
});

const updateSchema = z.object({
  class_id: idSchema,
  ...baseFields,
});

// ---------------------------------------------------------
// Create
// ---------------------------------------------------------
export async function createClassAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireRole("admin");

  const parsed = createSchema.safeParse({
    academic_year_id: formData.get("academic_year_id"),
    class_name: formData.get("class_name"),
    grade_level: formData.get("grade_level"),
    homeroom_teacher_id: formData.get("homeroom_teacher_id"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "ទិន្នន័យមិនត្រឹមត្រូវ។",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("create_class", {
    p_academic_year_id: parsed.data.academic_year_id,
    p_class_name: parsed.data.class_name,
    p_grade_level: parsed.data.grade_level,
    p_homeroom_teacher_id: parsed.data.homeroom_teacher_id,
  });

  if (error) {
    if (error.code === "23505") {
      return {
        ok: false,
        error: "ឈ្មោះថ្នាក់នេះមានរួចហើយ ក្នុងឆ្នាំសិក្សានេះ។",
      };
    }
    return { ok: false, error: error.message };
  }

  revalidate();
  redirect(`/admin/classes?year=${parsed.data.academic_year_id}`);
}

// ---------------------------------------------------------
// Update
// ---------------------------------------------------------
export async function updateClassAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireRole("admin");

  const parsed = updateSchema.safeParse({
    class_id: formData.get("class_id"),
    class_name: formData.get("class_name"),
    grade_level: formData.get("grade_level"),
    homeroom_teacher_id: formData.get("homeroom_teacher_id"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "ទិន្នន័យមិនត្រឹមត្រូវ។",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("update_class", {
    p_class_id: parsed.data.class_id,
    p_class_name: parsed.data.class_name,
    p_grade_level: parsed.data.grade_level,
    p_homeroom_teacher_id: parsed.data.homeroom_teacher_id,
  });

  if (error) {
    if (error.code === "23505") {
      return {
        ok: false,
        error: "ឈ្មោះថ្នាក់នេះមានរួចហើយ ក្នុងឆ្នាំសិក្សានេះ។",
      };
    }
    if (error.message.includes("Cannot change grade level")) {
      return {
        ok: false,
        error: "មិនអាចផ្លាស់កម្រិតថ្នាក់បានទេ ព្រោះថ្នាក់នេះមានសិស្សរួចហើយ។",
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
export async function deleteClassAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireRole("admin");

  const parsed = z
    .object({ class_id: idSchema })
    .safeParse({ class_id: formData.get("class_id") });

  if (!parsed.success) {
    return { ok: false, error: "លេខសម្គាល់មិនត្រឹមត្រូវ។" };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("delete_class_safe", {
    p_class_id: parsed.data.class_id,
  });

  if (error) {
    if (error.message.includes("has students")) {
      return {
        ok: false,
        error: "មិនអាចលុបបានទេ ព្រោះថ្នាក់នេះមានសិស្សរួចហើយ។",
      };
    }
    if (error.message.includes("teacher assignments")) {
      return {
        ok: false,
        error: "មិនអាចលុបបានទេ ព្រោះថ្នាក់នេះមានការចាត់តាំងគ្រូ។",
      };
    }
    return { ok: false, error: error.message };
  }

  revalidate();
  return { ok: true };
}