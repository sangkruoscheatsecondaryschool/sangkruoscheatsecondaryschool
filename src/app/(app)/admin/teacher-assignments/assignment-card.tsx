"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ActionResult } from "@/lib/actions/types";
import type { TeacherAssignmentRow } from "@/lib/admin/teacher-assignments/queries";
import { deleteAssignmentAction } from "@/lib/admin/teacher-assignments/actions";
import { useVisibleError } from "@/lib/hooks/use-visible-error";

export function AssignmentCard({ row }: { row: TeacherAssignmentRow }) {
  const router = useRouter();
  const [state, action, pending] = useActionState<
    ActionResult | null,
    FormData
  >(deleteAssignmentAction, null);

  const visibleError = useVisibleError(state);

  useEffect(() => {
    if (state?.ok) router.refresh();
  }, [state, router]);

  return (
    <div className="rounded-card border-border bg-surface border p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-moul truncate text-sm">{row.teacher_name_kh}</p>
          {row.teacher_name_en ? (
            <p className="text-muted mt-0.5 text-xs">
              {row.teacher_name_en}
            </p>
          ) : null}
        </div>
        <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700">
          ថ្នាក់ទី {row.grade_level}
        </span>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-btn border-border bg-bg border px-2 py-0.5">
          {row.class_name}
        </span>
        <span className="text-muted">→</span>
        <span className="rounded-btn border-border bg-bg border px-2 py-0.5">
          {row.subject_name}
        </span>
        <span className="text-muted font-mono text-[10px]">
          {row.subject_code}
        </span>
      </div>

      {visibleError ? (
        <div
          role="alert"
          className="rounded-btn mt-2 border border-red-200 bg-red-50 p-2 text-xs text-red-700"
        >
          {visibleError}
        </div>
      ) : null}

      <div className="mt-2 flex justify-end">
        <form
          action={action}
          onSubmit={(e) => {
            if (
              !window.confirm(
                `លុបការចាត់តាំង ${row.teacher_name_kh} · ${row.class_name} · ${row.subject_name}?`,
              )
            ) {
              e.preventDefault();
            }
          }}
        >
          <input type="hidden" name="id" value={row.id} />
          <button
            type="submit"
            disabled={pending}
            className="touch-target rounded-btn border border-red-200 px-3 text-xs text-red-700 active:bg-red-50 disabled:opacity-60"
          >
            {pending ? "..." : "លុប"}
          </button>
        </form>
      </div>
    </div>
  );
}