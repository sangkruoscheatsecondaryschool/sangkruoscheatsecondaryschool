import type {
  PublicReport,
  PublicSubject,
  PublicTerm,
  RankInfo,
} from "@/lib/public/report";
import { PrintButton } from "./print-button";

// =========================================================
// Helpers
// =========================================================
function gradeTone(khmer: string | null): string {
  if (!khmer) return "bg-slate-100 text-slate-700";
  if (khmer === "ល្អ") return "bg-green-100 text-green-800";
  if (khmer === "ល្អបង្គួរ") return "bg-blue-100 text-blue-800";
  if (khmer === "មធ្យម") return "bg-amber-100 text-amber-800";
  return "bg-red-100 text-red-800";
}

function fmt(n: number | null): string {
  if (n === null || n === undefined) return "—";
  return n.toFixed(2);
}

function RankBadge({ info }: { info: RankInfo | null }) {
  if (!info) return null;
  return (
    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-900">
      ចំណាត់ថ្នាក់ {info.rank}/{info.total}
    </span>
  );
}

// =========================================================
// Main view
// =========================================================
export function ReportView({ report }: { report: PublicReport }) {
  return (
    <div className="space-y-4 print:space-y-2">
      {/* Student header */}
      <section className="rounded-card border-border bg-surface border p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="font-moul truncate text-lg">
              {report.student.name_kh}
            </p>
            <p className="text-muted mt-0.5 font-mono text-xs">
              {report.student.student_code}
              {report.student.gender
                ? ` · ${report.student.gender === "F" ? "ស្រី" : "ប្រុស"}`
                : ""}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700">
            ថ្នាក់ទី {report.class.grade_level}
          </span>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
          <div>
            <p className="text-muted">ថ្នាក់</p>
            <p className="font-medium">{report.class.class_name}</p>
          </div>
          <div>
            <p className="text-muted">ឆ្នាំសិក្សា</p>
            <p className="font-medium">{report.academic_year.year_name}</p>
          </div>
        </div>
      </section>

      {/* Annual result */}
      <section className="rounded-card border-border bg-surface border p-4">
        <p className="text-muted text-[10px] font-medium uppercase">
          មធ្យមភាគរួមប្រចាំឆ្នាំ
        </p>
        <div className="mt-2 flex flex-wrap items-baseline gap-2">
          <span className="text-3xl font-bold tabular-nums">
            {fmt(report.annual_average)}
          </span>
          <span className="text-muted text-sm">/ 50</span>
          <RankBadge info={report.annual_rank_info} />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${gradeTone(
              report.annual_khmer_grade,
            )}`}
          >
            {report.annual_khmer_grade ?? "—"}
          </span>
          {report.annual_english_grade ? (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
              {report.annual_english_grade}
            </span>
          ) : null}
        </div>
      </section>

      {/* Attendance summary */}
      <AttendanceCard summary={report.attendance} />

      {/* Terms */}
      {report.terms.length === 0 ? (
        <div className="rounded-card border border-dashed border-border bg-surface p-6 text-center">
          <p className="text-muted text-sm">មិនមានពិន្ទុនៅឡើយទេ។</p>
        </div>
      ) : (
        report.terms.map((term) => (
          <TermSection key={term.term_number} term={term} />
        ))
      )}

      <div className="print:hidden">
        <PrintButton />
      </div>
    </div>
  );
}

// =========================================================
// Attendance
// =========================================================
function AttendanceCard({
  summary,
}: {
  summary: PublicReport["attendance"];
}) {
  if (summary.total === 0) return null;

  return (
    <section className="rounded-card border-border bg-surface border p-4">
      <p className="text-muted text-[10px] font-medium uppercase">
        វត្តមានសរុប
      </p>
      <div className="mt-2 grid grid-cols-4 gap-2 text-center">
        <Stat label="សរុប" value={summary.total} />
        <Stat label="មានវត្តមាន" value={summary.present} tone="green" />
        <Stat label="អវត្តមាន មានច្បាប់" value={summary.absent_permission} tone="amber" />
        <Stat
          label="អវត្តមាន គ្មានច្បាប់"
          value={summary.absent_no_permission}
          tone="red"
        />
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  tone = "gray",
}: {
  label: string;
  value: number;
  tone?: "gray" | "green" | "amber" | "red";
}) {
  const cls =
    tone === "green"
      ? "border-green-200 bg-green-50 text-green-800"
      : tone === "amber"
        ? "border-amber-200 bg-amber-50 text-amber-900"
        : tone === "red"
          ? "border-red-200 bg-red-50 text-red-800"
          : "border-border bg-bg";
  return (
    <div className={`rounded-btn border ${cls} px-2 py-2`}>
      <p className="text-[10px] uppercase">{label}</p>
      <p className="mt-0.5 text-lg font-semibold tabular-nums">{value}</p>
    </div>
  );
}

// =========================================================
// Term section
// =========================================================
function TermSection({ term }: { term: PublicTerm }) {
  return (
    <section className="rounded-card border-border bg-surface border p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-moul text-base">{term.term_name_kh}</h2>
        <div className="flex flex-wrap items-center gap-1.5">
          <RankBadge info={term.rank_info} />
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${gradeTone(
              term.khmer_grade,
            )}`}
          >
            {term.khmer_grade ?? "—"}
          </span>
          {term.english_grade ? (
            <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-700">
              {term.english_grade}
            </span>
          ) : null}
        </div>
      </div>

      {/* Three-column summary: monthly / exam / semester */}
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <SummaryCell label="មធ្យមភាគប្រចាំខែក្នុងឆមាស" value={term.monthly_average} />
        <SummaryCell
          label="មធ្យមភាគប្រឡងឆមាស"
          value={term.exam_average}
          tone="amber"
        />
        <SummaryCell
          label="មធ្យមភាគប្រចាំឆមាស"
          value={term.overall_average}
          tone="brand"
        />
      </div>

      {term.subjects.length === 0 ? (
        <p className="text-muted mt-3 text-xs">មិនមានពិន្ទុនៅឡើយទេ។</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {term.subjects.map((s) => (
            <SubjectRow key={s.subject_id} subject={s} />
          ))}
        </ul>
      )}
    </section>
  );
}

