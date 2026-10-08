"use client";

import { useActionState } from "react";
import type { ActionResult } from "@/lib/actions/types";
import type { ClassOption } from "@/lib/admin/students/queries";
import { createStudentAction } from "@/lib/admin/students/actions";
import { StudentFields } from "../student-fields";
import type { ProvinceOption } from "@/lib/admin/students/address-queries";

export function NewStudentForm({
  yearId,
  classes,
  provinces,
  defaultClassId,
}: {
  yearId: string;
  classes: ClassOption[];
  provinces: ProvinceOption[];
  defaultClassId?: string;
}) {
  const [state, action, pending] = useActionState<
    ActionResult | null,
    FormData
  >(createStudentAction, null);

  return (
    <form action={action} className="space-y-4">
      <StudentFields
        classes={classes}
        provinces={provinces}
        defaults={{ class_id: defaultClassId }}
      />

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

      <input type="hidden" name="_year" value={yearId} />
    </form>
  );
}