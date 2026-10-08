import { notFound } from "next/navigation";
import { connection } from "next/server";
import { AppShell } from "@/components/app-shell";
import { getAcademicYear } from "@/lib/admin/academic-years/queries";
import { listTermsWithMonths } from "@/lib/admin/term-months/queries";
import { SetupTermsCard } from "./setup-terms-card";
import { TermCard } from "./term-card";

export const instant = false;

export default async function AcademicYearDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();

  const { id } = await params;
  const year = await getAcademicYear(id);
  if (!year) notFound();

  const terms = await listTermsWithMonths(id);

  return (
    <AppShell title={year.year_name} backHref="/admin/academic-years">
      <div className="space-y-4">
        <div className="rounded-card border-border bg-surface border p-4">
          <p className="text-muted text-xs tracking-wide uppercase">
            ឆ្នាំសិក្សា
          </p>
          <p className="font-moul mt-1 text-lg">{year.year_name}</p>
          {year.is_current ? (
            <span className="bg-brand-100 text-brand-800 mt-2 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium">
              ឆ្នាំបច្ចុប្បន្ន
            </span>
          ) : null}
        </div>

        {terms.length === 0 ? (
          <SetupTermsCard yearId={year.id} />
        ) : (
          <div className="space-y-4">
            {terms.map((t) => (
              <TermCard key={t.id} term={t} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}