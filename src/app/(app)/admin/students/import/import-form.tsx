"use client";

import { useActionState } from "react";
import {
  importStudentsAction,
  type ImportResult,
} from "@/lib/admin/students/import-action";

export function ImportForm({
  yearId,
  yearName,
}: {
  yearId: string;
  yearName: string;
}) {
  const [state, action, pending] = useActionState<ImportResult | null, FormData>(
    importStudentsAction,
    null,
  );

  return (
    <div className="space-y-4">
      <form action={action} className="space-y-3">
        <input type="hidden" name="year_id" value={yearId} />

        <div className="rounded-card border-border bg-surface border p-3 text-sm">
          ឆ្នាំសិក្សា៖ <span className="font-medium">{yearName}</span>
        </div>

        <div>
          <label className="text-fg mb-1 block text-sm font-medium">
            ឯកសារ XLSX
          </label>
          <input
            type="file"
            name="file"
            accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            required
            className="rounded-btn border-border bg-surface w-full border px-3 py-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-brand-600 file:px-3 file:py-1.5 file:text-white"
          />
        </div>

        {state && !state.ok ? (
          <div
            role="alert"
            className="rounded-btn border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {state.error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="touch-target rounded-btn bg-brand-600 w-full px-4 py-3 font-medium text-white active:bg-brand-700 disabled:opacity-60"
        >
          {pending ? "កំពុងនាំចូល..." : "នាំចូល"}
        </button>
      </form>

      {state?.ok ? <ImportReport result={state} /> : null}
    </div>
  );
}

function ImportReport({
  result,
}: {
  result: Extract<ImportResult, { ok: true }>;
}) {
  const { inserted, failed, total, report } = result;
  const hasErrors = failed > 0;

  return (
    <div className="rounded-card border-border bg-surface border p-4">
      <p className="font-moul text-sm">លទ្ធផលនាំចូល</p>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <Stat label="សរុប" value={total} />
        <Stat label="ជោគជ័យ" value={inserted} tone="green" />
        <Stat label="បរាជ័យ" value={failed} tone={failed > 0 ? "red" : "gray"} />
      </div>

      {hasErrors ? (
        <div className="mt-4">
          <p className="text-muted mb-2 text-xs font-medium uppercase">
            ជួរដែលមានបញ្ហា
          </p>
          <ul className="max-h-64 space-y-1 overflow-y-auto">
            {report
              .filter((r) => !r.ok)
              .map((r) => (
                <li
                  key={r.row_index}
                  className="rounded-btn border border-red-200 bg-red-50 p-2 text-xs text-red-700"
                >
                  <span className="font-mono">ជួរទី {r.row_index}</span>
                  {r.student_code ? ` · ${r.student_code}` : ""}
                  {" — "}
                  {r.error ?? "មិនស្គាល់"}
                </li>
              ))}
          </ul>
        </div>
      ) : (
        <p className="text-muted mt-3 text-sm">
          រាល់ជួរត្រូវបាននាំចូលដោយជោគជ័យ។
        </p>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  tone = "gray",
}: {
  label: string;
  value: number;
  tone?: "gray" | "green" | "red";
}) {
  const cls =
    tone === "green"
      ? "border-green-200 bg-green-50 text-green-800"
      : tone === "red"
        ? "border-red-200 bg-red-50 text-red-800"
        : "border-border bg-bg";

  return (
    <div className={`rounded-btn border ${cls} px-2 py-2`}>
      <p className="text-[10px] uppercase">{label}</p>
      <p className="mt-0.5 text-lg font-semibold tabular-nums">{value}</p>
    </div>
  );
}