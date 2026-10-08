import Link from "next/link";
import { connection } from "next/server";
import { AppShell } from "@/components/app-shell";
import {
  listAcademicYears,
  getCurrentAcademicYear,
} from "@/lib/admin/academic-years/queries";
import { listClassesForYear } from "@/lib/admin/classes/queries";
import { ClassCard } from "./class-card";
import { YearSwitcher } from "./year-switcher";

export const instant = false;

export const metadata = { title: "ថ្នាក់រៀន" };

export default async function ClassesPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string }>;
}) {
  await connection();

  const { year: yearParam } = await searchParams;
  const [years, current] = await Promise.all([
    listAcademicYears(),
    getCurrentAcademicYear(),
  ]);

  const requested = yearParam ? years.find((y) => y.id === yearParam) : null;
  const activeYear = requested ?? current ?? years[0] ?? null;

  const classes = activeYear
    ? await listClassesForYear(activeYear.id)
    : [];

  // Group by grade
  const groups = new Map<number, typeof classes>();
  for (const c of classes) {
    const list = groups.get(c.grade_level) ?? [];
    list.push(c);
    groups.set(c.grade_level, list);
  }

  return (
    <AppShell title="ថ្នាក់រៀន" backHref="/admin">
      <YearSwitcher years={years} activeYearId={activeYear?.id ?? null} />

      {activeYear ? (
        <Link
          href={`/admin/classes/new?year=${activeYear.id}`}
          className="touch-target rounded-btn bg-brand-600 mb-4 flex w-full items-center justify-center px-4 font-medium text-white active:bg-brand-700"
        >
          + បន្ថែមថ្នាក់ថ្មី
        </Link>
      ) : null}

      {!activeYear ? (
        <div className="rounded-card border border-dashed border-border bg-surface p-6 text-center">
          <p className="text-muted text-sm">
            សូមបង្កើតឆ្នាំសិក្សាជាមុនសិន។
          </p>
        </div>
      ) : classes.length === 0 ? (
        <div className="rounded-card border border-dashed border-border bg-surface p-6 text-center">
          <p className="text-muted text-sm">
            មិនមានថ្នាក់រៀនសម្រាប់ឆ្នាំ {activeYear.year_name} នៅឡើយទេ។
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {[7, 8, 9].map((grade) => {
            const list = groups.get(grade) ?? [];
            if (list.length === 0) return null;
            return (
              <section key={grade}>
                <h2 className="font-moul text-muted mb-2 text-sm">
                  ថ្នាក់ទី {grade}
                </h2>
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {list.map((c) => (
                    <li key={`${c.id}-${c.student_count}`}>
                      <ClassCard cls={c} />
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}