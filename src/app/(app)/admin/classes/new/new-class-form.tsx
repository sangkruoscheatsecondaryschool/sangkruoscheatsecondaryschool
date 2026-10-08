"use client";

import { useActionState } from "react";
import type { ActionResult } from "@/lib/actions/types";
import type { TeacherOption } from "@/lib/admin/classes/queries";
import { createClassAction } from "@/lib/admin/classes/actions";
import { ClassFields } from "../class-fields";

export function NewClassForm({
  academicYearId,
  yearName,
  teachers,
}: {
  academicYearId: string;
  yearName: string;
  teachers: TeacherOption[];
}) {
  const [state, action, pending] = useActionState<
    ActionResult | null,
    FormData
  >(createClassAction, null);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="academic_year_id" value={academicYearId} />

      <div className="rounded-card border-border bg-surface border p-3 text-sm">
        ឆ្នាំសិក្សា៖ <span className="font-medium">{yearName}</span>
      </div>

      <ClassFields teachers={teachers} />

      {state && !state.ok ? (
        <div
          role="alert"
          className="rounded-btn border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {state.error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="touch-target rounded-btn bg-brand-600 w-full px-4 py-3 font-medium text-white active:bg-brand-700 disabled:opacity-60"
      >
        {pending ? "កំពុងបង្កើត..." : "បង្កើត"}
      </button>
    </form>
  );
}