"use client";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import type { ActionResult } from "@/lib/actions/types";
import type { TeacherAssignmentRow } from "@/lib/admin/teacher-assignments/queries";
import { deleteAssignmentAction } from "@/lib/admin/teacher-assignments/actions";
import { useVisibleError } from "@/lib/hooks/use-visible-error";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function AssignmentCard({ row }: { row: TeacherAssignmentRow }) {
  const router = useRouter();
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(deleteAssignmentAction, null);
  const visibleError = useVisibleError(state);

  useEffect(() => { if (state?.ok) router.refresh(); }, [state, router]);

  return (
    <Card className="p-4 flex items-center justify-between gap-3 hover:shadow-sm transition-shadow">
      <div className="min-w-0">
        <p className="font-moul text-sm text-slate-900 truncate">{row.subject_name}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="bg-slate-100 text-slate-600 rounded-md px-2 py-0.5 text-[10px] font-medium">{row.class_name}</span>
          <span className="text-slate-400 text-xs font-inter">{row.subject_code}</span>
        </div>
      </div>
      
      <div className="shrink-0">
        {visibleError && <p className="text-[10px] text-red-600 mb-1">{visibleError}</p>}
        <form action={action} onSubmit={(e) => { if (!window.confirm(`លុបការចាត់តាំង ${row.subject_name}?`)) e.preventDefault(); }}>
          <input type="hidden" name="id" value={row.id} />
          <Button type="submit" variant="ghost" size="sm" disabled={pending} className="h-8 w-8 p-0 text-slate-400 hover:text-red-600">
            <Trash2 className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}