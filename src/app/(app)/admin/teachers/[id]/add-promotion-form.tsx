"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import type { ActionResult } from "@/lib/actions/types";
import type { SalaryPosition } from "@/lib/admin/teachers/salary-queries";
import { addPromotionAction } from "@/lib/admin/teachers/salary-actions";
import { useVisibleError } from "@/lib/hooks/use-visible-error";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function AddPromotionForm({ teacherId, positions, onSuccess }: { teacherId: string; positions: SalaryPosition[]; onSuccess?: () => void }) {
  const router = useRouter();
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(addPromotionAction, null);
  const visibleError = useVisibleError(state);

  useEffect(() => {
    if (state?.ok) {
      router.refresh();
      onSuccess?.();
    }
  }, [state, router, onSuccess]);

  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={action} className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
      <input type="hidden" name="teacher_id" value={teacherId} />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">កាំប្រាក់ថ្មី *</label>
          <select name="position_id" required defaultValue="" className="flex h-11 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100">
            <option value="" disabled>— ជ្រើសរើស —</option>
            {positions.map((p) => <option key={p.id} value={p.id}>{p.display_label}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">ថ្ងៃចាប់ផ្ដើម *</label>
          <Input name="start_date" type="date" defaultValue={today} required className="h-11" />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700">លេខសេចក្ដីសម្រេច</label>
        <Input name="decision_number" type="text" className="h-11" />
      </div>

      {visibleError && <div className="text-sm text-red-600">{visibleError}</div>}

      <Button type="submit" disabled={pending} className="w-full gap-2">
        <Save className="h-4 w-4" /> {pending ? "កំពុងរក្សាទុក..." : "រក្សាទុក"}
      </Button>
    </form>
  );
}