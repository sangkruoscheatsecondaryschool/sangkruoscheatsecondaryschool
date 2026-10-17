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
    <div className="-mx-1 mb-4 flex gap-1 overflow-x-auto pb-1">
      {classes.map((c) => {
        const active = c.id === activeClassId;
        return (
          <Link
            key={c.id}
            href={`/admin/timetable?year=${yearId}&class=${c.id}`}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              active
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-border bg-surface text-fg active:bg-slate-50"
            }`}
          >
            {c.class_name}
          </Link>
        );
      })}
    </div>
  );
}