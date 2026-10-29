import Link from "next/link";
import { connection } from "next/server";
import { ArrowLeft } from "lucide-react";
import { listAcademicYears, getCurrentAcademicYear } from "@/lib/admin/academic-years/queries";
import { listPeriods } from "@/lib/admin/timetable/queries";
import { YearSwitcher } from "../../classes/year-switcher";
import { PeriodList } from "./period-list";
import { NewPeriodForm } from "./new-period-form";
import { SetupDefaultsCard } from "./setup-defaults-card";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Card } from "@/components/ui/card";

export const instant = false;
export const metadata = { title: "កំណត់ម៉ោងបង្រៀន" };

export default async function PeriodsPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string }>;
}) {
  await connection();

  const sp = await searchParams;
  const [years, current] = await Promise.all([listAcademicYears(), getCurrentAcademicYear()]);
  const activeYear = (sp.year && years.find((y) => y.id === sp.year)) || current || years[0] || null;

  if (!activeYear) {
    return (
      <div className="space-y-6">
        <PageHeader title="កំណត់ម៉ោងបង្រៀន" description="គ្រប់គ្រងម៉ោងចូលរៀន" />
        <EmptyState title="មិនទាន់មានឆ្នាំសិក្សា" description="សូមបង្កើតឆ្នាំសិក្សាជាមុនសិន។" />
      </div>
    );
  }

  const periods = await listPeriods(activeYear.id);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      <Link href={`/admin/timetable?year=${activeYear.id}`} className="inline-flex items-center text-sm text-slate-500 hover:text-primary-600 mb-2">
        <ArrowLeft className="h-4 w-4 mr-1" /> ត្រឡប់ទៅតារាងម៉ោង
      </Link>

      <PageHeader title="កំណត់ម៉ោងបង្រៀន" description={`ឆ្នាំសិក្សា ${activeYear.year_name}`} />

      <YearSwitcher years={years} activeYearId={activeYear.id} basePath="/admin/timetable/periods" />

      {periods.length === 0 ? (
        <Card className="p-8">
          <SetupDefaultsCard yearId={activeYear.id} />
        </Card>
      ) : (
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="font-moul text-lg text-slate-800 mb-4">ម៉ោងបង្រៀនដែលមានស្រាប់</h2>
            <PeriodList periods={periods} />
          </Card>
          
          <Card className="p-6">
            <NewPeriodForm yearId={activeYear.id} nextNumber={Math.max(...periods.map((p) => p.period_number)) + 1} />
          </Card>
        </div>
      )}
    </div>
  );
}