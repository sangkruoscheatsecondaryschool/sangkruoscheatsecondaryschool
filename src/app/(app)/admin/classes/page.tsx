import Link from "next/link";
import { connection } from "next/server";
import { Plus } from "lucide-react";
import { listAcademicYears, getCurrentAcademicYear } from "@/lib/admin/academic-years/queries";
import { listClassesForYear } from "@/lib/admin/classes/queries";
import { ClassCard } from "./class-card";
import { YearSwitcher } from "./year-switcher";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export const instant = false;
export const metadata = { title: "ថ្នាក់រៀន" };

export default async function ClassesPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string }>;
}) {
  await connection();

  const { year: yearParam } = await searchParams;
  const [years, current] = await Promise.all([listAcademicYears(), getCurrentAcademicYear()]);

  const requested = yearParam ? years.find((y) => y.id === yearParam) : null;
  const activeYear = requested ?? current ?? years[0] ?? null;

  const classes = activeYear ? await listClassesForYear(activeYear.id) : [];

  const groups = new Map<number, typeof classes>();
  for (const c of classes) {
    const list = groups.get(c.grade_level) ?? [];
    list.push(c);
    groups.set(c.grade_level, list);
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader 
        title="គ្រប់គ្រងថ្នាក់រៀន" 
        description="រៀបចំថ្នាក់រៀន និងកំណត់គ្រូបន្ទុកថ្នាក់"
        action={
          activeYear ? (
            <Link href={`/admin/classes/new?year=${activeYear.id}`}>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                បន្ថែមថ្នាក់ថ្មី
              </Button>
            </Link>
          ) : null
        }
      />

      <YearSwitcher years={years} activeYearId={activeYear?.id ?? null} basePath="/admin/classes" />

      {!activeYear ? (
        <EmptyState title="មិនទាន់មានឆ្នាំសិក្សា" description="សូមបង្កើតឆ្នាំសិក្សាជាមុនសិន។" />
      ) : classes.length === 0 ? (
        <EmptyState 
          title="មិនទាន់មានថ្នាក់រៀន" 
          description={`មិនទាន់មានថ្នាក់រៀនសម្រាប់ឆ្នាំ ${activeYear.year_name} នៅឡើយទេ។`}
          action={
            <Link href={`/admin/classes/new?year=${activeYear.id}`}>
              <Button variant="outline">បង្កើតថ្នាក់ដំបូង</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-8">
          {[7, 8, 9].map((grade) => {
            const list = groups.get(grade) ?? [];
            if (list.length === 0) return null;
            return (
              <section key={grade}>
                <h2 className="font-moul text-slate-800 mb-4 text-lg">ថ្នាក់ទី {grade}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {list.map((c) => (
                    <ClassCard key={`${c.id}-${c.student_count}`} cls={c} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}