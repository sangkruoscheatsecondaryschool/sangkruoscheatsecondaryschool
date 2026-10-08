import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { AppShell } from "@/components/app-shell";
import { getAcademicYear } from "@/lib/admin/academic-years/queries";
import { listClassesInYear } from "@/lib/admin/students/queries";
import { NewStudentForm } from "./new-student-form";
import { listProvinces } from "@/lib/admin/students/address-queries";

export const instant = false;

export const metadata = { title: "បន្ថែមសិស្ស" };

export default async function NewStudentPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; class?: string }>;
}) {
  await connection();

  const sp = await searchParams;
  if (!sp.year) notFound();

  const [year, classes, provinces] = await Promise.all([
    getAcademicYear(sp.year),
    listClassesInYear(sp.year),
    listProvinces(),
  ]);

  if (!year) notFound();

  if (classes.length === 0) {
    return (
      <AppShell
        title="បន្ថែមសិស្ស"
        backHref={`/admin/students?year=${year.id}`}
      >
        <div className="rounded-card border border-dashed border-border bg-surface p-6 text-center">
          <p className="text-muted text-sm">
            មិនមានថ្នាក់រៀននៅក្នុងឆ្នាំ {year.year_name} ទេ។
          </p>
          <Link
            href={`/admin/classes/new?year=${year.id}`}
            className="text-brand-700 mt-3 inline-block text-sm underline-offset-4 hover:underline"
          >
            បង្កើតថ្នាក់ថ្មី
          </Link>
        </div>
      </AppShell>
    );
  }

  const defaultClassId =
    sp.class && classes.some((c) => c.id === sp.class)
      ? sp.class
      : undefined;

  return (
    <AppShell
      title={`បន្ថែមសិស្ស · ${year.year_name}`}
      backHref={`/admin/students?year=${year.id}`}
    >
      <NewStudentForm
        yearId={year.id}
        classes={classes}
        provinces={provinces}
        defaultClassId={defaultClassId}
      />
    </AppShell>
  );
}