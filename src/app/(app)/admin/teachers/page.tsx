import Link from "next/link";
import { connection } from "next/server";
import { AppShell } from "@/components/app-shell";
import {
  listTeachers,
  listSubjectOptions,
} from "@/lib/admin/teachers/queries";
import { TeacherCard } from "./teacher-card";
import { TeacherFilters } from "./teacher-filters";

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
    listTeachers({
      q: sp.q,
      subjectId: sp.subject,
    }),
  ]);

  return (
    <AppShell title="គ្រូបង្រៀន" backHref="/admin">
      <TeacherFilters
        subjects={subjects}
        q={sp.q ?? ""}
        subjectId={sp.subject ?? ""}
      />

      <Link
        href="/admin/teachers/new"
        className="touch-target rounded-btn bg-brand-600 mb-4 flex w-full items-center justify-center px-4 font-medium text-white active:bg-brand-700"
      >
        + បន្ថែមគ្រូថ្មី
      </Link>

      {teachers.length === 0 ? (
        <div className="rounded-card border border-dashed border-border bg-surface p-6 text-center">
          <p className="text-muted text-sm">
            {sp.q || sp.subject ? "រកមិនឃើញគ្រូ។" : "មិនមានគ្រូនៅឡើយទេ។"}
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {teachers.map((t) => (
            <li key={t.id}>
              <TeacherCard teacher={t} />
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}