import Link from "next/link";
import { connection } from "next/server";
import { AppShell } from "@/components/app-shell";
import {
  listAcademicYears,
  getCurrentAcademicYear,
} from "@/lib/admin/academic-years/queries";
import { listClassOptions } from "@/lib/admin/teacher-assignments/queries";
import { listTermMonthsForYear } from "@/lib/teacher/scores-queries";
import { getSchoolSettings } from "@/lib/admin/school/queries";
import { fetchMonthlyRanking } from "@/lib/admin/reports/ranking";
import { RankingReportView } from "@/components/print/ranking-report-view";
import { PrintButton } from "@/components/print/print-button";

export const instant = false;

export default async function MonthlyRankingPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; class?: string; month?: string }>;
}) {
  await connection();

  const sp = await searchParams;
  const [years, current, settings] = await Promise.all([
    listAcademicYears(),
    getCurrentAcademicYear(),
    getSchoolSettings(),
  ]);

  const activeYear = (sp.year && years.find((y) => y.id === sp.year)) || current || years[0];
  if (!activeYear || !settings) {
    return (
      <AppShell title="ចំណាត់ថ្នាក់ប្រចាំខែ" backHref="/admin/reports/ranking">
        <p className="text-muted text-sm">សូមបង្កើតឆ្នាំសិក្សាជាមុន។</p>
      </AppShell>
    );
  }

  const [classes, terms] = await Promise.all([
    listClassOptions(activeYear.id),
    listTermMonthsForYear(activeYear.id),
  ]);
  const allMonths = terms.flatMap((t) =>
    t.months.map((m) => ({ ...m, term_name: t.term_name_kh })),
  );

  const activeClass =
    (sp.class && classes.find((c) => c.id === sp.class)) || classes[0] || null;
  const activeMonth =
    (sp.month && allMonths.find((m) => m.id === sp.month)) || allMonths[0] || null;

  const report = activeClass && activeMonth
    ? await fetchMonthlyRanking(activeClass.id, activeMonth.id)
    : null;

  return (
    <AppShell title="ចំណាត់ថ្នាក់ប្រចាំខែ" backHref="/admin/reports/ranking">
      <Filters
        baseUrl="/admin/reports/ranking/monthly"
        yearId={activeYear.id}
        classId={activeClass?.id ?? ""}
        monthId={activeMonth?.id ?? ""}
        classes={classes}
        months={allMonths}
        years={years}
      />

      {!report ? (
        <div className="rounded-card border border-dashed border-border bg-surface p-6 text-center print:hidden">
          <p className="text-muted text-sm">សូមជ្រើសរើសថ្នាក់ និងខែ។</p>
        </div>
      ) : (
        <>
          <div className="rounded-card border-border bg-white border p-4 print:border-0 print:p-0">
            <RankingReportView report={report} settings={settings} />
          </div>
          <div className="mt-4 print:hidden">
            <PrintButton />
          </div>
        </>
      )}
    </AppShell>
  );
}

// -----------------------------------------------------------------
// Filters — a tiny server component; navigation happens via GET form
// -----------------------------------------------------------------
import type { AdminUnit } from "@/lib/admin/students/address-queries";

function Filters({
  baseUrl,
  yearId,
  classId,
  monthId,
  classes,
  months,
  years,
}: {
  baseUrl: string;
  yearId: string;
  classId: string;
  monthId: string;
  classes: { id: string; class_name: string; grade_level: number }[];
  months: { id: string; month_name_kh: string; term_name: string; is_semester_exam: boolean }[];
  years: { id: string; year_name: string }[];
}) {
  return (
    <form
      method="get"
      action={baseUrl}
      className="rounded-card border-border bg-surface mb-4 space-y-2 border p-3 print:hidden"
    >
      <div>
        <label className="text-muted mb-1 block text-[10px] uppercase">
          ឆ្នាំសិក្សា
        </label>
        <select
          name="year"
          defaultValue={yearId}
          className="rounded-btn border-border bg-surface w-full border px-3 py-2 text-sm"
        >
          {years.map((y) => (
            <option key={y.id} value={y.id}>
              {y.year_name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-muted mb-1 block text-[10px] uppercase">
          ថ្នាក់
        </label>
        <select
          name="class"
          defaultValue={classId}
          className="rounded-btn border-border bg-surface w-full border px-3 py-2 text-sm"
        >
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              ថ្នាក់ទី {c.grade_level} · {c.class_name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-muted mb-1 block text-[10px] uppercase">
          ខែ
        </label>
        <select
          name="month"
          defaultValue={monthId}
          className="rounded-btn border-border bg-surface w-full border px-3 py-2 text-sm"
        >
          {months.map((m) => (
            <option key={m.id} value={m.id}>
              {m.term_name} · {m.month_name_kh}
              {m.is_semester_exam ? " · ប្រឡង" : ""}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="touch-target rounded-btn bg-brand-600 w-full px-4 py-2 text-sm font-medium text-white active:bg-brand-700"
      >
        បង្ហាញ
      </button>
    </form>
  );
}