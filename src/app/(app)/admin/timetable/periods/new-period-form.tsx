"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import type { ActionResult } from "@/lib/actions/types";
import { createPeriodAction } from "@/lib/admin/timetable/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function NewPeriodForm({ yearId, nextNumber }: { yearId: string; nextNumber: number }) {
  const router = useRouter();
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(createPeriodAction, null);

  useEffect(() => {
    if (state?.ok) router.refresh();
  }, [state, router]);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="year_id" value={yearId} />
      <h3 className="font-moul text-lg text-slate-800">បន្ថែមម៉ោងថ្មី</h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">លេខម៉ោង</label>
          <Input
            name="period_number"
            type="number"
            min="1"
            max="20"
            defaultValue={nextNumber}
            required
            className="font-inter text-center"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">ម៉ោងចាប់ផ្ដើម</label>
          <Input name="start_time" type="time" required className="font-inter" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">ម៉ោងបញ្ចប់</label>
          <Input name="end_time" type="time" required className="font-inter" />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700">ឈ្មោះម៉ោង (ស្រេចចិត្ត)</label>
        <Input name="label" type="text" maxLength={50} placeholder="ឧ. ម៉ោងភាសាខ្មែរ" />
      </div>

      {state && !state.ok && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{state.error}</div>
      )}

      <div className="pt-2">
        <Button type="submit" disabled={pending} className="w-full sm:w-auto gap-2">
          <Plus className="h-4 w-4" />
          {pending ? "កំពុងបន្ថែម..." : "បន្ថែមម៉ោង"}
        </Button>
      </div>
    </form>
  );
}