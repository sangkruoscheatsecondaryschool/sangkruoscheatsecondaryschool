import Link from "next/link";
import { connection } from "next/server";
import { ArrowLeft } from "lucide-react";
import { listSubjectOptions } from "@/lib/admin/teachers/queries";
import { listProvinces } from "@/lib/admin/students/address-queries";
import { NewTeacherForm } from "./new-teacher-form";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";

export const instant = false;
export const metadata = { title: "បន្ថែមគ្រូ" };

export default async function NewTeacherPage() {
  await connection();
  const [subjects, provinces] = await Promise.all([listSubjectOptions(), listProvinces()]);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      <Link href="/admin/teachers" className="inline-flex items-center text-sm text-slate-500 hover:text-primary-600 mb-2">
        <ArrowLeft className="h-4 w-4 mr-1" /> ត្រឡប់ក្រោយ
      </Link>

      <PageHeader title="បន្ថែមគ្រូថ្មី" description="បង្កើតគណនី និងបំពេញព័ត៌មានគ្រូបង្រៀន" />
      
      <Card className="p-6 md:p-8">
        <NewTeacherForm subjects={subjects} provinces={provinces} />
      </Card>
    </div>
  );
}