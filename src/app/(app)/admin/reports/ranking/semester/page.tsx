import { connection } from "next/server";
import { AppShell } from "@/components/app-shell";
import {
  listAcademicYears,
  getCurrentAcademicYear,
} from "@/lib/admin/academic-years/queries";
import { listClassOptions } from "@/lib/admin/teacher-assignments/queries";
import { listTermMonthsForYear } from "@/lib/teacher/scores-queries";
import { getSchoolSettings } from "@/lib/admin/school/queries";
import { fetchSemesterRanking } from "@/lib/admin/reports/ranking";
import { RankingReportView } from "@/components/print/ranking-report-view";
import { PrintButton } from "@/components/print/print-button";

export const instant = false;

export default async function SemesterRankingPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; class?: string; term?: number }>;
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
      <AppShell title="ចំណាត់ថ្នាក់ប្រចាំឆមាស" backHref="/admin/reports/ranking">
        <p className="text-muted text-sm">សូមបង្កើតឆ្នាំសិក្សាជាមុន។</p>
      </AppShell>
    );
  }

  const [classes, termGroups] = await Promise.all([
    listClassOptions(activeYear.id),
    listTermMonthsForYear(activeYear.id),
  ]);

  const activeClass =
    (sp.class && classes.find((c) => c.id === sp.class)) || classes[0] || null;
  const activeTermNumber = sp.term ?? 1;
  const activeTermGroup =
    termGroups.find((t) => t.term_number === activeTermNumber) ?? termGroups[0];

  // Fetch term id from a separate call
  let report = null;
  if (activeClass && activeTermGroup) {
    // We need the academic_term id — it's stored in term_months.academic_term_id
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data } = await supabase
      .from("academic_terms")
      .select("id")
      .eq("academic_year_id", activeYear.id)
      .eq("term_number", activeTermNumber)
      .maybeSingle();
    if (data?.id) {
      report = await fetchSemesterRanking(activeClass.id, data.id);
    }
  }

  return (
    <AppShell title="ចំណាត់ថ្នាក់ប្រចាំឆមាស" backHref="/admin/reports/ranking">
      <form
        method="get"
        action="/admin/reports/ranking/semester"
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
            ឆមាស
          </label>
          <select
            name="term"
            defaultValue={String(activeTermNumber)}
            className="rounded-btn border-border bg-surface w-full border px-3 py-2 text-sm"
          >
            {termGroups.map((t) => (
              <option key={t.term_number} value={t.term_number}>
                {t.term_name_kh}
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

      {!report ? (
        <div className="rounded-card border border-dashed border-border bg-surface p-6 text-center print:hidden">
          <p className="text-muted text-sm">សូមជ្រើសរើសថ្នាក់ និងឆមាស។</p>
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