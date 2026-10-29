"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Save, X } from "lucide-react";
import type { ActionResult } from "@/lib/actions/types";
import type { PeriodRow } from "@/lib/admin/timetable/queries";
import { deletePeriodAction, updatePeriodAction } from "@/lib/admin/timetable/actions";
import { useVisibleError } from "@/lib/hooks/use-visible-error";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function PeriodList({ periods }: { periods: PeriodRow[] }) {
  return (
    <div className="space-y-3">
      {periods.map((p) => (
        <PeriodRowItem key={p.id} period={p} />
      ))}
    </div>
  );
}

function PeriodRowItem({ period }: { period: PeriodRow }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);

  const [updateState, updateAction, updatePending] = useActionState<ActionResult | null, FormData>(updatePeriodAction, null);
  const [deleteState, deleteAction, deletePending] = useActionState<ActionResult | null, FormData>(deletePeriodAction, null);

  const updateError = useVisibleError(updateState);
  const deleteError = useVisibleError(deleteState);
  const visibleError = updateError ?? deleteError;

  useEffect(() => { if (updateState?.ok) { setEditing(false); router.refresh(); } }, [updateState, router]);
  useEffect(() => { if (deleteState?.ok) router.refresh(); }, [deleteState, router]);

  if (editing) {
    return (
      <form action={updateAction} className="rounded-xl border border-slate-300 bg-slate-50 p-4 space-y-3">
        <input type="hidden" name="id" value={period.id} />
        
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-500 uppercase">លេខម៉ោង</label>
            <Input name="period_number" type="number" min="1" max="20" defaultValue={period.period_number} required className="h-10 text-center font-inter" />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-500 uppercase">ចាប់ផ្ដើម</label>
            <Input name="start_time" type="time" defaultValue={period.start_time.slice(0, 5)} required className="h-10 font-inter" />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-500 uppercase">បញ្ចប់</label>
            <Input name="end_time" type="time" defaultValue={period.end_time.slice(0, 5)} required className="h-10 font-inter" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-500 uppercase">ឈ្មោះម៉ោង (ស្រេចចិត្ត)</label>
          <Input name="label" type="text" defaultValue={period.label ?? ""} maxLength={50} className="h-10" />
        </div>

        {visibleError && <div className="text-xs text-red-600">{visibleError}</div>}

        <div className="flex gap-2 pt-1">
          <Button type="submit" disabled={updatePending} size="sm" className="gap-1.5">
            <Save className="h-4 w-4" /> {updatePending ? "..." : "រក្សាទុក"}
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => setEditing(false)} className="gap-1.5">
            <X className="h-4 w-4" /> បោះបង់
          </Button>
        </div>
      </form>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 sm:px-4 flex items-center justify-between gap-3 hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-slate-100 flex flex-col items-center justify-center shrink-0">
          <span className="text-[9px] text-slate-500 leading-none">ម៉ោង</span>
          <span className="font-inter font-bold text-slate-700 text-sm leading-tight">{period.period_number}</span>
        </div>
        <div>
          <p className="font-medium text-slate-900 text-sm">
            {period.label || `ម៉ោងទី ${period.period_number}`}
          </p>
          <p className="text-slate-500 font-inter text-xs mt-0.5">
            {period.start_time.slice(0, 5)} – {period.end_time.slice(0, 5)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {visibleError && <p className="text-[10px] text-red-600 mr-2 max-w-[100px] truncate">{visibleError}</p>}
        
        <Button type="button" variant="ghost" size="sm" onClick={() => setEditing(true)} className="h-8 w-8 p-0 text-slate-400 hover:text-primary-600">
          <Edit className="h-4 w-4" />
        </Button>
        <form action={deleteAction} onSubmit={(e) => { if (!window.confirm(`លុបម៉ោងទី ${period.period_number}?`)) e.preventDefault(); }}>
          <input type="hidden" name="id" value={period.id} />
          <Button type="submit" variant="ghost" size="sm" disabled={deletePending} className="h-8 w-8 p-0 text-slate-400 hover:text-red-600">
            <Trash2 className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}