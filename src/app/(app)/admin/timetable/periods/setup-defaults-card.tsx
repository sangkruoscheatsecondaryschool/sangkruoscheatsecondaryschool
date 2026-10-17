"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ActionResult } from "@/lib/actions/types";
import { setupDefaultPeriodsAction } from "@/lib/admin/timetable/actions";

export function SetupDefaultsCard({ yearId }: { yearId: string }) {
  const router = useRouter();
  const [state, action, pending] = useActionState<
    ActionResult | null,
    FormData
  >(setupDefaultPeriodsAction, null);

  useEffect(() => {
    if (state?.ok) router.refresh();
  }, [state, router]);

  return (
    <div className="rounded-card border-border bg-surface border p-6">
      <p className="font-moul text-base">រៀបចំម៉ោងស្តង់ដារ</p>
      <p className="text-muted mt-2 text-sm">
        បង្កើតម៉ោងបង្រៀន ៨ ម៉ោងស្តង់ដារ (07:00–05:00)។ អ្នកអាចកែប្រែនៅពេលក្រោយ។
      </p>

      {state && !state.ok ? (
        <div className="rounded-btn mt-3 border border-red-200 bg-red-50 p-2 text-xs text-red-700">
          {state.error}
        </div>
      ) : null}

      <form action={action} className="mt-4">
        <input type="hidden" name="year_id" value={yearId} />
        <button
          type="submit"
          disabled={pending}
          className="touch-target rounded-btn bg-brand-600 w-full px-4 py-3 font-medium text-white active:bg-brand-700 disabled:opacity-60"
        >
          {pending ? "កំពុងបង្កើត..." : "បង្កើតម៉ោងស្តង់ដារ"}
        </button>
      </form>
    </div>
  );
}