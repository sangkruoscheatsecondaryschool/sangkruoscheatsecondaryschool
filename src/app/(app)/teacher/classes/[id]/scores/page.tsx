import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ArrowLeft } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getTeacherClassDetail } from "@/lib/teacher/queries";
import { listSubjectsForScoreEntry, listTermMonthsForYear, getScoreEntryContext } from "@/lib/teacher/scores-queries";
import { ScoreEntryForm } from "./score-entry-form";
import { SelectorEmpty } from "./selector-empty";
import { Card } from "@/components/ui/card";

export const instant = false;

export default async function ScoreEntryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ subject?: string; month?: string }>;
}) {
  await connection();

  const user = await getCurrentUser();
  if (!user) return null;

  const { id: classId } = await params;
  const sp = await searchParams;

  const detail = await getTeacherClassDetail(user.id, classId);
  if (!detail) notFound();

  const [subjects, terms] = await Promise.all([
    listSubjectsForScoreEntry(user.id, classId, detail.is_homeroom),
    listTermMonthsForYear(detail.academic_year_id),
  ]);

  const allMonths = terms.flatMap((t) => t.months.map((m) => ({ ...m, term_number: t.term_number })));

  const validSubject = sp.subject && subjects.some((s) => s.id === sp.subject) ? sp.subject : undefined;
  const validMonth = sp.month && allMonths.some((m) => m.id === sp.month) ? sp.month : undefined;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20 max-w-4xl mx-auto">
      <Link href={`/teacher/classes/${classId}`} className="inline-flex items-center text-sm text-slate-500 hover:text-primary-600 mb-2">
        <ArrowLeft className="h-4 w-4 mr-1" /> ត្រឡប់ក្រោយ
      </Link>

      <div>
        <h1 className="font-moul text-2xl text-slate-900">បញ្ចូលពិន្ទុ · {detail.class_name}</h1>
        <p className="text-slate-500 mt-1 text-sm">ជ្រើសរើសមុខវិជ្ជា និងខែ ដើម្បីបញ្ចូលពិន្ទុសិស្ស</p>
      </div>

      {subjects.length === 0 ? (
        <Card className="p-8 text-center text-slate-500">
          អ្នកមិនមានមុខវិជ្ជាដែលត្រូវបញ្ចូលពិន្ទុក្នុងថ្នាក់នេះទេ។
        </Card>
      ) : (
        <>
          {/* Selectors */}
          <Card className="p-4 md:p-6 space-y-6 bg-white border-slate-200">
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase mb-3">មុខវិជ្ជា</p>
              <div className="-mx-1 flex gap-2 overflow-x-auto pb-1">
                {subjects.map((s) => {
                  const active = s.id === validSubject;
                  const href = `/teacher/classes/${classId}/scores?subject=${s.id}${validMonth ? `&month=${validMonth}` : ""}`;
                  return (
                    <Link
                      key={s.id}
                      href={href}
                      className={`shrink-0 rounded-xl border px-4 py-2 text-sm font-medium transition-all ${
                        active
                          ? "border-primary-600 bg-primary-600 text-white shadow-sm"
                          : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {s.subject_name}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase mb-3">ខែ</p>
              <div className="space-y-4">
                {terms.map((t) => (
                  <div key={t.term_number}>
                    <p className="text-xs text-slate-400 mb-2">{t.term_name_kh}</p>
                    <div className="-mx-1 flex gap-2 overflow-x-auto pb-1">
                      {t.months.map((m) => {
                        const active = m.id === validMonth;
                        const href = `/teacher/classes/${classId}/scores?${validSubject ? `subject=${validSubject}&` : ""}month=${m.id}`;
                        return (
                          <Link
                            key={m.id}
                            href={href}
                            className={`shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                              active
                                ? m.is_semester_exam
                                  ? "border-amber-500 bg-amber-500 text-white shadow-sm"
                                  : "border-primary-600 bg-primary-600 text-white shadow-sm"
                                : m.is_semester_exam
                                  ? "border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100"
                                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            {m.month_name_kh}
                            {m.is_semester_exam ? " · ប្រឡងឆមាស" : ""}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {!validSubject || !validMonth ? (
            <SelectorEmpty hasSubjects={subjects.length > 0} hasMonth={!!validMonth} />
          ) : (
            <ScoreEntryLoader classId={classId} subjectId={validSubject} monthId={validMonth} months={allMonths} />
          )}
        </>
      )}
    </div>
  );
}

async function ScoreEntryLoader({ classId, subjectId, monthId }: { classId: string; subjectId: string; monthId: string; months: any[] }) {
  const ctx = await getScoreEntryContext(classId, subjectId, monthId);
  if (!ctx) {
    return <Card className="p-8 text-center text-slate-500">រកមិនឃើញទិន្នន័យ។</Card>;
  }
  return <ScoreEntryForm key={`${subjectId}-${monthId}`} ctx={ctx} />;
}