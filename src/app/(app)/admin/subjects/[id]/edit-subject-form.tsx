"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ActionResult } from "@/lib/actions/types";
import { updateSubjectAction } from "@/lib/admin/subjects/actions";
import {
  SubjectFields,
  type SubjectDefaults,
} from "../subject-fields";

export function EditSubjectForm({
  subjectId,
  defaults,
}: {
  subjectId: string;
  defaults: SubjectDefaults;
}) {
  const router = useRouter();
  const [state, action, pending] = useActionState<
    ActionResult | null,
    FormData
  >(updateSubjectAction, null);

  useEffect(() => {
    if (state?.ok) router.refresh();
  }, [state, router]);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="subject_id" value={subjectId} />
      <SubjectFields defaults={defaults} />

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
        {pending ? "កំពុងរក្សាទុក..." : "រក្សាទុក"}
      </button>
    </form>
  );
}