import Link from "next/link";
import type { ClassOption } from "@/lib/admin/teacher-assignments/queries";

export function ClassSwitcher({
  classes,
  activeClassId,
  yearId,
}: {
  classes: ClassOption[];
  activeClassId: string;
  yearId: string;
}) {
  if (classes.length === 0) return null;

  return (
    <div className="-mx-1 mb-4 flex gap-2 overflow-x-auto pb-1">
      {classes.map((c) => {
        const active = c.id === activeClassId;
        return (
          <Link
            key={c.id}
            href={`/admin/timetable?year=${yearId}&class=${c.id}`}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
              active
                ? "border-primary-600 bg-primary-600 text-white shadow-sm"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {c.class_name}
          </Link>
        );
      })}
    </div>
  );
}