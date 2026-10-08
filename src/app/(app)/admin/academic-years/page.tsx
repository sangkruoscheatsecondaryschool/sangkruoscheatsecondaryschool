import Link from "next/link";
import { connection } from "next/server";
import { AppShell } from "@/components/app-shell";
import { listAcademicYears } from "@/lib/admin/academic-years/queries";
import { AcademicYearCard } from "./academic-year-card";
import { ErrorBanner } from "./error-banner";

export const instant = false;

export const metadata = { title: "ឆ្នាំសិក្សា" };

export default async function AcademicYearsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await connection();

  const { error } = await searchParams;
  const years = await listAcademicYears();

  return (
    <AppShell title="ឆ្នាំសិក្សា" backHref="/admin">
      {error ? <ErrorBanner message={error} /> : null}

      <Link
        href="/admin/academic-years/new"
        className="touch-target rounded-btn bg-brand-600 mb-4 flex w-full items-center justify-center px-4 font-medium text-white active:bg-brand-700"
      >
        + បន្ថែមឆ្នាំសិក្សាថ្មី
      </Link>

      {years.length === 0 ? (
        <div className="rounded-card border border-dashed border-border bg-surface p-6 text-center">
          <p className="text-muted text-sm">
            មិនមានឆ្នាំសិក្សានៅឡើយទេ។
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
            {years.map((y) => (
                <li key={`${y.id}-${y.is_current ? "current" : "idle"}`}>
                <AcademicYearCard year={y} />
                </li>
            ))}
        </ul>
      )}
    </AppShell>
  );
}