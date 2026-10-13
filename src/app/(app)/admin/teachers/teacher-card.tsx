"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ActionResult } from "@/lib/actions/types";
import type { TeacherRow } from "@/lib/admin/teachers/queries";
import { deleteTeacherAction } from "@/lib/admin/teachers/actions";
import { useVisibleError } from "@/lib/hooks/use-visible-error";

export function TeacherCard({ teacher }: { teacher: TeacherRow }) {
  const router = useRouter();
  const [state, action, pending] = useActionState<
    ActionResult | null,
    FormData
  >(deleteTeacherAction, null);
  const visibleError = useVisibleError(state);

  useEffect(() => {
    if (state?.ok) router.refresh();
  }, [state, router]);

  return (
    <div className="rounded-card border-border bg-surface border p-3">
      <Link
        href={`/admin/teachers/${teacher.id}`}
        className="block active:opacity-80"
      >
        <p className="font-moul truncate text-sm">{teacher.full_name_kh}</p>
        {teacher.full_name_en ? (
          <p className="text-muted mt-0.5 text-xs">{teacher.full_name_en}</p>
        ) : null}
        {teacher.email ? (
          <p className="text-muted mt-0.5 truncate font-mono text-xs">
            {teacher.email}
          </p>
        ) : null}
      </Link>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {teacher.specialist_1_name ? (
          <span className="bg-brand-100 text-brand-800 rounded-full px-2 py-0.5 text-[10px] font-medium">
            {teacher.specialist_1_name}
          </span>
        ) : null}
        {teacher.specialist_2_name ? (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700">
            {teacher.specialist_2_name}
          </span>
        ) : null}
      </div>

      {teacher.phone ? (
        <p className="text-muted mt-1.5 text-xs">📞 {teacher.phone}</p>
      ) : null}

      {visibleError ? (
        <div
          role="alert"
          className="rounded-btn mt-2 border border-red-200 bg-red-50 p-2 text-xs text-red-700"
        >
          {visibleError}
        </div>
      ) : null}

      <div className="mt-2 flex flex-wrap gap-2">
        <Link
          href={`/admin/teachers/${teacher.id}`}
          className="touch-target rounded-btn border-border bg-surface flex items-center border px-3 text-xs active:bg-slate-50"
        >
          កែប្រែ
        </Link>

        <form
          action={action}
          onSubmit={(e) => {
            if (!window.confirm(`លុបគ្រូ ${teacher.full_name_kh}?`))
              e.preventDefault();
          }}
        >
          <input type="hidden" name="teacher_id" value={teacher.id} />
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