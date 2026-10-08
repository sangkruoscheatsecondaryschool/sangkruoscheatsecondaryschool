import Link from "next/link";
import type { AcademicYear } from "@/lib/admin/academic-years/queries";

export function YearSwitcher({
  years,
  activeYearId,
}: {
  years: AcademicYear[];
  activeYearId: string | null;
}) {
  if (years.length === 0) return null;

  return (
    <div className="-mx-1 mb-4 flex gap-1 overflow-x-auto pb-1">
      {years.map((y) => {
        const active = y.id === activeYearId;
        return (
          <Link
            key={y.id}
            href={`/admin/classes?year=${y.id}`}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              active
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-border bg-surface text-fg active:bg-slate-50"
            }`}
          >
            {y.year_name}
            {y.is_current ? " •" : ""}
          </Link>
        );
      })}
    </div>
  );
}