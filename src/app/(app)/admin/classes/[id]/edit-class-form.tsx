"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ActionResult } from "@/lib/actions/types";
import type { TeacherOption } from "@/lib/admin/classes/queries";
import { updateClassAction } from "@/lib/admin/classes/actions";
import { ClassFields, type ClassDefaults } from "../class-fields";

export function EditClassForm({
  classId,
  yearName,
  teachers,
  defaults,
}: {
  classId: string;
  yearName: string;
  teachers: TeacherOption[];
  defaults: ClassDefaults;
}) {
  const router = useRouter();
  const [state, action, pending] = useActionState<
    ActionResult | null,
    FormData
  >(updateClassAction, null);

  useEffect(() => {
    if (state?.ok) router.refresh();
  }, [state, router]);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="class_id" value={classId} />

      {yearName ? (
        <div className="rounded-card border-border bg-surface border p-3 text-sm">
          ឆ្នាំសិក្សា៖ <span className="font-medium">{yearName}</span>
        </div>
      ) : null}

      <ClassFields teachers={teachers} defaults={defaults} />

      {state && !state.ok ? (
        <div
          role="alert"
          className="rounded-btn border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {state.error}
        </div>
      ) : null}

      {state?.ok ? (
        <div
          role="status"
          className="rounded-btn border border-green-200 bg-green-50 p-3 text-sm text-green-800"
        >
          បានរក្សាទុកដោយជោគជ័យ។
        </div>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="touch-target rounded-btn bg-brand-600 w-full px-4 py-3 font-medium text-white active:bg-brand-700 disabled:opacity-60"
      >
        {pending ? "កំពុងរក្សាទុក..." : "រក្សាទុក"}
      </button>
    </form>
  );
}