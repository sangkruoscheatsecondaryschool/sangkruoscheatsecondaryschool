"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar, CheckCircle2, Edit, Trash2 } from "lucide-react";
import type { AcademicYear } from "@/lib/admin/academic-years/queries";
import { deleteAcademicYearAction, setCurrentYearAction, type ActionResult } from "@/lib/admin/academic-years/actions";
import { useVisibleError } from "@/lib/hooks/use-visible-error";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function AcademicYearCard({ year }: { year: AcademicYear }) {
  const router = useRouter();
  const [setState, setAction, setPending] = useActionState<ActionResult | null, FormData>(setCurrentYearAction, null);
  const [delState, delAction, delPending] = useActionState<ActionResult | null, FormData>(deleteAcademicYearAction, null);

  const setError = useVisibleError(setState);
  const delError = useVisibleError(delState);
  const visibleError = setError || delError;

  useEffect(() => { if (setState?.ok || delState?.ok) router.refresh(); }, [setState, delState, router]);

  return (
    <Card className="p-5 hover:shadow-md transition-shadow group flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2">
          <Link href={`/admin/academic-years/${year.id}`} className="block min-w-0 flex-1">
            <h3 className="font-moul text-xl text-slate-900 group-hover:text-primary-600 transition-colors">
              {year.year_name}
            </h3>
          </Link>
          {year.is_current && (
            <span className="bg-green-100 text-green-800 rounded-full px-2.5 py-0.5 text-[10px] font-medium flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> ឆ្នាំសិក្សាបច្ចុប្បន្ន
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        {visibleError ? (
          <p className="text-xs text-red-600 truncate max-w-[120px]">{visibleError}</p>
        ) : <span />}

        <div className="flex gap-1">
          {!year.is_current && (
            <form action={setAction}>
              <input type="hidden" name="id" value={year.id} />
              <Button type="submit" variant="ghost" size="sm" disabled={setPending} className="h-8 text-xs text-slate-500 hover:text-primary-600 px-2">
                កំណត់ជាឆ្នាំសិក្សាបច្ចុប្បន្ន
              </Button>
            </form>
          )}
          <Link href={`/admin/academic-years/${year.id}`}>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-primary-600">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
          {!year.is_current && (
            <form action={delAction} onSubmit={(e) => { if (!window.confirm(`លុបឆ្នាំសិក្សា ${year.year_name}?`)) e.preventDefault(); }}>
              <input type="hidden" name="id" value={year.id} />
              <Button type="submit" variant="ghost" size="sm" disabled={delPending} className="h-8 w-8 p-0 text-slate-400 hover:text-red-600">
                <Trash2 className="h-4 w-4" />
              </Button>
            </form>
          )}
        </div>
      </div>
    </Card>
  );
}