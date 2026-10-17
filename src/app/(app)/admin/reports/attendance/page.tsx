import Link from "next/link";
import { connection } from "next/server";
import { AppShell } from "@/components/app-shell";
import { getCurrentAcademicYear } from "@/lib/admin/academic-years/queries";
import { listClassOptions } from "@/lib/admin/teacher-assignments/queries";
import { MonthPicker } from "./month-picker";

export const instant = false;
export const metadata = { title: "របាយការណ៍វត្តមាន" };

export default async function AttendanceReportsHub({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  await connection();

  const sp = await searchParams;
  const year = await getCurrentAcademicYear();
  if (!year) return <AppShell title="របាយការណ៍វត្តមាន" backHref="/admin/reports"><p className="text-muted text-sm">គ្មានឆ្នាំសិក្សា</p></AppShell>;

  const classes = await listClassOptions(year.id);
  const defaultMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const activeMonth = sp.month || defaultMonth;

  return (
    <AppShell title="របាយការណ៍វត្តមាន" backHref="/admin/reports">
      <MonthPicker initialMonth={activeMonth} />

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {classes.map((c) => (
          <Link
            key={c.id}
            href={`/admin/reports/attendance/class/${c.id}?month=${activeMonth}`}
            className="w-full rounded-card border-border bg-surface border p-4 block text-left active:bg-brand-50"
          >
            <p className="font-moul text-sm">ថ្នាក់ទី {c.grade_level} · {c.class_name}</p>
            <p className="text-muted mt-1 text-xs">មើលវត្តមានប្រចាំខែ</p>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}