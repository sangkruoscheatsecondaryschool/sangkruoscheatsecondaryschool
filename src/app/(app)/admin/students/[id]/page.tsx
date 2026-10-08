import { notFound } from "next/navigation";
import { connection } from "next/server";
import { AppShell } from "@/components/app-shell";
import { getAcademicYear } from "@/lib/admin/academic-years/queries";
import { getClassById } from "@/lib/admin/classes/queries";
import { getStudentById, listClassesInYear } from "@/lib/admin/students/queries";
import { EditStudentForm } from "./edit-student-form";
import { listProvinces } from "@/lib/admin/students/address-queries";

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
    <AppShell
      title={`កែប្រែ · ${student.name_kh}`}
      backHref={`/admin/students?class=${student.class_id}`}
    >
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
          place_of_birth_village_id: student.place_of_birth_village_id,
          current_address_village_id: student.current_address_village_id,
          current_address_detail: student.current_address_detail,
          mother_name: student.mother_name,
          father_name: student.father_name,
          contact_number: student.contact_number,
          status: student.status,
        }}
      />
    </AppShell>
  );
}