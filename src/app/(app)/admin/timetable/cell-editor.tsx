"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Save } from "lucide-react";
import type { ActionResult } from "@/lib/actions/types";
import type { PeriodRow, TimetableCell } from "@/lib/admin/timetable/queries";
import { saveTimetableCellAction } from "@/lib/admin/timetable/actions";
import { useVisibleError } from "@/lib/hooks/use-visible-error";
import { Button } from "@/components/ui/button";

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
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(saveTimetableCellAction, null);
  const visibleError = useVisibleError(state);

  useEffect(() => {
    if (state?.ok) {
      router.refresh();
      onClose();
    }
  }, [state, router, onClose]);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-900/50 backdrop-blur-sm md:items-center animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md rounded-t-3xl md:rounded-2xl border-t md:border border-slate-200 p-6 pb-24 md:pb-6 shadow-2xl animate-in slide-in-from-bottom-8 md:slide-in-from-bottom-0 md:zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-2">
          <div>
            <h3 className="font-moul text-lg text-slate-900">
              ថ្នាក់ {className} · {dayName}
            </h3>
            <p className="text-slate-500 mt-0.5 text-sm font-inter">
              ម៉ោងទី {period.period_number} · {period.start_time.slice(0, 5)}–{period.end_time.slice(0, 5)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form action={action} className="space-y-5">
          <input type="hidden" name="class_id" value={classId} />
          <input type="hidden" name="day_of_week" value={dayOfWeek} />
          <input type="hidden" name="period_id" value={period.id} />

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">មុខវិជ្ជា</label>
            <select
              name="subject_id"
              defaultValue={currentCell?.subject_id ?? ""}
              className="flex h-12 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-base focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            >
              <option value="">— ទទេ (ដកចេញ) —</option>
              {assignableSubjects.map((s) => (
                <option key={s.subject_id} value={s.subject_id}>
                  {s.subject_name} · {s.subject_code}
                </option>
              ))}
            </select>
            {assignableSubjects.length === 0 ? (
              <p className="text-amber-600 mt-1 text-xs">
                មិនមានមុខវិជ្ជាចាត់តាំងសម្រាប់ថ្នាក់នេះទេ។ សូមចាត់តាំងគ្រូជាមុន។
              </p>
            ) : null}
          </div>

          {currentCell ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
              <span className="text-slate-500">គ្រូបង្រៀន៖ </span>
              <span className="font-medium text-slate-900">{currentCell.teacher_name_kh}</span>
            </div>
          ) : null}

          {visibleError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {visibleError}
            </div>
          ) : null}

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={pending || assignableSubjects.length === 0}
              className="flex-1 gap-2 shadow-sm"
            >
              <Save className="h-4 w-4" />
              {pending ? "កំពុងរក្សាទុក..." : "រក្សាទុក"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}