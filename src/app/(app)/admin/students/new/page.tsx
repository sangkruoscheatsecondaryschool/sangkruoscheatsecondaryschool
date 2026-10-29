import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ArrowLeft } from "lucide-react";
import { getAcademicYear, getCurrentAcademicYear } from "@/lib/admin/academic-years/queries";
import { listClassesInYear } from "@/lib/admin/students/queries";
import { listProvinces } from "@/lib/admin/students/address-queries";
import { NewStudentForm } from "./new-student-form";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";

export const instant = false;
export const metadata = { title: "បន្ថែមសិស្ស" };

export default async function NewStudentPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; class?: string }>;
}) {
  await connection();

  const sp = await searchParams;
  
  //FALLBACK LOGIC: If no year is in the URL, get the current one
  const currentYear = await getCurrentAcademicYear();
  const yearId = sp.year || currentYear?.id;

  if (!yearId) {
    // If there is no year param AND no current year in the database, fail.
    notFound();
  }

  const [year, classes, provinces] = await Promise.all([
    getAcademicYear(yearId),
    listClassesInYear(yearId),
    listProvinces(),
  ]);

  if (!year) notFound();

  if (classes.length === 0) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <p className="text-slate-500">
            មិនមានថ្នាក់រៀននៅក្នុងឆ្នាំ {year.year_name} ទេ។
          </p>
          <Link href={`/admin/classes/new?year=${year.id}`} className="text-primary-600 mt-3 inline-block text-sm hover:underline">
            បង្កើតថ្នាក់ថ្មី
          </Link>
        </div>
      </div>
    );
  }

  const defaultClassId = sp.class && classes.some((c) => c.id === sp.class) ? sp.class : undefined;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      <Link href={`/admin/students?year=${year.id}`} className="inline-flex items-center text-sm text-slate-500 hover:text-primary-600 mb-2">
        <ArrowLeft className="h-4 w-4 mr-1" /> ត្រឡប់ក្រោយ
      </Link>
      
      <PageHeader
        title="បន្ថែមសិស្សថ្មី"
        description={`បំពេញព័ត៌មានសម្រាប់ឆ្នាំសិក្សា ${year.year_name}`}
      />
      
      <Card className="p-6 md:p-8">
        <NewStudentForm
          yearId={year.id}
          classes={classes}
          provinces={provinces}
          defaultClassId={defaultClassId}
        />
      </Card>
    </div>
  );
}