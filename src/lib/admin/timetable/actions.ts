"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/require-role";
import { idSchema } from "@/lib/validation/ids";
import type { ActionResult } from "@/lib/actions/types";

// =========================================================
// Period CRUD
// =========================================================
const periodSchema = z
  .object({
    year_id: idSchema,
    period_number: z.coerce.number().int().min(1).max(20),
    start_time: z.string().regex(/^\d{2}:\d{2}$/, "ម៉ោងចាប់ផ្ដើមមិនត្រឹមត្រូវ។"),
    end_time: z.string().regex(/^\d{2}:\d{2}$/, "ម៉ោងបញ្ចប់មិនត្រឹមត្រូវ។"),
    label: z
      .union([z.string(), z.literal(""), z.null()])
      .transform((v) => (v === "" || v === null ? null : v))
      .refine((v) => v === null || v.length <= 50, "វាយអក្សរវែងពេក។"),
  })
  .refine((v) => v.end_time > v.start_time, {
    message: "ម៉ោងបញ្ចប់ត្រូវធំជាងម៉ោងចាប់ផ្ដើម។",
    path: ["end_time"],
  });

export async function createPeriodAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireRole("admin");

  const parsed = periodSchema.safeParse({
    year_id: formData.get("year_id"),
    period_number: formData.get("period_number"),
    start_time: formData.get("start_time"),
    end_time: formData.get("end_time"),
    label: formData.get("label"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "ទិន្នន័យមិនត្រឹមត្រូវ។",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("periods").insert({
    academic_year_id: parsed.data.year_id,
    period_number: parsed.data.period_number,
    start_time: parsed.data.start_time,
    end_time: parsed.data.end_time,
    label: parsed.data.label,
  });

  if (error) {
    if (error.code === "23505") {
      return { ok: false, error: "លេខម៉ោងនេះមានរួចហើយ។" };
    }
    return { ok: false, error: error.message };
  }

  revalidatePath(`/admin/timetable/periods`);
  return { ok: true };
}

export async function updatePeriodAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireRole("admin");

  const idParsed = idSchema.safeParse(formData.get("id"));
  if (!idParsed.success) {
    return { ok: false, error: "លេខសម្គាល់មិនត្រឹមត្រូវ។" };
  }

  const parsed = periodSchema.omit({ year_id: true }).safeParse({
    period_number: formData.get("period_number"),
    start_time: formData.get("start_time"),
    end_time: formData.get("end_time"),
    label: formData.get("label"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "ទិន្នន័យមិនត្រឹមត្រូវ។",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("periods")
    .update({
      period_number: parsed.data.period_number,
      start_time: parsed.data.start_time,
      end_time: parsed.data.end_time,
      label: parsed.data.label,
    })
    .eq("id", idParsed.data);

  if (error) {
    if (error.code === "23505") {
      return { ok: false, error: "លេខម៉ោងនេះមានរួចហើយ។" };
    }
    return { ok: false, error: error.message };
  }

  revalidatePath(`/admin/timetable/periods`);
  return { ok: true };
}

export async function deletePeriodAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireRole("admin");

  const parsed = z
    .object({ id: idSchema })
    .safeParse({ id: formData.get("id") });
  if (!parsed.success) {
    return { ok: false, error: "លេខសម្គាល់មិនត្រឹមត្រូវ។" };
  }

  const supabase = await createClient();

  // Check for timetable entries using this period
  const { count } = await supabase
    .from("timetable_entries")
    .select("id", { count: "exact", head: true })
    .eq("period_id", parsed.data.id);

  if ((count ?? 0) > 0) {
    return {
      ok: false,
      error:
        "មិនអាចលុបម៉ោងនេះបានទេ ព្រោះមានការកំណត់ក្នុងតារាងកាលវិភាគរួចហើយ។ សូមលុបការកំណត់ទាំងនោះជាមុនសិន។",
    };
  }

  const { error } = await supabase
    .from("periods")
    .delete()
    .eq("id", parsed.data.id);

  if (error) return { ok: false, error: error.message };

  revalidatePath(`/admin/timetable/periods`);
  return { ok: true };
}

export async function setupDefaultPeriodsAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireRole("admin");

  const parsed = idSchema.safeParse(formData.get("year_id"));
  if (!parsed.success) {
    return { ok: false, error: "លេខសម្គាល់មិនត្រឹមត្រូវ។" };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("setup_default_periods", {
    p_academic_year_id: parsed.data,
  });

  if (error) return { ok: false, error: error.message };

  revalidatePath(`/admin/timetable/periods`);
  return { ok: true };
}

// =========================================================
// Cell save
// =========================================================
const cellSchema = z.object({
  class_id: idSchema,
  day_of_week: z.coerce.number().int().min(1).max(6),
  period_id: idSchema,
  subject_id: z
    .union([z.string(), z.literal(""), z.null()])
    .transform((v) => (v === "" || v === null ? null : v))
    .refine(
      (v) => v === null || /^[0-9a-fA-F-]{36}$/.test(v),
      "លេខសម្គាល់មុខវិជ្ជាមិនត្រឹមត្រូវ។",
    ),
});

export async function saveTimetableCellAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireRole("admin");

  const parsed = cellSchema.safeParse({
    class_id: formData.get("class_id"),
    day_of_week: formData.get("day_of_week"),
    period_id: formData.get("period_id"),
    subject_id: formData.get("subject_id"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "ទិន្នន័យមិនត្រឹមត្រូវ។",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("save_timetable_entry", {
    p_class_id: parsed.data.class_id,
    p_day_of_week: parsed.data.day_of_week,
    p_period_id: parsed.data.period_id,
    p_subject_id: parsed.data.subject_id,
  });

  if (error) {
    if (error.message.startsWith("NO_ASSIGNMENT")) {
      return {
        ok: false,
        error:
          "មុខវិជ្ជានេះមិនទាន់ត្រូវបានចាត់តាំងឱ្យគ្រូបង្រៀនសម្រាប់ថ្នាក់នេះទេ។ សូមកំណត់មុខវិជ្ជាបង្រៀននេះឱ្យគ្រូជាមុនសិន។",
      };
    }
    if (error.message.startsWith("TEACHER_CONFLICT|")) {
      const [, teacher, cls, subj] = error.message.split("|");
      return {
        ok: false,
        error: `គ្រូ ${teacher} មានម៉ោងបង្រៀនរួចហើយនៅថ្នាក់ ${cls} មុខវិជ្ជា ${subj} ក្នុងម៉ោងនេះ។`,
      };
    }
    if (error.message.startsWith("CLASS_CONFLICT|")) {
      const [, subj] = error.message.split("|");
      return {
        ok: false,
        error: `ម៉ោងនេះមានមុខវិជ្ជា ${subj} រួចហើយ។`,
      };
    }
    return { ok: false, error: error.message };
  }

  revalidatePath(`/admin/timetable`);
  return { ok: true };
}