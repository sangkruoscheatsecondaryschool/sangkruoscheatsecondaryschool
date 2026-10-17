"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { ScoreEntryContext } from "@/lib/teacher/scores-queries";
import {
  saveScoresAction,
  type SaveScoresResult,
} from "@/lib/teacher/scores-actions";

export function ScoreEntryForm({ ctx }: { ctx: ScoreEntryContext }) {
  const router = useRouter();
  const [state, action, pending] = useActionState<
    SaveScoresResult | null,
    FormData
  >(saveScoresAction, null);

  const [q, setQ] = useState("");

  useEffect(() => {
    if (state?.ok && state.saved > 0) {
      router.refresh();
    }
  }, [state, router]);

  const needle = q.trim().toLowerCase();

  // Return a Set of matching student IDs — all rows still render, but
  // non-matching ones are hidden with CSS so their inputs are still
  // submitted (preserves "save all" semantics).
  const visible = useMemo(() => {
    if (!needle) return null; // null = show everyone
    const set = new Set<string>();
    for (const s of ctx.students) {
      if (
        s.name_kh.toLowerCase().includes(needle) ||
        s.student_code.toLowerCase().includes(needle)
      ) {
        set.add(s.id);
      }
    }
    return set;
  }, [needle, ctx.students]);

  const visibleCount = visible ? visible.size : ctx.students.length;

  return (
    <form action={action} className="space-y-4 pb-24">
      <input type="hidden" name="class_id" value={ctx.class_id} />
      <input type="hidden" name="subject_id" value={ctx.subject_id} />
      <input type="hidden" name="term_month_id" value={ctx.term_month_id} />

      {/* Header summary */}
      <div
        className={`rounded-card border p-3 ${
          ctx.is_semester_exam
            ? "border-amber-300 bg-amber-50"
            : "border-border bg-surface"
        }`}
      >
        <p className="text-muted text-[10px] font-medium uppercase">
          {ctx.is_semester_exam ? "ការប្រឡងឆមាស" : "ពិន្ទុប្រចាំខែ"}
        </p>
        <p className="font-moul mt-0.5 text-sm">
          {ctx.subject_name} · {ctx.month_name_kh}
        </p>
        <p className="text-muted mt-1 text-xs">
          ពិន្ទុពេញ៖ <span className="tabular-nums">{ctx.max_score}</span>
        </p>
      </div>

      {/* Search */}
      <div className="rounded-card border-border bg-surface border p-2">
        <input
          type="search"
          inputMode="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ស្វែងរកឈ្មោះ ឬលេខកូដសិស្ស"
          className="w-full rounded-btn border-0 bg-transparent px-2 py-1.5 text-sm outline-none"
        />
        {q ? (
          <p className="text-muted px-2 pb-1 text-[11px]">
            បង្ហាញ {visibleCount} / {ctx.students.length} នាក់
          </p>
        ) : null}
      </div>

      {state && !state.ok ? (
        <div
          role="alert"
          className="rounded-btn border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {state.error}
        </div>
      ) : null}

      {state?.ok ? (
        <div
          role="status"
          className={`rounded-btn border p-3 text-sm ${
            state.failed === 0
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-amber-200 bg-amber-50 text-amber-900"
          }`}
        >
          <p>
            បានរក្សាទុក {state.saved} · បរាជ័យ {state.failed}
          </p>
          {state.errors.length > 0 ? (
            <ul className="mt-2 space-y-1 text-xs">
              {state.errors.map((e, i) => (
                <li key={i}>
                  <span className="font-medium">{e.name}</span> — {e.message}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      {/* Student rows */}
      <ul className="space-y-2">
        {ctx.students.map((s) => {
          const matched = !visible || visible.has(s.id);
          return (
            <li
              key={s.id}
              className={`rounded-card border-border bg-surface flex items-center gap-3 border p-3 ${
                matched ? "" : "hidden"
              }`}
            >
              <span
                aria-hidden
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                  s.gender === "F"
                    ? "bg-pink-100 text-pink-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {s.gender === "F" ? "F" : s.gender === "M" ? "M" : "—"}
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">{s.name_kh}</p>
                <p className="text-muted truncate font-mono text-xs">
                  {s.student_code}
                </p>
              </div>

              <input type="hidden" name={`name__${s.id}`} value={s.name_kh} />

              <input
                name={`score__${s.id}`}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                defaultValue={
                  s.existing_score === null ? "" : String(s.existing_score)
                }
                placeholder="—"
                className={`rounded-btn w-20 shrink-0 border px-2 py-2 text-center text-base tabular-nums outline-none focus:ring-2 ${
                  ctx.is_semester_exam
                    ? "border-amber-300 bg-amber-50 focus:border-amber-500 focus:ring-amber-100"
                    : "border-border bg-surface focus:border-brand-500 focus:ring-brand-100"
                }`}
              />
            </li>
          );
        })}
      </ul>

      {visibleCount === 0 ? (
        <div className="rounded-card border border-dashed border-border bg-surface p-6 text-center">
          <p className="text-muted text-sm">រកមិនឃើញសិស្ស។</p>
        </div>
      ) : null}

      {/* Sticky save bar */}
      <div className="bg-surface/95 fixed inset-x-0 bottom-0 z-30 border-t border-border pb-safe backdrop-blur">
        <div className="mx-auto flex max-w-3xl gap-2 p-3">
          <button
            type="submit"
            disabled={pending}
            className="touch-target rounded-btn bg-brand-600 flex-1 px-4 py-3 font-medium text-white active:bg-brand-700 disabled:opacity-60"
          >
            {pending ? "កំពុងរក្សាទុក..." : "រក្សាទុកទាំងអស់"}
          </button>
        </div>
      </div>
    </form>
  );
}