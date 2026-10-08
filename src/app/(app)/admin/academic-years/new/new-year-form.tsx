"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  createAcademicYearAction,
  type ActionResult,
} from "@/lib/admin/academic-years/actions";

export function NewYearForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<
    ActionResult | null,
    FormData
  >(createAcademicYearAction, null);

  useEffect(() => {
    if (state?.ok) {
      router.push("/admin/academic-years");
      router.refresh();
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-4">
      {/* same input field as before, unchanged */}
      <div>
        <label
          htmlFor="year_name"
          className="text-fg mb-1 block text-sm font-medium"
        >
          ឈ្មោះឆ្នាំសិក្សា
        </label>
        <input
          id="year_name"
          name="year_name"
          type="text"
          inputMode="numeric"
          placeholder="2027-2028"
          pattern="\d{4}-\d{4}"
          required
          autoComplete="off"
          className="rounded-btn border-border bg-surface w-full border px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
        <p className="text-muted mt-1 text-xs">
          ទម្រង់៖ YYYY-YYYY ឧទាហរណ៍ 2027-2028
        </p>
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
        {pending ? "កំពុងបង្កើត..." : "បង្កើត"}
      </button>
    </form>
  );
}