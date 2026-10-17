"use client";

import { clearReportAction } from "../actions";

export function ReportActions() {
  return (
    <form action={clearReportAction} className="flex items-center gap-1">
      <button
        type="submit"
        className="touch-target rounded-btn text-brand-700 px-2 text-xs active:bg-brand-50"
      >
        ស្វែងរកថ្មី
      </button>
    </form>
  );
}