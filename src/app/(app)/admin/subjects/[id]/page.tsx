import { notFound } from "next/navigation";
import { connection } from "next/server";
import { AppShell } from "@/components/app-shell";
import { getSubjectWithConfigs } from "@/lib/admin/subjects/queries";
import { EditSubjectForm } from "./edit-subject-form";

export const instant = false;

export default async function EditSubjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();

  const { id } = await params;
  const subject = await getSubjectWithConfigs(id);
  if (!subject) notFound();

  const byGrade = new Map(subject.configs.map((c) => [c.grade_level, c.max_score]));

  return (
    <AppShell title={subject.subject_name} backHref="/admin/subjects">
      <EditSubjectForm
        subjectId={subject.id}
        defaults={{
          subject_name: subject.subject_name,
          code: subject.code,
          p_max_grade7: Number(byGrade.get(7) ?? 50),
          p_max_grade8: Number(byGrade.get(8) ?? 50),
          p_max_grade9: Number(byGrade.get(9) ?? 100),
        }}
      />
    </AppShell>
  );
}