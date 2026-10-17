import type { TimetableGrid } from "@/lib/admin/reports/timetable";
import type { SchoolSettings } from "@/lib/admin/school/queries";
import { SchoolReportHeader } from "./school-report-header";
import { ReportSignatures } from "./report-signatures";

const DAYS = [
  { n: 1, label: "ចន្ទ" },
  { n: 2, label: "អង្គារ" },
  { n: 3, label: "ពុធ" },
  { n: 4, label: "ព្រហស្បតិ៍" },
  { n: 5, label: "សុក្រ" },
  { n: 6, label: "សៅរ៍" },
];

export function TimetableReportView({
  grid,
  settings,
  mode,
}: {
  grid: TimetableGrid;
  settings: SchoolSettings;
  mode: "class" | "teacher";
}) {
  const morning = grid.periods.filter((p) => p.is_morning);
  const afternoon = grid.periods.filter((p) => !p.is_morning);

  return (
    <div className="timetable-report mb-8">
      <SchoolReportHeader
        settings={settings}
        academicYearName={grid.academic_year_name}
        title={grid.title}
        subtitle={grid.subtitle}
      />

      <table className="w-full border-collapse text-[10px] leading-tight">
        <thead>
          <tr className="bg-blue-100">
            <th className="border border-blue-300 px-1 py-1 w-16">ម៉ោង</th>
            {DAYS.map((d) => (
              <th key={d.n} className="border border-blue-300 px-1 py-1">
                {d.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {morning.length > 0 && (
            <>
              <tr className="bg-blue-50">
                <td
                  colSpan={7}
                  className="border border-blue-300 px-2 py-0.5 text-center font-medium"
                >
                  វេនព្រឹក
                </td>
              </tr>
              {morning.map((p) => (
                <tr key={p.id}>
                  <td className="border border-blue-200 px-1 py-1 text-center align-middle">
                    <div className="font-semibold">
                      {p.start_time.slice(0, 5)}-{p.end_time.slice(0, 5)}
                    </div>
                  </td>
                  {DAYS.map((d) => {
                    const cell = grid.grid[d.n]?.[p.id];
                    return (
                      <td
                        key={d.n}
                        className="border border-blue-200 px-1 py-1 text-center"
                      >
                        {cell ? (
                          <>
                            <div className="font-medium">
                              {cell.subject_name}
                            </div>
                            <div className="text-[9px] text-gray-600">
                              {mode === "class"
                                ? cell.teacher_name_kh
                                : cell.class_name}
                            </div>
                          </>
                        ) : null}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </>
          )}

          {afternoon.length > 0 && (
            <>
              <tr className="bg-blue-50">
                <td
                  colSpan={7}
                  className="border border-blue-300 px-2 py-0.5 text-center font-medium"
                >
                  វេនល្ងាច
                </td>
              </tr>
              {afternoon.map((p) => (
                <tr key={p.id}>
                  <td className="border border-blue-200 px-1 py-1 text-center align-middle">
                    <div className="font-semibold">
                      {p.start_time.slice(0, 5)}-{p.end_time.slice(0, 5)}
                    </div>
                  </td>
                  {DAYS.map((d) => {
                    const cell = grid.grid[d.n]?.[p.id];
                    return (
                      <td
                        key={d.n}
                        className="border border-blue-200 px-1 py-1 text-center"
                      >
                        {cell ? (
                          <>
                            <div className="font-medium">
                              {cell.subject_name}
                            </div>
                            <div className="text-[9px] text-gray-600">
                              {mode === "class"
                                ? cell.teacher_name_kh
                                : cell.class_name}
                            </div>
                          </>
                        ) : null}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>

      <ReportSignatures
        principalName={settings.principal_name_kh}
        // 👇 If class, label = homeroom. If teacher, label = teacher.
        secondaryTitle={mode === "class" ? "គ្រូបន្ទុកថ្នាក់" : "គ្រូបង្រៀន"}
        // 👇 If class, name = homeroom teacher. If teacher, name = the teacher.
        homeroomName={mode === "class" ? grid.homeroom_teacher_name : grid.teacher_name}
      />
    </div>
  );
}