"use client";

import { useState } from "react";
import type { PeriodRow, TimetableCell } from "@/lib/admin/timetable/queries";
import { CellEditor } from "./cell-editor";

const DAYS = [
  { n: 1, kh: "ចន្ទ" },
  { n: 2, kh: "អង្គារ" },
  { n: 3, kh: "ពុធ" },
  { n: 4, kh: "ព្រហស្បតិ៍" },
  { n: 5, kh: "សុក្រ" },
  { n: 6, kh: "សៅរ៍" },
] as const;

type EditableCell = {
  day_of_week: number;
  period_id: string;
} | null;

export function TimetableGrid({
  classId,
  className,
  periods,
  cells,
  assignableSubjects,
}: {
  classId: string;
  className: string;
  periods: PeriodRow[];
  cells: TimetableCell[];
  assignableSubjects: {
    subject_id: string;
    subject_name: string;
    subject_code: string;
  }[];
}) {
  const [editing, setEditing] = useState<EditableCell>(null);

  // Fast lookup
  const cellMap = new Map<string, TimetableCell>();
  for (const c of cells) {
    cellMap.set(`${c.day_of_week}-${c.period_id}`, c);
  }

  const editingCell = editing ? cellMap.get(`${editing.day_of_week}-${editing.period_id}`) ?? null : null;

  return (
    <div className="space-y-4">
      {/* Desktop grid */}
      <div className="hidden overflow-x-auto md:block rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-slate-200 bg-slate-50 p-3 text-left sticky left-0 z-10 font-medium text-slate-600">
                ម៉ោង
              </th>
              {DAYS.map((d) => (
                <th key={d.n} className="border-b border-slate-200 bg-slate-50 p-3 text-center font-medium text-slate-600">
                  {d.kh}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {periods.map((p) => (
              <tr key={p.id} className="group">
                <td className="border-b border-slate-100 bg-white p-3 align-top sticky left-0 z-10 group-hover:bg-slate-50 transition-colors">
                  <p className="text-sm font-medium text-slate-800">ម៉ោងទី {p.period_number}</p>
                  <p className="text-slate-500 text-[11px] font-inter mt-0.5">
                    {p.start_time.slice(0, 5)}–{p.end_time.slice(0, 5)}
                  </p>
                </td>
                {DAYS.map((d) => {
                  const cell = cellMap.get(`${d.n}-${p.id}`);
                  return (
                    <td key={d.n} className="border-b border-slate-100 p-0 align-top">
                      <button
                        type="button"
                        onClick={() => setEditing({ day_of_week: d.n, period_id: p.id })}
                        className="flex h-full min-h-[64px] w-full flex-col items-start justify-center gap-1 p-3 text-left transition-colors hover:bg-primary-50 active:bg-primary-100"
                      >
                        {cell ? (
                          <>
                            <span className="text-sm font-medium text-slate-900">{cell.subject_name}</span>
                            <span className="text-slate-500 text-xs">{cell.teacher_name_kh}</span>
                          </>
                        ) : (
                          <span className="text-slate-300 text-xs">— មិនទាន់កំណត់ —</span>
                        )}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile day-by-day */}
      <div className="space-y-6 md:hidden">
        {DAYS.map((d) => (
          <section key={d.n}>
            <h3 className="font-moul text-slate-800 mb-3 text-lg flex items-center gap-2">
              <span className="bg-primary-100 text-primary-700 w-8 h-8 rounded-lg flex items-center justify-center text-sm">{d.n}</span>
              ថ្ងៃ{d.kh}
            </h3>
            <div className="space-y-2">
              {periods.map((p) => {
                const cell = cellMap.get(`${d.n}-${p.id}`);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setEditing({ day_of_week: d.n, period_id: p.id })}
                    className="w-full flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-3 text-left transition-colors hover:border-primary-300 hover:shadow-sm active:scale-[0.99]"
                  >
                    <div className="shrink-0 w-14 text-center border-r border-slate-100 pr-3">
                      <p className="text-slate-500 text-[10px] uppercase font-medium">ម៉ោង {p.period_number}</p>
                      <p className="text-slate-700 text-xs font-inter mt-0.5">{p.start_time.slice(0, 5)}</p>
                    </div>
                    <div className="min-w-0 flex-1">
                      {cell ? (
                        <>
                          <p className="text-sm font-medium text-slate-900 truncate">{cell.subject_name}</p>
                          <p className="text-slate-500 text-xs truncate mt-0.5">{cell.teacher_name_kh}</p>
                        </>
                      ) : (
                        <span className="text-slate-400 text-sm">— មិនទាន់កំណត់ —</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Cell editor sheet */}
      {editing ? (
        <CellEditor
          classId={classId}
          className={className}
          dayOfWeek={editing.day_of_week}
          dayName={DAYS.find((d) => d.n === editing.day_of_week)?.kh ?? ""}
          period={periods.find((p) => p.id === editing.period_id)!}
          currentCell={editingCell}
          assignableSubjects={assignableSubjects}
          onClose={() => setEditing(null)}
        />
      ) : null}
    </div>
  );
}