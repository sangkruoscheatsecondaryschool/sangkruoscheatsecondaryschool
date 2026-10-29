"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import type { ActionResult } from "@/lib/actions/types";
import type { SalaryPosition, SalaryHistoryRow } from "@/lib/admin/teachers/salary-queries";
import { deleteSalaryHistoryAction } from "@/lib/admin/teachers/salary-actions";
import { useVisibleError } from "@/lib/hooks/use-visible-error";
import { AddPromotionForm } from "./add-promotion-form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const KHMER_MONTHS = ["មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា", "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"];
function formatKhmerDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${KHMER_MONTHS[m - 1]} ${y}`;
}

export function SalaryHistoryCard({ teacherId, history, positions }: { teacherId: string; history: SalaryHistoryRow[]; positions: SalaryPosition[] }) {
  const router = useRouter();
  const [showAdd, setShowAdd] = useState(history.length === 0);
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(deleteSalaryHistoryAction, null);
  const visibleError = useVisibleError(state);

  useEffect(() => {
    if (state?.ok) router.refresh();
  }, [state, router]);

  const current = history.find((h) => h.end_date === null);

  return (
    <Card className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-moul text-lg text-slate-800">ប្រវត្តិកាំប្រាក់</h2>
        {current && (
          <Button variant="outline" size="sm" onClick={() => setShowAdd(!showAdd)}>
            <Plus className="h-4 w-4 mr-1" /> {showAdd ? "បិទ" : "ដំឡើងថ្នាក់"}
          </Button>
        )}
      </div>

      {history.length === 0 ? (
        <p className="text-slate-500 text-sm mb-4">មិនមានទិន្នន័យកាំប្រាក់នៅឡើយទេ។ សូមបញ្ចូលកាំប្រាក់បច្ចុប្បន្នជាមុន។</p>
      ) : (
        <div className="space-y-3 mb-6">
          {history.map((h) => {
            const isCurrent = h.end_date === null;
            return (
              <div key={h.id} className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${isCurrent ? "border-primary-200 bg-primary-50" : "border-slate-200 bg-white"}`}>
                <div>
                  <p className="font-moul text-base text-slate-900">{h.position_label}</p>
                  <p className="text-sm text-slate-600 mt-1">
                    {formatKhmerDate(h.start_date)} – {h.end_date ? formatKhmerDate(h.end_date) : "បច្ចុប្បន្ន"}
                  </p>
                  {h.decision_number && <p className="text-xs text-slate-500 mt-1">លេខសេចក្ដីសម្រេច៖ {h.decision_number}</p>}
                </div>
                {isCurrent && (
                  <form action={action} onSubmit={(e) => { if (!window.confirm("លុបមុខតំណែងបច្ចុប្បន្ន?")) e.preventDefault(); }}>
                    <input type="hidden" name="history_id" value={h.id} />
                    <input type="hidden" name="teacher_id" value={teacherId} />
                    <Button type="submit" variant="ghost" size="sm" disabled={pending} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </form>
                )}
              </div>
            );
          })}
        </div>
      )}

      {visibleError && <div className="text-sm text-red-600 mb-4">{visibleError}</div>}

      {showAdd && (
        <div className="mt-4 border-t border-slate-100 pt-6">
          <AddPromotionForm teacherId={teacherId} positions={positions} onSuccess={() => setShowAdd(false)} />
        </div>
      )}
    </Card>
  );
}