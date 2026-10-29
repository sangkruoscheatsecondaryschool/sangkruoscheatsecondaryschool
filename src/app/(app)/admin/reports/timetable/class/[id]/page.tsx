import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ArrowLeft } from "lucide-react";
import { getSchoolSettings } from "@/lib/admin/school/queries";
import { fetchClassTimetable } from "@/lib/admin/reports/timetable";
import { TimetableReportView } from "@/components/print/timetable-report-view";
import { PrintButton } from "@/components/print/print-button";
import { Card } from "@/components/ui/card";

export const instant = false;

export default async function ClassTimetableReportPage({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;

  const [grid, settings] = await Promise.all([fetchClassTimetable(id), getSchoolSettings()]);
  if (!grid || !settings) notFound();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <Link href="/admin/reports/timetable/class" className="inline-flex items-center text-sm text-slate-500 hover:text-primary-600 mb-2 print:hidden">
        <ArrowLeft className="h-4 w-4 mr-1" /> ត្រឡប់ក្រោយ
      </Link>
      
      <Card className="p-4 md:p-8 print:p-0 print:border-none print:shadow-none">
        <TimetableReportView grid={grid} settings={settings} mode="class" />
      </Card>
      
      <div className="print:hidden">
        <PrintButton />
      </div>
    </div>
  );
}