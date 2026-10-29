"use client";

import { useActionState } from "react";
import { Save } from "lucide-react";
import type { ActionResult } from "@/lib/actions/types";
import { createSubjectAction } from "@/lib/admin/subjects/actions";
import { SubjectFields } from "../subject-fields";
import { Button } from "@/components/ui/button";

export function NewSubjectForm() {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(createSubjectAction, null);

  return (
    <form action={action} className="space-y-8">
      <SubjectFields />

      {state && !state.ok && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <div className="sticky bottom-16 md:bottom-0 -mx-6 -mb-6 md:-mx-8 md:-mb-8 p-4 bg-white/90 backdrop-blur-md border-t border-slate-200 flex justify-end gap-3 rounded-b-2xl z-40">
        <Button type="submit" disabled={pending} size="lg" className="w-full sm:w-auto gap-2 shadow-lg">
          <Save className="h-5 w-5" />
          {pending ? "កំពុងបង្កើត..." : "បង្កើតមុខវិជ្ជា"}
        </Button>
      </div>
    </form>
  );
}