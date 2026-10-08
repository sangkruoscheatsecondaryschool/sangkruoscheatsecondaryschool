"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ActionResult } from "@/lib/actions/types";
import type { StudentRow } from "@/lib/admin/students/queries";
import { deleteStudentAction } from "@/lib/admin/students/actions";
import { useVisibleError } from "@/lib/hooks/use-visible-error";

const STATUS_LABEL: Record<StudentRow["status"], string> = {
  active: "កំពុងសិក្សា",
  dropped_s1: "បោះបង់ ឆមាសទី១",
  dropped_s2: "បោះបង់ ឆមាសទី២",
  graduated: "បានបញ្ចប់",
};

const STATUS_CLASS: Record<StudentRow["status"], string> = {
  active: "bg-green-100 text-green-800",
  dropped_s1: "bg-amber-100 text-amber-800",
  dropped_s2: "bg-amber-100 text-amber-800",
  graduated: "bg-slate-100 text-slate-700",
};

export function StudentCard({ student }: { student: StudentRow }) {
  const router = useRouter();
  const [state, action, pending] = useActionState<
    ActionResult | null,
    FormData
  >(deleteStudentAction, null);
  const visibleError = useVisibleError(state);

  useEffect(() => {
    if (state?.ok) router.refresh();
  }, [state, router]);

  const isActive = student.status === "active";

  return (
    <div className="rounded-card border-border bg-surface border p-3">
      <div className="flex items-start justify-between gap-2">
        <Link
          href={`/admin/students/${student.id}`}
          className="min-w-0 flex-1 active:opacity-80"
        >
          <p className="font-moul truncate text-sm">{student.name_kh}</p>
          <p className="text-muted mt-0.5 font-mono text-xs">
            {student.student_code}
            {student.gender ? ` · ${student.gender}` : ""}
          </p>
        </Link>
        {!isActive ? (
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS_CLASS[student.status]}`}
          >
            {STATUS_LABEL[student.status]}
          </span>
        ) : null}
      </div>

      {student.contact_number ? (
        <p className="text-muted mt-1 text-xs">📞 {student.contact_number}</p>
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
          href={`/admin/students/${student.id}`}
          className="touch-target rounded-btn border-border bg-surface flex items-center border px-3 text-xs active:bg-slate-50"
        >
          កែប្រែ
        </Link>

        <form
          action={action}
          onSubmit={(e) => {
            if (!window.confirm(`លុបសិស្ស ${student.name_kh}?`)) {
              e.preventDefault();
            }
          }}
        >
          <input type="hidden" name="student_id" value={student.id} />
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