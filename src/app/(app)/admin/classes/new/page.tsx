import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ArrowLeft } from "lucide-react";
import { getAcademicYear } from "@/lib/admin/academic-years/queries";
import { listTeachers } from "@/lib/admin/classes/queries";
import { NewClassForm } from "./new-class-form";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";

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
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      <Link href={`/admin/classes?year=${yearRow.id}`} className="inline-flex items-center text-sm text-slate-500 hover:text-primary-600 mb-2">
        <ArrowLeft className="h-4 w-4 mr-1" /> ត្រឡប់ក្រោយ
      </Link>

      <PageHeader
        title="បន្ថែមថ្នាក់រៀនថ្មី"
        description={`បង្កើតថ្នាក់ថ្មីសម្រាប់ឆ្នាំសិក្សា ${yearRow.year_name}`}
      />
      
      <Card className="p-6 md:p-8">
        <NewClassForm
          academicYearId={yearRow.id}
          yearName={yearRow.year_name}
          teachers={teachers}
        />
      </Card>
    </div>
  );
}