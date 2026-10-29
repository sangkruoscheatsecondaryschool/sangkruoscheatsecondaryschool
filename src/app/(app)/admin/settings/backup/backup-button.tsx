"use client";

import { useTransition, useState } from "react";
import { Database, CheckCircle2, AlertCircle } from "lucide-react";
import { runBackupAction } from "@/lib/admin/backup/actions";
import type { ActionResult } from "@/lib/actions/types";
import { Button } from "@/components/ui/button";

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
    <div className="space-y-4">
      <Button
        onClick={handleBackup}
        disabled={isPending}
        size="lg"
        className="w-full gap-2 shadow-sm"
      >
        <Database className="h-5 w-5" />
        {isPending ? "កំពុងបម្រុងទុក..." : "បម្រុងទុកឥឡូវនេះ"}
      </Button>

      {result && !result.ok && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 shrink-0" />
          {result.error}
        </div>
      )}

      {result && result.ok && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
          បានបម្រុងទុកទិន្នន័យដោយជោគជ័យ!
        </div>
      )}
    </div>
  );
}