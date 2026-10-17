"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ActionResult } from "@/lib/actions/types";
import type { PeriodRow, TimetableCell } from "@/lib/admin/timetable/queries";
import { saveTimetableCellAction } from "@/lib/admin/timetable/actions";
import { useVisibleError } from "@/lib/hooks/use-visible-error";

export function CellEditor({
  classId,
  className,
  dayOfWeek,
  dayName,
  period,
  currentCell,
  assignableSubjects,
  onClose,
}: {
  classId: string;
  className: string;
  dayOfWeek: number;
  dayName: string;
  period: PeriodRow;
  currentCell: TimetableCell | null;
  assignableSubjects: {
    subject_id: string;
    subject_name: string;
    subject_code: string;
  }[];
  onClose: () => void;
}) {
  const router = useRouter();
  const [state, action, pending] = useActionState<
    ActionResult | null,
    FormData
  >(saveTimetableCellAction, null);

  const visibleError = useVisibleError(state);

  useEffect(() => {
    if (state?.ok) {
      router.refresh();
      onClose();
    }
  }, [state, router, onClose]);

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 md:items-center"
      onClick={onClose}
    >
      <div
        className="bg-surface w-full max-w-md rounded-t-2xl border-t border-border p-4 pb-safe md:rounded-2xl md:border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-start justify-between gap-2">
          <div>
            <h3 className="font-moul text-sm">
              ថ្នាក់ {className} · {dayName}
            </h3>
            <p className="text-muted mt-0.5 text-xs tabular-nums">
              ម៉ោងទី {period.period_number} ·{" "}
              {period.start_time.slice(0, 5)}–{period.end_time.slice(0, 5)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="touch-target rounded-btn text-muted px-2 text-sm active:bg-slate-100"
          >
            ✕
          </button>
        </div>

        <form action={action} className="space-y-3">
          <input type="hidden" name="class_id" value={classId} />
          <input type="hidden" name="day_of_week" value={dayOfWeek} />
          <input type="hidden" name="period_id" value={period.id} />

          <div>
            <label className="text-fg mb-1 block text-sm font-medium">
              មុខវិជ្ជា
            </label>
            <select
              name="subject_id"
              defaultValue={currentCell?.subject_id ?? ""}
              className="rounded-btn border-border bg-surface w-full border px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            >
              <option value="">— ទទេ (ដកចេញ) —</option>
              {assignableSubjects.map((s) => (
                <option key={s.subject_id} value={s.subject_id}>
                  {s.subject_name} · {s.subject_code}
                </option>
              ))}
            </select>
            {assignableSubjects.length === 0 ? (
              <p className="text-muted mt-1 text-xs">
                មិនទាន់មានមុខវិជ្ជាបានកំណត់សម្រាប់ថ្នាក់នេះទេ។ សូមកំណត់មុខវិជ្ជាបង្រៀនឱ្យគ្រូតាមថ្នាក់ជាមុន។
              </p>
            ) : null}
          </div>

          {currentCell ? (
            <div className="rounded-btn border-border bg-bg border p-2 text-xs">
              <span className="text-muted">គ្រូបង្រៀន៖ </span>
              <span className="font-medium">
                {currentCell.teacher_name_kh}
              </span>
            </div>
          ) : null}

          {visibleError ? (
            <div
              role="alert"
              className="rounded-btn border border-red-200 bg-red-50 p-2 text-xs text-red-700"
            >
              {visibleError}
            </div>
          ) : null}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={pending || assignableSubjects.length === 0}
              className="touch-target rounded-btn bg-brand-600 flex-1 px-4 py-2.5 text-sm font-medium text-white active:bg-brand-700 disabled:opacity-60"
            >
              {pending ? "កំពុងរក្សាទុក..." : "រក្សាទុក"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="touch-target rounded-btn border-border bg-surface border px-4 py-2.5 text-sm active:bg-slate-50"
            >
              បោះបង់
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}