import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ArrowLeft } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getTeacherClassDetail } from "@/lib/teacher/queries";
import { getAttendanceContext, recentSchoolDays } from "@/lib/teacher/attendance-queries";
import { AttendanceForm } from "./attendance-form";
import { DatePills } from "./date-pills";
import { Card } from "@/components/ui/card";

export const instant = false;

function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default async function AttendancePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ date?: string }> }) {
  await connection();

  const user = await getCurrentUser();
  if (!user) return null;

  const { id: classId } = await params;
  const sp = await searchParams;

  const detail = await getTeacherClassDetail(user.id, classId);
  if (!detail) notFound();

  if (!detail.is_homeroom) {
    return (
      <div className="max-w-3xl mx-auto mt-10 text-center">
        <Card className="p-8">
          <p className="font-moul text-lg text-slate-800">គ្មានសិទ្ធិចូលប្រើ</p>
          <p className="text-slate-500 text-sm mt-2">មានតែគ្រូបន្ទុកថ្នាក់ប៉ុណ្ណោះដែលអាចកត់ត្រាវត្តមាន។</p>
          <Link href={`/teacher/classes/${classId}`} className="text-primary-600 mt-4 inline-block text-sm hover:underline">ត្រឡប់ក្រោយ</Link>
        </Card>
      </div>
    );
  }

  const validDate = sp.date && /^\d{4}-\d{2}-\d{2}$/.test(sp.date) ? sp.date : todayIso();
  const ctx = await getAttendanceContext(classId, validDate);
  if (!ctx) notFound();

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20 max-w-4xl mx-auto">
      <Link href={`/teacher/classes/${classId}`} className="inline-flex items-center text-sm text-slate-500 hover:text-primary-600 mb-2">
        <ArrowLeft className="h-4 w-4 mr-1" /> ត្រឡប់ក្រោយ
      </Link>

      <div>
        <h1 className="font-moul text-2xl text-slate-900">វត្តមាន · {detail.class_name}</h1>
        <p className="text-slate-500 mt-1 text-sm">ជ្រើសរើសកាលបរិច្ឆេទ ដើម្បីកត់ត្រាវត្តមានសិស្ស</p>
      </div>

      <DatePills classId={classId} days={recentSchoolDays(5)} activeDate={validDate} />
      <AttendanceForm ctx={ctx} />
    </div>
  );
}