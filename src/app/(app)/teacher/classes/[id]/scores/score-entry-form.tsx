"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Save, AlertCircle, CheckCircle2 } from "lucide-react";
import type { ScoreEntryContext } from "@/lib/teacher/scores-queries";
import { saveScoresAction, type SaveScoresResult } from "@/lib/teacher/scores-actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function ScoreEntryForm({ ctx }: { ctx: ScoreEntryContext }) {
  const router = useRouter();
  const [state, action, pending] = useActionState<SaveScoresResult | null, FormData>(saveScoresAction, null);
  const [q, setQ] = useState("");

  useEffect(() => {
    if (state?.ok && state.saved > 0) router.refresh();
  }, [state, router]);

  const needle = q.trim().toLowerCase();
  const visible = useMemo(() => {
    if (!needle) return null;
    const set = new Set<string>();
    for (const s of ctx.students) {
      if (s.name_kh.toLowerCase().includes(needle) || s.student_code.toLowerCase().includes(needle)) set.add(s.id);
    }
    return set;
  }, [needle, ctx.students]);

  const visibleCount = visible ? visible.size : ctx.students.length;

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="class_id" value={ctx.class_id} />
      <input type="hidden" name="subject_id" value={ctx.subject_id} />
      <input type="hidden" name="term_month_id" value={ctx.term_month_id} />

      {/* Header Info */}
      <div className={`rounded-xl border p-4 flex items-center justify-between gap-4 ${
        ctx.is_semester_exam ? "border-amber-200 bg-amber-50" : "border-slate-200 bg-slate-50"
      }`}>
        <div>
          <p className="text-sm font-medium text-slate-900">{ctx.subject_name} · {ctx.month_name_kh}</p>
          <p className="text-xs text-slate-500 mt-1">ពិន្ទុពេញ៖ {ctx.max_score}</p>
        </div>
        {ctx.is_semester_exam && (
          <span className="bg-amber-200 text-amber-900 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">ប្រឡងឆមាស</span>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <Input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ស្វែងរកឈ្មោះ ឬលេខកូដសិស្ស..."
          className="pl-10 h-12 bg-white"
        />
      </div>

      {state && !state.ok && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 shrink-0" /> {state.error}
        </div>
      )}

      {state?.ok && (
        <div className={`rounded-xl border p-3 text-sm flex items-center gap-2 ${
          state.failed === 0 ? "border-green-200 bg-green-50 text-green-800" : "border-amber-200 bg-amber-50 text-amber-900"
        }`}>
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <div>
            <p>បានរក្សាទុក {state.saved} · បរាជ័យ {state.failed}</p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {ctx.students.map((s) => {
          const matched = !visible || visible.has(s.id);
          return (
            <Card key={s.id} className={`p-3 flex items-center gap-3 transition-all ${matched ? "" : "hidden"}`}>
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                s.gender === "F" ? "bg-pink-100 text-pink-800" : "bg-blue-100 text-blue-800"
              }`}>
                {s.gender === "F" ? "F" : s.gender === "M" ? "M" : "—"}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-900">{s.name_kh}</p>
                <p className="text-slate-500 font-inter text-xs">{s.student_code}</p>
              </div>
              <input type="hidden" name={`name__${s.id}`} value={s.name_kh} />
              <Input
                name={`score__${s.id}`}
                type="text"
                inputMode="decimal"
                defaultValue={s.existing_score === null ? "" : String(s.existing_score)}
                placeholder="—"
                className={`w-20 shrink-0 text-center font-inter text-lg font-semibold h-11 ${
                  ctx.is_semester_exam ? "border-amber-300 bg-amber-50 focus:border-amber-500" : ""
                }`}
              />
            </Card>
          );
        })}
      </div>

      {visibleCount === 0 && (
        <p className="text-center py-8 text-slate-500 text-sm">រកមិនឃើញសិស្ស។</p>
      )}

      {/* Sticky Save Bar */}
      <div className="fixed bottom-16 md:bottom-0 inset-x-0 md:left-64 z-40 bg-white/90 backdrop-blur-md border-t border-slate-200 p-4 print:hidden">
        <div className="mx-auto max-w-4xl">
          <Button type="submit" disabled={pending} size="lg" className="w-full gap-2 shadow-lg">
            <Save className="h-5 w-5" />
            {pending ? "កំពុងរក្សាទុក..." : "រក្សាទុកពិន្ទុទាំងអស់"}
          </Button>
        </div>
      </div>
    </form>
  );
}