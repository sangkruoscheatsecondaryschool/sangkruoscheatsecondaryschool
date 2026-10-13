"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ActionResult } from "@/lib/actions/types";
import type {
  SalaryPosition,
  SalaryHistoryRow,
} from "@/lib/admin/teachers/salary-queries";
import { deleteSalaryHistoryAction } from "@/lib/admin/teachers/salary-actions";
import { useVisibleError } from "@/lib/hooks/use-visible-error";
import { AddPromotionForm } from "./add-promotion-form";

export function SalaryHistoryCard({
  teacherId,
  history,
  positions,
}: {
  teacherId: string;
  history: SalaryHistoryRow[];
  positions: SalaryPosition[];
}) {
  const router = useRouter();
  const [showAdd, setShowAdd] = useState(history.length === 0);

  const [state, action, pending] = useActionState<
    ActionResult | null,
    FormData
  >(deleteSalaryHistoryAction, null);

  const visibleError = useVisibleError(state);

  useEffect(() => {
    if (state?.ok) router.refresh();
  }, [state, router]);

  const current = history.find((h) => h.end_date === null);

  return (
    <div className="rounded-card border-border bg-surface border p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="font-moul text-sm">ប្រវត្តិកាំប្រាក់</h2>
        {current ? (
          <button
            type="button"
            onClick={() => setShowAdd((v) => !v)}
            className="touch-target rounded-btn border-border bg-surface border px-3 text-xs active:bg-slate-50"
          >
            {showAdd ? "បិទ" : "+ ដំឡើងថ្នាក់"}
          </button>
        ) : null}
      </div>

      {history.length === 0 ? (
        <p className="text-muted text-sm">
          មិនមានទិន្នន័យកាំប្រាក់នៅឡើយទេ។ សូមបញ្ចូលកាំប្រាក់បច្ចុប្បន្នជាមុន។
        </p>
      ) : (
        <ul className="space-y-2">
          {history.map((h) => {
            const isCurrent = h.end_date === null;
            return (
              <li
                key={h.id}
                className={`rounded-btn border p-3 ${
                  isCurrent
                    ? "border-brand-400 bg-brand-50"
                    : "border-border bg-bg"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-moul text-sm">{h.position_label}</p>
                    <p className="text-muted mt-0.5 text-xs">
                      {formatKhmerDate(h.start_date)}
                      {" – "}
                      {h.end_date ? formatKhmerDate(h.end_date) : "បច្ចុប្បន្ន"}
                    </p>
                    {h.decision_number ? (
                      <p className="text-muted mt-1 text-xs">
                        លេខសេចក្ដីសម្រេច/ប្រកាស៖ {h.decision_number}
                      </p>
                    ) : null}
                    {h.notes ? (
                      <p className="text-muted mt-1 text-xs italic">
                        {h.notes}
                      </p>
                    ) : null}
                  </div>
                  {isCurrent ? (
                    <span className="bg-brand-600 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium text-white">
                      បច្ចុប្បន្ន
                    </span>
                  ) : null}
                </div>

                {isCurrent ? (
                  <form
                    action={action}
                    className="mt-2 flex justify-end"
                    onSubmit={(e) => {
                      if (
                        !window.confirm(
                          "លុបកាំប្រាក់បច្ចុប្បន្ន? កាំប្រាក់មុននឹងត្រូវបានបើកឡើងវិញ។",
                        )
                      ) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <input type="hidden" name="history_id" value={h.id} />
                    <input type="hidden" name="teacher_id" value={teacherId} />
                    <button
                      type="submit"
                      disabled={pending}
                      className="touch-target rounded-btn border border-red-200 px-3 text-xs text-red-700 active:bg-red-50 disabled:opacity-60"
                    >
                      {pending ? "..." : "លុប"}
                    </button>
                  </form>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}

      {visibleError ? (
        <div
          role="alert"
          className="rounded-btn mt-3 border border-red-200 bg-red-50 p-2 text-xs text-red-700"
        >
          {visibleError}
        </div>
      ) : null}

      {showAdd ? (
        <div className="mt-4">
          <AddPromotionForm
            teacherId={teacherId}
            positions={positions}
            onSuccess={() => setShowAdd(false)}
          />
        </div>
      ) : null}
    </div>
  );
}

const KHMER_MONTHS = [
  "មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា",
  "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ",
];

function formatKhmerDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${KHMER_MONTHS[m - 1]} ${y}`;
}