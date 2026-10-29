"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Edit, Trash2 } from "lucide-react";
import type { ActionResult } from "@/lib/actions/types";
import type { SubjectWithConfigs } from "@/lib/admin/subjects/queries";
import { deleteSubjectAction } from "@/lib/admin/subjects/actions";
import { useVisibleError } from "@/lib/hooks/use-visible-error";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function SubjectCard({ subject }: { subject: SubjectWithConfigs }) {
  const router = useRouter();
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(deleteSubjectAction, null);
  const visibleError = useVisibleError(state);

  useEffect(() => {
    if (state?.ok) router.refresh();
  }, [state, router]);

  const configByGrade = new Map(subject.configs.map((c) => [c.grade_level, c.max_score]));

  return (
    <Card className="p-5 hover:shadow-md transition-shadow group flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2">
          <Link href={`/admin/subjects/${subject.id}`} className="block min-w-0 flex-1">
            <h3 className="font-moul text-lg truncate group-hover:text-primary-600 transition-colors">
              {subject.subject_name}
            </h3>
            <p className="text-slate-500 font-inter text-xs mt-0.5 uppercase tracking-wider">{subject.code}</p>
          </Link>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2 text-center">
          {[7, 8, 9].map((g) => (
            <div key={g} className="bg-slate-50 rounded-xl py-2 border border-slate-100">
              <p className="text-[10px] text-slate-500 uppercase font-medium">ថ្នាក់ទី {g}</p>
              <p className="mt-0.5 text-sm font-inter font-semibold text-slate-800">
                {configByGrade.get(g) ?? "—"}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        {visibleError ? (
          <p className="text-xs text-red-600 truncate">{visibleError}</p>
        ) : <span />}
        
        <div className="flex gap-1">
          <Link href={`/admin/subjects/${subject.id}`}>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-primary-600">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
          <form
            action={action}
            onSubmit={(e) => {
              if (!window.confirm(`លុបមុខវិជ្ជា ${subject.subject_name}?`)) e.preventDefault();
            }}
          >
            <input type="hidden" name="subject_id" value={subject.id} />
            <Button type="submit" variant="ghost" size="sm" disabled={pending} className="h-8 w-8 p-0 text-slate-400 hover:text-red-600">
              <Trash2 className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </Card>
  );
}