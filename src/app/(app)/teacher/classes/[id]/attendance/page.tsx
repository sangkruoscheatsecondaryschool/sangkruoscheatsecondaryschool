import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { AppShell } from "@/components/app-shell";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getTeacherClassDetail } from "@/lib/teacher/queries";
import {
  getAttendanceContext,
  recentSchoolDays,
} from "@/lib/teacher/attendance-queries";
import { AttendanceForm } from "./attendance-form";
import { DatePills } from "./date-pills";

export const instant = false;

function todayIso(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

export default async function AttendancePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ date?: string }>;
}) {
  await connection();

  const user = await getCurrentUser();
  if (!user) return null;

  const { id: classId } = await params;
  const sp = await searchParams;

  const detail = await getTeacherClassDetail(user.id, classId);
  if (!detail) notFound();

  // Only homeroom teachers can record attendance
  if (!detail.is_homeroom) {
    return (
      <AppShell
        title={`វត្តមាន · ${detail.class_name}`}
        backHref={`/teacher/classes/${classId}`}
      >
        <div className="rounded-card border border-dashed border-border bg-surface p-6 text-center">
          <p className="font-moul text-sm">គ្មានសិទ្ធិ</p>
          <p className="text-muted mt-2 text-xs">
            មានតែគ្រូបន្ទុកថ្នាក់ប៉ុណ្ណោះដែលអាចកត់ត្រាវត្តមាន។
          </p>
          <Link
            href={`/teacher/classes/${classId}`}
            className="text-brand-700 mt-3 inline-block text-sm underline-offset-4 hover:underline"
          >
            ត្រឡប់ទៅថ្នាក់
          </Link>
        </div>
      </AppShell>
    );
  }

  const validDate =
    sp.date && /^\d{4}-\d{2}-\d{2}$/.test(sp.date) ? sp.date : todayIso();

  const ctx = await getAttendanceContext(classId, validDate);
  if (!ctx) notFound();

  const days = recentSchoolDays(5);

  return (
    <AppShell
      title={`វត្តមាន · ${detail.class_name}`}
      backHref={`/teacher/classes/${classId}`}
    >
      <div className="space-y-4">
        <DatePills
          classId={classId}
          days={days}
          activeDate={validDate}
        />

        <AttendanceForm key={ctx.date} ctx={ctx} />
      </div>
    </AppShell>
  );
}