import type { PublicReport, PublicSubject, PublicTerm, RankInfo } from "@/lib/public/report";
import { PrintButton } from "./print-button";
import { Card } from "@/components/ui/card";
import { Calendar, User, Trophy, CheckCircle2, XCircle, MinusCircle } from "lucide-react";

// Helpers
function gradeTone(khmer: string | null): string {
  if (!khmer) return "bg-slate-100 text-slate-700";
  if (khmer === "ល្អ") return "bg-green-100 text-green-800 border-green-200";
  if (khmer === "ល្អបង្គួរ") return "bg-blue-100 text-blue-800 border-blue-200";
  if (khmer === "មធ្យម") return "bg-amber-100 text-amber-800 border-amber-200";
  return "bg-red-100 text-red-800 border-red-200";
}

function fmt(n: number | null): string {
  if (n === null || n === undefined) return "—";
  return n.toFixed(2);
}

function RankBadge({ info }: { info: RankInfo | null }) {
  if (!info) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 border border-amber-200 px-3 py-1 text-xs font-semibold text-amber-900">
      <Trophy className="h-3.5 w-3.5" /> ចំណាត់ថ្នាក់ {info.rank}/{info.total}
    </span>
  );
}

export function ReportView({ report }: { report: PublicReport }) {
  return (
    <div className="space-y-6 md:space-y-8 print:space-y-4">
      
      {/* 1. Student Header */}
      <section className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-200 pb-6 print:border-none print:pb-0">
        <div>
          <h1 className="font-moul text-2xl md:text-3xl text-slate-900 print:text-xl">{report.student.name_kh}</h1>
          <p className="text-slate-500 font-inter mt-1 text-sm md:text-base print:text-sm">
            {report.student.student_code} · {report.student.gender === "F" ? "ស្រី" : "ប្រុស"}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <div className="bg-slate-50 rounded-lg px-3 py-1.5 border border-slate-100 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-400" /> ថ្នាក់ទី {report.class.grade_level} ថ្នាក់{report.class.class_name}
          </div>
          <div className="bg-slate-50 rounded-lg px-3 py-1.5 border border-slate-100 flex items-center gap-2">
            <User className="h-4 w-4 text-slate-400" /> ឆ្នាំសិក្សា {report.academic_year.year_name}
          </div>
        </div>
      </section>

      {/* 2. Annual Overview & Attendance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2">
        
        {/* Annual Result */}
        <Card className="bg-primary-600 text-white border-none shadow-md overflow-hidden relative print:shadow-none print:bg-slate-100 print:text-black">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Trophy className="w-24 h-24" />
          </div>
          <div className="p-6 relative z-10">
            <p className="text-primary-100 print:text-slate-500 text-xs font-medium uppercase tracking-wider mb-2">មធ្យមភាគរួមប្រចាំឆ្នាំ</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-inter font-bold">{fmt(report.annual_average)}</span>
              <span className="text-primary-200 print:text-slate-500">/ 50</span>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <RankBadge info={report.annual_rank_info} />
              <span className={`rounded-full px-3 py-1 text-xs font-medium border ${gradeTone(report.annual_khmer_grade)} print:border-slate-300`}>
                {report.annual_khmer_grade ?? "—"}
              </span>
              {report.annual_english_grade && (
                <span className="rounded-full bg-white/20 text-white px-3 py-1 text-xs font-medium print:bg-slate-200 print:text-black">
                  {report.annual_english_grade}
                </span>
              )}
            </div>
          </div>
        </Card>

        {/* Attendance Summary */}
        <Card className="p-6 print:shadow-none print:border-slate-300">
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-4">សង្ខេបវត្តមាន</p>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center bg-green-50 rounded-xl p-3 border border-green-100 print:border-none print:bg-transparent">
              <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-green-700 font-inter">{report.attendance.present}</p>
              <p className="text-[10px] text-green-600 uppercase font-medium mt-1">មានវត្តមាន</p>
            </div>
            <div className="text-center bg-amber-50 rounded-xl p-3 border border-amber-100 print:border-none print:bg-transparent">
              <MinusCircle className="h-5 w-5 text-amber-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-amber-700 font-inter">{report.attendance.absent_permission}</p>
              <p className="text-[10px] text-amber-600 uppercase font-medium mt-1">អវត្តមាន មានច្បាប់</p>
            </div>
            <div className="text-center bg-red-50 rounded-xl p-3 border border-red-100 print:border-none print:bg-transparent">
              <XCircle className="h-5 w-5 text-red-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-red-700 font-inter">{report.attendance.absent_no_permission}</p>
              <p className="text-[10px] text-red-600 uppercase font-medium mt-1">អវត្តមាន គ្មានច្បាប់</p>
            </div>
          </div>
        </Card>

      </div>

      {/* 3. Terms Breakdown */}
      {report.terms.length === 0 ? (
        <div className="text-center p-12 border border-dashed border-slate-300 rounded-2xl text-slate-500">
          មិនទាន់មានពិន្ទុនៅឡើយទេ។
        </div>
      ) : (
        report.terms.map((term) => (
          <TermSection key={term.term_number} term={term} />
        ))
      )}

      {/* Print Button (Mobile) */}
      <div className="print:hidden pt-4">
        <PrintButton />
      </div>
    </div>
  );
}

