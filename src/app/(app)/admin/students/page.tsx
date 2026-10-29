import Link from "next/link";
import { connection } from "next/server";
import { Plus } from "lucide-react";
import { listAcademicYears, getCurrentAcademicYear } from "@/lib/admin/academic-years/queries";
import { listClassesInYear, listStudentsByYear } from "@/lib/admin/students/queries";
import { YearSwitcher } from "../classes/year-switcher";
import { StudentCard } from "./student-card";
import { StudentFilters } from "./student-filters";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export const instant = false;
export const metadata = { title: "សិស្ស" };

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; class?: string; q?: string }>;
}) {
  await connection();

  const sp = await searchParams;
  const [years, current] = await Promise.all([
    listAcademicYears(),
    getCurrentAcademicYear(),
  ]);

  const requested = sp.year ? years.find((y) => y.id === sp.year) : null;
  const activeYear = requested ?? current ?? years[0] ?? null;

  const classes = activeYear ? await listClassesInYear(activeYear.id) : [];
  const validClassId = sp.class && classes.some((c) => c.id === sp.class) ? sp.class : undefined;

  const students = activeYear
    ? await listStudentsByYear(activeYear.id, { classId: validClassId, q: sp.q })
    : [];

  // Group by class for display
  const groups = new Map<string, { class_name: string; grade_level: number; students: typeof students }>();
  for (const s of students) {
    const g = groups.get(s.class_id) ?? { class_name: s.class_name, grade_level: s.grade_level, students: [] };
    g.students.push(s);
    groups.set(s.class_id, g);
  }

  const grouped = Array.from(groups.entries()).sort((a, b) => {
    if (a[1].grade_level !== b[1].grade_level) return a[1].grade_level - b[1].grade_level;
    return a[1].class_name.localeCompare(b[1].class_name);
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      <PageHeader 
        title="បញ្ជីសិស្ស" 
        description="គ្រប់គ្រងព័ត៌មានសិស្ស និងការចុះឈ្មោះចូលរៀន"
        action={
          activeYear && classes.length > 0 ? (
            <Link href={`/admin/students/new?year=${activeYear.id}${validClassId ? `&class=${validClassId}` : ""}`}>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                បន្ថែមសិស្សថ្មី
              </Button>
            </Link>
          ) : null
        }
      />

      <YearSwitcher years={years} activeYearId={activeYear?.id ?? null} basePath="/admin/students" />

      {activeYear && classes.length > 0 && (
        <StudentFilters
          classes={classes}
          activeClassId={validClassId ?? ""}
          q={sp.q ?? ""}
          yearId={activeYear.id}
        />
      )}

      {!activeYear ? (
        <EmptyState 
          title="មិនទាន់មានឆ្នាំសិក្សា" 
          description="សូមបង្កើតឆ្នាំសិក្សាជាមុនសិន ដើម្បីចាប់ផ្តើមបន្ថែមសិស្ស។"
        />
      ) : classes.length === 0 ? (
        <EmptyState 
          title="មិនទាន់មានថ្នាក់រៀន" 
          description="អ្នកត្រូវបង្កើតថ្នាក់រៀនជាមុនសិន ទើបអាចបន្ថែមសិស្សបាន។"
          action={
            <Link href={`/admin/classes/new?year=${activeYear.id}`}>
              <Button variant="outline">បង្កើតថ្នាក់រៀន</Button>
            </Link>
          }
        />
      ) : students.length === 0 ? (
        <EmptyState 
          title="រកមិនឃើញសិស្ស" 
          description="មិនមានសិស្សត្រូវនឹងលក្ខខណ្ឌស្វែងរករបស់អ្នកទេ។ សូមព្យាយាមម្តងទៀត។"
        />
      ) : (
        <div className="space-y-8">
          {grouped.map(([classId, group]) => (
            <section key={classId}>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="font-moul text-lg text-slate-800">
                  ថ្នាក់ទី {group.grade_level} · {group.class_name}
                </h2>
                <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full font-medium">
                  {group.students.length} នាក់
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {group.students.map((s) => (
                  <StudentCard key={`${s.id}-${s.class_id}`} student={s} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}