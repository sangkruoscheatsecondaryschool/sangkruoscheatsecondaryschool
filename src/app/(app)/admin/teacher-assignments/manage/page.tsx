import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ArrowLeft } from "lucide-react";
import { getAcademicYear } from "@/lib/admin/academic-years/queries";
import { listClassOptions, listSubjectOptions, listTeacherOptions, listAssignmentsForYear, listTakenSubjectsByClass } from "@/lib/admin/teacher-assignments/queries";
import { TeacherSelector } from "./teacher-selector";
import { ManageForm } from "./manage-form";
import { PageHeader } from "@/components/layout/page-header";

export const instant = false;
export const metadata = { title: "ការចាត់តាំងគ្រូ" };

export default async function ManageAssignmentsPage({ searchParams }: { searchParams: Promise<{ year?: string; teacher?: string }> }) {
  await connection();
  const sp = await searchParams;
  if (!sp.year) notFound();

  const [year, teachers, classes, subjects] = await Promise.all([
    getAcademicYear(sp.year), listTeacherOptions(), listClassOptions(sp.year), listSubjectOptions(),
  ]);
  if (!year) notFound();

  const validTeacherId = sp.teacher && teachers.some((t) => t.id === sp.teacher) ? sp.teacher : undefined;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      <Link href={`/admin/teacher-assignments?year=${year.id}`} className="inline-flex items-center text-sm text-slate-500 hover:text-primary-600 mb-2">
        <ArrowLeft className="h-4 w-4 mr-1" /> ត្រឡប់ក្រោយ
      </Link>

      {!validTeacherId ? (
        <>
          <PageHeader title="ចាត់តាំងគ្រូ" description="ជ្រើសរើសគ្រូដែលអ្នកចង់ចាត់តាំងមុខវិជ្ជា" />
          <TeacherSelector yearId={year.id} teachers={teachers} yearName={year.year_name} />
        </>
      ) : (
        <ManageAssignmentsLoader yearId={year.id} teacherId={validTeacherId} classes={classes} subjects={subjects} teachers={teachers} />
      )}
    </div>
  );
}

// Helper to fetch data just for the selected teacher
async function ManageAssignmentsLoader({ yearId, teacherId, classes, subjects, teachers }: any) {
  const currentTeacher = teachers.find((t: any) => t.id === teacherId);
  const [assignments, takenByClass] = await Promise.all([
    listAssignmentsForYear(yearId, { teacherId }),
    listTakenSubjectsByClass(yearId, teacherId),
  ]);

  const initialByClass: Record<string, string[]> = {};
  for (const a of assignments) {
    if (!initialByClass[a.class_id]) initialByClass[a.class_id] = [];
    initialByClass[a.class_id].push(a.subject_id);
  }

  return (
    <>
      <PageHeader title={`ចាត់តាំងគ្រូ · ${currentTeacher.full_name_kh}`} description="ធីកជ្រើសរើសមុខវិជ្ជាដែលគ្រូនេះបង្រៀន" />
      <ManageForm yearId={yearId} teacherId={teacherId} classes={classes} subjects={subjects} initialByClass={initialByClass} takenByClass={takenByClass} />
    </>
  );
}