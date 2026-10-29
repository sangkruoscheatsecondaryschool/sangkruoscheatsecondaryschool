"use client";

import { useActionState } from "react";
import { Save } from "lucide-react";
import type { ActionResult } from "@/lib/actions/types";
import type { TeacherOption } from "@/lib/admin/classes/queries";
import { createClassAction } from "@/lib/admin/classes/actions";
import { ClassFields } from "../class-fields";
import { Button } from "@/components/ui/button";

export function NewClassForm({
  academicYearId,
  yearName,
  teachers,
}: {
  academicYearId: string;
  yearName: string;
  teachers: TeacherOption[];
}) {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(
    createClassAction,
    null
  );

  return (
    <form action={action} className="space-y-8">
      <input type="hidden" name="academic_year_id" value={academicYearId} />

      <ClassFields teachers={teachers} />

      {state && !state.ok && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <div className="sticky bottom-16 md:bottom-0 -mx-6 -mb-6 md:-mx-8 md:-mb-8 p-4 bg-white/90 backdrop-blur-md border-t border-slate-200 flex justify-end gap-3 rounded-b-2xl z-40">
        <Button type="submit" disabled={pending} size="lg" className="w-full sm:w-auto gap-2 shadow-lg">
          <Save className="h-5 w-5" />
          {pending ? "កំពុងបង្កើត..." : "បង្កើតថ្នាក់រៀន"}
        </Button>
      </div>
    </form>
  );
}