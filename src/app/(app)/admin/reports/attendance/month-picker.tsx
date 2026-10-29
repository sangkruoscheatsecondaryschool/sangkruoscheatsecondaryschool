"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Calendar } from "lucide-react";

export function MonthPicker({ initialMonth }: { initialMonth: string }) {
  const router = useRouter();
  const [month, setMonth] = useState(initialMonth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setMonth(val);
    if (val) router.push(`/admin/reports/attendance?month=${val}`);
  };

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-4 max-w-sm">
      <div className="flex items-center gap-2 text-slate-600 font-medium">
        <Calendar className="h-5 w-5" /> ខែ និង ឆ្នាំ
      </div>
      <input
        type="month"
        value={month}
        onChange={handleChange}
        className="flex h-11 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
      />
    </div>
  );
}