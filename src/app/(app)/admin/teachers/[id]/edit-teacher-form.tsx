"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, CheckCircle2 } from "lucide-react";
import type { ActionResult } from "@/lib/actions/types";
import type { SubjectOption } from "@/lib/admin/teachers/queries";
import type { AdminUnit } from "@/lib/admin/students/address-queries";
import { updateTeacherAction } from "@/lib/admin/teachers/actions";
import { TeacherFields, type TeacherDefaults } from "../teacher-fields";
import { Button } from "@/components/ui/button";

export function EditTeacherForm({
  teacherId,
  email,
  subjects,
  provinces,
  defaults,
}: {
  teacherId: string;
  email: string | null;
  subjects: SubjectOption[];
  provinces: AdminUnit[];
  defaults: TeacherDefaults;
}) {
  const router = useRouter();
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(updateTeacherAction, null);

  useEffect(() => {
    if (state?.ok) router.refresh();
  }, [state, router]);

  return (
    <form action={action} className="space-y-8">
      <input type="hidden" name="teacher_id" value={teacherId} />

      {email && (
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
          <p className="text-xs text-slate-500">អ៊ីមែលចូលប្រើ</p>
          <p className="font-inter text-sm font-medium text-slate-800">{email}</p>
        </div>
      )}

      <TeacherFields subjects={subjects} provinces={provinces} defaults={defaults} />

      {state && !state.ok && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{state.error}</div>
      )}

      {state?.ok && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          បានរក្សាទុកដោយជោគជ័យ។
        </div>
      )}

      <div className="sticky bottom-16 md:bottom-0 -mx-6 -mb-6 md:-mx-8 md:-mb-8 p-4 bg-white/90 backdrop-blur-md border-t border-slate-200 flex justify-end gap-3 rounded-b-2xl z-40">
        <Button type="submit" disabled={pending} size="lg" className="w-full sm:w-auto gap-2 shadow-lg">
          <Save className="h-5 w-5" />
          {pending ? "កំពុងរក្សាទុក..." : "រក្សាទុកការកែប្រែ"}
        </Button>
      </div>
    </form>
  );
}