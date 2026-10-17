"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ActionResult } from "@/lib/actions/types";
import { createPeriodAction } from "@/lib/admin/timetable/actions";

export function NewPeriodForm({
  yearId,
  nextNumber,
}: {
  yearId: string;
  nextNumber: number;
}) {
  const router = useRouter();
  const [state, action, pending] = useActionState<
    ActionResult | null,
    FormData
  >(createPeriodAction, null);

  useEffect(() => {
    if (state?.ok) router.refresh();
  }, [state, router]);

  return (
    <form
      action={action}
      className="rounded-card border-border bg-surface space-y-3 border p-3"
    >
      <input type="hidden" name="year_id" value={yearId} />

      <p className="font-moul text-sm">បន្ថែមម៉ោងថ្មី</p>

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
            defaultValue={nextNumber}
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
            required
            className="rounded-btn border-border bg-surface w-full border px-2 py-1.5 text-sm"
          />
        </div>
      </div>

      <input
        name="label"
        type="text"
        maxLength={50}
        placeholder="ឈ្មោះម៉ោង (ស្រេចចិត្ត)"
        className="rounded-btn border-border bg-surface w-full border px-3 py-2 text-sm"
      />

      {state && !state.ok ? (
        <div className="rounded-btn border border-red-200 bg-red-50 p-2 text-xs text-red-700">
          {state.error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="touch-target rounded-btn bg-brand-600 w-full px-4 py-2.5 text-sm font-medium text-white active:bg-brand-700 disabled:opacity-60"
      >
        {pending ? "កំពុងបន្ថែម..." : "+ បន្ថែមម៉ោង"}
      </button>
    </form>
  );
}