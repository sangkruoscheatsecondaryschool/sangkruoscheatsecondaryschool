import Link from "next/link";
import { connection } from "next/server";
import { ArrowLeft, School } from "lucide-react";
import { getCurrentAcademicYear } from "@/lib/admin/academic-years/queries";
import { listClassOptions } from "@/lib/admin/teacher-assignments/queries";
import { MonthPicker } from "./month-picker";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

export const instant = false;
export const metadata = { title: "របាយការណ៍វត្តមាន" };

export default async function AttendanceReportsHub({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  await connection();
  const sp = await searchParams;
  const year = await getCurrentAcademicYear();
  
  if (!year) return (
    <div className="space-y-6">
      <Link href="/admin/reports" className="inline-flex items-center text-sm text-slate-500 hover:text-primary-600 mb-2"><ArrowLeft className="h-4 w-4 mr-1" /> ត្រឡប់ក្រោយ</Link>
      <EmptyState title="មិនទាន់មានឆ្នាំសិក្សា" description="សូមកំណត់ឆ្នាំបច្ចុប្បន្នជាមុនសិន។" />
    </div>
  );

  const classes = await listClassOptions(year.id);
  const defaultMonth = new Date().toISOString().slice(0, 7);
  const activeMonth = sp.month || defaultMonth;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <Link href="/admin/reports" className="inline-flex items-center text-sm text-slate-500 hover:text-primary-600 mb-2">
        <ArrowLeft className="h-4 w-4 mr-1" /> ត្រឡប់ក្រោយ
      </Link>
      
      <PageHeader title="របាយការណ៍វត្តមាន" description="ជ្រើសរើសខែ និងថ្នាក់រៀនដើម្បីមើលវត្តមាន" />

      <MonthPicker initialMonth={activeMonth} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {classes.map((c) => (
          <Link key={c.id} href={`/admin/reports/attendance/class/${c.id}?month=${activeMonth}`}>
            <Card className="p-4 flex items-center gap-3 hover:border-primary-300 hover:shadow-md transition-all active:scale-95">
              <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><School className="h-5 w-5" /></div>
              <div>
                <p className="font-moul text-base text-slate-800">ថ្នាក់ {c.class_name}</p>
                <p className="text-xs text-slate-500">កម្រិត {c.grade_level}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}