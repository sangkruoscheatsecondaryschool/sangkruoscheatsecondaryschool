import Link from "next/link";
import { connection } from "next/server";
import { Plus } from "lucide-react";
import { listAcademicYears, getCurrentAcademicYear } from "@/lib/admin/academic-years/queries";
import { listAssignmentsForYear, listClassOptions, listTeacherOptions } from "@/lib/admin/teacher-assignments/queries";
import { YearSwitcher } from "../classes/year-switcher";
import { AssignmentCard } from "./assignment-card";
import { AssignmentFilters } from "./assignment-filters";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export const instant = false;
export const metadata = { title: "ការចាត់តាំងគ្រូ" };

export default async function TeacherAssignmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; teacher?: string; class?: string }>;
}) {
  await connection();
  const sp = await searchParams;
  const [years, current] = await Promise.all([listAcademicYears(), getCurrentAcademicYear()]);
  const activeYear = (sp.year && years.find((y) => y.id === sp.year)) || current || years[0] || null;

  if (!activeYear) {
    return (
      <div className="space-y-6">
        <PageHeader title="ការចាត់តាំងគ្រូ" description="ចាត់តាំងគ្រូបង្រៀនតាមមុខវិជ្ជា និងថ្នាក់រៀន" />
        <EmptyState title="មិនទាន់មានឆ្នាំសិក្សា" description="សូមបង្កើតឆ្នាំសិក្សាជាមុនសិន។" />
      </div>
    );
  }

  const [teachers, classes] = await Promise.all([listTeacherOptions(), listClassOptions(activeYear.id)]);
  const validTeacherId = sp.teacher && teachers.some((t) => t.id === sp.teacher) ? sp.teacher : undefined;
  const validClassId = sp.class && classes.some((c) => c.id === sp.class) ? sp.class : undefined;

  const assignments = await listAssignmentsForYear(activeYear.id, { teacherId: validTeacherId, classId: validClassId });
  const groupBy = validTeacherId ? "class" : "teacher";

  const groups = new Map<string, { key: string; label: string; sub: string; items: typeof assignments }>();
  for (const a of assignments) {
    const key = groupBy === "teacher" ? a.teacher_id : a.class_id;
    const label = groupBy === "teacher" ? a.teacher_name_kh : a.class_name;
    const sub = groupBy === "teacher" ? (a.teacher_name_en ?? "") : `ថ្នាក់ទី ${a.grade_level}`;
    const g = groups.get(key) ?? { key, label, sub, items: [] };
    g.items.push(a);
    groups.set(key, g);
  }
  const grouped = Array.from(groups.values()).sort((a, b) => a.label.localeCompare(b.label, "km"));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader 
        title="ការចាត់តាំងគ្រូ" 
        description="ចាត់តាំងគ្រូបង្រៀនតាមមុខវិជ្ជា និងថ្នាក់រៀន"
        action={
          <Link href={`/admin/teacher-assignments/manage?year=${activeYear.id}`}>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              ចាត់តាំងគ្រូថ្មី
            </Button>
          </Link>
        }
      />

      <YearSwitcher years={years} activeYearId={activeYear.id} basePath="/admin/teacher-assignments" />

      {teachers.length === 0 || classes.length === 0 ? (
        <EmptyState 
          title="មិនទាន់មានទិន្នន័យ" 
          description="អ្នកត្រូវមានគ្រូបង្រៀន និងថ្នាក់រៀនជាមុនសិន ទើបអាចចាត់តាំងបាន។"
        />
      ) : (
        <>
          <AssignmentFilters teachers={teachers} classes={classes} activeTeacherId={validTeacherId ?? ""} activeClassId={validClassId ?? ""} yearId={activeYear.id} />
          
          {assignments.length === 0 ? (
            <EmptyState title="រកមិនឃើញការចាត់តាំង" description="មិនមានទិន្នន័យត្រូវនឹងលក្ខខណ្ឌស្វែងរក។" />
          ) : (
            <div className="space-y-8">
              {grouped.map((g) => (
                <section key={g.key}>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <h2 className="font-moul text-lg text-slate-800">{g.label}</h2>
                      {g.sub && <p className="text-slate-500 text-sm mt-0.5">{g.sub}</p>}
                    </div>
                    {groupBy === "teacher" && (
                      <Link href={`/admin/teacher-assignments/manage?year=${activeYear.id}&teacher=${g.key}`}>
                        <Button variant="outline" size="sm">កែប្រែ</Button>
                      </Link>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {g.items.map((a) => <AssignmentCard key={a.id} row={a} />)}
                  </div>
                </section>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}