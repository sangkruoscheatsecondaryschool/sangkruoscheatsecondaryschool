"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/require-role";
import { idSchema } from "@/lib/validation/ids";
import type { ActionResult } from "@/lib/actions/types";

const yearSchema = z.object({
  year_name: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{4}$/, "ទម្រង់ត្រូវតែជា YYYY-YYYY ឧ. 2026-2027"),
});


export type { ActionResult };

export async function createAcademicYearAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireRole("admin");

  const parsed = yearSchema.safeParse({
    year_name: formData.get("year_name"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "ទិន្នន័យមិនត្រឹមត្រូវ។",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("academic_years")
    .insert({ year_name: parsed.data.year_name, is_current: false });

  if (error) {
    if (error.code === "23505") {
      return { ok: false, error: "ឆ្នាំសិក្សានេះមានរួចហើយ។" };
    }
    return { ok: false, error: error.message };
  }

  revalidatePath("/admin/academic-years");
  return { ok: true };
}

export async function setCurrentYearAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireRole("admin");

  const parsed = idSchema.safeParse(formData.get("id"));
  if (!parsed.success) {
    return { ok: false, error: "លេខសម្គាល់មិនត្រឹមត្រូវ។" };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("set_current_academic_year", {
    p_year_id: parsed.data,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/admin/academic-years");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteAcademicYearAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireRole("admin");

  const parsed = idSchema.safeParse(formData.get("id"));
  if (!parsed.success) {
    return { ok: false, error: "លេខសម្គាល់មិនត្រឹមត្រូវ។" };
  }

  const supabase = await createClient();
  const { error, count } = await supabase
    .from("academic_years")
    .delete({ count: "exact" })
    .eq("id", parsed.data);

  if (error) {
    const msg =
      error.code === "23503"
        ? "មិនអាចលុបបានទេ ព្រោះឆ្នាំសិក្សានេះមានថ្នាក់រៀន ឬទិន្នន័យពាក់ព័ន្ធ។"
        : error.message;
    return { ok: false, error: msg };
  }

  // If RLS silently blocked the delete, count is 0 but no error.
  if (count === 0) {
    return {
      ok: false,
      error: "រកមិនឃើញឆ្នាំសិក្សា ឬអ្នកគ្មានសិទ្ធិលុប។",
    };
  }

  revalidatePath("/admin/academic-years");
  return { ok: true };
}