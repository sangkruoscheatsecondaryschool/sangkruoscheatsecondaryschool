"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/require-role";
import { idSchema } from "@/lib/validation/ids";
import type { ActionResult } from "@/lib/actions/types";

function revalidate() {
  revalidatePath("/admin/teacher-assignments");
}

// ---------------------------------------------------------
// Sync: full teacher assignment state in one shot.
// formData contains:
//   teacher_id: uuid
//   year: uuid         (for redirect back)
//   class_ids: string  (repeated, one per class card)
//   cs__<class_id>:    (repeated per class, one value per checked subject)
// ---------------------------------------------------------
export async function syncAssignmentsAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireRole("admin");

  const teacherParsed = idSchema.safeParse(formData.get("teacher_id"));
  const yearParsed = idSchema.safeParse(formData.get("year"));

  if (!teacherParsed.success || !yearParsed.success) {
    return { ok: false, error: "លេខសម្គាល់មិនត្រឹមត្រូវ។" };
  }

  const teacherId = teacherParsed.data;
  const yearId = yearParsed.data;

  // Collect class_ids (hidden input, one per class card)
  const classIds = formData
    .getAll("class_ids")
    .filter((v): v is string => typeof v === "string");

  // Build { [class_id]: [subject_id, ...] }
  const map: Record<string, string[]> = {};
  for (const cid of classIds) {
    const ids = formData
      .getAll(`cs__${cid}`)
      .filter((v): v is string => typeof v === "string");
    // Validate each id is uuid-like
    for (const sid of ids) {
      if (!idSchema.safeParse(sid).success) {
        return { ok: false, error: "លេខសម្គាល់មុខវិជ្ជាមិនត្រឹមត្រូវ។" };
      }
    }
    map[cid] = ids;
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("sync_teacher_assignments", {
    p_teacher_id: teacherId,
    p_class_subjects: map,
  });

  if (error) {
    if (error.message.startsWith("CONFLICT|")) {
        const [, tName, cName, sName] = error.message.split("|");
        return {
        ok: false,
        error: `មុខវិជ្ជា "${sName}" ក្នុងថ្នាក់ "${cName}" មានគ្រូបង្រៀនរួចហើយ (${tName})។ សូមលុបចេញពីគ្រូនោះជាមុនសិន។`,
        };
    }
    return { ok: false, error: error.message };
  }

  revalidate();
  redirect(`/admin/teacher-assignments?year=${yearId}&teacher=${teacherId}`);
}

// ---------------------------------------------------------
// Delete one assignment (used on the list's inline cards)
// ---------------------------------------------------------
export async function deleteAssignmentAction(
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
  const { error } = await supabase
    .from("teacher_assignments")
    .delete()
    .eq("id", parsed.data.id);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidate();
  return { ok: true };
}