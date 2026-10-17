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

  const editingCell = editing
    ? cellMap.get(`${editing.day_of_week}-${editing.period_id}`) ?? null
    : null;

  return (
    <div className="space-y-4">
      {/* Desktop grid */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr>
              <th className="border-border bg-bg sticky left-0 z-10 border p-2 text-left">
                ម៉ោង
              </th>
              {DAYS.map((d) => (
                <th
                  key={d.n}
                  className="border-border bg-bg border p-2 text-center font-medium"
                >
                  {d.kh}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {periods.map((p) => (
              <tr key={p.id}>
                <td className="border-border bg-bg sticky left-0 z-10 border p-2 align-top">
                  <p className="text-xs font-medium">
                    ម៉ោងទី {p.period_number}
                  </p>
                  <p className="text-muted text-[10px] tabular-nums">
                    {p.start_time.slice(0, 5)}–{p.end_time.slice(0, 5)}
                  </p>
                </td>
                {DAYS.map((d) => {
                  const cell = cellMap.get(`${d.n}-${p.id}`);
                  return (
                    <td
                      key={d.n}
                      className="border-border border p-0 align-top"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setEditing({
                            day_of_week: d.n,
                            period_id: p.id,
                          })
                        }
                        className="hover:bg-brand-50 flex h-full min-h-16 w-full flex-col items-start gap-0.5 p-2 text-left active:bg-brand-100"
                      >
                        {cell ? (
                          <>
                            <span className="text-xs font-medium">
                              {cell.subject_name}
                            </span>
                            <span className="text-muted text-[10px]">
                              {cell.teacher_name_kh}
                            </span>
                          </>
                        ) : (
                          <span className="text-muted text-[10px]">—</span>
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
      <div className="space-y-4 md:hidden">
        {DAYS.map((d) => (
          <section key={d.n}>
            <h3 className="font-moul text-muted mb-2 text-sm">
              ថ្ងៃ{d.kh}
            </h3>
            <ul className="space-y-1.5">
              {periods.map((p) => {
                const cell = cellMap.get(`${d.n}-${p.id}`);
                return (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() =>
                        setEditing({
                          day_of_week: d.n,
                          period_id: p.id,
                        })
                      }
                      className="rounded-btn border-border bg-surface flex w-full items-center gap-3 border p-2.5 text-left active:bg-slate-50"
                    >
                      <span className="text-muted shrink-0 text-[10px] tabular-nums">
                        ម៉ោងទី {p.period_number}
                        <br />
                        {p.start_time.slice(0, 5)}
                      </span>
                      <span className="min-w-0 flex-1">
                        {cell ? (
                          <>
                            <p className="truncate text-sm">
                              {cell.subject_name}
                            </p>
                            <p className="text-muted truncate text-xs">
                              {cell.teacher_name_kh}
                            </p>
                          </>
                        ) : (
                          <span className="text-muted text-xs">
                            — មិនទាន់កំណត់ —
                          </span>
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      {/* Cell editor sheet */}
      {editing ? (
        <CellEditor
          classId={classId}
          className={className}
          dayOfWeek={editing.day_of_week}
          dayName={
            DAYS.find((d) => d.n === editing.day_of_week)?.kh ?? ""
          }
          period={periods.find((p) => p.id === editing.period_id)!}
          currentCell={editingCell}
          assignableSubjects={assignableSubjects}
          onClose={() => setEditing(null)}
        />
      ) : null}
    </div>
  );
}