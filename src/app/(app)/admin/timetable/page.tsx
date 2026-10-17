import Link from "next/link";
import { connection } from "next/server";
import { AppShell } from "@/components/app-shell";
import {
  listAcademicYears,
  getCurrentAcademicYear,
} from "@/lib/admin/academic-years/queries";
import { listClassOptions } from "@/lib/admin/teacher-assignments/queries";
import {
  listPeriods,
  listTimetableForClass,
  listAssignableSubjects,
} from "@/lib/admin/timetable/queries";
import { YearSwitcher } from "../classes/year-switcher";
import { ClassSwitcher } from "./class-switcher";
import { TimetableGrid } from "./timetable-grid";

export const instant = false;

export const metadata = { title: "តារាងកាលវិភាគ" };

export default async function TimetablePage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; class?: string }>;
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
      <AppShell title="តារាងកាលវិភាគ" backHref="/admin">
        <p className="text-muted text-sm">សូមបង្កើតឆ្នាំសិក្សាជាមុនសិន។</p>
      </AppShell>
    );
  }

  const [classes, periods] = await Promise.all([
    listClassOptions(activeYear.id),
    listPeriods(activeYear.id),
  ]);

  const activeClass =
    (sp.class && classes.find((c) => c.id === sp.class)) ||
    classes[0] ||
    null;

  const cells = activeClass
    ? await listTimetableForClass(activeClass.id)
    : [];
  const assignableSubjects = activeClass
    ? await listAssignableSubjects(activeClass.id)
    : [];

  return (
    <AppShell title="តារាងកាលវិភាគ" backHref="/admin">
      <YearSwitcher years={years} activeYearId={activeYear.id} />

      <div className="mb-4 flex gap-2">
        <Link
          href={`/admin/timetable/periods?year=${activeYear.id}`}
          className="touch-target rounded-btn border-border bg-surface flex flex-1 items-center justify-center border px-4 text-sm active:bg-slate-50"
        >
          ⚙️ កំណត់ម៉ោងបង្រៀន
        </Link>
      </div>

      {periods.length === 0 ? (
        <div className="rounded-card border border-dashed border-border bg-surface p-6 text-center">
          <p className="text-muted text-sm">
            សូមកំណត់ម៉ោងបង្រៀនជាមុនសិន។
          </p>
          <Link
            href={`/admin/timetable/periods?year=${activeYear.id}`}
            className="text-brand-700 mt-3 inline-block text-sm underline-offset-4 hover:underline"
          >
            កំណត់ម៉ោង
          </Link>
        </div>
      ) : classes.length === 0 ? (
        <div className="rounded-card border border-dashed border-border bg-surface p-6 text-center">
          <p className="text-muted text-sm">
            មិនមានថ្នាក់រៀននៅក្នុងឆ្នាំនេះទេ។
          </p>
        </div>
      ) : !activeClass ? (
        <div className="rounded-card border border-dashed border-border bg-surface p-6 text-center">
          <p className="text-muted text-sm">សូមជ្រើសរើសថ្នាក់។</p>
        </div>
      ) : (
        <>
          <ClassSwitcher
            classes={classes}
            activeClassId={activeClass.id}
            yearId={activeYear.id}
          />

          <TimetableGrid
            classId={activeClass.id}
            className={activeClass.class_name}
            periods={periods}
            cells={cells}
            assignableSubjects={assignableSubjects}
          />
        </>
      )}
    </AppShell>
  );
}