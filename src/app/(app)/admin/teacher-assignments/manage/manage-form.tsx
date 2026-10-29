"use client";

import { useActionState } from "react";
import { Save } from "lucide-react";
import type { ActionResult } from "@/lib/actions/types";
import type { ClassOption, SubjectOption } from "@/lib/admin/teacher-assignments/queries";
import { syncAssignmentsAction } from "@/lib/admin/teacher-assignments/actions";
import { ClassSubjectCard } from "./class-subject-card";
import { Button } from "@/components/ui/button";

export function ManageForm({
  yearId,
  teacherId,
  classes,
  subjects,
  initialByClass,
  takenByClass,
}: {
  yearId: string;
  teacherId: string;
  classes: ClassOption[];
  subjects: SubjectOption[];
  initialByClass: Record<string, string[]>;
  takenByClass: Map<string, Map<string, string>>;
}) {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(syncAssignmentsAction, null);

  const totalSelected = Object.values(initialByClass).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <form action={action} className="space-y-6 pb-24">
      <input type="hidden" name="teacher_id" value={teacherId} />
      <input type="hidden" name="year" value={yearId} />

      {state && !state.ok && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <div className="space-y-4">
        {classes.map((cls) => (
          <ClassSubjectCard
            key={cls.id}
            cls={cls}
            subjects={subjects}
            initialSelected={initialByClass[cls.id] ?? []}
            takenByOthers={takenByClass.get(cls.id) ?? new Map()}
          />
        ))}
      </div>

      {/* Sticky Save Bar */}
      <div className="fixed bottom-16 md:bottom-0 inset-x-0 md:left-64 z-40 bg-white/90 backdrop-blur-md border-t border-slate-200 p-4 print:hidden">
        <div className="mx-auto max-w-4xl flex items-center justify-between gap-4">
          <p className="text-sm text-slate-600 font-medium">
            សរុប៖ <span className="text-primary-600 font-bold">{totalSelected}</span> ការចាត់តាំង
          </p>
          <Button type="submit" disabled={pending} size="lg" className="gap-2 shadow-lg">
            <Save className="h-5 w-5" />
            {pending ? "កំពុងរក្សាទុក..." : "រក្សាទុកការចាត់តាំង"}
          </Button>
        </div>
      </div>
    </form>
  );
}