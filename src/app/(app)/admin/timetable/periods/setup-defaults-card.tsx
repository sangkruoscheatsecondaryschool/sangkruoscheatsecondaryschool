"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Wand2 } from "lucide-react";
import type { ActionResult } from "@/lib/actions/types";
import { setupDefaultPeriodsAction } from "@/lib/admin/timetable/actions";
import { Button } from "@/components/ui/button";

export function SetupDefaultsCard({ yearId }: { yearId: string }) {
  const router = useRouter();
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(setupDefaultPeriodsAction, null);

  useEffect(() => {
    if (state?.ok) router.refresh();
  }, [state, router]);

  return (
    <div className="text-center space-y-6 py-4">
      <div className="mx-auto w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center">
        <Wand2 className="h-8 w-8" />
      </div>
      <div>
        <h3 className="font-moul text-lg text-slate-900">រៀបចំម៉ោងស្តង់ដារ</h3>
        <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto">
          បង្កើតម៉ោងបង្រៀន ៨ ម៉ោងស្តង់ដារ (07:00–05:00)។ អ្នកអាចកែប្រែម៉ោងនីមួយៗនៅពេលក្រោយ។
        </p>
      </div>

      {state && !state.ok && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 text-left">
          {state.error}
        </div>
      )}

      <form action={action}>
        <input type="hidden" name="year_id" value={yearId} />
        <Button type="submit" disabled={pending} size="lg" className="w-full sm:w-auto px-8">
          {pending ? "កំពុងបង្កើត..." : "បង្កើតម៉ោងស្តង់ដារ"}
        </Button>
      </form>
    </div>
  );
}