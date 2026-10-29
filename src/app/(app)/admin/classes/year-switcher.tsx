import Link from "next/link";
import type { AcademicYear } from "@/lib/admin/academic-years/queries";

export function YearSwitcher({
  years,
  activeYearId,
  basePath,
}: {
  years: AcademicYear[];
  activeYearId: string | null;
  basePath: string;
}) {
  if (years.length === 0) return null;

  return (
    <div className="-mx-1 mb-4 flex gap-2 overflow-x-auto pb-1">
      {years.map((y) => {
        const active = y.id === activeYearId;
        return (
          <Link
            key={y.id}
            href={`${basePath}?year=${y.id}`}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
              active
                ? "border-primary-600 bg-primary-600 text-white shadow-sm"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
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