// =========================================================
// Term Section Component
// =========================================================
function TermSection({ term }: { term: PublicTerm }) {
  return (
    <Card className="overflow-hidden border-slate-200 shadow-sm print:shadow-none print:border-slate-300 print:break-inside-avoid">
      
      {/* Term Header */}
      <div className="bg-slate-50 p-4 md:p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 print:bg-slate-100">
        <h2 className="font-moul text-lg text-slate-900">{term.term_name_kh}</h2>
        <div className="flex flex-wrap items-center gap-2">
          <RankBadge info={term.rank_info} />
          <span className={`rounded-full px-3 py-1 text-xs font-medium border ${gradeTone(term.khmer_grade)} print:border-slate-300`}>
            {term.khmer_grade ?? "—"}
          </span>
          {term.english_grade && (
             <span className="rounded-full bg-slate-200 text-slate-700 px-3 py-1 text-xs font-medium print:bg-transparent print:border print:border-slate-300">
             {term.english_grade}
           </span>
          )}
        </div>
      </div>

      {/* Term Averages */}
      <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100 text-center bg-white">
        <div className="p-3 md:p-4">
          <p className="text-[10px] text-slate-500 uppercase font-medium">មធ្យមភាគខែក្នុងឆមាស</p>
          <p className="text-lg font-inter font-bold text-slate-800 mt-1">{fmt(term.monthly_average)}</p>
        </div>
        <div className="p-3 md:p-4 bg-amber-50/30">
          <p className="text-[10px] text-amber-600 uppercase font-medium">មធ្យមភាគប្រឡងឆមាស</p>
          <p className="text-lg font-inter font-bold text-amber-700 mt-1">{fmt(term.exam_average)}</p>
        </div>
        <div className="p-3 md:p-4 bg-primary-50/30">
          <p className="text-[10px] text-primary-600 uppercase font-medium">មធ្យមភាគប្រចាំឆមាស</p>
          <p className="text-lg font-inter font-bold text-primary-700 mt-1">{fmt(term.overall_average)}</p>
        </div>
      </div>

      {/* Subjects List */}
      <div className="p-0 md:p-2">
        {term.subjects.length === 0 ? (
          <p className="p-6 text-center text-slate-500 text-sm">មិនមានពិន្ទុនៅឡើយទេ។</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {term.subjects.map((s) => (
              <SubjectRow key={s.subject_id} subject={s} />
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}

// =========================================================
// Subject Row Component
// =========================================================
function SubjectRow({ subject }: { subject: PublicSubject }) {
  const maxLabel = subject.max_score !== null ? ` / ${subject.max_score}` : "";

  return (
    <li className="p-4 md:p-5 hover:bg-slate-50 transition-colors print:hover:bg-transparent">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
        
        {/* Subject Title & Averages */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-slate-900 truncate">{subject.subject_name}</h3>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{subject.code}</span>
          </div>
          
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
            <span>មធ្យមខែ៖ <strong className="text-slate-700 font-inter">{fmt(subject.monthly_average)}</strong></span>
            <span>មធ្យមប្រឡងឆមាស៖ <strong className="text-slate-700 font-inter">{fmt(subject.exam_average)}</strong></span>
          </div>
        </div>

        {/* Score Chips & Final Grade */}
        <div className="flex flex-col md:items-end gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-900 font-inter">
              {fmt(subject.average)}
              <span className="text-slate-400 font-normal text-xs">{maxLabel}</span>
            </span>
            <span className={`rounded-md px-2 py-0.5 text-[10px] font-medium border ${gradeTone(subject.khmer_grade)} print:border-slate-300`}>
              {subject.khmer_grade ?? "—"}
            </span>
            {subject.english_grade && (
              <span className="rounded-md bg-slate-100 text-slate-600 px-2 py-0.5 text-[10px] font-medium print:bg-transparent print:border print:border-slate-300">
                {subject.english_grade}
              </span>
            )}
          </div>

          {/* Monthly Chips */}
          {subject.scores.length > 0 && (
            <div className="flex flex-wrap md:justify-end gap-1.5 mt-1">
              {subject.scores.map((sc, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-1.5 rounded border px-2 py-0.5 text-[11px] print:border-slate-300 ${
                    sc.is_semester_exam
                      ? "border-amber-200 bg-amber-50 text-amber-900"
                      : "border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  <span className="text-[10px] text-slate-500">{sc.month_name_kh}</span>
                  <span className="font-inter font-semibold">{sc.score_value ?? "—"}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </li>
  );
}