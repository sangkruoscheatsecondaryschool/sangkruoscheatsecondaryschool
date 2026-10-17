import type { MasterTimetableData } from "@/lib/admin/reports/timetable";
import type { SchoolSettings } from "@/lib/admin/school/queries";
import { SchoolReportHeader } from "./school-report-header";
import { ReportSignatures } from "./report-signatures";
import { toKhmerOrdinal } from "@/lib/khmer/numerals";

const DAYS = [
  { n: 1, label: "ចន្ទ" },
  { n: 2, label: "អង្គារ" },
  { n: 3, label: "ពុធ" },
  { n: 4, label: "ព្រ.ហ" },
  { n: 5, label: "សុក្រ" },
  { n: 6, label: "សៅរ៍" },
];

const SLOTS = [1, 2, 3, 4, 5, 6, 7, 8];

export function MasterTimetableView({
  data,
  settings,
}: {
  data: MasterTimetableData;
  settings: SchoolSettings;
}) {
  return (
    <div className="master-timetable-report mb-8">
      <SchoolReportHeader
        settings={settings}
        academicYearName={data.academic_year_name}
        title="តារាងកាលវិភាគបង្រៀនសរុប (គ្រូទាំងអស់)"
        subtitle=""
      />

      {/* 53 Columns total (3 info + 48 schedule + 2 info) */}
      <table className="w-full border-collapse text-[8px] leading-tight">
        <thead>
          <tr className="bg-blue-100">
            <th className="border border-blue-300 px-1 py-1 w-6">ល.រ</th>
            <th className="border border-blue-300 px-1 py-1 min-w-[80px]">ឈ្មោះគ្រូ</th>
            <th className="border border-blue-300 px-1 py-1 w-8">ភេទ</th>
            
            {/* Days */}
            {DAYS.map((d) => (
              <th key={d.n} colSpan={8} className="border border-blue-300 px-1 py-1 text-center">
                {d.label}
              </th>
            ))}

            <th className="border border-blue-300 px-1 py-1 w-12">បន្ទុកថ្នាក់</th>
            <th className="border border-blue-300 px-1 py-1 w-12">ផ្សេងៗ</th>
          </tr>
          <tr className="bg-blue-50">
            <th colSpan={3} className="border border-blue-300"></th>
            {DAYS.map((d) => (
              SLOTS.map((s) => (
                <th key={`${d.n}-${s}`} className="border border-blue-300 px-0 py-0.5 text-center text-[7px] w-4">
                  {s}
                </th>
              ))
            ))}
            <th colSpan={2} className="border border-blue-300"></th>
          </tr>
        </thead>
        <tbody>
          {data.teachers.map((t, i) => (
            <tr key={t.teacher_id} className={i % 2 === 0 ? "bg-white" : "bg-blue-50"}>
              <td className="border border-blue-200 px-1 py-0.5 text-center">
                {toKhmerOrdinal(i + 1)}
              </td>
              <td className="border border-blue-200 px-1 py-0.5">
                {t.name_kh}
              </td>
              <td className="border border-blue-200 px-1 py-0.5 text-center">
                {t.gender === "F" ? "ស" : t.gender === "M" ? "ប" : ""}
              </td>

              {/* Schedule Data */}
              {DAYS.map((d) => (
                SLOTS.map((s) => {
                  const cell = t.schedule[d.n]?.[s];
                  return (
                    <td key={`${d.n}-${s}`} className="border border-blue-200 px-0.5 py-0.5 text-center">
                      {cell ? (
                        <div className="flex flex-col items-center leading-none">
                          <span className="font-bold">{cell.subject}</span>
                          <span className="text-[7px] text-gray-600">{cell.className}</span>
                        </div>
                      ) : null}
                    </td>
                  );
                })
              ))}

              <td className="border border-blue-200 px-1 py-0.5 text-center">
                {t.homeroom_class}
              </td>
              <td className="border border-blue-200 px-1 py-0.5">
                {/* Notes */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 text-[9px] text-gray-600">
        <p>* លេខ ១ ដល់ ៤ ជាវេនព្រឹក, លេខ ៥ ដល់ ៨ ជាវេនល្ងាច</p>
      </div>

      <ReportSignatures
        principalName={settings.principal_name_kh}
        secondaryTitle="នាយករង / អ្នកគ្រប់គ្រងកាលវិភាគ"
        homeroomName={null}
      />
    </div>
  );
}