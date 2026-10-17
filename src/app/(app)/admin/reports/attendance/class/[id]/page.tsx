import { notFound } from "next/navigation";
import { connection } from "next/server";
import { AppShell } from "@/components/app-shell";
import { getSchoolSettings } from "@/lib/admin/school/queries";
import { fetchClassAttendanceMonth } from "@/lib/admin/reports/attendance";
import { AttendanceReportView } from "@/components/print/attendance-report-view";
import { PrintButton } from "@/components/print/print-button";

export const instant = false;

export default async function ClassAttendanceReportPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ month?: string }>;
}) {
  await connection();
  const { id } = await params;
  const sp = await searchParams;
  const month = sp.month || new Date().toISOString().slice(0, 7);

  const [report, settings] = await Promise.all([
    fetchClassAttendanceMonth(id, month),
    getSchoolSettings(),
  ]);

  if (!report || !settings) notFound();

  return (
    <AppShell title={`វត្តមាន · ${report.class_name}`} backHref={`/admin/reports/attendance?month=${month}`}>
      <div className="bg-white border border-border rounded-card p-4 overflow-hidden">
        <AttendanceReportView report={report} settings={settings} />
      </div>
      <div className="mt-4 print:hidden">
        <PrintButton />
      </div>
    </AppShell>
  );
}