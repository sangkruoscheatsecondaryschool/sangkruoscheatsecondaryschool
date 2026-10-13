"use client";

import { useActionState } from "react";
import type { ActionResult } from "@/lib/actions/types";
import type { SubjectOption } from "@/lib/admin/teachers/queries";
import type { AdminUnit } from "@/lib/admin/students/address-queries";
import { createTeacherAction } from "@/lib/admin/teachers/actions";
import { TeacherFields } from "../teacher-fields";

export function NewTeacherForm({
  subjects,
  provinces,
}: {
  subjects: SubjectOption[];
  provinces: AdminUnit[];
}) {
  const [state, action, pending] = useActionState<
    ActionResult | null,
    FormData
  >(createTeacherAction, null);

  return (
    <form action={action} className="space-y-5">
      <section className="space-y-4">
        <h3 className="font-moul text-muted text-xs uppercase">គណនី</h3>

        <div>
          <label className="text-fg mb-1 block text-sm font-medium">
            អ៊ីមែល *
          </label>
          <input
            name="email"
            type="email"
            inputMode="email"
            autoComplete="off"
            autoCapitalize="none"
            required
            className="rounded-btn border-border bg-surface w-full border px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </div>

        <div>
          <label className="text-fg mb-1 block text-sm font-medium">
            លេខសម្ងាត់បណ្ដោះអាសន្ន *
          </label>
          <input
            name="password"
            type="text"
            minLength={8}
            maxLength={72}
            required
            autoComplete="off"
            placeholder="យ៉ាងតិច 8 តួ"
            className="rounded-btn border-border bg-surface w-full border px-3 py-2.5 font-mono outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
          <p className="text-muted mt-1 text-xs">
            សូមចម្លងលេខសម្ងាត់នេះជូនគ្រូ។ ពួកគេអាចផ្លាស់ប្ដូរនៅពេលក្រោយ។
          </p>
        </div>
      </section>

      <TeacherFields subjects={subjects} provinces={provinces} />

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
        {pending ? "កំពុងបង្កើត..." : "បង្កើតគណនីគ្រូ"}
      </button>
    </form>
  );
}