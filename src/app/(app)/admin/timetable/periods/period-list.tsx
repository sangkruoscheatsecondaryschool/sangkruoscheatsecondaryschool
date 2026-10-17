"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ActionResult } from "@/lib/actions/types";
import type { PeriodRow } from "@/lib/admin/timetable/queries";
import {
  deletePeriodAction,
  updatePeriodAction,
} from "@/lib/admin/timetable/actions";
import { useVisibleError } from "@/lib/hooks/use-visible-error";

export function PeriodList({ periods }: { periods: PeriodRow[] }) {
  return (
    <div className="space-y-2">
      {periods.map((p) => (
        <PeriodRowItem key={p.id} period={p} />
      ))}
    </div>
  );
}

function PeriodRowItem({ period }: { period: PeriodRow }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);

  const [updateState, updateAction, updatePending] = useActionState<
    ActionResult | null,
    FormData
  >(updatePeriodAction, null);

  const [deleteState, deleteAction, deletePending] = useActionState<
    ActionResult | null,
    FormData
  >(deletePeriodAction, null);

  const updateError = useVisibleError(updateState);
  const deleteError = useVisibleError(deleteState);

  useEffect(() => {
    if (updateState?.ok) {
      setEditing(false);
      router.refresh();
    }
  }, [updateState, router]);

  useEffect(() => {
    if (deleteState?.ok) router.refresh();
  }, [deleteState, router]);

  const visibleError = updateError ?? deleteError;

  if (editing) {
    return (
      <form
        action={updateAction}
        className="rounded-card border-border bg-surface space-y-2 border p-3"
      >
        <input type="hidden" name="id" value={period.id} />

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-muted mb-1 block text-[10px] uppercase">
              លេខម៉ោង
            </label>
            <input
              name="period_number"
              type="number"
              min="1"
              max="20"
              defaultValue={period.period_number}
              required
              className="rounded-btn border-border bg-surface w-full border px-2 py-1.5 text-sm tabular-nums"
            />
          </div>
          <div>
            <label className="text-muted mb-1 block text-[10px] uppercase">
              ចាប់ផ្ដើម
            </label>
            <input
              name="start_time"
              type="time"
              defaultValue={period.start_time.slice(0, 5)}
              required
              className="rounded-btn border-border bg-surface w-full border px-2 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="text-muted mb-1 block text-[10px] uppercase">
              បញ្ចប់
            </label>
            <input
              name="end_time"
              type="time"
              defaultValue={period.end_time.slice(0, 5)}
              required
              className="rounded-btn border-border bg-surface w-full border px-2 py-1.5 text-sm"
            />
          </div>
        </div>

        <input
          name="label"
          type="text"
          defaultValue={period.label ?? ""}
          maxLength={50}
          placeholder="ឈ្មោះម៉ោង (ស្រេចចិត្ត)"
          className="rounded-btn border-border bg-surface w-full border px-3 py-2 text-sm"
        />

        {visibleError ? (
          <div className="rounded-btn border border-red-200 bg-red-50 p-2 text-xs text-red-700">
            {visibleError}
          </div>
        ) : null}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={updatePending}
            className="touch-target rounded-btn bg-brand-600 flex-1 px-3 text-sm font-medium text-white active:bg-brand-700 disabled:opacity-60"
          >
            {updatePending ? "..." : "រក្សាទុក"}
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="touch-target rounded-btn border-border bg-surface border px-3 text-sm active:bg-slate-50"
          >
            បោះបង់
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="rounded-card border-border bg-surface border p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">
            ម៉ោងទី {period.period_number}
            {period.label ? (
              <span className="text-muted ml-2 text-xs">{period.label}</span>
            ) : null}
          </p>
          <p className="text-muted mt-0.5 text-xs tabular-nums">
            {period.start_time.slice(0, 5)} – {period.end_time.slice(0, 5)}
          </p>
        </div>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="touch-target rounded-btn border-border bg-surface border px-3 text-xs active:bg-slate-50"
          >
            កែប្រែ
          </button>
          <form
            action={deleteAction}
            onSubmit={(e) => {
              if (
                !window.confirm(`លុបម៉ោងទី ${period.period_number}?`)
              )
                e.preventDefault();
            }}
          >
            <input type="hidden" name="id" value={period.id} />
            <button
              type="submit"
              disabled={deletePending}
              className="touch-target rounded-btn border border-red-200 px-3 text-xs text-red-700 active:bg-red-50 disabled:opacity-60"
            >
              {deletePending ? "..." : "លុប"}
            </button>
          </form>
        </div>
      </div>

      {visibleError ? (
        <div className="rounded-btn mt-2 border border-red-200 bg-red-50 p-2 text-xs text-red-700">
          {visibleError}
        </div>
      ) : null}
    </div>
  );
}