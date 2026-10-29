import Link from "next/link";
import { connection } from "next/server";
import { ArrowLeft, GraduationCap } from "lucide-react";
import { listTeacherOptions } from "@/lib/admin/teacher-assignments/queries";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

export const instant = false;
export const metadata = { title: "ជ្រើសរើសគ្រូ" };

export default async function TeacherSelectorPage() {
  await connection();
  const teachers = await listTeacherOptions();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <Link href="/admin/reports/timetable" className="inline-flex items-center text-sm text-slate-500 hover:text-primary-600 mb-2">
        <ArrowLeft className="h-4 w-4 mr-1" /> ត្រឡប់ក្រោយ
      </Link>
      
      <PageHeader title="ជ្រើសរើសគ្រូបង្រៀន" description="ចុចលើឈ្មោះគ្រូដើម្បីមើល និងបោះពុម្ពតារាងម៉ោង" />

      {teachers.length === 0 ? (
        <EmptyState title="មិនទាន់មានគ្រូ" description="សូមបង្កើតគណនីគ្រូជាមុនសិន។" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {teachers.map((t) => (
            <Link key={t.id} href={`/admin/reports/timetable/teacher/${t.id}`}>
              <Card className="p-4 flex items-center gap-3 hover:border-primary-300 hover:shadow-md transition-all active:scale-95">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><GraduationCap className="h-5 w-5" /></div>
                <div className="min-w-0">
                  <p className="font-moul text-base text-slate-800 truncate">{t.full_name_kh}</p>
                  {t.full_name_en && <p className="text-xs text-slate-500 truncate font-inter">{t.full_name_en}</p>}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}