import Link from "next/link";
import { connection } from "next/server";
import { AppShell } from "@/components/app-shell";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getTeacherClassCards } from "@/lib/teacher/queries";
import { TeacherClassCard } from "./teacher-class-card";

export const instant = false;

export const metadata = { title: "គ្រូបង្រៀន" };

export default async function TeacherHomePage() {
  await connection();

  const user = await getCurrentUser();
  if (!user) return null;

  const classes = await getTeacherClassCards(user.id);

  return (
    <AppShell title="ថ្នាក់របស់ខ្ញុំ" backHref="/dashboard">
      {classes.length === 0 ? (
        <div className="rounded-card border border-dashed border-border bg-surface p-6 text-center">
          <p className="font-moul text-sm">មិនមានថ្នាក់នៅឡើយទេ</p>
          <p className="text-muted mt-2 text-xs">
            អ្នកមិនទាន់ត្រូវបានចាត់តាំងជាគ្រូបន្ទុកថ្នាក់ ឬគ្រូបង្រៀនមុខវិជ្ជាណាមួយទេ។
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {classes.map((c) => (
            <li key={c.class_id}>
              <TeacherClassCard card={c} />
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}