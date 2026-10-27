import type { MonthlyAttendanceReport } from "@/lib/admin/reports/attendance";
import type { SchoolSettings } from "@/lib/admin/school/queries";
import { SchoolReportHeader } from "./school-report-header";
import { ReportSignatures } from "./report-signatures";
import { toKhmer, toKhmerOrdinal } from "@/lib/khmer/numerals";

const KHMER_MONTHS = [
  "មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា",
  "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ",
];

function symbolFor(status: string | undefined): string {
  if (!status) return "";
  if (status === "present") return "ម";
  if (status === "absent_permission") return "ច";
  if (status === "absent_no_permission") return "អ";
  return "";
}

export function AttendanceReportView({
  report,
  settings,
}: {
  report: MonthlyAttendanceReport;
  settings: SchoolSettings;
}) {
  const [year, month] = report.month.split("-");
  const monthNameKh = KHMER_MONTHS[Number(month) - 1] ?? "";
  const daysArray = Array.from({ length: report.days_in_month }, (_, i) => i + 1);

  return (
    <div className="attendance-report">
      <SchoolReportHeader
        settings={settings}
        academicYearName={report.academic_year_name}
        title="បញ្ជីវត្តមានសិស្ស"
        subtitle={`ថ្នាក់ទី ${report.class_name} · ខែ${monthNameKh}`}
      />

     {/* Wrap the table in overflow-x-auto for screen preview */}
      <div className="overflow-x-auto w-full">
        <table className="w-full border-collapse text-[11px] leading-tight print:text-[10px]">
            <thead>
            <tr className="bg-blue-100">
                <th className="border border-blue-300 px-1 py-1 w-8">ល.រ</th>
                <th className="border border-blue-300 px-1 py-1 w-12">អត្តលេខ</th>
                <th className="border border-blue-300 px-1 py-1 text-left min-w-25">ឈ្មោះ</th>
                <th className="border border-blue-300 px-1 py-1 w-8">ភេទ</th>
                
                {/* Days of month */}
                {daysArray.map((d) => (
                <th key={d} className="border border-blue-300 px-0.5 py-1 text-center w-5">
                    {d}
                </th>
                ))}

                {/* Summary */}
                <th className="border border-blue-300 px-1 py-1 w-8 bg-blue-200">មាន</th>
                <th className="border border-blue-300 px-1 py-1 w-8 bg-blue-200">ច្បាប់</th>
                <th className="border border-blue-300 px-1 py-1 w-8 bg-blue-200">អត់</th>
            </tr>
            </thead>
            <tbody>
            {report.students.map((s, i) => {
                return (
                <tr key={s.student_id} className={i % 2 === 0 ? "bg-white" : "bg-blue-50"}>
                    <td className="border border-blue-200 px-1 py-0.5 text-center">
                    {toKhmerOrdinal(i + 1)}
                    </td>
                    <td className="border border-blue-200 px-1 py-0.5 text-center font-mono">
                    {s.student_code}
                    </td>
                    <td className="border border-blue-200 px-1 py-0.5">{s.name_kh}</td>
                    <td className="border border-blue-200 px-1 py-0.5 text-center">
                    {s.gender === "F" ? "ស" : s.gender === "M" ? "ប" : ""}
                    </td>

                    {/* Daily attendance */}
                    {daysArray.map((d) => {
                    const status = s.daily_status[d.toString()];
                    return (
                        <td
                        key={d}
                        className={`border border-blue-200 px-0.5 py-0.5 text-center ${
                            status === "absent_no_permission"
                            ? "text-red-600 font-bold"
                            : status === "absent_permission"
                                ? "text-amber-600 font-bold"
                                : ""
                        }`}
                        >
                        {symbolFor(status)}
                        </td>
                    );
                    })}

                    {/* Summaries */}
                    <td className="border border-blue-200 px-1 py-0.5 text-center font-semibold">
                    {toKhmerOrdinal(s.present_count)}
                    </td>
                    <td className="border border-blue-200 px-1 py-0.5 text-center text-amber-700">
                    {toKhmerOrdinal(s.permission_count)}
                    </td>
                    <td className="border border-blue-200 px-1 py-0.5 text-center text-red-700">
                    {toKhmerOrdinal(s.unpermitted_count)}
                    </td>
                </tr>
                );
            })}
            </tbody>
        </table>
    </div>

      <div className="mt-2 text-[10px]">
        <p>សរុប៖ {toKhmer(report.students.length)} នាក់</p>
      </div>

      <ReportSignatures
        principalName={settings.principal_name_kh}
        homeroomName={report.homeroom_teacher_name}
        dateIso={`${year}-${month}-28`} // End of month approx
      />
    </div>
  );
}