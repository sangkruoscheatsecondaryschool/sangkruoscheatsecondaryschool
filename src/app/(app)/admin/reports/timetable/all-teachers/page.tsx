import Link from "next/link";
import { connection } from "next/server";
import { ArrowLeft } from "lucide-react";
import { getSchoolSettings } from "@/lib/admin/school/queries";
import { fetchAllTeachersTimetable } from "@/lib/admin/reports/timetable";
import { MasterTimetableView } from "@/components/print/master-timetable-view";
import { PrintButton } from "@/components/print/print-button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

export const instant = false;
export const metadata = { title: "តារាងកាលវិភាគគ្រូទាំងអស់" };

export default async function AllTeachersTimetablePage() {
  await connection();
  const [data, settings] = await Promise.all([
    fetchAllTeachersTimetable(),
    getSchoolSettings(),
  ]);

  if (!data || !settings) {
    return (
      <div className="space-y-6">
        <Link href="/admin/reports/timetable" className="inline-flex items-center text-sm text-slate-500 hover:text-primary-600 mb-2"><ArrowLeft className="h-4 w-4 mr-1" /> ត្រឡប់ក្រោយ</Link>
        <EmptyState title="រកមិនឃើញទិន្នន័យ" description="សូមពិនិត្យមូលដ្ឋានទិន្នន័យឡើងវិញ។" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <Link href="/admin/reports/timetable" className="inline-flex items-center text-sm text-slate-500 hover:text-primary-600 mb-2 print:hidden">
        <ArrowLeft className="h-4 w-4 mr-1" /> ត្រឡប់ក្រោយ
      </Link>
      
      <Card className="p-4 md:p-8 print:p-0 print:border-none print:shadow-none overflow-hidden">
        <MasterTimetableView data={data} settings={settings} />
      </Card>
      
      <div className="print:hidden">
        <PrintButton />
      </div>
    </div>
  );
}