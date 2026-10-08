import { notFound } from "next/navigation";
import { connection } from "next/server";
import { AppShell } from "@/components/app-shell";
import { getAcademicYear } from "@/lib/admin/academic-years/queries";
import { listTeachers } from "@/lib/admin/classes/queries";
import { NewClassForm } from "./new-class-form";

export const instant = false;

export const metadata = { title: "បន្ថែមថ្នាក់" };

export default async function NewClassPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string }>;
}) {
  await connection();

  const { year } = await searchParams;
  if (!year) notFound();

  const [yearRow, teachers] = await Promise.all([
    getAcademicYear(year),
    listTeachers(),
  ]);

  if (!yearRow) notFound();

  return (
    <AppShell
      title={`បន្ថែមថ្នាក់ · ${yearRow.year_name}`}
      backHref={`/admin/classes?year=${yearRow.id}`}
    >
      <NewClassForm
        academicYearId={yearRow.id}
        yearName={yearRow.year_name}
        teachers={teachers}
      />
    </AppShell>
  );
}