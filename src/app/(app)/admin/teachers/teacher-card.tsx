"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Mail, Phone, BookOpen } from "lucide-react";
import type { ActionResult } from "@/lib/actions/types";
import type { TeacherRow } from "@/lib/admin/teachers/queries";
import { deleteTeacherAction } from "@/lib/admin/teachers/actions";
import { useVisibleError } from "@/lib/hooks/use-visible-error";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function TeacherCard({ teacher }: { teacher: TeacherRow }) {
  const router = useRouter();
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(deleteTeacherAction, null);
  const visibleError = useVisibleError(state);

  useEffect(() => {
    if (state?.ok) router.refresh();
  }, [state, router]);

  return (
    <Card className="p-5 hover:shadow-md transition-shadow group flex flex-col justify-between">
      <div>
        <Link href={`/admin/teachers/${teacher.id}`} className="block">
          <h3 className="font-moul text-lg truncate group-hover:text-primary-600 transition-colors">
            {teacher.full_name_kh}
          </h3>
          {teacher.full_name_en && (
            <p className="text-slate-500 text-xs mt-0.5">{teacher.full_name_en}</p>
          )}
        </Link>

        <div className="mt-4 space-y-2 text-sm text-slate-600">
          {teacher.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="font-inter truncate">{teacher.email}</span>
            </div>
          )}
          {teacher.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="font-inter">{teacher.phone}</span>
            </div>
          )}
        </div>

        {/* Specializations */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {teacher.specialist_1_name && (
            <span className="bg-primary-50 text-primary-700 rounded-md px-2 py-1 text-[11px] font-medium flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              {teacher.specialist_1_name}
            </span>
          )}
          {teacher.specialist_2_name && (
            <span className="bg-slate-100 text-slate-700 rounded-md px-2 py-1 text-[11px] font-medium flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              {teacher.specialist_2_name}
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        {visibleError ? (
          <p className="text-xs text-red-600 truncate">{visibleError}</p>
        ) : <span />}
        
        <div className="flex gap-1">
          <Link href={`/admin/teachers/${teacher.id}`}>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-primary-600">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
          <form
            action={action}
            onSubmit={(e) => {
              if (!window.confirm(`លុបគ្រូ ${teacher.full_name_kh}?`)) e.preventDefault();
            }}
          >
            <input type="hidden" name="teacher_id" value={teacher.id} />
            <Button type="submit" variant="ghost" size="sm" disabled={pending} className="h-8 w-8 p-0 text-slate-400 hover:text-red-600">
              <Trash2 className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </Card>
  );
}