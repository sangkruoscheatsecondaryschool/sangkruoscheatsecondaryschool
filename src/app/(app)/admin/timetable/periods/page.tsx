import Link from "next/link";
import { connection } from "next/server";
import { AppShell } from "@/components/app-shell";
import {
  listAcademicYears,
  getCurrentAcademicYear,
} from "@/lib/admin/academic-years/queries";
import { listPeriods } from "@/lib/admin/timetable/queries";
import { YearSwitcher } from "../../classes/year-switcher";
import { PeriodList } from "./period-list";
import { NewPeriodForm } from "./new-period-form";
import { SetupDefaultsCard } from "./setup-defaults-card";

export const instant = false;

export const metadata = { title: "កំណត់ម៉ោងបង្រៀន" };

export default async function PeriodsPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string }>;
}) {
  await connection();

  const sp = await searchParams;
  const [years, current] = await Promise.all([
    listAcademicYears(),
    getCurrentAcademicYear(),
  ]);

  const requested = sp.year ? years.find((y) => y.id === sp.year) : null;
  const activeYear = requested ?? current ?? years[0] ?? null;

  if (!activeYear) {
    return (
      <AppShell title="កំណត់ម៉ោងបង្រៀន" backHref="/admin">
        <p className="text-muted text-sm">សូមបង្កើតឆ្នាំសិក្សាជាមុនសិន។</p>
      </AppShell>
    );
  }

  const periods = await listPeriods(activeYear.id);

  return (
    <AppShell title="កំណត់ម៉ោងបង្រៀន" backHref="/admin">
      <YearSwitcher years={years} activeYearId={activeYear.id} basePath="/admin/timetable/periods" />

      <div className="mb-4 flex gap-2">
        <Link
          href={`/admin/timetable?year=${activeYear.id}`}
          className="touch-target rounded-btn border-border bg-surface flex flex-1 items-center justify-center border px-4 text-sm active:bg-slate-50"
        >
          ← ត្រឡប់ទៅតារាងកាលវិភាគ
        </Link>
      </div>

      {periods.length === 0 ? (
        <SetupDefaultsCard yearId={activeYear.id} />
      ) : (
        <>
          <PeriodList periods={periods} />
          <div className="mt-6">
            <NewPeriodForm
              yearId={activeYear.id}
              nextNumber={
                Math.max(...periods.map((p) => p.period_number)) + 1
              }
            />
          </div>
        </>
      )}
    </AppShell>
  );
}