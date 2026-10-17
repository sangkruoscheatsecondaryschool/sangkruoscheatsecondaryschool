"use client";

import { useActionState } from "react";
import { checkReportAction, type CheckState } from "./actions";

export function CheckForm() {
  const [state, action, pending] = useActionState<CheckState, FormData>(
    checkReportAction,
    null,
  );

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="text-fg mb-1 block text-sm font-medium">
          លេខកូដសិស្ស
        </label>
        <input
          name="student_code"
          type="text"
          inputMode="text"
          autoComplete="off"
          autoCapitalize="characters"
          required
          maxLength={30}
          placeholder="S001"
          className="rounded-btn border-border bg-surface w-full border px-3 py-2.5 font-mono uppercase outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
      </div>

      <div>
        <label className="text-fg mb-1 block text-sm font-medium">
          ថ្ងៃខែឆ្នាំកំណើត
        </label>
        <input
          name="dob"
          type="date"
          required
          max={new Date().toISOString().slice(0, 10)}
          className="rounded-btn border-border bg-surface w-full border px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
      </div>

      {state?.error ? (
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
        {pending ? "កំពុងស្វែងរក..." : "បង្ហាញលទ្ធផល"}
      </button>
    </form>
  );
}