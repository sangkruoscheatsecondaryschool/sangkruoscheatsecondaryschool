import { connection } from "next/server";
import { AppShell } from "@/components/app-shell";
import { getCurrentAcademicYear } from "@/lib/admin/academic-years/queries";
import { fetchSchoolStatistics } from "@/lib/admin/reports/statistics";
import { StatisticsDashboard } from "./statistics-dashboard";
import { PrintButton } from "@/components/print/print-button";
import { SchoolReportHeader } from "@/components/print/school-report-header";
import { getSchoolSettings } from "@/lib/admin/school/queries";

export const instant = false;
export const metadata = { title: "ស្ថិតិសាលា" };

export default async function StatisticsPage() {
  await connection();

  const [year, settings] = await Promise.all([
    getCurrentAcademicYear(),
    getSchoolSettings(),
  ]);

  if (!year || !settings) {
    return (
      <AppShell title="ស្ថិតិសាលា" backHref="/admin/reports">
        <p className="text-muted text-sm">សូមបង្កើតឆ្នាំសិក្សាជាមុន។</p>
      </AppShell>
    );
  }

  const data = await fetchSchoolStatistics(year.id);

  if (!data) {
    return (
      <AppShell title="ស្ថិតិសាលា" backHref="/admin/reports">
        <p className="text-muted text-sm">មិនមានទិន្នន័យ។</p>
      </AppShell>
    );
  }

  return (
    <AppShell title="ស្ថិតិសាលា" backHref="/admin/reports">
      
      {/* Report Header (Only visible in print) */}
      <div className="hidden print:block mb-6">
        <SchoolReportHeader
          settings={settings}
          academicYearName={year.year_name}
          title="របាយការណ៍ស្ថិតិសាលា"
          subtitle={`ឆ្នាំសិក្សា ${year.year_name}`}
        />
      </div>

      {/* Screen Header */}
      <div className="mb-4 print:hidden">
        <h2 className="font-moul text-lg">ស្ថិតិសាលា · {year.year_name}</h2>
        <p className="text-muted text-sm mt-1">ទិដ្ឋភាពទូទៅនៃសិស្ស គ្រូ និងលទ្ធផលសិក្សា</p>
      </div>

      <div className="rounded-card border-border bg-surface border p-4 print:border-0 print:p-0 print:bg-transparent">
        <StatisticsDashboard data={data} />
      </div>

      <div className="mt-4 print:hidden">
        <PrintButton />
      </div>
    </AppShell>
  );
}