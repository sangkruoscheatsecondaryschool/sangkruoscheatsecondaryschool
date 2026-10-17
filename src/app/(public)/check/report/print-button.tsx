"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="touch-target rounded-btn border-border bg-surface flex w-full items-center justify-center gap-2 border px-4 py-3 text-sm font-medium active:bg-slate-50"
    >
      🖨️ បោះពុម្ព / រក្សាទុកជា PDF
    </button>
  );
}