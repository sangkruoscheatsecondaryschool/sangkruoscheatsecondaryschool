import { notFound } from "next/navigation";
import { connection } from "next/server";
import { AppShell } from "@/components/app-shell";
import { getClassById, listTeachers } from "@/lib/admin/classes/queries";
import { getAcademicYear } from "@/lib/admin/academic-years/queries";
import { EditClassForm } from "./edit-class-form";

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
    <AppShell
      title={`កែប្រែ · ${cls.class_name}`}
      backHref={`/admin/classes?year=${cls.academic_year_id}`}
    >
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
    </AppShell>
  );
}