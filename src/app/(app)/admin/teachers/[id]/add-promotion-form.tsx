"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ActionResult } from "@/lib/actions/types";
import type { SalaryPosition } from "@/lib/admin/teachers/salary-queries";
import { addPromotionAction } from "@/lib/admin/teachers/salary-actions";
import { useVisibleError } from "@/lib/hooks/use-visible-error";

export function AddPromotionForm({
  teacherId,
  positions,
  onSuccess,
}: {
  teacherId: string;
  positions: SalaryPosition[];
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const [state, action, pending] = useActionState<
    ActionResult | null,
    FormData
  >(addPromotionAction, null);

  const visibleError = useVisibleError(state);

  useEffect(() => {
    if (state?.ok) {
      router.refresh();
      onSuccess?.();
    }
  }, [state, router, onSuccess]);

  const today = new Date().toISOString().slice(0, 10);

  return (
    <form
      action={action}
      className="space-y-3 rounded-btn border border-dashed border-border bg-bg p-3"
    >
      <input type="hidden" name="teacher_id" value={teacherId} />

      <div>
        <label className="text-fg mb-1 block text-xs font-medium">
          កាំប្រាក់ថ្មី *
        </label>
        <select
          name="position_id"
          required
          defaultValue=""
          className="rounded-btn border-border bg-surface w-full border px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        >
          <option value="" disabled>
            — ជ្រើសរើសកាំប្រាក់ —
          </option>
          {positions.map((p) => (
            <option key={p.id} value={p.id}>
              {p.display_label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-fg mb-1 block text-xs font-medium">
          ថ្ងៃចាប់ផ្ដើម *
        </label>
        <input
          name="start_date"
          type="date"
          defaultValue={today}
          required
          className="rounded-btn border-border bg-surface w-full border px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
      </div>

      <div>
        <label className="text-fg mb-1 block text-xs font-medium">
          លេខសេចក្ដីសម្រេច
        </label>
        <input
          name="decision_number"
          type="text"
          maxLength={100}
          className="rounded-btn border-border bg-surface w-full border px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
      </div>

      <div>
        <label className="text-fg mb-1 block text-xs font-medium">
          កំណត់សម្គាល់
        </label>
        <textarea
          name="notes"
          rows={2}
          maxLength={500}
          className="rounded-btn border-border bg-surface w-full border px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
      </div>

      {visibleError ? (
        <div
          role="alert"
          className="rounded-btn border border-red-200 bg-red-50 p-2 text-xs text-red-700"
        >
          {visibleError}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="touch-target rounded-btn bg-brand-600 w-full px-4 py-2.5 text-sm font-medium text-white active:bg-brand-700 disabled:opacity-60"
      >
        {pending ? "កំពុងរក្សាទុក..." : "រក្សាទុក"}
      </button>
    </form>
  );
}