import { forbidden, notFound } from "next/navigation";
import { connection } from "next/server";
import { AppShell } from "@/components/app-shell";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getTeacherClassDetail } from "@/lib/teacher/queries";
import { ClassActions } from "./class-actions";
import { RosterList } from "./roster-list";

export const instant = false;

export default async function TeacherClassPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();

  const user = await getCurrentUser();
  if (!user) return null;

  const { id } = await params;
  const detail = await getTeacherClassDetail(user.id, id);

  if (!detail) {
    // Not a class this teacher teaches — either it doesn't exist, or they
    // shouldn't see it. Distinguish: if the class exists but no access, 403.
    // For simplicity here, treat both as 404 to avoid leaking existence.
    notFound();
  }

  return (
    <AppShell
      title={`ថ្នាក់ ${detail.class_name}`}
      backHref="/teacher"
    >
      <div className="space-y-4">
        {/* Header card */}
        <div className="rounded-card border-border bg-surface border p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-moul text-lg">{detail.class_name}</p>
              <p className="text-muted mt-0.5 text-xs">
                ថ្នាក់ទី {detail.grade_level} · {detail.academic_year_name}
              </p>
            </div>
            {detail.is_homeroom ? (
              <span className="bg-brand-100 text-brand-800 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium">
                គ្រូបន្ទុក
              </span>
            ) : null}
          </div>

          <p className="text-muted mt-3 text-xs">
            សិស្ស {detail.students.length} នាក់
          </p>

          {detail.subjects_taught.length > 0 ? (
            <div className="mt-3">
              <p className="text-muted mb-1.5 text-[10px] font-medium uppercase">
                មុខវិជ្ជាដែលអ្នកបង្រៀន
              </p>
              <div className="flex flex-wrap gap-1.5">
                {detail.subjects_taught.map((s) => (
                  <span
                    key={s.id}
                    className="rounded-btn border-border bg-bg border px-2 py-0.5 text-[11px]"
                  >
                    {s.subject_name} · {s.code}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* Action cards */}
        <ClassActions
          classId={detail.class_id}
          className={detail.class_name}
          subjects={detail.subjects_taught}
          isHomeroom={detail.is_homeroom}
        />

        {/* Roster */}
        <section>
          <h2 className="font-moul text-muted mb-2 text-sm">
            បញ្ជីឈ្មោះសិស្ស
          </h2>
          <RosterList students={detail.students} />
        </section>
      </div>
    </AppShell>
  );
}