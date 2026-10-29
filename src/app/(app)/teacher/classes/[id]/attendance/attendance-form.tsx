"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Check, X, ShieldAlert, CheckCircle2, AlertCircle, Save } from "lucide-react";
import type { AttendanceContext, AttendanceStatus } from "@/lib/teacher/attendance-queries";
import { saveAttendanceAction, type SaveAttendanceResult } from "@/lib/teacher/attendance-actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type State = Record<string, AttendanceStatus>;

export function AttendanceForm({ ctx }: { ctx: AttendanceContext }) {
  const router = useRouter();
  const [state, action, pending] = useActionState<SaveAttendanceResult | null, FormData>(saveAttendanceAction, null);
  const [q, setQ] = useState("");

  const [statuses, setStatuses] = useState<State>(() => {
    const m: State = {};
    for (const s of ctx.students) m[s.id] = s.status ?? "present";
    return m;
  });

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

  const counts = useMemo(() => {
    let present = 0, perm = 0, absent = 0;
    for (const s of ctx.students) {
      const st = statuses[s.id];
      if (st === "present") present++;
      else if (st === "absent_permission") perm++;
      else absent++;
    }
    return { present, perm, absent };
  }, [statuses, ctx.students]);

  const setStatus = (id: string, status: AttendanceStatus) => setStatuses((prev) => ({ ...prev, [id]: status }));
  const markAllPresent = () => {
    const m: State = {};
    for (const s of ctx.students) m[s.id] = "present";
    setStatuses(m);
  };

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="class_id" value={ctx.class_id} />
      <input type="hidden" name="date" value={ctx.date} />

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-center">
          <p className="text-[10px] font-medium text-green-700 uppercase">មានវត្តមាន</p>
          <p className="text-xl font-inter font-bold text-green-800 mt-1">{counts.present}</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-center">
          <p className="text-[10px] font-medium text-amber-700 uppercase">មានច្បាប់</p>
          <p className="text-xl font-inter font-bold text-amber-800 mt-1">{counts.perm}</p>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-center">
          <p className="text-[10px] font-medium text-red-700 uppercase">គ្មានច្បាប់</p>
          <p className="text-xl font-inter font-bold text-red-800 mt-1">{counts.absent}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button type="button" onClick={markAllPresent} variant="outline" className="shrink-0 h-12 gap-2 border-green-200 text-green-700 bg-green-50 hover:bg-green-100 hover:text-green-800">
          <Check className="h-4 w-4" /> មានវត្តមានទាំងអស់
        </Button>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ស្វែងរកឈ្មោះ ឬលេខកូដសិស្ស..."
            className="pl-10 h-12 bg-white"
          />
        </div>
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
          <p>បានរក្សាទុក {state.saved} · បរាជ័យ {state.failed}</p>
        </div>
      )}

      {/* Student List */}
      <div className="space-y-2">
        {ctx.students.map((s) => {
          const matched = !visible || visible.has(s.id);
          const current = statuses[s.id] ?? "present";

          return (
            <Card key={s.id} className={`p-3 transition-all ${matched ? "" : "hidden"}`}>
              <div className="flex items-center gap-3 mb-3">
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                  s.gender === "F" ? "bg-pink-100 text-pink-800" : "bg-blue-100 text-blue-800"
                }`}>
                  {s.gender === "F" ? "F" : s.gender === "M" ? "M" : "—"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">{s.name_kh}</p>
                  <p className="text-slate-500 font-inter text-xs">{s.student_code}</p>
                </div>
              </div>

              <input type="hidden" name={`name__${s.id}`} value={s.name_kh} />
              <input type="hidden" name={`attn__${s.id}`} value={current} />

              <div className="grid grid-cols-3 gap-2">
                <SegBtn active={current === "present"} tone="green" onClick={() => setStatus(s.id, "present")} label="មាន" icon={<Check className="h-4 w-4" />} />
                <SegBtn active={current === "absent_permission"} tone="amber" onClick={() => setStatus(s.id, "absent_permission")} label="ច្បាប់" icon={<ShieldAlert className="h-4 w-4" />} />
                <SegBtn active={current === "absent_no_permission"} tone="red" onClick={() => setStatus(s.id, "absent_no_permission")} label="គ្មាន" icon={<X className="h-4 w-4" />} />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Sticky Save Bar */}
      <div className="fixed bottom-16 md:bottom-0 inset-x-0 md:left-64 z-40 bg-white/90 backdrop-blur-md border-t border-slate-200 p-4 print:hidden">
        <div className="mx-auto max-w-4xl">
          <Button type="submit" disabled={pending} size="lg" className="w-full gap-2 shadow-lg">
            <Save className="h-5 w-5" />
            {pending ? "កំពុងរក្សាទុក..." : "រក្សាទុកវត្តមាន"}
          </Button>
        </div>
      </div>
    </form>
  );
}

function SegBtn({ active, tone, onClick, label, icon }: { active: boolean; tone: "green" | "amber" | "red"; onClick: () => void; label: string; icon: React.ReactNode }) {
  const activeCls = tone === "green" ? "border-green-600 bg-green-600 text-white shadow-sm" : tone === "amber" ? "border-amber-500 bg-amber-500 text-white shadow-sm" : "border-red-600 bg-red-600 text-white shadow-sm";
  const inactiveCls = tone === "green" ? "border-green-200 bg-green-50 text-green-800 hover:bg-green-100" : tone === "amber" ? "border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100" : "border-red-200 bg-red-50 text-red-800 hover:bg-red-100";

  return (
    <button type="button" onClick={onClick} className={`flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-sm font-medium transition-all ${active ? activeCls : inactiveCls}`}>
      {icon} {label}
    </button>
  );
}