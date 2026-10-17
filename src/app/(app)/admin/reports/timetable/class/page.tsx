import { connection } from "next/server";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { getCurrentAcademicYear } from "@/lib/admin/academic-years/queries";
import { listClassOptions } from "@/lib/admin/teacher-assignments/queries";

export const instant = false;

export default async function ClassSelectorPage() {
  await connection();
  const year = await getCurrentAcademicYear();
  if (!year) return <AppShell title="ជ្រើសរើសថ្នាក់" backHref="/admin/reports/timetable"><p className="text-muted text-sm">គ្មានឆ្នាំសិក្សា</p></AppShell>;

  const classes = await listClassOptions(year.id);

  return (
    <AppShell title="ជ្រើសរើសថ្នាក់" backHref="/admin/reports/timetable">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {classes.map((c) => (
          <form key={c.id} action={async () => {
            "use server";
            redirect(`/admin/reports/timetable/class/${c.id}`);
          }}>
            <button
              type="submit"
              className="w-full rounded-card border-border bg-surface border p-4 text-left active:bg-brand-50"
            >
              <p className="font-moul text-sm">ថ្នាក់ទី {c.grade_level} · {c.class_name}</p>
            </button>
          </form>
        ))}
      </div>
    </AppShell>
  );
}