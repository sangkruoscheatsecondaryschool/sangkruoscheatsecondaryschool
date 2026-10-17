import Link from "next/link";
import { connection } from "next/server";
import { AppShell } from "@/components/app-shell";
import { listTeacherOptions } from "@/lib/admin/teacher-assignments/queries";

export const instant = false;

export default async function TeacherSelectorPage() {
  await connection();
  const teachers = await listTeacherOptions();

  return (
    <AppShell title="ជ្រើសរើសគ្រូ" backHref="/admin/reports/timetable">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {teachers.map((t) => (
          <Link
            key={t.id}
            href={`/admin/reports/timetable/teacher/${t.id}`}
            className="w-full rounded-card border-border bg-surface border p-4 block text-left active:bg-brand-50"
          >
            <p className="font-moul text-sm">{t.full_name_kh}</p>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}