"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/require-role";
import { idSchema } from "@/lib/validation/ids";
import type { ActionResult } from "@/lib/actions/types";
import { KHMER_MONTHS } from "./constants";

function revalidateAll() {
  revalidatePath("/admin/academic-years", "layout");
}

// ---------------------------------------------------------
// Setup default terms for a year
// ---------------------------------------------------------
export async function setupTermsAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireRole("admin");

  const parsed = z
    .object({ year_id: idSchema })
    .safeParse({ year_id: formData.get("year_id") });

  if (!parsed.success) {
    return { ok: false, error: "លេខសម្គាល់មិនត្រឹមត្រូវ។" };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("setup_default_year_terms", {
    p_academic_year_id: parsed.data.year_id,
  });

  if (error) return { ok: false, error: error.message };

  revalidateAll();
  return { ok: true };
}

// ---------------------------------------------------------
// Rename a term
// ---------------------------------------------------------
export async function renameTermAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireRole("admin");

  const parsed = z
    .object({
      term_id: idSchema,
      term_name_kh: z.string().trim().min(1).max(100),
    })
    .safeParse({
      term_id: formData.get("term_id"),
      term_name_kh: formData.get("term_name_kh"),
    });

  if (!parsed.success) {
    return { ok: false, error: "សូមបញ្ចូលឈ្មោះឆមាស។" };
  }

  const supabase = await createClient();
  const { error, count } = await supabase
    .from("academic_terms")
    .update({ term_name_kh: parsed.data.term_name_kh }, { count: "exact" })
    .eq("id", parsed.data.term_id);

  if (error) return { ok: false, error: error.message };
  if (count === 0) return { ok: false, error: "រកមិនឃើញឆមាស។" };

  revalidateAll();
  return { ok: true };
}

// ---------------------------------------------------------
// Add a month to a term
// ---------------------------------------------------------
export async function addTermMonthAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireRole("admin");

  const parsed = z
    .object({
      term_id: idSchema,
      month_number: z.coerce.number().int().min(1).max(12),
    })
    .safeParse({
      term_id: formData.get("term_id"),
      month_number: formData.get("month_number"),
    });

  if (!parsed.success) {
    return { ok: false, error: "ទិន្នន័យមិនត្រឹមត្រូវ។" };
  }

  const monthNameKh = KHMER_MONTHS.find(
    (m) => m.number === parsed.data.month_number,
  )?.name_kh;

  if (!monthNameKh) {
    return { ok: false, error: "ខែមិនត្រឹមត្រូវ។" };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("add_term_month", {
    p_academic_term_id: parsed.data.term_id,
    p_month_number: parsed.data.month_number,
    p_month_name_kh: monthNameKh,
  });

  if (error) {
    if (error.code === "23505") {
      return { ok: false, error: "ខែនេះមានរួចហើយនៅក្នុងឆមាសនេះ។" };
    }
    return { ok: false, error: error.message };
  }

  revalidateAll();
  return { ok: true };
}

// ---------------------------------------------------------
// Unified month command: move up/down, set/unset exam, remove
// ---------------------------------------------------------
const COMMANDS = [
  "move_up",
  "move_down",
  "set_exam",
  "unset_exam",
  "remove",
] as const;

export async function monthCommandAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireRole("admin");

  const parsed = z
    .object({
      month_id: idSchema,
      command: z.enum(COMMANDS),
    })
    .safeParse({
      month_id: formData.get("month_id"),
      command: formData.get("command"),
    });

  if (!parsed.success) {
    return { ok: false, error: "ទិន្នន័យមិនត្រឹមត្រូវ។" };
  }

  const supabase = await createClient();
  const { month_id, command } = parsed.data;

  let error: { message: string } | null = null;

  if (command === "move_up" || command === "move_down") {
    const { error: e } = await supabase.rpc("move_term_month", {
      p_month_id: month_id,
      p_direction: command === "move_up" ? "up" : "down",
    });
    error = e;
  } else if (command === "set_exam" || command === "unset_exam") {
    const { error: e } = await supabase.rpc("set_semester_exam_month", {
      p_month_id: month_id,
      p_value: command === "set_exam",
    });
    error = e;
  } else {
    const { error: e } = await supabase.rpc("remove_term_month", {
      p_month_id: month_id,
    });
    error = e;
  }

  if (error) {
    const msg = error.message.includes("has scores")
      ? "មិនអាចលុបបានទេ ព្រោះខែនេះមានពិន្ទុរួចហើយ។"
      : error.message;
    return { ok: false, error: msg };
  }

  revalidateAll();
  return { ok: true };
}