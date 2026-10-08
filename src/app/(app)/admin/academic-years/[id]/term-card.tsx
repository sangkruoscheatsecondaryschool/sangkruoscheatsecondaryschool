"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ActionResult } from "@/lib/actions/types";
import type { TermWithMonths } from "@/lib/admin/term-months/queries";
import {
  addTermMonthAction,
  renameTermAction,
} from "@/lib/admin/term-months/actions";
import { KHMER_MONTHS } from "@/lib/admin/term-months/constants";
import { MonthRow } from "./month-row";

export function TermCard({ term }: { term: TermWithMonths }) {
  const router = useRouter();

  const [renameState, renameAction, renamePending] = useActionState<
    ActionResult | null,
    FormData
  >(renameTermAction, null);

  const [addState, addAction, addPending] = useActionState<
    ActionResult | null,
    FormData
  >(addTermMonthAction, null);

  useEffect(() => {
    if (renameState?.ok || addState?.ok) router.refresh();
  }, [renameState, addState, router]);

  const used = new Set(term.months.map((m) => m.month_number));
  const available = KHMER_MONTHS.filter((m) => !used.has(m.number));

  const error =
    (renameState && !renameState.ok ? renameState.error : null) ??
    (addState && !addState.ok ? addState.error : null);

  return (
    <div className="rounded-card border-border bg-surface space-y-3 border p-4">
      {/* Term name form */}
      <form action={renameAction} className="flex gap-2">
        <input type="hidden" name="term_id" value={term.id} />
        <input
          name="term_name_kh"
          type="text"
          defaultValue={term.term_name_kh}
          required
          maxLength={100}
          className="rounded-btn border-border bg-surface font-moul min-w-0 flex-1 border px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
        <button
          type="submit"
          disabled={renamePending}
          className="touch-target rounded-btn border-border bg-surface border px-3 text-xs active:bg-slate-50 disabled:opacity-50"
        >
          {renamePending ? "..." : "រក្សាទុក"}
        </button>
      </form>

      {error ? (
        <div className="rounded-btn border border-red-200 bg-red-50 p-2 text-xs text-red-700">
          {error}
        </div>
      ) : null}

      {/* Months list */}
      {term.months.length === 0 ? (
        <p className="text-muted text-center text-xs">
          មិនមានខែនៅឡើយទេ។ សូមបន្ថែមខែខាងក្រោម។
        </p>
      ) : (
        <ul className="space-y-2">
          {term.months.map((m, i) => (
            <li key={m.id}>
              <MonthRow
                month={m}
                isFirst={i === 0}
                isLast={i === term.months.length - 1}
              />
            </li>
          ))}
        </ul>
      )}

      {/* Add month */}
      {available.length > 0 ? (
        <form action={addAction} className="flex gap-2">
          <input type="hidden" name="term_id" value={term.id} />
          <select
            name="month_number"
            defaultValue={available[0]?.number}
            className="rounded-btn border-border bg-surface min-w-0 flex-1 border px-3 py-2 text-sm"
          >
            {available.map((m) => (
              <option key={m.number} value={m.number}>
                {m.name_kh}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={addPending}
            className="touch-target rounded-btn bg-brand-600 px-4 text-sm font-medium text-white active:bg-brand-700 disabled:opacity-60"
          >
            {addPending ? "..." : "+ បន្ថែម"}
          </button>
        </form>
      ) : (
        <p className="text-muted text-center text-xs">
          ខែទាំង ១២ ត្រូវបានប្រើប្រាស់រួចហើយ។
        </p>
      )}
    </div>
  );
}