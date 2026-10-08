"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ActionResult } from "@/lib/actions/types";
import type { ClassOption } from "@/lib/admin/students/queries";
import { updateStudentAction } from "@/lib/admin/students/actions";
import { StudentFields, type StudentDefaults } from "../student-fields";
import type { ProvinceOption } from "@/lib/admin/students/address-queries";

export function EditStudentForm({
  studentId,
  yearName,
  classes,
  provinces,
  defaults,
}: {
  studentId: string;
  yearName: string;
  classes: ClassOption[];
  provinces: ProvinceOption[];
  defaults: StudentDefaults;
}) {
  const router = useRouter();
  const [state, action, pending] = useActionState<
    ActionResult | null,
    FormData
  >(updateStudentAction, null);

  useEffect(() => {
    if (state?.ok) router.refresh();
  }, [state, router]);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="student_id" value={studentId} />

      {yearName ? (
        <div className="rounded-card border-border bg-surface border p-3 text-sm">
          ឆ្នាំសិក្សា៖ <span className="font-medium">{yearName}</span>
        </div>
      ) : null}

      <StudentFields classes={classes} provinces={provinces} defaults={defaults} />

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