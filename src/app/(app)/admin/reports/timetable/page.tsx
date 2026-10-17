import Link from "next/link";
import { connection } from "next/server";
import { AppShell } from "@/components/app-shell";

export const instant = false;
export const metadata = { title: "របាយការណ៍កាលវិភាគ" };

export default async function TimetableReportsHub() {
  await connection();

  return (
    <AppShell title="របាយការណ៍កាលវិភាគ" backHref="/admin/reports">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Link
          href="/admin/reports/timetable/class"
          className="rounded-card border-border bg-surface border p-4 active:bg-brand-50"
        >
          <p className="font-moul text-base">តាមថ្នាក់</p>
          <p className="text-muted mt-1 text-xs">
            បង្ហាញតារាងកាលវិភាគសម្រាប់ថ្នាក់រៀនមួយៗ
          </p>
        </Link>
        <Link
          href="/admin/reports/timetable/teacher"
          className="rounded-card border-border bg-surface border p-4 active:bg-brand-50"
        >
          <p className="font-moul text-base">តាមគ្រូបង្រៀន</p>
          <p className="text-muted mt-1 text-xs">
            បង្ហាញតារាងកាលវិភាគបង្រៀនសម្រាប់គ្រូម្នាក់ៗ
          </p>
        </Link>
        <Link
          href="/admin/reports/timetable/all"
          className="rounded-card border-border bg-surface border p-4 active:bg-brand-50"
        >
          <p className="font-moul text-base">គ្រប់ថ្នាក់ទាំងអស់</p>
          <p className="text-muted mt-1 text-xs">
            បោះពុម្ពកាលវិភាគសម្រាប់សាលាទាំងមូល
          </p>
        </Link>
        <Link
          href="/admin/reports/timetable/all-teachers"
          className="rounded-card border-border bg-surface border p-4 active:bg-brand-50"
        >
          <p className="font-moul text-base">កាលវិភាគរួមគ្រូទាំងអស់ (តារាងធំ)</p>
          <p className="text-muted mt-1 text-xs">
            បង្ហាញកាលវិភាគសម្រាប់គ្រូទាំងអស់ក្នុងតារាងតែមួយ
          </p>
        </Link>
      </div>
    </AppShell>
  );
}