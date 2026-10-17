"use client";

import { useState } from "react";
import type { TeacherRosterStudent } from "@/lib/teacher/queries";
import {
  STUDENT_STATUS_CLASS,
  STUDENT_STATUS_LABEL,
} from "@/lib/students/status-labels";

export function RosterList({
  students,
}: {
  students: TeacherRosterStudent[];
}) {
  const [q, setQ] = useState("");

  if (students.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-border bg-surface p-6 text-center">
        <p className="text-muted text-sm">មិនមានសិស្សនៅក្នុងថ្នាក់នេះទេ។</p>
      </div>
    );
  }

  const needle = q.trim().toLowerCase();
  const filtered = needle
    ? students.filter(
        (s) =>
          s.name_kh.toLowerCase().includes(needle) ||
          s.student_code.toLowerCase().includes(needle),
      )
    : students;

  return (
    <div className="space-y-3">
      <input
        type="search"
        inputMode="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="ស្វែងរកឈ្មោះ ឬលេខកូដ"
        className="rounded-btn border-border bg-surface w-full border px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
      />

      {filtered.length === 0 ? (
        <p className="text-muted py-4 text-center text-sm">
          រកមិនឃើញសិស្ស។
        </p>
      ) : (
        <ul className="space-y-1.5">
          {filtered.map((s) => {
            const isInactive = s.status !== "active";
            return (
              <li
                key={s.id}
                className="rounded-btn border-border bg-surface flex items-center justify-between gap-3 border p-3"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                      s.gender === "F"
                        ? "bg-pink-100 text-pink-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {s.gender === "F" ? "F" : s.gender === "M" ? "M" : "—"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">{s.name_kh}</p>
                    <p className="text-muted truncate font-mono text-xs">
                      {s.student_code}
                    </p>
                  </div>
                </div>
                {isInactive ? (
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      STUDENT_STATUS_CLASS[s.status] ??
                      "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {STUDENT_STATUS_LABEL[s.status] ?? s.status}
                  </span>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}

      <p className="text-muted text-center text-xs">
        បង្ហាញ {filtered.length} / {students.length} នាក់
      </p>
    </div>
  );
}