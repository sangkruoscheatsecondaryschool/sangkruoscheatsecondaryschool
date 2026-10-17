import { notFound } from "next/navigation";
import { connection } from "next/server";
import { AppShell } from "@/components/app-shell";
import { getSchoolSettings } from "@/lib/admin/school/queries";
import { fetchTeacherTimetable } from "@/lib/admin/reports/timetable";
import { TimetableReportView } from "@/components/print/timetable-report-view";
import { PrintButton } from "@/components/print/print-button";

export const instant = false;

export default async function TeacherTimetableReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();
  const { id } = await params;

  const [grid, settings] = await Promise.all([
    fetchTeacherTimetable(id),
    getSchoolSettings(),
  ]);

  if (!grid || !settings) notFound();

  return (
    <AppShell title={`តារាងកាលវិភាគ · ${grid.class_name}`} backHref="/admin/reports/timetable/teacher">
      <div className="rounded-card border-border bg-white border p-4 print:border-0 print:p-0">
        <TimetableReportView grid={grid} settings={settings} mode="teacher" />
      </div>
      <div className="mt-4 print:hidden">
        <PrintButton />
      </div>
    </AppShell>
  );
}