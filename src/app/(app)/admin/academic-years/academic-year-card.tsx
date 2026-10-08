"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { AcademicYear } from "@/lib/admin/academic-years/queries";
import {
  deleteAcademicYearAction,
  setCurrentYearAction,
  type ActionResult,
} from "@/lib/admin/academic-years/actions";
import { useVisibleError } from "@/lib/hooks/use-visible-error";

export function AcademicYearCard({ year }: { year: AcademicYear }) {
  const router = useRouter();

  const [setState, setAction, setPending] = useActionState<
    ActionResult | null,
    FormData
  >(setCurrentYearAction, null);

  const [delState, delAction, delPending] = useActionState<
    ActionResult | null,
    FormData
  >(deleteAcademicYearAction, null);

  useEffect(() => {
    if (setState?.ok) router.refresh();
  }, [setState, router]);

  useEffect(() => {
    if (delState?.ok) router.refresh();
  }, [delState, router]);

  // Auto-dismissing visible errors, one per action.
  const setError = useVisibleError(setState);
  const delError = useVisibleError(delState);

  // Only render each error if the corresponding action is still
  // available on this card. Prevents stale errors after is_current flips.
  const visibleSetError = !year.is_current ? setError : null;
  const visibleDelError = !year.is_current ? delError : null;

  return (
    <div className="rounded-card border-border bg-surface border p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Link
            href={`/admin/academic-years/${year.id}`}
            className="block active:opacity-80"
          >
            <p className="font-moul truncate text-base">{year.year_name}</p>
          </Link>
          {year.is_current ? (
            <span className="bg-brand-100 text-brand-800 mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium">
              ឆ្នាំបច្ចុប្បន្ន
            </span>
          ) : null}
        </div>
      </div>

      {visibleSetError ? (
        <div
          role="alert"
          className="rounded-btn mt-3 border border-red-200 bg-red-50 p-2 text-xs text-red-700"
        >
          {visibleSetError}
        </div>
      ) : null}

      <div className="mt-3 flex flex-wrap gap-2">
        {!year.is_current ? (
          <form action={setAction}>
            <input type="hidden" name="id" value={year.id} />
            <button
              type="submit"
              disabled={setPending}
              className="touch-target rounded-btn border-border bg-surface border px-3 text-sm active:bg-slate-50 disabled:opacity-60"
            >
              {setPending ? "..." : "កំណត់ជាឆ្នាំបច្ចុប្បន្ន"}
            </button>
          </form>
        ) : null}

        <Link
          href={`/admin/academic-years/${year.id}`}
          className="touch-target rounded-btn border-border bg-surface flex items-center border px-3 text-sm active:bg-slate-50"
        >
          កំណត់ឆមាស
        </Link>

        {!year.is_current ? (
          <form
            action={delAction}
            onSubmit={(e) => {
              if (
                !window.confirm(`លុបឆ្នាំសិក្សា ${year.year_name}?`)
              ) {
                e.preventDefault();
              }
            }}
          >
            <input type="hidden" name="id" value={year.id} />
            <button
              type="submit"
              disabled={delPending}
              className="touch-target rounded-btn border border-red-200 px-3 text-sm text-red-700 active:bg-red-50 disabled:opacity-60"
            >
              {delPending ? "..." : "លុប"}
            </button>
          </form>
        ) : null}
      </div>

      {visibleDelError ? (
        <div
          role="alert"
          className="rounded-btn mt-3 border border-red-200 bg-red-50 p-2 text-xs text-red-700"
        >
          {visibleDelError}
        </div>
      ) : null}
    </div>
  );
}