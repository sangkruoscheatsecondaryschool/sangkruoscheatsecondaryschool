"use client";

import { useState } from "react";
import type {
  ClassOption,
  SubjectOption,
} from "@/lib/admin/teacher-assignments/queries";

export function ClassSubjectCard({
  cls,
  subjects,
  initialSelected,
  takenByOthers,
}: {
  cls: ClassOption;
  subjects: SubjectOption[];
  initialSelected: string[];
  takenByOthers: Map<string, string>; // subject_id -> other teacher name
}) {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(initialSelected),
  );

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="rounded-card border-border bg-surface border p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <p className="font-moul text-sm">ថ្នាក់ {cls.class_name}</p>
          <p className="text-muted text-[11px]">
            កម្រិតថ្នាក់ទី {cls.grade_level}
          </p>
        </div>
        <span className="bg-brand-100 text-brand-800 rounded-full px-2 py-0.5 text-[11px] font-medium">
          {selected.size} មុខវិជ្ជា
        </span>
      </div>

      <input type="hidden" name="class_ids" value={cls.id} />

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {subjects.map((s) => {
          const takenBy = takenByOthers.get(s.id);
          const checked = selected.has(s.id);

          // Disabled: already taught by another teacher
          if (takenBy) {
            return (
              <div
                key={s.id}
                title={`បង្រៀនដោយ ${takenBy}`}
                className="border-border bg-bg flex cursor-not-allowed flex-col gap-0.5 rounded-btn border px-2.5 py-2 text-xs opacity-60"
              >
                <span className="truncate line-through">{s.subject_name}</span>
                <span className="text-muted truncate text-[10px]">
                  បង្រៀនដោយ {takenBy}
                </span>
              </div>
            );
          }

          return (
            <label
              key={s.id}
              className={`flex cursor-pointer items-center gap-2 rounded-btn border px-2.5 py-2 text-xs transition-colors ${
                checked
                  ? "border-brand-500 bg-brand-50 text-brand-800"
                  : "border-border bg-bg text-fg active:bg-slate-100"
              }`}
            >
              <input
                type="checkbox"
                name={`cs__${cls.id}`}
                value={s.id}
                checked={checked}
                onChange={() => toggle(s.id)}
                className="sr-only"
              />
              <span
                aria-hidden
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                  checked
                    ? "border-brand-600 bg-brand-600"
                    : "border-border bg-surface"
                }`}
              >
                {checked ? (
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                ) : null}
              </span>
              <span className="min-w-0 flex-1 truncate">
                {s.subject_name}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}