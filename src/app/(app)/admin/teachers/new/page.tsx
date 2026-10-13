import { connection } from "next/server";
import { AppShell } from "@/components/app-shell";
import { listSubjectOptions } from "@/lib/admin/teachers/queries";
import { listProvinces } from "@/lib/admin/students/address-queries";
import { NewTeacherForm } from "./new-teacher-form";

export const instant = false;

export const metadata = { title: "បន្ថែមគ្រូ" };

export default async function NewTeacherPage() {
  await connection();

  const [subjects, provinces] = await Promise.all([
    listSubjectOptions(),
    listProvinces(),
  ]);

  return (
    <AppShell title="បន្ថែមគ្រូ" backHref="/admin/teachers">
      <NewTeacherForm subjects={subjects} provinces={provinces} />
    </AppShell>
  );
}