import Link from "next/link";
import { connection } from "next/server";
import { AppShell } from "@/components/app-shell";
import {
  listAcademicYears,
  getCurrentAcademicYear,
} from "@/lib/admin/academic-years/queries";
import {
  listAssignmentsForYear,
  listClassOptions,
  listTeacherOptions,
} from "@/lib/admin/teacher-assignments/queries";
import { YearSwitcher } from "../classes/year-switcher";
import { AssignmentCard } from "./assignment-card";
import { AssignmentFilters } from "./assignment-filters";

export const instant = false;

export const metadata = { title: "ការចាត់តាំងគ្រូ" };

export default async function TeacherAssignmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; teacher?: string; class?: string }>;
}) {
  await connection();

  const sp = await searchParams;
  const [years, current] = await Promise.all([
    listAcademicYears(),
    getCurrentAcademicYear(),
  ]);

  const requested = sp.year ? years.find((y) => y.id === sp.year) : null;
  const activeYear = requested ?? current ?? years[0] ?? null;

  if (!activeYear) {
    return (
      <AppShell title="ការចាត់តាំងគ្រូ" backHref="/admin">
        <div className="rounded-card border border-dashed border-border bg-surface p-6 text-center">
          <p className="text-muted text-sm">
            សូមបង្កើតឆ្នាំសិក្សាជាមុនសិន។
          </p>
        </div>
      </AppShell>
    );
  }

  const [teachers, classes] = await Promise.all([
    listTeacherOptions(),
    listClassOptions(activeYear.id),
  ]);

  const validTeacherId =
    sp.teacher && teachers.some((t) => t.id === sp.teacher)
      ? sp.teacher
      : undefined;
  const validClassId =
    sp.class && classes.some((c) => c.id === sp.class) ? sp.class : undefined;

  const assignments = await listAssignmentsForYear(activeYear.id, {
    teacherId: validTeacherId,
    classId: validClassId,
  });

  // Group by teacher unless a teacher filter is active (then group by class)
  const groupBy: "teacher" | "class" = validTeacherId ? "class" : "teacher";

  const groups = new Map<
    string,
    {
      key: string;
      label: string;
      sub: string;
      items: typeof assignments;
    }
  >();
  for (const a of assignments) {
    const key = groupBy === "teacher" ? a.teacher_id : a.class_id;
    const label =
      groupBy === "teacher" ? a.teacher_name_kh : a.class_name;
    const sub =
      groupBy === "teacher"
        ? (a.teacher_name_en ?? "")
        : `ថ្នាក់ទី ${a.grade_level}`;
    const g = groups.get(key) ?? { key, label, sub, items: [] };
    g.items.push(a);
    groups.set(key, g);
  }

  const grouped = Array.from(groups.values()).sort((a, b) =>
    a.label.localeCompare(b.label, "km"),
  );

  return (
    <AppShell title="ការចាត់តាំងគ្រូ" backHref="/admin">
      <YearSwitcher years={years} activeYearId={activeYear.id} basePath="/admin/teacher-assignments" />

      {teachers.length === 0 ? (
        <div className="rounded-card border border-dashed border-border bg-surface p-6 text-center">
          <p className="text-muted text-sm">
            មិនមានគណនីគ្រូនៅឡើយទេ។ សូមបង្កើតគណនីគ្រូជាមុនសិន។
          </p>
        </div>
      ) : classes.length === 0 ? (
        <div className="rounded-card border border-dashed border-border bg-surface p-6 text-center">
          <p className="text-muted text-sm">
            មិនមានថ្នាក់រៀននៅក្នុងឆ្នាំ {activeYear.year_name} ទេ។
          </p>
          <Link
            href={`/admin/classes/new?year=${activeYear.id}`}
            className="text-brand-700 mt-3 inline-block text-sm underline-offset-4 hover:underline"
          >
            បង្កើតថ្នាក់ថ្មី
          </Link>
        </div>
      ) : (
        <>
          <AssignmentFilters
            teachers={teachers}
            classes={classes}
            activeTeacherId={validTeacherId ?? ""}
            activeClassId={validClassId ?? ""}
            yearId={activeYear.id}
          />

          <Link
            href={`/admin/teacher-assignments/manage?year=${activeYear.id}`}
            className="touch-target rounded-btn bg-brand-600 mb-4 flex w-full items-center justify-center px-4 font-medium text-white active:bg-brand-700"
          >
            + ចាត់តាំងគ្រូថ្មី
          </Link>

          {assignments.length === 0 ? (
            <div className="rounded-card border border-dashed border-border bg-surface p-6 text-center">
              <p className="text-muted text-sm">រកមិនឃើញការចាត់តាំង។</p>
            </div>
          ) : (
            <div className="space-y-6">
              {grouped.map((g) => (
                <section key={g.key}>
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <div>
                      <h2 className="font-moul text-sm">{g.label}</h2>
                      {g.sub ? (
                        <p className="text-muted text-xs">{g.sub}</p>
                      ) : null}
                    </div>
                    {groupBy === "teacher" ? (
                      <Link
                        href={`/admin/teacher-assignments/manage?year=${activeYear.id}&teacher=${g.key}`}
                        className="touch-target rounded-btn border-border bg-surface border px-3 text-xs active:bg-slate-50"
                      >
                        កែប្រែ
                      </Link>
                    ) : null}
                  </div>
                  <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {g.items.map((a) => (
                      <li key={a.id}>
                        <AssignmentCard row={a} />
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </>
      )}
    </AppShell>
  );
}