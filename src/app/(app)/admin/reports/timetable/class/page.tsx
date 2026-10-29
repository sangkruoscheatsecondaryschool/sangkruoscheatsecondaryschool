import Link from "next/link";
import { connection } from "next/server";
import { ArrowLeft } from "lucide-react";
import { getCurrentAcademicYear } from "@/lib/admin/academic-years/queries";
import { listClassOptions } from "@/lib/admin/teacher-assignments/queries";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

export const instant = false;
export const metadata = { title: "ជ្រើសរើសថ្នាក់" };

export default async function ClassSelectorPage() {
  await connection();
  const year = await getCurrentAcademicYear();
  
  if (!year) return (
    <div className="space-y-6">
      <Link href="/admin/reports/timetable" className="inline-flex items-center text-sm text-slate-500 hover:text-primary-600 mb-2"><ArrowLeft className="h-4 w-4 mr-1" /> ត្រឡប់ក្រោយ</Link>
      <EmptyState title="មិនទាន់មានឆ្នាំសិក្សា" description="សូមកំណត់ឆ្នាំបច្ចុប្បន្នជាមុនសិន។" />
    </div>
  );

  const classes = await listClassOptions(year.id);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <Link href="/admin/reports/timetable" className="inline-flex items-center text-sm text-slate-500 hover:text-primary-600 mb-2">
        <ArrowLeft className="h-4 w-4 mr-1" /> ត្រឡប់ក្រោយ
      </Link>
      <PageHeader title="ជ្រើសរើសថ្នាក់រៀន" description="ចុចលើថ្នាក់ដើម្បីមើល និងបោះពុម្ពតារាងម៉ោង" />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {classes.map((c) => (
          <Link key={c.id} href={`/admin/reports/timetable/class/${c.id}`}>
            <Card className="p-4 text-center hover:border-primary-300 hover:shadow-md transition-all active:scale-95">
              <p className="font-moul text-xl text-slate-800">{c.class_name}</p>
              <p className="text-xs text-slate-500 mt-1">កម្រិត {c.grade_level}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}