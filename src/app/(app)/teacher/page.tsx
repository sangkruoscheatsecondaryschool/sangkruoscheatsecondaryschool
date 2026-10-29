import Link from "next/link";
import { connection } from "next/server";
import { School } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getTeacherClassCards } from "@/lib/teacher/queries";
import { TeacherClassCard } from "./teacher-class-card";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export const instant = false;
export const metadata = { title: "គ្រូបង្រៀន" };

export default async function TeacherHomePage() {
  await connection();

  const user = await getCurrentUser();
  if (!user) return null;

  const classes = await getTeacherClassCards(user.id);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader 
        title="ថ្នាក់របស់ខ្ញុំ" 
        description="គ្រប់គ្រងថ្នាក់រៀន បញ្ចូលពិន្ទុ និងកត់ត្រាវត្តមាន"
      />

      {classes.length === 0 ? (
        <EmptyState 
          title="មិនទាន់មានថ្នាក់រៀន" 
          description="អ្នកមិនទាន់ត្រូវបានចាត់តាំងជាគ្រូបន្ទុកថ្នាក់ ឬគ្រូបង្រៀនមុខវិជ្ជាណាមួយទេ។ សូមទាក់ទងនាយកសាលា។"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((c) => (
            <TeacherClassCard key={c.class_id} card={c} />
          ))}
        </div>
      )}
    </div>
  );
}