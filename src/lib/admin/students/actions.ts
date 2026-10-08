"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/require-role";
import { idSchema } from "@/lib/validation/ids";
import type { ActionResult } from "@/lib/actions/types";
import type { StudentStatus } from "@/lib/supabase/database.types";

function revalidate() {
  revalidatePath("/admin/students");
}

const STATUSES = ["active", "dropped_s1", "dropped_s2", "graduated"] as const;

const nullableString = (max: number) =>
  z
    .union([z.string(), z.literal(""), z.null()])
    .transform((v) => (v === "" || v === null ? null : v))
    .refine((v) => v === null || v.length <= max, "វាយអក្សរវែងពេក។");

const nullableId = z
  .union([z.string(), z.literal(""), z.null()])
  .transform((v) => (v === "" || v === null ? null : v))
  .refine(
    (v) => v === null || /^[0-9a-fA-F-]{36}$/.test(v),
    "លេខសម្គាល់មិនត្រឹមត្រូវ។",
  );

const baseFields = {
  class_id: idSchema,
  student_code: z
    .string()
    .trim()
    .min(1, "សូមបញ្ចូលលេខកូដសិស្ស។")
    .max(30),
  name_kh: z.string().trim().min(1, "សូមបញ្ចូលឈ្មោះសិស្ស។").max(150),
  gender: z
    .union([z.literal("M"), z.literal("F"), z.literal(""), z.null()])
    .transform((v) => (v === "" ? null : v)),
  dob: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "សូមបញ្ចូលថ្ងៃខែឆ្នាំកំណើតត្រឹមត្រូវ។"),
  place_of_birth_village_id: nullableId,
  current_address_village_id: nullableId,
  current_address_detail: nullableString(200),
  mother_name: nullableString(150),
  father_name: nullableString(150),
  contact_number: nullableString(30),
  status: z.enum(STATUSES),
} as const;

const createSchema = z.object(baseFields);
const updateSchema = z.object({ student_id: idSchema, ...baseFields });

// ---------------------------------------------------------
// Create
// ---------------------------------------------------------
export async function createStudentAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireRole("admin");

  const parsed = createSchema.safeParse({
    class_id: formData.get("class_id"),
    student_code: formData.get("student_code"),
    name_kh: formData.get("name_kh"),
    gender: formData.get("gender"),
    dob: formData.get("dob"),
    place_of_birth_village_id: formData.get("place_of_birth_village_id"),
    current_address_village_id: formData.get("current_address_village_id"),
    current_address_detail: formData.get("current_address_detail"),
    mother_name: formData.get("mother_name"),
    father_name: formData.get("father_name"),
    contact_number: formData.get("contact_number"),
    status: formData.get("status") || "active",
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "ទិន្នន័យមិនត្រឹមត្រូវ។",
    };
  }

  // If current address not specified, default to place of birth
  const currentVillage =
    parsed.data.current_address_village_id ??
    parsed.data.place_of_birth_village_id;

  const supabase = await createClient();
  const { error } = await supabase.rpc("create_student", {
    p_class_id: parsed.data.class_id,
    p_student_code: parsed.data.student_code,
    p_name_kh: parsed.data.name_kh,
    p_gender: parsed.data.gender,
    p_dob: parsed.data.dob,
    p_place_of_birth_village_id: parsed.data.place_of_birth_village_id,
    p_current_address_village_id: currentVillage,
    p_current_address_detail: parsed.data.current_address_detail,
    p_mother_name: parsed.data.mother_name,
    p_father_name: parsed.data.father_name,
    p_contact_number: parsed.data.contact_number,
    p_status: parsed.data.status as StudentStatus,
  });

  if (error) {
    if (error.code === "23505") {
      return { ok: false, error: "លេខកូដសិស្សនេះមានរួចហើយ។" };
    }
    return { ok: false, error: error.message };
  }

  revalidate();
  redirect(`/admin/students?class=${parsed.data.class_id}`);
}

// ---------------------------------------------------------
// Update
// ---------------------------------------------------------
export async function updateStudentAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireRole("admin");

  const parsed = updateSchema.safeParse({
    student_id: formData.get("student_id"),
    class_id: formData.get("class_id"),
    student_code: formData.get("student_code"),
    name_kh: formData.get("name_kh"),
    gender: formData.get("gender"),
    dob: formData.get("dob"),
    place_of_birth_village_id: formData.get("place_of_birth_village_id"),
    current_address_village_id: formData.get("current_address_village_id"),
    current_address_detail: formData.get("current_address_detail"),
    mother_name: formData.get("mother_name"),
    father_name: formData.get("father_name"),
    contact_number: formData.get("contact_number"),
    status: formData.get("status") || "active",
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "ទិន្នន័យមិនត្រឹមត្រូវ។",
    };
  }

  const currentVillage =
    parsed.data.current_address_village_id ??
    parsed.data.place_of_birth_village_id;

  const supabase = await createClient();
  const { error } = await supabase.rpc("update_student", {
    p_student_id: parsed.data.student_id,
    p_class_id: parsed.data.class_id,
    p_student_code: parsed.data.student_code,
    p_name_kh: parsed.data.name_kh,
    p_gender: parsed.data.gender,
    p_dob: parsed.data.dob,
    p_place_of_birth_village_id: parsed.data.place_of_birth_village_id,
    p_current_address_village_id: currentVillage,
    p_current_address_detail: parsed.data.current_address_detail,
    p_mother_name: parsed.data.mother_name,
    p_father_name: parsed.data.father_name,
    p_contact_number: parsed.data.contact_number,
    p_status: parsed.data.status as StudentStatus,
  });

  if (error) {
    if (error.code === "23505") {
      return { ok: false, error: "លេខកូដសិស្សនេះមានរួចហើយ។" };
    }
    return { ok: false, error: error.message };
  }

  revalidate();
  return { ok: true };
}

// ---------------------------------------------------------
// Delete
// ---------------------------------------------------------
export async function deleteStudentAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireRole("admin");

  const parsed = z
    .object({ student_id: idSchema })
    .safeParse({ student_id: formData.get("student_id") });

  if (!parsed.success) {
    return { ok: false, error: "លេខសម្គាល់មិនត្រឹមត្រូវ។" };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("delete_student_safe", {
    p_student_id: parsed.data.student_id,
  });

  if (error) {
    if (error.message.includes("existing scores")) {
      return {
        ok: false,
        error: "មិនអាចលុបបានទេ ព្រោះសិស្សនេះមានពិន្ទុរួចហើយ។",
      };
    }
    if (error.message.includes("attendance records")) {
      return {
        ok: false,
        error: "មិនអាចលុបបានទេ ព្រោះសិស្សនេះមានកំណត់ត្រាវត្តមាន។",
      };
    }
    return { ok: false, error: error.message };
  }

  revalidate();
  return { ok: true };
}