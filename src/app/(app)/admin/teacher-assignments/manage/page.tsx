import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { AppShell } from "@/components/app-shell";
import { getAcademicYear } from "@/lib/admin/academic-years/queries";
import {
  listClassOptions,
  listSubjectOptions,
  listTeacherOptions,
  listAssignmentsForYear,
  listTakenSubjectsByClass,
} from "@/lib/admin/teacher-assignments/queries";
import { TeacherSelector } from "./teacher-selector";
import { ManageForm } from "./manage-form";

export const instant = false;

export const metadata = { title: "ការចាត់តាំងគ្រូ" };

export default async function ManageAssignmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; teacher?: string }>;
}) {
  await connection();

  const sp = await searchParams;
  if (!sp.year) notFound();

  const [year, teachers, classes, subjects] = await Promise.all([
    getAcademicYear(sp.year),
    listTeacherOptions(),
    listClassOptions(sp.year),
    listSubjectOptions(),
  ]);

  if (!year) notFound();

  const validTeacherId =
    sp.teacher && teachers.some((t) => t.id === sp.teacher)
      ? sp.teacher
      : undefined;

  if (!validTeacherId) {
    return (
      <AppShell
        title="ការចាត់តាំងគ្រូ"
        backHref={`/admin/teacher-assignments?year=${year.id}`}
      >
        <TeacherSelector
          yearId={year.id}
          teachers={teachers}
          yearName={year.year_name}
        />
      </AppShell>
    );
  }

  const currentTeacher = teachers.find((t) => t.id === validTeacherId)!;

  // Load existing assignments for this teacher
  const [assignments, takenByClass] = await Promise.all([
    listAssignmentsForYear(year.id, { teacherId: validTeacherId }),
    listTakenSubjectsByClass(year.id, validTeacherId),
  ]);

  const initialByClass: Record<string, string[]> = {};
  for (const a of assignments) {
    if (!initialByClass[a.class_id]) initialByClass[a.class_id] = [];
    initialByClass[a.class_id].push(a.subject_id);
  }

  return (
    <AppShell
      title={`ការចាត់តាំង · ${currentTeacher.full_name_kh}`}
      backHref={`/admin/teacher-assignments?year=${year.id}&teacher=${validTeacherId}`}
    >
      <div className="space-y-4">
        <div className="rounded-card border-border bg-surface border p-3">
          <p className="text-muted text-xs">គ្រូបង្រៀន</p>
          <p className="font-moul mt-0.5 text-sm">
            {currentTeacher.full_name_kh}
          </p>
          <Link
            href={`/admin/teacher-assignments/manage?year=${year.id}`}
            className="text-brand-700 mt-2 inline-block text-xs underline-offset-4 hover:underline"
          >
            ផ្លាស់ប្ដូរគ្រូ
          </Link>
        </div>

        {classes.length === 0 ? (
          <div className="rounded-card border border-dashed border-border bg-surface p-6 text-center">
            <p className="text-muted text-sm">
              មិនមានថ្នាក់រៀននៅក្នុងឆ្នាំនេះទេ។
            </p>
          </div>
        ) : (
          <ManageForm
            yearId={year.id}
            teacherId={validTeacherId}
            classes={classes}
            subjects={subjects}
            initialByClass={initialByClass}
            takenByClass={takenByClass}
          />
        )}
      </div>
    </AppShell>
  );
}