import Link from "next/link";
import { connection } from "next/server";
import { ArrowLeft } from "lucide-react";
import { getCurrentAcademicYear } from "@/lib/admin/academic-years/queries";
import { listClassOptions } from "@/lib/admin/teacher-assignments/queries";
import { getSchoolSettings } from "@/lib/admin/school/queries";
import { fetchClassTimetable } from "@/lib/admin/reports/timetable";
import { TimetableReportView } from "@/components/print/timetable-report-view";
import { PrintButton } from "@/components/print/print-button";
import { EmptyState } from "@/components/ui/empty-state";

export const instant = false;
export const metadata = { title: "គ្រប់ថ្នាក់ទាំងអស់" };

export default async function AllTimetablesReportPage() {
  await connection();
  const [year, settings] = await Promise.all([
    getCurrentAcademicYear(),
    getSchoolSettings(),
  ]);

  if (!year || !settings) {
    return (
      <div className="space-y-6">
        <Link href="/admin/reports/timetable" className="inline-flex items-center text-sm text-slate-500 hover:text-primary-600 mb-2"><ArrowLeft className="h-4 w-4 mr-1" /> ត្រឡប់ក្រោយ</Link>
        <EmptyState title="មិនទាន់មានទិន្នន័យ" description="សូមកំណត់ឆ្នាំបច្ចុប្បន្នជាមុនសិន។" />
      </div>
    );
  }

  const classes = await listClassOptions(year.id);
  const grids = (await Promise.all(classes.map((c) => fetchClassTimetable(c.id)))).filter((g): g is NonNullable<typeof g> => g !== null);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <Link href="/admin/reports/timetable" className="inline-flex items-center text-sm text-slate-500 hover:text-primary-600 mb-2 print:hidden">
        <ArrowLeft className="h-4 w-4 mr-1" /> ត្រឡប់ក្រោយ
      </Link>

      <div className="space-y-8 print:space-y-0">
        {grids.length === 0 ? (
          <EmptyState title="រកមិនឃើញទិន្នន័យ" description="មិនមានតារាងម៉ោងសម្រាប់ឆ្នាំនេះទេ។" />
        ) : (
          grids.map((grid) => (
            <div key={grid.class_name} className="print-page-break print:break-after-page">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 md:p-8 print:p-0 print:border-none print:shadow-none">
                <TimetableReportView grid={grid} settings={settings} mode="class" />
              </div>
            </div>
          ))
        )}
      </div>

      <div className="print:hidden">
        <PrintButton />
      </div>
    </div>
  );
}