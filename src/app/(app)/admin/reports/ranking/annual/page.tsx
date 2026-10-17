import { connection } from "next/server";
import { AppShell } from "@/components/app-shell";
import {
  listAcademicYears,
  getCurrentAcademicYear,
} from "@/lib/admin/academic-years/queries";
import { listClassOptions } from "@/lib/admin/teacher-assignments/queries";
import { getSchoolSettings } from "@/lib/admin/school/queries";
import { fetchAnnualRanking } from "@/lib/admin/reports/ranking";
import { RankingReportView } from "@/components/print/ranking-report-view";
import { PrintButton } from "@/components/print/print-button";

export const instant = false;

export default async function AnnualRankingPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; class?: string; layout?: string }>;
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
      <AppShell title="ចំណាត់ថ្នាក់ប្រចាំឆ្នាំ" backHref="/admin/reports/ranking">
        <p className="text-muted text-sm">សូមបង្កើតឆ្នាំសិក្សាជាមុន។</p>
      </AppShell>
    );
  }

  const classes = await listClassOptions(activeYear.id);
  const activeClass =
    (sp.class && classes.find((c) => c.id === sp.class)) || classes[0] || null;
  const layout: "compact" | "wide" = sp.layout === "wide" ? "wide" : "compact";

  const report = activeClass
    ? await fetchAnnualRanking(activeClass.id, activeYear.id, layout)
    : null;

  return (
    <AppShell title="ចំណាត់ថ្នាក់ប្រចាំឆ្នាំ" backHref="/admin/reports/ranking">
      <form
        method="get"
        action="/admin/reports/ranking/annual"
        className="rounded-card border-border bg-surface mb-4 space-y-2 border p-3 print:hidden"
      >
        <input type="hidden" name="year" value={activeYear.id} />

        <div>
          <label className="text-muted mb-1 block text-[10px] uppercase">
            ថ្នាក់
          </label>
          <select
            name="class"
            defaultValue={activeClass?.id ?? ""}
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
            ទម្រង់
          </label>
          <select
            name="layout"
            defaultValue={layout}
            className="rounded-btn border-border bg-surface w-full border px-3 py-2 text-sm"
          >
            <option value="compact">សង្ខេប</option>
            <option value="wide">លម្អិត (បង្ហាញខែ)</option>
          </select>
        </div>

        <button
          type="submit"
          className="touch-target rounded-btn bg-brand-600 w-full px-4 py-2 text-sm font-medium text-white active:bg-brand-700"
        >
          បង្ហាញ
        </button>
      </form>

      {!report ? (
        <div className="rounded-card border border-dashed border-border bg-surface p-6 text-center print:hidden">
          <p className="text-muted text-sm">សូមជ្រើសរើសថ្នាក់។</p>
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