function SummaryCell({
  label,
  value,
  tone = "gray",
}: {
  label: string;
  value: number | null;
  tone?: "gray" | "amber" | "brand";
}) {
  const cls =
    tone === "amber"
      ? "border-amber-200 bg-amber-50"
      : tone === "brand"
        ? "border-brand-200 bg-brand-50"
        : "border-border bg-bg";
  return (
    <div className={`rounded-btn border ${cls} px-2 py-2`}>
      <p className="text-muted text-[10px] uppercase">{label}</p>
      <p className="mt-0.5 text-base font-semibold tabular-nums">
        {fmt(value)}
        <span className="text-muted ml-0.5 text-[10px] font-normal">/50</span>
      </p>
    </div>
  );
}

// =========================================================
// Subject row
// =========================================================
function SubjectRow({ subject }: { subject: PublicSubject }) {
  const maxLabel =
    subject.max_score !== null ? ` / ${subject.max_score}` : "";

  return (
    <li className="rounded-btn border-border bg-bg border p-3">
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
        <p className="font-medium">មុខវិជ្ជា: {subject.subject_name}</p>
        <span className="text-muted">
          មធ្យមប្រចាំខែក្នុងឆមាស៖
          <span className="text-fg ml-1 font-medium tabular-nums">
            {fmt(subject.monthly_average)}
          </span>
        </span>
        <span className="text-muted">
          មធ្យមប្រឡងឆមាស៖
          <span className="text-fg ml-1 font-medium tabular-nums">
            {fmt(subject.exam_average)}
          </span>
        </span>
      </div>

      {subject.scores.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {subject.scores.map((sc, idx) => (
            <span
              key={idx}
              className={`flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] ${
                sc.is_semester_exam
                  ? "border-amber-300 bg-amber-50 text-amber-900"
                  : "border-border bg-surface"
              }`}
            >
              <span>{sc.month_name_kh}</span>
              {sc.score_value !== null ? (
                <span className="font-semibold tabular-nums">
                  {sc.score_value}
                </span>
              ) : (
                <span className="text-muted">—</span>
              )}
              {sc.is_semester_exam ? (
                <span className="text-[9px] uppercase">ប្រឡងឆមាស</span>
              ) : null}
            </span>
          ))}
        </div>
      ) : null}
    </li>
  );
}
