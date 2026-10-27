import { connection } from "next/server";
import { AppShell } from "@/components/app-shell";
import { getSchoolSettings } from "@/lib/admin/school/queries";
import { listProvinces } from "@/lib/admin/students/address-queries";
import { SchoolSettingsForm } from "./school-settings-form";

export const instant = false;
export const metadata = { title: "ការកំណត់សាលា" };

export default async function SchoolSettingsPage() {
  await connection();

  const [settings, provinces] = await Promise.all([
    getSchoolSettings(),
    listProvinces(),
  ]);

  if (!settings) {
    return (
      <AppShell title="ការកំណត់សាលា" backHref="/dashboard">
        <div className="rounded-card border border-dashed border-border bg-surface p-6 text-center">
          <p className="text-muted text-sm">
            រកមិនឃើញការកំណត់សាលា។ សូមពិនិត្យមូលដ្ឋានទិន្នន័យ(Database)។
          </p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="ការកំណត់សាលា" backHref="/dashboard">
      <SchoolSettingsForm settings={settings} provinces={provinces} />
    </AppShell>
  );
}