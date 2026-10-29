import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ArrowLeft } from "lucide-react";
import { getTeacherById, listSubjectOptions } from "@/lib/admin/teachers/queries";
import { getSalaryHistory, listSalaryPositions } from "@/lib/admin/teachers/salary-queries";
import { listProvinces } from "@/lib/admin/students/address-queries";
import { EditTeacherForm } from "./edit-teacher-form";
import { SalaryHistoryCard } from "./salary-history-card";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";

export const instant = false;

export default async function EditTeacherPage({ params }: { params: Promise<{ id: string }> }) {
  await connection();

  const { id } = await params;
  const teacher = await getTeacherById(id);
  if (!teacher) notFound();

  const [subjects, provinces, positions, history] = await Promise.all([
    listSubjectOptions(),
    listProvinces(),
    listSalaryPositions(),
    getSalaryHistory(teacher.id),
  ]);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      <Link href="/admin/teachers" className="inline-flex items-center text-sm text-slate-500 hover:text-primary-600 mb-2">
        <ArrowLeft className="h-4 w-4 mr-1" /> ត្រឡប់ក្រោយ
      </Link>

      <PageHeader title={`កែប្រែព័ត៌មានគ្រូ`} description={teacher.full_name_kh} />
      
      <Card className="p-6 md:p-8">
        <EditTeacherForm
          teacherId={teacher.id}
          email={teacher.email}
          subjects={subjects}
          provinces={provinces}
          defaults={{
            full_name_kh: teacher.full_name_kh,
            full_name_en: teacher.full_name_en,
            gender: teacher.gender,
            dob: teacher.dob,
            phone: teacher.phone,
            contact_address_code: teacher.contact_address_code,
            joined_date: teacher.joined_date,
            specialist_1_subject_id: teacher.specialist_1_subject_id,
            specialist_2_subject_id: teacher.specialist_2_subject_id,
            notes: teacher.notes,
          }}
        />
      </Card>

      {/* Salary History Component */}
      <SalaryHistoryCard teacherId={teacher.id} history={history} positions={positions} />
    </div>
  );
}