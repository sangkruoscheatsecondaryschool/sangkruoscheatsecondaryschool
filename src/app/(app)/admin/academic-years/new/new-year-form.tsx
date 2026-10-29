// new-year-form.tsx
"use client";
import { useActionState } from "react";
import { Save } from "lucide-react";
import { createAcademicYearAction, type ActionResult } from "@/lib/admin/academic-years/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewYearForm() {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(createAcademicYearAction, null);

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700">ឈ្មោះឆ្នាំសិក្សា *</label>
        <Input name="year_name" type="text" placeholder="2027-2028" pattern="\d{4}-\d{4}" required className="font-inter" />
        <p className="text-xs text-slate-500">ទម្រង់៖ YYYY-YYYY ឧទាហរណ៍ 2027-2028</p>
      </div>

      {state && !state.ok && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{state.error}</div>
      )}

      <div className="pt-2 flex justify-end">
        <Button type="submit" disabled={pending} className="gap-2">
          <Save className="h-4 w-4" /> {pending ? "កំពុងបង្កើត..." : "បង្កើត"}
        </Button>
      </div>
    </form>
  );
}