import { connection } from "next/server";
import { AppShell } from "@/components/app-shell";
import { BackupButton } from "./backup-button";

export const instant = false;
export const metadata = { title: "បម្រុងទុកទិន្នន័យ" };

export default async function BackupPage() {
  await connection();

  return (
    <AppShell title="បម្រុងទុកទិន្នន័យ" backHref="/admin">
      <div className="space-y-4">
        <div className="rounded-card border-border bg-surface border p-6">
          <p className="font-moul text-base">Google Sheets Backup</p>
          <p className="text-muted mt-2 text-sm">
            ចុចប៊ូតុងខាងក្រោម ដើម្បីបញ្ជូនទិន្នន័យសិស្ស ពិន្ទុ និងវត្តមានទាំងអស់ទៅកាន់ Google Sheet ដែលបានកំណត់។
            ទិន្នន័យចាស់នៅក្នុង Sheet នឹងត្រូវលុប និងជំនួសដោយទិន្នន័យថ្មី។
          </p>

          <div className="mt-6">
            <BackupButton />
          </div>
        </div>
      </div>
    </AppShell>
  );
}