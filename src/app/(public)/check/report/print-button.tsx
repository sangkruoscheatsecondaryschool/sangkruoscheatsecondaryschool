"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintButton() {
  return (
    <Button
      type="button"
      onClick={() => window.print()}
      size="lg"
      className="w-full gap-2 shadow-lg"
    >
      <Printer className="h-5 w-5" />
      បោះពុម្ព / ទាញយក PDF
    </Button>
  );
}