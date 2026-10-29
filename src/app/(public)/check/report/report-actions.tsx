"use client";

import { Printer } from "lucide-react";
import { clearReportAction } from "../actions";
import { Button } from "@/components/ui/button";

export function ReportActions() {
  return (
    <div className="flex items-center gap-2">
      <form action={clearReportAction}>
        <Button type="submit" variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900 hidden sm:flex">
          ស្វែងរកថ្មី
        </Button>
      </form>
      <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-2 hidden sm:flex">
        <Printer className="h-4 w-4" /> បោះពុម្ព
      </Button>
    </div>
  );
}