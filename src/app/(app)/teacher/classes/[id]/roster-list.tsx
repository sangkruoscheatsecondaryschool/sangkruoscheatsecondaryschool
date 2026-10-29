"use client";

import { useState } from "react";
import { Search, User } from "lucide-react";
import type { TeacherRosterStudent } from "@/lib/teacher/queries";
import { STUDENT_STATUS_CLASS, STUDENT_STATUS_LABEL } from "@/lib/students/status-labels";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export function RosterList({ students }: { students: TeacherRosterStudent[] }) {
  const [q, setQ] = useState("");

  if (students.length === 0) {
    return (
      <Card className="p-8 text-center text-slate-500">
        មិនមានសិស្សនៅក្នុងថ្នាក់នេះទេ។
      </Card>
    );
  }

  const needle = q.trim().toLowerCase();
  const filtered = needle
    ? students.filter(
        (s) => s.name_kh.toLowerCase().includes(needle) || s.student_code.toLowerCase().includes(needle)
      )
    : students;

  return (
    <div className="space-y-4">
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

      {filtered.length === 0 ? (
        <p className="text-center py-8 text-slate-500 text-sm">រកមិនឃើញសិស្ស។</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {filtered.map((s) => {
            const isInactive = s.status !== "active";
            return (
              <Card key={s.id} className="p-3 flex items-center gap-3 hover:shadow-sm transition-shadow">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-medium ${
                    s.gender === "F" ? "bg-pink-100 text-pink-800" : "bg-blue-100 text-blue-800"
                  }`}>
                  {s.gender === "F" ? "F" : s.gender === "M" ? "M" : <User className="h-4 w-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900 truncate">{s.name_kh}</p>
                  <p className="text-slate-500 font-inter text-xs">{s.student_code}</p>
                </div>
                {isInactive && (
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${STUDENT_STATUS_CLASS[s.status] ?? "bg-slate-100 text-slate-700"}`}>
                    {STUDENT_STATUS_LABEL[s.status] ?? s.status}
                  </span>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}