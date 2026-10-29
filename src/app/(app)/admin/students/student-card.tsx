"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Phone, User } from "lucide-react";
import type { ActionResult } from "@/lib/actions/types";
import type { StudentRow } from "@/lib/admin/students/queries";
import { deleteStudentAction } from "@/lib/admin/students/actions";
import { useVisibleError } from "@/lib/hooks/use-visible-error";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const STATUS_LABEL: Record<string, string> = {
  active: "កំពុងសិក្សា",
  dropped_s1: "បោះបង់ ឆមាសទី១",
  dropped_s2: "បោះបង់ ឆមាសទី២",
  graduated: "បានបញ្ចប់",
};

const STATUS_CLASS: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  dropped_s1: "bg-amber-100 text-amber-800",
  dropped_s2: "bg-amber-100 text-amber-800",
  graduated: "bg-slate-100 text-slate-700",
};

export function StudentCard({ student }: { student: StudentRow }) {
  const router = useRouter();
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(deleteStudentAction, null);
  const visibleError = useVisibleError(state);

  useEffect(() => {
    if (state?.ok) router.refresh();
  }, [state, router]);

  return (
    <Card className="p-4 hover:shadow-md transition-shadow group flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2">
          <Link href={`/admin/students/${student.id}`} className="min-w-0 flex-1">
            <h3 className="font-moul text-base truncate group-hover:text-primary-600 transition-colors">
              {student.name_kh}
            </h3>
            <p className="text-slate-500 font-inter text-sm mt-0.5">
              {student.student_code}
            </p>
          </Link>
          {student.status !== "active" && (
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS_CLASS[student.status]}`}>
              {STATUS_LABEL[student.status]}
            </span>
          )}
        </div>

        <div className="mt-3 space-y-1.5 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-slate-400" />
            <span>{student.gender === "F" ? "ស្រី" : student.gender === "M" ? "ប្រុស" : "—"}</span>
          </div>
          {student.contact_number && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-slate-400" />
              <span className="font-inter">{student.contact_number}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        {visibleError ? (
          <p className="text-xs text-red-600 truncate">{visibleError}</p>
        ) : <span />}
        
        <div className="flex gap-1">
          <Link href={`/admin/students/${student.id}`}>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-primary-600">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
          <form
            action={action}
            onSubmit={(e) => {
              if (!window.confirm(`លុបសិស្ស ${student.name_kh}?`)) e.preventDefault();
            }}
          >
            <input type="hidden" name="student_id" value={student.id} />
            <Button type="submit" variant="ghost" size="sm" disabled={pending} className="h-8 w-8 p-0 text-slate-400 hover:text-red-600">
              <Trash2 className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </Card>
  );
}