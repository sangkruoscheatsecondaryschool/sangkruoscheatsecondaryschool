import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ArrowLeft } from "lucide-react";
import { getSchoolSettings } from "@/lib/admin/school/queries";
import { fetchClassAttendanceMonth } from "@/lib/admin/reports/attendance";
import { AttendanceReportView } from "@/components/print/attendance-report-view";
import { PrintButton } from "@/components/print/print-button";
import { Card } from "@/components/ui/card";

export const instant = false;

export default async function ClassAttendanceReportPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ month?: string }> }) {
  await connection();
  const { id } = await params;
  const sp = await searchParams;
  const month = sp.month || new Date().toISOString().slice(0, 7);

  const [report, settings] = await Promise.all([fetchClassAttendanceMonth(id, month), getSchoolSettings()]);
  if (!report || !settings) notFound();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <Link href={`/admin/reports/attendance?month=${month}`} className="inline-flex items-center text-sm text-slate-500 hover:text-primary-600 mb-2 print:hidden">
        <ArrowLeft className="h-4 w-4 mr-1" /> ត្រឡប់ក្រោយ
      </Link>
      
      <Card className="p-4 md:p-8 print:p-0 print:border-none print:shadow-none">
        <AttendanceReportView report={report} settings={settings} />
      </Card>
      
      <div className="print:hidden">
        <PrintButton />
      </div>
    </div>
  );
}