"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/require-role";
import { idSchema } from "@/lib/validation/ids";
import type { ActionResult } from "@/lib/actions/types";

const nullableString = (max: number) =>
  z
    .union([z.string(), z.literal(""), z.null()])
    .transform((v) => (v === "" || v === null ? null : v))
    .refine((v) => v === null || v.length <= max, "វាយអក្សរវែងពេក។");

const schema = z.object({
  id: idSchema,
  school_name_kh: z.string().trim().min(1, "សូមបញ្ចូលឈ្មោះសាលា។").max(200),
  school_name_en: nullableString(200),
  school_code: nullableString(50),
  ministry_line_kh: z.string().trim().min(1).max(200),
  department_line_kh: nullableString(200),
  district_line_kh: nullableString(200),
  address_code: z
    .union([z.string(), z.literal(""), z.null()])
    .transform((v) => (v === "" || v === null ? null : v))
    .refine(
      (v) => v === null || /^[0-9]{2}([0-9]{2}){0,3}$/.test(v),
      "លេខកូដអាសយដ្ឋានមិនត្រឹមត្រូវ។",
    ),
  phone: nullableString(30),
  email: nullableString(100),
  principal_name_kh: nullableString(150),
  motto_kh: z.string().trim().min(1).max(100),
  logo_url: nullableString(500),
});

export async function updateSchoolSettingsAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireRole("admin");

  const parsed = schema.safeParse({
    id: formData.get("id"),
    school_name_kh: formData.get("school_name_kh"),
    school_name_en: formData.get("school_name_en"),
    school_code: formData.get("school_code"),
    ministry_line_kh: formData.get("ministry_line_kh"),
    department_line_kh: formData.get("department_line_kh"),
    district_line_kh: formData.get("district_line_kh"),
    address_code: formData.get("address_code"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    principal_name_kh: formData.get("principal_name_kh"),
    motto_kh: formData.get("motto_kh"),
    logo_url: formData.get("logo_url"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "ទិន្នន័យមិនត្រឹមត្រូវ។",
    };
  }

  const supabase = await createClient();
  const { id, ...updates } = parsed.data;

  const { error } = await supabase
    .from("school_settings")
    .update(updates)
    .eq("id", id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/settings/school");
  revalidatePath("/admin", "layout");
  return { ok: true };
}