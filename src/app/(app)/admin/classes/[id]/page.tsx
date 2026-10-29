import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ArrowLeft } from "lucide-react";
import { getClassById, listTeachers } from "@/lib/admin/classes/queries";
import { getAcademicYear } from "@/lib/admin/academic-years/queries";
import { EditClassForm } from "./edit-class-form";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";

export const instant = false;

export default async function EditClassPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();

  const { id } = await params;
  const cls = await getClassById(id);
  if (!cls) notFound();

  const [teachers, year] = await Promise.all([
    listTeachers(),
    getAcademicYear(cls.academic_year_id),
  ]);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      <Link href={`/admin/classes?year=${cls.academic_year_id}`} className="inline-flex items-center text-sm text-slate-500 hover:text-primary-600 mb-2">
        <ArrowLeft className="h-4 w-4 mr-1" /> ត្រឡប់ក្រោយ
      </Link>

      <PageHeader
        title={`កែប្រែថ្នាក់ ${cls.class_name}`}
        description={`កែប្រែព័ត៌មានសម្រាប់ឆ្នាំសិក្សា ${year?.year_name ?? ""}`}
      />
      
      <Card className="p-6 md:p-8">
        <EditClassForm
          classId={cls.id}
          yearName={year?.year_name ?? ""}
          teachers={teachers}
          defaults={{
            class_name: cls.class_name,
            grade_level: cls.grade_level,
            homeroom_teacher_id: cls.homeroom_teacher_id,
          }}
        />
      </Card>
    </div>
  );
}