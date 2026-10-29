import { connection } from "next/server";
import { Database, ShieldCheck, HardDrive } from "lucide-react";
import { BackupButton } from "./backup-button";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const instant = false;
export const metadata = { title: "បម្រុងទុកទិន្នន័យ" };

export default async function BackupPage() {
  await connection();

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      <PageHeader title="បម្រុងទុកទិន្នន័យ" description="គ្រប់គ្រងការបម្រុងទុកទិន្នន័យទៅកាន់ Google Sheets" />

      <Card className="border-slate-200">
        <CardHeader className="bg-slate-50 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary-600" />
            <CardTitle className="text-lg">Google Sheets Backup</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-medium text-slate-900">ទិន្នន័យមានសុវត្ថិភាព</h3>
              <p className="text-slate-500 text-sm mt-1">
                ចុចប៊ូតុងខាងក្រោម ដើម្បីបញ្ជូនទិន្នន័យសិស្ស ពិន្ទុ និងវត្តមានទាំងអស់ទៅកាន់ Google Sheet ដែលបានកំណត់។
                ទិន្នន័យចាស់នៅក្នុង Sheet នឹងត្រូវលុប និងជំនួសដោយទិន្នន័យថ្មី។
              </p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-800">
            <strong>ចំណាំ៖</strong> ប្រព័ន្ធក៏នឹងធ្វើការបម្រុងទុកដោយស្វ័យប្រវត្តិនៅរៀងរាល់ខែផងដែរ។
          </div>

          <div className="pt-2">
            <BackupButton />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}