"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireRole } from "@/lib/auth/require-role";
import { idSchema } from "@/lib/validation/ids";
import type { ActionResult } from "@/lib/actions/types";

function revalidate() {
  revalidatePath("/admin/teachers");
}

const nullableString = (max: number) =>
  z
    .union([z.string(), z.literal(""), z.null()])
    .transform((v) => (v === "" || v === null ? null : v))
    .refine((v) => v === null || v.length <= max, "វាយអក្សរវែកពេក។");

const nullableId = z
  .union([z.string(), z.literal(""), z.null()])
  .transform((v) => (v === "" || v === null ? null : v))
  .refine(
    (v) => v === null || /^[0-9a-fA-F-]{36}$/.test(v),
    "លេខសម្គាល់មិនត្រឹមត្រូវ។",
  );

const nullableDate = z
  .union([z.string(), z.literal(""), z.null()])
  .transform((v) => (v === "" || v === null ? null : v))
  .refine(
    (v) => v === null || /^\d{4}-\d{2}-\d{2}$/.test(v),
    "កាលបរិច្ឆេទមិនត្រឹមត្រូវ។",
  );

const baseFields = {
  full_name_kh: z.string().trim().min(1, "សូមបញ្ចូលឈ្មោះជាភាសាខ្មែរ។").max(150),
  full_name_en: nullableString(150),
  gender: z
    .union([z.literal("M"), z.literal("F"), z.literal(""), z.null()])
    .transform((v) => (v === "" ? null : v)),
  dob: nullableDate,
  phone: nullableString(30),
  contact_address_code: z
    .union([z.string(), z.literal(""), z.null()])
    .transform((v) => (v === "" || v === null ? null : v))
    .refine(
      (v) => v === null || /^[0-9]{2}([0-9]{2}){0,3}$/.test(v),
      "លេខកូដអាសយដ្ឋានមិនត្រឹមត្រូវ។",
    ),
  joined_date: nullableDate,
  specialist_1_subject_id: nullableId,
  specialist_2_subject_id: nullableId,
  notes: nullableString(1000),
} as const;

const createSchema = z.object({
  email: z.string().trim().email("សូមបញ្ចូលអ៊ីមែលត្រឹមត្រូវ។"),
  password: z.string().min(8, "លេខសម្ងាត់ត្រូវមានយ៉ាងតិច 8 តួ។").max(72),
  ...baseFields,
});

const updateSchema = z.object({
  teacher_id: idSchema,
  ...baseFields,
});

// ---------------------------------------------------------
// Create
// ---------------------------------------------------------
export async function createTeacherAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireRole("admin");

  const parsed = createSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    full_name_kh: formData.get("full_name_kh"),
    full_name_en: formData.get("full_name_en"),
    gender: formData.get("gender"),
    dob: formData.get("dob"),
    phone: formData.get("phone"),
    contact_address_code: formData.get("contact_address_code"),
    joined_date: formData.get("joined_date"),
    specialist_1_subject_id: formData.get("specialist_1_subject_id"),
    specialist_2_subject_id: formData.get("specialist_2_subject_id"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "ទិន្នន័យមិនត្រឹមត្រូវ។",
    };
  }

  const {
    email,
    password,
    full_name_kh,
    full_name_en,
    ...profileFields
  } = parsed.data;

  // 1. Create the auth user with service role (this triggers handle_new_user)
  const admin = createAdminClient();
  const { data: created, error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name_kh,
      full_name_en,
      role: "teacher",
    },
  });

  if (authError || !created.user) {
    if (authError?.message.toLowerCase().includes("already")) {
      return { ok: false, error: "អ៊ីមែលនេះមានរួចហើយ។" };
    }
    return { ok: false, error: authError?.message ?? "បង្កើតគណនីមិនបានសម្រេច។" };
  }

  const newId = created.user.id;

  // 2. Update the profile with the extra fields (trigger only creates basic row)
  const supabase = await createClient();
  const { error: updateErr } = await supabase.rpc("update_teacher_profile", {
    p_teacher_id: newId,
    p_full_name_kh: full_name_kh,
    p_full_name_en: full_name_en,
    p_gender: profileFields.gender,
    p_dob: profileFields.dob,
    p_phone: profileFields.phone,
    p_contact_address_code: profileFields.contact_address_code,
    p_joined_date: profileFields.joined_date,
    p_specialist_1_subject_id: profileFields.specialist_1_subject_id,
    p_specialist_2_subject_id: profileFields.specialist_2_subject_id,
    p_notes: profileFields.notes,
  });

  if (updateErr) {
    // Roll back the auth user
    await admin.auth.admin.deleteUser(newId);
    return { ok: false, error: updateErr.message };
  }

  revalidate();
  redirect("/admin/teachers");
}

// ---------------------------------------------------------
// Update
// ---------------------------------------------------------
export async function updateTeacherAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireRole("admin");

  const parsed = updateSchema.safeParse({
    teacher_id: formData.get("teacher_id"),
    full_name_kh: formData.get("full_name_kh"),
    full_name_en: formData.get("full_name_en"),
    gender: formData.get("gender"),
    dob: formData.get("dob"),
    phone: formData.get("phone"),
    contact_address_code: formData.get("contact_address_code"),
    joined_date: formData.get("joined_date"),
    specialist_1_subject_id: formData.get("specialist_1_subject_id"),
    specialist_2_subject_id: formData.get("specialist_2_subject_id"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "ទិន្នន័យមិនត្រឹមត្រូវ។",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("update_teacher_profile", {
    p_teacher_id: parsed.data.teacher_id,
    p_full_name_kh: parsed.data.full_name_kh,
    p_full_name_en: parsed.data.full_name_en,
    p_gender: parsed.data.gender,
    p_dob: parsed.data.dob,
    p_phone: parsed.data.phone,
    p_contact_address_code: parsed.data.contact_address_code,
    p_joined_date: parsed.data.joined_date,
    p_specialist_1_subject_id: parsed.data.specialist_1_subject_id,
    p_specialist_2_subject_id: parsed.data.specialist_2_subject_id,
    p_notes: parsed.data.notes,
  });

  if (error) return { ok: false, error: error.message };

  revalidate();
  return { ok: true };
}

// ---------------------------------------------------------
// Delete
// ---------------------------------------------------------
export async function deleteTeacherAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireRole("admin");

  const parsed = z
    .object({ teacher_id: idSchema })
    .safeParse({ teacher_id: formData.get("teacher_id") });

  if (!parsed.success) {
    return { ok: false, error: "លេខសម្គាល់មិនត្រឹមត្រូវ។" };
  }

  const supabase = await createClient();

  // Check if teacher can be deleted
  const { data: canDelete, error: checkErr } = await supabase.rpc(
    "can_delete_teacher",
    { p_teacher_id: parsed.data.teacher_id },
  );

  if (checkErr) return { ok: false, error: checkErr.message };
  if (!canDelete) {
    return {
      ok: false,
      error:
        "មិនអាចលុបគ្រូនេះបានទេ ព្រោះមានការចាត់តាំង ឬជាគ្រូបន្ទុកថ្នាក់។ សូមលុបការចាត់តាំងជាមុនសិន។",
    };
  }

  // Delete the auth user (cascades to profiles via FK)
  const admin = createAdminClient();
  const { error: authErr } = await admin.auth.admin.deleteUser(
    parsed.data.teacher_id,
  );

  if (authErr) return { ok: false, error: authErr.message };

  revalidate();
  return { ok: true };
}