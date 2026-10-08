"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ActionResult } from "@/lib/actions/types";
import type { ClassRow } from "@/lib/admin/classes/queries";
import { deleteClassAction } from "@/lib/admin/classes/actions";
import { useVisibleError } from "@/lib/hooks/use-visible-error";

export function ClassCard({ cls }: { cls: ClassRow }) {
  const router = useRouter();
  const [state, action, pending] = useActionState<
    ActionResult | null,
    FormData
  >(deleteClassAction, null);

  const visibleError = useVisibleError(state);

  useEffect(() => {
    if (state?.ok) router.refresh();
  }, [state, router]);

  return (
    <div className="rounded-card border-border bg-surface border p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Link
            href={`/admin/classes/${cls.id}`}
            className="block active:opacity-80"
          >
            <p className="font-moul truncate text-base">{cls.class_name}</p>
          </Link>
          <p className="text-muted mt-0.5 text-xs">
            គ្រូបន្ទុក៖ {cls.teacher_name_kh ?? "—"}
          </p>
          <p className="text-muted mt-0.5 text-xs">
            សិស្ស៖ {cls.student_count}
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700">
          ថ្នាក់ទី {cls.grade_level}
        </span>
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
          href={`/admin/classes/${cls.id}`}
          className="touch-target rounded-btn border-border bg-surface flex items-center border px-3 text-sm active:bg-slate-50"
        >
          កែប្រែ
        </Link>

        <form
          action={action}
          onSubmit={(e) => {
            if (!window.confirm(`លុបថ្នាក់ ${cls.class_name}?`)) {
              e.preventDefault();
            }
          }}
        >
          <input type="hidden" name="class_id" value={cls.id} />
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