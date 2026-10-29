"use client";

import { useActionState } from "react";
import { Search } from "lucide-react";
import { checkReportAction, type CheckState } from "./actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function CheckForm() {
  const [state, action, pending] = useActionState<CheckState, FormData>(checkReportAction, null);

  return (
    <form action={action} className="space-y-5">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700">លេខកូដសិស្ស</label>
        <Input
          name="student_code"
          type="text"
          inputMode="text"
          autoComplete="off"
          autoCapitalize="characters"
          required
          maxLength={30}
          placeholder="ឧទាហរណ៍៖ 1234"
          className="font-inter uppercase text-lg"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700">ថ្ងៃខែឆ្នាំកំណើត</label>
        <Input
          name="dob"
          type="date"
          required
          max={new Date().toISOString().slice(0, 10)}
          className="font-inter text-lg"
        />
      </div>

      {state?.error ? (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {state.error}
        </div>
      ) : null}

      <Button type="submit" disabled={pending} size="lg" className="w-full gap-2 mt-2 shadow-md">
        <Search className="h-5 w-5" />
        {pending ? "កំពុងស្វែងរក..." : "បង្ហាញលទ្ធផល"}
      </Button>
    </form>
  );
}