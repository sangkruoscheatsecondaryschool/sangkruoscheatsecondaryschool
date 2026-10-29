import Link from "next/link";
import { connection } from "next/server";
import { ArrowLeft } from "lucide-react";
import { listAcademicYears, getCurrentAcademicYear } from "@/lib/admin/academic-years/queries";
import { listClassOptions } from "@/lib/admin/teacher-assignments/queries";
import { getSchoolSettings } from "@/lib/admin/school/queries";
import { fetchAnnualRanking } from "@/lib/admin/reports/ranking";
import { RankingReportView } from "@/components/print/ranking-report-view";
import { PrintButton } from "@/components/print/print-button";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export const instant = false;
export const metadata = { title: "ចំណាត់ថ្នាក់ប្រចាំឆ្នាំ" };

export default async function AnnualRankingPage({ searchParams }: { searchParams: Promise<{ year?: string; class?: string; layout?: string }> }) {
  await connection();
  const sp = await searchParams;
  
  const [years, current, settings] = await Promise.all([
    listAcademicYears(),
    getCurrentAcademicYear(),
    getSchoolSettings(),
  ]);

  const activeYear = (sp.year && years.find((y) => y.id === sp.year)) || current || years[0];

  if (!activeYear || !settings) {
    return (
      <div className="space-y-6">
        <Link href="/admin/reports/ranking" className="text-sm text-slate-500 hover:text-primary-600 flex items-center"><ArrowLeft className="h-4 w-4 mr-1" /> ត្រឡប់ក្រោយ</Link>
        <EmptyState title="មិនទាន់មានទិន្នន័យ" description="សូមបង្កើតឆ្នាំសិក្សាជាមុនសិន។" />
      </div>
    );
  }

  const classes = await listClassOptions(activeYear.id);
  const activeClass = (sp.class && classes.find((c) => c.id === sp.class)) || classes[0] || null;
  const layout = sp.layout === "wide" ? "wide" : "compact";

  const report = activeClass ? await fetchAnnualRanking(activeClass.id, activeYear.id, layout) : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <Link href="/admin/reports/ranking" className="inline-flex items-center text-sm text-slate-500 hover:text-primary-600 mb-2">
        <ArrowLeft className="h-4 w-4 mr-1" /> ត្រឡប់ក្រោយ
      </Link>
      
      <PageHeader title="ចំណាត់ថ្នាក់ប្រចាំឆ្នាំ" description="បង្ហាញលទ្ធផលមធ្យមភាគប្រចាំឆ្នាំ" />

      <form method="get" action="/admin/reports/ranking/annual" className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 print:hidden">
        <div className="flex-1 space-y-1">
          <label className="text-[11px] font-medium text-slate-500 uppercase">ឆ្នាំសិក្សា</label>
          <select name="year" defaultValue={activeYear.id} className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
            {years.map((y) => <option key={y.id} value={y.id}>{y.year_name}</option>)}
          </select>
        </div>
        <div className="flex-1 space-y-1">
          <label className="text-[11px] font-medium text-slate-500 uppercase">ថ្នាក់រៀន</label>
          <select name="class" defaultValue={activeClass?.id ?? ""} className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
            {classes.map((c) => <option key={c.id} value={c.id}>ថ្នាក់ទី {c.grade_level} · {c.class_name}</option>)}
          </select>
        </div>
        <div className="flex-1 space-y-1">
          <label className="text-[11px] font-medium text-slate-500 uppercase">ទម្រង់បង្ហាញ</label>
          <select name="layout" defaultValue={layout} className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option value="compact">សង្ខេប (៣ ជួរឈរ)</option>
            <option value="wide">លម្អិត (បង្ហាញខែ)</option>
          </select>
        </div>
        <div className="flex items-end">
          <Button type="submit" className="h-11 px-8">បង្ហាញ</Button>
        </div>
      </form>

      {!report ? (
        <EmptyState title="រកមិនឃើញទិន្នន័យ" description="សូមជ្រើសរើសថ្នាក់ដើម្បីបង្ហាញរបាយការណ៍។" />
      ) : (
        <>
          <Card className="p-4 md:p-8 print:p-0 print:border-none print:shadow-none">
            <RankingReportView report={report} settings={settings} />
          </Card>
          <div className="print:hidden">
            <PrintButton />
          </div>
        </>
      )}
    </div>
  );
}