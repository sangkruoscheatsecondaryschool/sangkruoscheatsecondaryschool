import { connection } from "next/server";
import { AppShell } from "@/components/app-shell";
import { getCurrentAcademicYear } from "@/lib/admin/academic-years/queries";
import { listClassOptions } from "@/lib/admin/teacher-assignments/queries";
import { getSchoolSettings } from "@/lib/admin/school/queries";
import { fetchClassTimetable } from "@/lib/admin/reports/timetable";
import { TimetableReportView } from "@/components/print/timetable-report-view";
import { PrintButton } from "@/components/print/print-button";

export const instant = false;

export default async function AllTimetablesReportPage() {
  await connection();
  const [year, settings] = await Promise.all([
    getCurrentAcademicYear(),
    getSchoolSettings(),
  ]);

  if (!year || !settings) return <AppShell title="គ្រប់ថ្នាក់"><p>មិនមានឆ្នាំសិក្សាទេ</p></AppShell>;

  const classes = await listClassOptions(year.id);
  
  // Fetch all grids (Promise.all)
  const grids = (
    await Promise.all(classes.map((c) => fetchClassTimetable(c.id)))
  ).filter((g): g is NonNullable<typeof g> => g !== null);

  return (
    <AppShell title="គ្រប់ថ្នាក់ទាំងអស់" backHref="/admin/reports/timetable">
      <div className="space-y-8 print:space-y-0">
        {grids.map((grid, i) => (
          <div
            key={grid.class_name}
            className="rounded-card border-border bg-white border p-4 print:border-0 print:p-0 print-page-break"
          >
            <TimetableReportView grid={grid} settings={settings} mode="class" />
          </div>
        ))}
      </div>
      <div className="mt-4 print:hidden">
        <PrintButton />
      </div>
    </AppShell>
  );
}