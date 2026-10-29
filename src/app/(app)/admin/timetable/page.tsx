import Link from "next/link";
import { connection } from "next/server";
import { Settings, Printer } from "lucide-react";
import { listAcademicYears, getCurrentAcademicYear } from "@/lib/admin/academic-years/queries";
import { listClassOptions } from "@/lib/admin/teacher-assignments/queries";
import { listPeriods, listTimetableForClass, listAssignableSubjects } from "@/lib/admin/timetable/queries";
import { YearSwitcher } from "../classes/year-switcher";
import { ClassSwitcher } from "./class-switcher";
import { TimetableGrid } from "./timetable-grid";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export const instant = false;
export const metadata = { title: "តារាងកាលវិភាគ" };

export default async function TimetablePage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; class?: string }>;
}) {
  await connection();

  const sp = await searchParams;
  const [years, current] = await Promise.all([listAcademicYears(), getCurrentAcademicYear()]);
  const activeYear = (sp.year && years.find((y) => y.id === sp.year)) || current || years[0] || null;

  if (!activeYear) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <PageHeader title="តារាងកាលវិភាគ" description="គ្រប់គ្រងកាលវិភាគបង្រៀន" />
        <EmptyState title="មិនទាន់មានឆ្នាំសិក្សា" description="សូមបង្កើតឆ្នាំសិក្សាជាមុនសិន។" />
      </div>
    );
  }

  const [classes, periods] = await Promise.all([
    listClassOptions(activeYear.id),
    listPeriods(activeYear.id),
  ]);

  const activeClass = (sp.class && classes.find((c) => c.id === sp.class)) || classes[0] || null;
  const cells = activeClass ? await listTimetableForClass(activeClass.id) : [];
  const assignableSubjects = activeClass ? await listAssignableSubjects(activeClass.id) : [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader 
        title="តារាងកាលវិភាគ" // 👈 Updated
        description="គ្រប់គ្រងកាលវិភាគបង្រៀនប្រចាំសប្តាហ៍"
        action={
          <Link href={`/admin/timetable/periods?year=${activeYear.id}`}>
            <Button variant="outline" className="gap-2">
              <Settings className="h-4 w-4" />
              កំណត់ម៉ោងបង្រៀន
            </Button>
          </Link>
        }
      />

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="w-full sm:w-auto">
          <YearSwitcher years={years} activeYearId={activeYear.id} basePath="/admin/timetable" />
        </div>
        
        <div className="w-full sm:w-auto shrink-0 mb-4">
          <Link href={`/admin/reports/timetable?year=${activeYear.id}`}>
            <Button variant="outline" className="gap-2 bg-white w-full sm:w-auto">
              <Printer className="h-4 w-4" />
              មើលរបាយការណ៍ / បោះពុម្ព
            </Button>
          </Link>
        </div>
      </div>

      {periods.length === 0 ? (
        <EmptyState 
          title="មិនទាន់មានម៉ោងបង្រៀន" 
          description="សូមកំណត់ម៉ោងបង្រៀនជាមុនសិន ទើបអាចបង្កើតតារាងកាលវិភាគបាន។"
          action={
            <Link href={`/admin/timetable/periods?year=${activeYear.id}`}>
              <Button>កំណត់ម៉ោងឥឡូវនេះ</Button>
            </Link>
          }
        />
      ) : classes.length === 0 ? (
        <EmptyState title="មិនទាន់មានថ្នាក់រៀន" description="សូមបង្កើតថ្នាក់រៀនជាមុនសិន។" />
      ) : !activeClass ? (
        <EmptyState title="សូមជ្រើសរើសថ្នាក់" description="សូមជ្រើសរើសថ្នាក់រៀនដើម្បីមើលតារាងកាលវិភាគ។" />
      ) : (
        <>
          <ClassSwitcher classes={classes} activeClassId={activeClass.id} yearId={activeYear.id} />
          <TimetableGrid
            classId={activeClass.id}
            className={activeClass.class_name}
            periods={periods}
            cells={cells}
            assignableSubjects={assignableSubjects}
          />
        </>
      )}
    </div>
  );
}