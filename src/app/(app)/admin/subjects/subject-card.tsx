"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ActionResult } from "@/lib/actions/types";
import type { SubjectWithConfigs } from "@/lib/admin/subjects/queries";
import { deleteSubjectAction } from "@/lib/admin/subjects/actions";
import { useVisibleError } from "@/lib/hooks/use-visible-error";

export function SubjectCard({ subject }: { subject: SubjectWithConfigs }) {
  const router = useRouter();
  const [state, action, pending] = useActionState<
    ActionResult | null,
    FormData
  >(deleteSubjectAction, null);

  const visibleError = useVisibleError(state);

  useEffect(() => {
    if (state?.ok) router.refresh();
  }, [state, router]);

  const configByGrade = new Map(
    subject.configs.map((c) => [c.grade_level, c.max_score]),
  );

  return (
    <div className="rounded-card border-border bg-surface border p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Link
            href={`/admin/subjects/${subject.id}`}
            className="block active:opacity-80"
          >
            <p className="font-moul truncate text-base">
              {subject.subject_name}
            </p>
            <p className="text-muted mt-0.5 text-xs font-mono">
              {subject.code}
            </p>
          </Link>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        {[7, 8, 9].map((g) => (
          <div
            key={g}
            className="rounded-btn border-border bg-bg border px-2 py-1.5"
          >
            <p className="text-muted text-[10px] uppercase">ថ្នាក់ {g}</p>
            <p className="mt-0.5 text-sm font-semibold tabular-nums">
              {configByGrade.get(g) ?? "—"}
            </p>
          </div>
        ))}
      </div>

      {visibleError ? (
        <div
          role="alert"
          className="rounded-btn mt-3 border border-red-200 bg-red-50 p-2 text-xs text-red-700"
        >
          {visibleError}
        </div>
      ) : null}

      <div className="mt-3 flex flex-wrap gap-2">
        <Link
          href={`/admin/subjects/${subject.id}`}
          className="touch-target rounded-btn border-border bg-surface flex items-center border px-3 text-sm active:bg-slate-50"
        >
          កែប្រែ
        </Link>

        <form
          action={action}
          onSubmit={(e) => {
            if (!window.confirm(`លុបមុខវិជ្ជា ${subject.subject_name}?`)) {
              e.preventDefault();
            }
          }}
        >
          <input type="hidden" name="subject_id" value={subject.id} />
          <button
            type="submit"
            disabled={pending}
            className="touch-target rounded-btn border border-red-200 px-3 text-sm text-red-700 active:bg-red-50 disabled:opacity-60"
          >
            {pending ? "..." : "លុប"}
          </button>
        </form>
      </div>
    </div>
  );
}