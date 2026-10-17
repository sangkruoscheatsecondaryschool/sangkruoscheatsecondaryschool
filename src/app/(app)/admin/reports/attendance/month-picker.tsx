"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function MonthPicker({ initialMonth }: { initialMonth: string }) {
  const router = useRouter();
  const [month, setMonth] = useState(initialMonth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setMonth(val);
    if (val) {
      router.push(`/admin/reports/attendance?month=${val}`);
    }
  };

  return (
    <div className="rounded-card border-border bg-surface mb-4 space-y-3 border p-3 print:hidden">
      <div>
        <label className="text-muted mb-1 block text-xs font-medium uppercase">
          ខែ និង ឆ្នាំ
        </label>
        <input
          type="month"
          value={month}
          onChange={handleChange}
          className="rounded-btn border-border bg-surface w-full border px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
      </div>
    </div>
  );
}