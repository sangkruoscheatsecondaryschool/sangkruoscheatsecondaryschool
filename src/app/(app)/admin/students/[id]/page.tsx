import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ArrowLeft } from "lucide-react";
import { getAcademicYear } from "@/lib/admin/academic-years/queries";
import { getClassById } from "@/lib/admin/classes/queries";
import { getStudentById, listClassesInYear } from "@/lib/admin/students/queries";
import { listProvinces } from "@/lib/admin/students/address-queries";
import { EditStudentForm } from "./edit-student-form";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";

export const instant = false;

export default async function EditStudentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();

  const { id } = await params;
  const student = await getStudentById(id);
  if (!student) notFound();

  const cls = await getClassById(student.class_id);
  if (!cls) notFound();

  const [year, classes, provinces] = await Promise.all([
    getAcademicYear(cls.academic_year_id),
    listClassesInYear(cls.academic_year_id),
    listProvinces(),
  ]);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      <Link href={`/admin/students?class=${student.class_id}`} className="inline-flex items-center text-sm text-slate-500 hover:text-primary-600 mb-2">
        <ArrowLeft className="h-4 w-4 mr-1" /> ត្រឡប់ក្រោយ
      </Link>

      <PageHeader
        title={`កែប្រែព័ត៌មានសិស្ស`}
        description={`កែប្រែព័ត៌មានសម្រាប់ ${student.name_kh} (${student.student_code})`}
      />
      
      <Card className="p-6 md:p-8">
        <EditStudentForm
          studentId={student.id}
          yearName={year?.year_name ?? ""}
          classes={classes}
          provinces={provinces}
          defaults={{
            student_code: student.student_code,
            name_kh: student.name_kh,
            gender: student.gender,
            dob: student.dob,
            class_id: student.class_id,
            place_of_birth_code: student.place_of_birth_code,
            current_address_code: student.current_address_code,
            current_address_detail: student.current_address_detail,
            mother_name: student.mother_name,
            father_name: student.father_name,
            contact_number: student.contact_number,
            status: student.status,
          }}
        />
      </Card>
    </div>
  );
}