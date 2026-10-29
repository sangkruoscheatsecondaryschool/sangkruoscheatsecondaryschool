"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, CheckCircle2 } from "lucide-react";
import type { ActionResult } from "@/lib/actions/types";
import type { ClassOption } from "@/lib/admin/students/queries";
import type { AdminUnit } from "@/lib/admin/students/address-queries";
import { updateStudentAction } from "@/lib/admin/students/actions";
import { StudentFields, type StudentDefaults } from "../student-fields";
import { Button } from "@/components/ui/button";

export function EditStudentForm({
  studentId,
  yearName,
  classes,
  provinces,
  defaults,
}: {
  studentId: string;
  yearName: string;
  classes: ClassOption[];
  provinces: AdminUnit[];
  defaults: StudentDefaults;
}) {
  const router = useRouter();
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(
    updateStudentAction,
    null
  );

  useEffect(() => {
    if (state?.ok) router.refresh();
  }, [state, router]);

  return (
    <form action={action} className="space-y-8">
      <input type="hidden" name="student_id" value={studentId} />

      <StudentFields classes={classes} provinces={provinces} defaults={defaults} />

      {state && !state.ok && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {state.error}
        </div>
      )}

      {state?.ok && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          បានរក្សាទុកដោយជោគជ័យ។
        </div>
      )}

      {/* Sticky Action Bar */}
      <div className="sticky bottom-16 md:bottom-0 -mx-6 -mb-6 md:-mx-8 md:-mb-8 p-4 bg-white/90 backdrop-blur-md border-t border-slate-200 flex justify-end gap-3 rounded-b-2xl z-40">
        <Button type="submit" disabled={pending} size="lg" className="w-full sm:w-auto gap-2 shadow-lg">
          <Save className="h-5 w-5" />
          {pending ? "កំពុងរក្សាទុក..." : "រក្សាទុកការកែប្រែ"}
        </Button>
      </div>
    </form>
  );
}