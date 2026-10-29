import Link from "next/link";
import { connection } from "next/server";
import { Plus } from "lucide-react";
import { listSubjectsWithConfigs } from "@/lib/admin/subjects/queries";
import { SubjectCard } from "./subject-card";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export const instant = false;
export const metadata = { title: "មុខវិជ្ជា" };

export default async function SubjectsPage() {
  await connection();
  const subjects = await listSubjectsWithConfigs();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader 
        title="គ្រប់គ្រងមុខវិជ្ជា" 
        description="កំណត់មុខវិជ្ជា និងពិន្ទុពេញសម្រាប់ថ្នាក់ទី ៧, ៨, ៩"
        action={
          <Link href="/admin/subjects/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              បន្ថែមមុខវិជ្ជាថ្មី
            </Button>
          </Link>
        }
      />

      {subjects.length === 0 ? (
        <EmptyState 
          title="មិនទាន់មានមុខវិជ្ជា" 
          description="សូមបង្កើតមុខវិជ្ជាដំបូងរបស់អ្នក ដើម្បីចាប់ផ្តើមបញ្ចូលពិន្ទុ។"
          action={
            <Link href="/admin/subjects/new">
              <Button variant="outline">បង្កើតមុខវិជ្ជាដំបូង</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((s) => (
            <SubjectCard key={s.id} subject={s} />
          ))}
        </div>
      )}
    </div>
  );
}