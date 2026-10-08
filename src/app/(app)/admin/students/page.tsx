import Link from "next/link";
import { connection } from "next/server";
import { AppShell } from "@/components/app-shell";
import {
  listAcademicYears,
  getCurrentAcademicYear,
} from "@/lib/admin/academic-years/queries";
import {
  listClassesInYear,
  listStudentsByYear,
} from "@/lib/admin/students/queries";
import { StudentCard } from "./student-card";
import { YearSwitcher } from "../classes/year-switcher";
import { StudentFilters } from "./student-filters";

export const instant = false;

export const metadata = { title: "សិស្ស" };

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; class?: string; q?: string }>;
}) {
  await connection();

  const sp = await searchParams;
  const [years, current] = await Promise.all([
    listAcademicYears(),
    getCurrentAcademicYear(),
  ]);

  const requested = sp.year ? years.find((y) => y.id === sp.year) : null;
  const activeYear = requested ?? current ?? years[0] ?? null;

  const classes = activeYear ? await listClassesInYear(activeYear.id) : [];
  const validClassId =
    sp.class && classes.some((c) => c.id === sp.class) ? sp.class : undefined;

  const students = activeYear
    ? await listStudentsByYear(activeYear.id, {
        classId: validClassId,
        q: sp.q,
      })
    : [];

  // Group by class for display
  const groups = new Map<
    string,
    { class_name: string; grade_level: number; students: typeof students }
  >();
  for (const s of students) {
    const g = groups.get(s.class_id) ?? {
      class_name: s.class_name,
      grade_level: s.grade_level,
      students: [],
    };
    g.students.push(s);
    groups.set(s.class_id, g);
  }

  const grouped = Array.from(groups.entries()).sort((a, b) => {
    const [ga, gb] = [a[1].grade_level, b[1].grade_level];
    if (ga !== gb) return ga - gb;
    return a[1].class_name.localeCompare(b[1].class_name);
  });

  return (
    <AppShell title="សិស្ស" backHref="/admin">
      <YearSwitcher years={years} activeYearId={activeYear?.id ?? null} />

      {activeYear && classes.length > 0 ? (
        <StudentFilters
          classes={classes}
          activeClassId={validClassId ?? ""}
          q={sp.q ?? ""}
          yearId={activeYear.id}
        />
      ) : null}

      {activeYear ? (
        <Link
          href={`/admin/students/new?year=${activeYear.id}${
            validClassId ? `&class=${validClassId}` : ""
          }`}
          className="touch-target rounded-btn bg-brand-600 mb-4 flex w-full items-center justify-center px-4 font-medium text-white active:bg-brand-700"
        >
          + បន្ថែមសិស្សថ្មី
        </Link>
      ) : null}

      {!activeYear ? (
        <div className="rounded-card border border-dashed border-border bg-surface p-6 text-center">
          <p className="text-muted text-sm">
            សូមបង្កើតឆ្នាំសិក្សាជាមុនសិន។
          </p>
        </div>
      ) : classes.length === 0 ? (
        <div className="rounded-card border border-dashed border-border bg-surface p-6 text-center">
          <p className="text-muted text-sm">
            សូមបង្កើតថ្នាក់រៀនជាមុនសិន។
          </p>
        </div>
      ) : students.length === 0 ? (
        <div className="rounded-card border border-dashed border-border bg-surface p-6 text-center">
          <p className="text-muted text-sm">រកមិនឃើញសិស្ស។</p>
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map(([classId, group]) => (
            <section key={classId}>
              <h2 className="font-moul text-muted mb-2 text-sm">
                ថ្នាក់ទី {group.grade_level} · {group.class_name}{" "}
                <span className="font-kantumruy text-xs">
                  ({group.students.length})
                </span>
              </h2>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {group.students.map((s) => (
                  <li key={`${s.id}-${s.class_id}`}>
                    <StudentCard student={s} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </AppShell>
  );
}