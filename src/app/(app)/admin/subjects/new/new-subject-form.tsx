"use client";

import { useActionState } from "react";
import type { ActionResult } from "@/lib/actions/types";
import { createSubjectAction } from "@/lib/admin/subjects/actions";
import { SubjectFields } from "../subject-fields";

export function NewSubjectForm() {
  const [state, action, pending] = useActionState<
    ActionResult | null,
    FormData
  >(createSubjectAction, null);

  return (
    <form action={action} className="space-y-4">
      <SubjectFields />

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