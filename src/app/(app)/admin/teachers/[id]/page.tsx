import { notFound } from "next/navigation";
import { connection } from "next/server";
import { AppShell } from "@/components/app-shell";
import {
  getTeacherById,
  listSubjectOptions,
} from "@/lib/admin/teachers/queries";
import { listProvinces } from "@/lib/admin/students/address-queries";
import {
  getSalaryHistory,
  listSalaryPositions,
} from "@/lib/admin/teachers/salary-queries";
import { EditTeacherForm } from "./edit-teacher-form";
import { SalaryHistoryCard } from "./salary-history-card";

export const instant = false;

export default async function EditTeacherPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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
    <AppShell
      title={`កែប្រែ · ${teacher.full_name_kh}`}
      backHref="/admin/teachers"
    >
      <div className="space-y-5">
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

        <SalaryHistoryCard
            teacherId={teacher.id}
            history={history}
            positions={positions}
        />
      </div>
    </AppShell>
  );
}