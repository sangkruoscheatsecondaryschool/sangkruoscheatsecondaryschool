"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ActionResult } from "@/lib/actions/types";
import type { SubjectOption } from "@/lib/admin/teachers/queries";
import type { AdminUnit } from "@/lib/admin/students/address-queries";
import { updateTeacherAction } from "@/lib/admin/teachers/actions";
import { TeacherFields, type TeacherDefaults } from "../teacher-fields";

export function EditTeacherForm({
  teacherId,
  email,
  subjects,
  provinces,
  defaults,
}: {
  teacherId: string;
  email: string | null;
  subjects: SubjectOption[];
  provinces: AdminUnit[];
  defaults: TeacherDefaults;
}) {
  const router = useRouter();
  const [state, action, pending] = useActionState<
    ActionResult | null,
    FormData
  >(updateTeacherAction, null);

  useEffect(() => {
    if (state?.ok) router.refresh();
  }, [state, router]);

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="teacher_id" value={teacherId} />

      {email ? (
        <div className="rounded-card border-border bg-surface border p-3 text-sm">
          <p className="text-muted text-xs">អ៊ីមែលចូលប្រើ</p>
          <p className="mt-0.5 font-mono text-xs">{email}</p>
        </div>
      ) : null}

      <TeacherFields
        subjects={subjects}
        provinces={provinces}
        defaults={defaults}
      />

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