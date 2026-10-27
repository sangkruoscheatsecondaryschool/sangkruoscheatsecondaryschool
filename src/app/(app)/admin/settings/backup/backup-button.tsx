"use client";

import { useTransition, useState } from "react";
import { runBackupAction } from "@/lib/admin/backup/actions";
import type { ActionResult } from "@/lib/actions/types";

export function BackupButton() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionResult | null>(null);

  const handleBackup = () => {
    setResult(null);
    startTransition(async () => {
      const res = await runBackupAction();
      setResult(res);
    });
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleBackup}
        disabled={isPending}
        className="touch-target rounded-btn bg-brand-600 w-full px-4 py-3 font-medium text-white active:bg-brand-700 disabled:opacity-60"
      >
        {isPending ? "កំពុងបម្រុងទុក..." : "បម្រុងទុកឥឡូវនេះ"}
      </button>

      {result && !result.ok ? (
        <div className="rounded-btn border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {result.error}
        </div>
      ) : null}

      {result && result.ok ? (
        <div className="rounded-btn border border-green-200 bg-green-50 p-3 text-sm text-green-800">
          បានបម្រុងទុកទិន្នន័យដោយជោគជ័យ!
        </div>
      ) : null}
    </div>
  );
}