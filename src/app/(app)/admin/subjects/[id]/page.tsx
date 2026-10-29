import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ArrowLeft } from "lucide-react";
import { getSubjectWithConfigs } from "@/lib/admin/subjects/queries";
import { EditSubjectForm } from "./edit-subject-form";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";

export const instant = false;

export default async function EditSubjectPage({ params }: { params: Promise<{ id: string }> }) {
  await connection();

  const { id } = await params;
  const subject = await getSubjectWithConfigs(id);
  if (!subject) notFound();

  const byGrade = new Map(subject.configs.map((c) => [c.grade_level, c.max_score]));

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      <Link href="/admin/subjects" className="inline-flex items-center text-sm text-slate-500 hover:text-primary-600 mb-2">
        <ArrowLeft className="h-4 w-4 mr-1" /> ត្រឡប់ក្រោយ
      </Link>

      <PageHeader
        title={`កែប្រែមុខវិជ្ជា ${subject.subject_name}`}
        description={`កូដ៖ ${subject.code}`}
      />
      
      <Card className="p-6 md:p-8">
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
      </Card>
    </div>
  );
}