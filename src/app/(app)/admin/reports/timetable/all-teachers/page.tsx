import { connection } from "next/server";
import { AppShell } from "@/components/app-shell";
import { getSchoolSettings } from "@/lib/admin/school/queries";
import { fetchAllTeachersTimetable } from "@/lib/admin/reports/timetable";
import { MasterTimetableView } from "@/components/print/master-timetable-view";
import { PrintButton } from "@/components/print/print-button";

export const instant = false;
export const metadata = { title: "តារាងកាលវិភាគគ្រូទាំងអស់" };

export default async function AllTeachersTimetablePage() {
  await connection();

  const [data, settings] = await Promise.all([
    fetchAllTeachersTimetable(),
    getSchoolSettings(),
  ]);

  if (!data || !settings) {
    return (
      <AppShell title="តារាងកាលវិភាគគ្រូទាំងអស់" backHref="/admin/reports/timetable">
        <p className="text-muted text-sm">រកមិនឃើញទិន្នន័យ។</p>
      </AppShell>
    );
  }

  return (
    <AppShell title="តារាងកាលវិភាគគ្រូទាំងអស់" backHref="/admin/reports/timetable">
      <div className="rounded-card border-border bg-white border p-4 print:border-0 print:p-0 print:bg-transparent">
        <MasterTimetableView data={data} settings={settings} />
      </div>
      <div className="mt-4 print:hidden">
        <PrintButton />
      </div>
    </AppShell>
  );
}