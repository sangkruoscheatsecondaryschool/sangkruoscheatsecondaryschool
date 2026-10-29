"use client";

import { useActionState } from "react";
import { Save } from "lucide-react";
import type { ActionResult } from "@/lib/actions/types";
import type { SubjectOption } from "@/lib/admin/teachers/queries";
import type { AdminUnit } from "@/lib/admin/students/address-queries";
import { createTeacherAction } from "@/lib/admin/teachers/actions";
import { TeacherFields } from "../teacher-fields";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function NewTeacherForm({ subjects, provinces }: { subjects: SubjectOption[]; provinces: AdminUnit[] }) {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(createTeacherAction, null);

  return (
    <form action={action} className="space-y-8">
      <section className="space-y-4">
        <h3 className="font-moul text-lg text-slate-800 border-b pb-2">គណនីចូលប្រើប្រាស់</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">អ៊ីមែល *</label>
            <Input name="email" type="email" required className="font-inter" placeholder="teacher@school.edu.kh" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">លេខសម្ងាត់បណ្ដោះអាសន្ន *</label>
            <Input name="password" type="text" required minLength={8} className="font-inter" placeholder="យ៉ាងតិច ៨ តួ" />
            <p className="text-xs text-slate-500 mt-1">សូមចម្លងលេខសម្ងាត់នេះជូនគ្រូ។</p>
          </div>
        </div>
      </section>

      <TeacherFields subjects={subjects} provinces={provinces} />

      {state && !state.ok && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{state.error}</div>
      )}

      <div className="sticky bottom-16 md:bottom-0 -mx-6 -mb-6 md:-mx-8 md:-mb-8 p-4 bg-white/90 backdrop-blur-md border-t border-slate-200 flex justify-end gap-3 rounded-b-2xl z-40">
        <Button type="submit" disabled={pending} size="lg" className="w-full sm:w-auto gap-2 shadow-lg">
          <Save className="h-5 w-5" />
          {pending ? "កំពុងបង្កើត..." : "បង្កើតគណនីគ្រូ"}
        </Button>
      </div>
    </form>
  );
}