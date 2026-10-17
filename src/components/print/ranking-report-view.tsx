import type {
  RankingReport,
  RankedStudent,
} from "@/lib/admin/reports/ranking";
import type { SchoolSettings } from "@/lib/admin/school/queries";
import { SchoolReportHeader } from "./school-report-header";
import { ReportSignatures } from "./report-signatures";
import { toKhmer, toKhmerOrdinal } from "@/lib/khmer/numerals";

const SPLIT_THRESHOLD = 22;

export function RankingReportView({
  report,
  settings,
}: {
  report: RankingReport;
  settings: SchoolSettings;
}) {
  const twoColumn = report.students.length > SPLIT_THRESHOLD;
  const half = Math.ceil(report.students.length / 2);
  const left = twoColumn ? report.students.slice(0, half) : report.students;
  const right = twoColumn ? report.students.slice(half) : [];

  return (
    <div className="ranking-report">
      <SchoolReportHeader
        settings={settings}
        academicYearName={report.academic_year_name}
        title={report.title}
        subtitle={report.subtitle}
      />

      <div className="mb-2 text-xs">
        <p>
          សិស្សសរុប៖ {toKhmer(report.summary.total)} នាក់ ·{" "}
          ប្រុស៖ {toKhmer(report.summary.male)} ·{" "}
          ស្រី៖ {toKhmer(report.summary.female)}
        </p>
      </div>

      <div className={twoColumn ? "grid grid-cols-2 gap-2" : ""}>
        <RankingTable report={report} students={left} startIndex={0} />
        {twoColumn ? (
          <RankingTable report={report} students={right} startIndex={half} />
        ) : null}
      </div>

      <ReportSummary report={report} />

      <ReportSignatures
        principalName={settings.principal_name_kh}
        homeroomName={report.homeroom_teacher_name}
      />
    </div>
  );
}

// =========================================================
// Main table
// =========================================================
function RankingTable({
  report,
  students,
  startIndex,
}: {
  report: RankingReport;
  students: RankedStudent[];
  startIndex: number;
}) {
  return (
    <table className="w-full border-collapse text-[10px] leading-tight">
      <thead>
        <tr className="bg-blue-100">
          <th className="border border-blue-300 px-1 py-1">ល.រ</th>
          <th className="border border-blue-300 px-1 py-1">អត្តលេខ</th>
          <th className="border border-blue-300 px-1 py-1 text-left">
            គោត្តនាមនិងនាម
          </th>
          <th className="border border-blue-300 px-1 py-1">ភេទ</th>
          {report.columns.map((c) => (
            <th
              key={c.key}
              className={`border border-blue-300 px-1 py-1 ${
                c.bold ? "bg-blue-200 font-semibold" : ""
              }`}
            >
              {c.label}
            </th>
          ))}
          <th className="border border-blue-300 px-1 py-1">ចំណាត់ថ្នាក់</th>
          <th className="border border-blue-300 px-1 py-1">និទ្ទេស</th>
        </tr>
      </thead>
      <tbody>
        {students.map((s, i) => (
          <tr key={s.student_id} className={i % 2 === 0 ? "bg-white" : "bg-blue-50"}>
            <td className="border border-blue-200 px-1 py-0.5 text-center tabular-nums">
              {toKhmerOrdinal(startIndex + i + 1)}
            </td>
            <td className="border border-blue-200 px-1 py-0.5 text-center font-mono">
              {s.student_code}
            </td>
            <td className="border border-blue-200 px-1 py-0.5">{s.name_kh}</td>
            <td className="border border-blue-200 px-1 py-0.5 text-center">
              {s.gender === "F" ? "ស្រី" : s.gender === "M" ? "ប្រុស" : "—"}
            </td>
            {report.columns.map((c) => {
              const v = s.values[c.key];
              return (
                <td
                  key={c.key}
                  className={`border border-blue-200 px-1 py-0.5 text-center tabular-nums ${
                    c.bold ? "font-semibold" : ""
                  }`}
                >
                  {v === null || v === undefined ? "—" : v.toFixed(2)}
                </td>
              );
            })}
            <td className="border border-blue-200 px-1 py-0.5 text-center font-semibold tabular-nums">
              {s.rank ?? "—"}
            </td>
            <td className="border border-blue-200 px-1 py-0.5 text-center">
              <span className="text-[9px]">{s.khmer_grade ?? "—"}</span>
              {s.english_grade ? (
                <span className="ml-0.5 text-[9px] text-slate-600">
                  · {s.english_grade}
                </span>
              ) : null}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// =========================================================
// Summary footer
// =========================================================
function ReportSummary({ report }: { report: RankingReport }) {
  const { summary } = report;

  return (
    <div className="mt-4 grid grid-cols-3 items-start gap-3 text-[10px]">
      {/* ===== Left: textual summary ===== */}
      <div>
        <p className="font-medium">- បញ្ជីបញ្ចីត្រឹមចំនួនសិស្ស ៖</p>
        <p className="ml-3">
          សិស្សសរុប៖ {toKhmer(summary.total)} នាក់ · ប្រុស{" "}
          {toKhmer(summary.male)} · ស្រី {toKhmer(summary.female)}
        </p>
        <p className="ml-3 mt-0.5">
          សិស្សជាប់៖ {toKhmer(summary.pass)} នាក់ · សិស្សធ្លាក់៖{" "}
          {toKhmer(summary.fail)} នាក់
        </p>
      </div>

      {/* ===== Middle: Khmer grade tiers ===== */}
      <div>
        <GradeTierTable
          headerLabel="និទ្ទេស"
          total={summary.total}
          rows={summary.khmer_grades.map((g) => ({
            label: g.label,
            count: g.count,
            female: g.female,
          }))}
        />
      </div>

      {/* ===== Right: English grade tiers ===== */}
      <div>
        <GradeTierTable
          headerLabel="និទ្ទេស"
          total={summary.total}
          rows={summary.grades.map((g) => ({
            label: g.letter,
            count: g.count,
            female: g.female,
          }))}
        />
      </div>
    </div>
  );
}

// =========================================================
// Reusable grade tier table
// =========================================================
function GradeTierTable({
  headerLabel,
  total,
  rows,
}: {
  headerLabel: string;
  total: number;
  rows: { label: string; count: number; female: number }[];
}) {
  return (
    <table className="w-full border-collapse text-[10px]">
      <thead>
        <tr className="bg-blue-50">
          <th className="border border-blue-300 px-2 py-0.5">{headerLabel}</th>
          <th className="border border-blue-300 px-2 py-0.5">ចំនួន</th>
          <th className="border border-blue-300 px-2 py-0.5">ស្រី</th>
          <th className="border border-blue-300 px-2 py-0.5">%</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => {
          const pct =
            total > 0 ? ((row.count / total) * 100).toFixed(2) : "0.00";
          return (
            <tr key={row.label}>
              <td className="border border-blue-300 px-2 py-0.5 text-center font-medium">
                {row.label}
              </td>
              <td className="border border-blue-300 px-2 py-0.5 text-center tabular-nums">
                {toKhmerOrdinal(row.count)}
              </td>
              <td className="border border-blue-300 px-2 py-0.5 text-center tabular-nums">
                {toKhmerOrdinal(row.female)}
              </td>
              <td className="border border-blue-300 px-2 py-0.5 text-right tabular-nums">
                {pct}%
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}