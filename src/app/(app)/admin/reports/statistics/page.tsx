import { connection } from "next/server";
import { getCurrentAcademicYear } from "@/lib/admin/academic-years/queries";
import { fetchSchoolStatistics } from "@/lib/admin/reports/statistics";
import { StatisticsDashboard } from "./statistics-dashboard";
import { PrintButton } from "@/components/print/print-button";
import { SchoolReportHeader } from "@/components/print/school-report-header";
import { getSchoolSettings } from "@/lib/admin/school/queries";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Card } from "@/components/ui/card";

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
      <div className="space-y-6">
        <PageHeader title="ស្ថិតិសាលា" description="ទិដ្ឋភាពទូទៅនៃសិស្ស គ្រូ និងលទ្ធផលសិក្សា" />
        <EmptyState title="មិនទាន់មានទិន្នន័យ" description="សូមបង្កើតឆ្នាំសិក្សាជាមុនសិន។" />
      </div>
    );
  }

  const data = await fetchSchoolStatistics(year.id);

  if (!data) {
    return (
      <div className="space-y-6">
        <PageHeader title="ស្ថិតិសាលា" description="ទិដ្ឋភាពទូទៅនៃសិស្ស គ្រូ និងលទ្ធផលសិក្សា" />
        <EmptyState title="មិនមានទិន្នន័យ" description="មិនអាចទាញយកទិន្នន័យស្ថិតិបានទេ។" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Screen Header (Hidden on Print) */}
      <div className="print:hidden">
        <PageHeader 
          title="ស្ថិតិសាលា" 
          description={`ទិដ្ឋភាពទូទៅសម្រាប់ឆ្នាំសិក្សា ${year.year_name}`} 
        />
      </div>

      {/* Official Print Header (Hidden on Screen) */}
      <div className="hidden print:block mb-6">
        <SchoolReportHeader
          settings={settings}
          academicYearName={year.year_name}
          title="របាយការណ៍ស្ថិតិសាលា"
          subtitle=""
        />
      </div>

      {/* Dashboard Content */}
      <Card className="p-4 md:p-6 border-slate-200 shadow-sm print:shadow-none print:border-none print:p-0">
        <StatisticsDashboard data={data} />
      </Card>

      {/* Print Button */}
      <div className="print:hidden pt-4">
        <PrintButton />
      </div>
    </div>
  );
}