import Link from "next/link";
import { connection } from "next/server";
import { Plus } from "lucide-react";
import { listTeachers, listSubjectOptions } from "@/lib/admin/teachers/queries";
import { TeacherCard } from "./teacher-card";
import { TeacherFilters } from "./teacher-filters";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export const instant = false;
export const metadata = { title: "គ្រូបង្រៀន" };

export default async function TeachersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; subject?: string }>;
}) {
  await connection();

  const sp = await searchParams;
  const [subjects, teachers] = await Promise.all([
    listSubjectOptions(),
    listTeachers({ q: sp.q, subjectId: sp.subject }),
  ]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader 
        title="គ្រប់គ្រងគ្រូបង្រៀន" 
        description="គ្រប់គ្រងព័ត៌មានគ្រូ និងមុខវិជ្ជាជំនាញ"
        action={
          <Link href="/admin/teachers/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              បន្ថែមគ្រូថ្មី
            </Button>
          </Link>
        }
      />

      <TeacherFilters subjects={subjects} q={sp.q ?? ""} subjectId={sp.subject ?? ""} />

      {teachers.length === 0 ? (
        <EmptyState 
          title="មិនទាន់មានគ្រូបង្រៀន" 
          description={sp.q || sp.subject ? "រកមិនឃើញគ្រូត្រូវនឹងលក្ខខណ្ឌស្វែងរក។" : "សូមបង្កើតគណនីគ្រូដំបូងរបស់អ្នក។"}
          action={
            !sp.q && !sp.subject ? (
              <Link href="/admin/teachers/new">
                <Button variant="outline">បង្កើតគណនីគ្រូ</Button>
              </Link>
            ) : null
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teachers.map((t) => (
            <TeacherCard key={t.id} teacher={t} />
          ))}
        </div>
      )}
    </div>
  );
}