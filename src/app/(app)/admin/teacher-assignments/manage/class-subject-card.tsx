"use client";

import { useState } from "react";
import type { ClassOption, SubjectOption } from "@/lib/admin/teacher-assignments/queries";
import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";

export function ClassSubjectCard({
  cls,
  subjects,
  initialSelected,
  takenByOthers,
}: {
  cls: ClassOption;
  subjects: SubjectOption[];
  initialSelected: string[];
  takenByOthers: Map<string, string>;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set(initialSelected));

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-moul text-lg text-slate-900">ថ្នាក់ {cls.class_name}</h3>
          <p className="text-xs text-slate-500">កម្រិតថ្នាក់ទី {cls.grade_level}</p>
        </div>
        <span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-xs font-medium">
          {selected.size} មុខវិជ្ជា
        </span>
      </div>

      <input type="hidden" name="class_ids" value={cls.id} />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {subjects.map((s) => {
          const takenBy = takenByOthers.get(s.id);
          const checked = selected.has(s.id);

          // If taught by another teacher, disable it
          if (takenBy) {
            return (
              <div
                key={s.id}
                title={`បង្រៀនដោយ ${takenBy}`}
                className="flex flex-col gap-0.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 opacity-60 cursor-not-allowed"
              >
                <span className="text-sm text-slate-500 truncate line-through">{s.subject_name}</span>
                <span className="text-[10px] text-slate-400 truncate">បង្រៀនដោយ {takenBy}</span>
              </div>
            );
          }

          // Active checkbox
          return (
            <label
              key={s.id}
              className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 transition-colors ${
                checked
                  ? "border-primary-500 bg-primary-50 text-primary-900 shadow-sm"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
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
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                  checked ? "border-primary-600 bg-primary-600" : "border-slate-300 bg-white"
                }`}
              >
                {checked && <Check className="h-3.5 w-3.5 text-white" />}
              </span>
              <span className="text-sm font-medium truncate">{s.subject_name}</span>
            </label>
          );
        })}
      </div>
    </Card>
  );
}