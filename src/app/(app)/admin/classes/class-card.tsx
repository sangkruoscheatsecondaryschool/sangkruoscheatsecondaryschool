"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, UserCircle2, Edit, Trash2 } from "lucide-react";
import type { ActionResult } from "@/lib/actions/types";
import type { ClassRow } from "@/lib/admin/classes/queries";
import { deleteClassAction } from "@/lib/admin/classes/actions";
import { useVisibleError } from "@/lib/hooks/use-visible-error";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ClassCard({ cls }: { cls: ClassRow }) {
  const router = useRouter();
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(deleteClassAction, null);
  const visibleError = useVisibleError(state);

  useEffect(() => {
    if (state?.ok) router.refresh();
  }, [state, router]);

  return (
    <Card className="p-4 hover:shadow-md transition-shadow group flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2">
          <Link href={`/admin/classes/${cls.id}`} className="block">
            <h3 className="font-moul text-lg group-hover:text-primary-600 transition-colors">{cls.class_name}</h3>
          </Link>
          <span className="bg-primary-50 text-primary-700 text-xs px-2.5 py-1 rounded-full font-medium">
            ថ្នាក់ទី {cls.grade_level}
          </span>
        </div>

        <div className="mt-4 space-y-2 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-slate-400" />
            <span>សិស្សសរុប៖ <span className="font-medium text-slate-900">{cls.student_count}</span> នាក់</span>
          </div>
          <div className="flex items-center gap-2">
            <UserCircle2 className="h-4 w-4 text-slate-400" />
            <span className="truncate">គ្រូបន្ទុក៖ {cls.teacher_name_kh ?? "—"}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        {visibleError ? (
          <p className="text-xs text-red-600 truncate">{visibleError}</p>
        ) : <span />}

        <div className="flex gap-1">
          <Link href={`/admin/classes/${cls.id}`}>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-primary-600">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
          <form
            action={action}
            onSubmit={(e) => {
              if (!window.confirm(`លុបថ្នាក់ ${cls.class_name}?`)) e.preventDefault();
            }}
          >
            <input type="hidden" name="class_id" value={cls.id} />
            <Button type="submit" variant="ghost" size="sm" disabled={pending} className="h-8 w-8 p-0 text-slate-400 hover:text-red-600">
              <Trash2 className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </Card>
  );
}