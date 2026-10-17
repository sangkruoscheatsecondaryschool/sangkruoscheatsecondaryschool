import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { AppShell } from "@/components/app-shell";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getTeacherClassDetail } from "@/lib/teacher/queries";
import {
  listSubjectsForScoreEntry,
  listTermMonthsForYear,
  getScoreEntryContext,
} from "@/lib/teacher/scores-queries";
import { ScoreEntryForm } from "./score-entry-form";
import { SelectorEmpty } from "./selector-empty";

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

  const allMonths = terms.flatMap((t) =>
    t.months.map((m) => ({ ...m, term_number: t.term_number })),
  );

  const validSubject =
    sp.subject && subjects.some((s) => s.id === sp.subject)
      ? sp.subject
      : undefined;
  const validMonth =
    sp.month && allMonths.some((m) => m.id === sp.month)
      ? sp.month
      : undefined;

  return (
    <AppShell
      title={`បញ្ចូលពិន្ទុ · ${detail.class_name}`}
      backHref={`/teacher/classes/${classId}`}
    >
      {subjects.length === 0 ? (
        <div className="rounded-card border border-dashed border-border bg-surface p-6 text-center">
          <p className="text-muted text-sm">
            អ្នកមិនមានមុខវិជ្ជាដែលត្រូវបញ្ចូលពិន្ទុក្នុងថ្នាក់នេះទេ។
          </p>
          <Link
            href={`/teacher/classes/${classId}`}
            className="text-brand-700 mt-3 inline-block text-sm underline-offset-4 hover:underline"
          >
            ត្រឡប់ទៅថ្នាក់
          </Link>
        </div>
      ) : (
        <>
          {/* Selector */}
          <div className="rounded-card border-border bg-surface mb-4 space-y-3 border p-3">
            <p className="text-muted text-[10px] font-medium uppercase">
              ជ្រើសរើសមុខវិជ្ជា និងខែ
            </p>

            <SubjectPills
              classId={classId}
              subjects={subjects}
              activeId={validSubject ?? ""}
              monthId={validMonth ?? ""}
            />

            <TermMonthChips
              classId={classId}
              terms={terms}
              subjectId={validSubject ?? ""}
              activeId={validMonth ?? ""}
            />
          </div>

          {!validSubject || !validMonth ? (
            <SelectorEmpty
              hasSubjects={subjects.length > 0}
              hasMonth={!!validMonth}
            />
          ) : (
            <ScoreEntryLoader
              classId={classId}
              subjectId={validSubject}
              monthId={validMonth}
              months={allMonths}
            />
          )}
        </>
      )}
    </AppShell>
  );
}

// ------------------- Subcomponents -------------------

import type { SubjectOption, TermMonthGroup } from "@/lib/teacher/scores-queries";

function SubjectPills({
  classId,
  subjects,
  activeId,
  monthId,
}: {
  classId: string;
  subjects: SubjectOption[];
  activeId: string;
  monthId: string;
}) {
  return (
    <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1">
      {subjects.map((s) => {
        const active = s.id === activeId;
        const href = `/teacher/classes/${classId}/scores?subject=${s.id}${
          monthId ? `&month=${monthId}` : ""
        }`;
        return (
          <Link
            key={s.id}
            href={href}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              active
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-border bg-bg text-fg active:bg-slate-100"
            }`}
          >
            {s.subject_name}
          </Link>
        );
      })}
    </div>
  );
}

function TermMonthChips({
  classId,
  terms,
  subjectId,
  activeId,
}: {
  classId: string;
  terms: TermMonthGroup[];
  subjectId: string;
  activeId: string;
}) {
  return (
    <div className="space-y-2">
      {terms.map((t) => (
        <div key={t.term_number}>
          <p className="text-muted mb-1 text-[10px] font-medium uppercase">
            {t.term_name_kh}
          </p>
          <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-0.5">
            {t.months.map((m) => {
              const active = m.id === activeId;
              const href = `/teacher/classes/${classId}/scores?${
                subjectId ? `subject=${subjectId}&` : ""
              }month=${m.id}`;
              return (
                <Link
                  key={m.id}
                  href={href}
                  className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    active
                      ? m.is_semester_exam
                        ? "border-amber-600 bg-amber-500 text-white"
                        : "border-brand-600 bg-brand-600 text-white"
                      : m.is_semester_exam
                        ? "border-amber-300 bg-amber-50 text-amber-900 active:bg-amber-100"
                        : "border-border bg-bg text-fg active:bg-slate-100"
                  }`}
                >
                  {m.month_name_kh}
                  {m.is_semester_exam ? " · ប្រឡង" : ""}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

async function ScoreEntryLoader({
  classId,
  subjectId,
  monthId,
  months,
}: {
  classId: string;
  subjectId: string;
  monthId: string;
  months: { id: string; month_name_kh: string; is_semester_exam: boolean }[];
}) {
  const ctx = await getScoreEntryContext(classId, subjectId, monthId);
  if (!ctx) {
    return (
      <div className="rounded-card border border-dashed border-border bg-surface p-6 text-center">
        <p className="text-muted text-sm">រកមិនឃើញទិន្នន័យ។</p>
      </div>
    );
  }
  return (
    <ScoreEntryForm
      key={`${ctx.subject_id}__${ctx.term_month_id}`}
      ctx={ctx}
    />
  );
}