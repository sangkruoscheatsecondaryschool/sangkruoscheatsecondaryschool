"use client";

import { useActionState } from "react";
import type { ActionResult } from "@/lib/actions/types";
import type {
  ClassOption,
  SubjectOption,
} from "@/lib/admin/teacher-assignments/queries";
import { syncAssignmentsAction } from "@/lib/admin/teacher-assignments/actions";
import { ClassSubjectCard } from "./class-subject-card";

export function ManageForm({
  yearId,
  teacherId,
  classes,
  subjects,
  initialByClass,
  takenByClass,
}: {
  yearId: string;
  teacherId: string;
  classes: ClassOption[];
  subjects: SubjectOption[];
  initialByClass: Record<string, string[]>;
  takenByClass: Map<string, Map<string, string>>;
}) {
  const [state, action, pending] = useActionState<
    ActionResult | null,
    FormData
  >(syncAssignmentsAction, null);

  const totalSelected = Object.values(initialByClass).reduce(
    (sum, arr) => sum + arr.length,
    0,
  );

  return (
    <form action={action} className="space-y-4 pb-24">
      <input type="hidden" name="teacher_id" value={teacherId} />
      <input type="hidden" name="year" value={yearId} />

      <div className="rounded-card border-border bg-surface border p-3 text-sm">
        <p className="text-muted text-xs">
          សរុប៖{" "}
          <span className="text-fg font-medium">{totalSelected}</span>{" "}
          ការចាត់តាំង
        </p>
      </div>

      {state && !state.ok ? (
        <div
          role="alert"
          className="rounded-btn border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {state.error}
        </div>
      ) : null}

      <div className="space-y-3">
        {classes.map((cls) => (
          <ClassSubjectCard
            key={cls.id}
            cls={cls}
            subjects={subjects}
            initialSelected={initialByClass[cls.id] ?? []}
            takenByOthers={takenByClass.get(cls.id) ?? new Map()}
          />
        ))}
      </div>

      {/* Sticky save bar */}
      <div className="bg-surface/95 fixed inset-x-0 bottom-0 z-30 border-t border-border pb-safe backdrop-blur">
        <div className="mx-auto flex max-w-3xl gap-2 p-3">
          <button
            type="submit"
            disabled={pending}
            className="touch-target rounded-btn bg-brand-600 flex-1 px-4 py-3 font-medium text-white active:bg-brand-700 disabled:opacity-60"
          >
            {pending ? "កំពុងរក្សាទុក..." : "រក្សាទុកការចាត់តាំង"}
          </button>
        </div>
      </div>
    </form>
  );
}