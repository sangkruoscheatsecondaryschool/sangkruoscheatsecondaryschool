import Link from "next/link";
import type { SubjectTaught } from "@/lib/teacher/queries";

export function ClassActions({
  classId,
  className,
  subjects,
  isHomeroom,
}: {
  classId: string;
  className: string;
  subjects: SubjectTaught[];
  isHomeroom: boolean;
}) {
  // Subject teacher with no assignments can't enter scores — but homeroom
  // teachers can enter scores for every subject.
  const canEnterScores = subjects.length > 0 || isHomeroom;

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {/* Attendance — live link for homeroom */}
      {isHomeroom ? (
        <Link
          href={`/teacher/classes/${classId}/attendance`}
          className="rounded-card bg-brand-600 block p-4 text-white active:bg-brand-700"
        >
          <div className="flex items-start gap-3">
            <span className="text-lg leading-none">✓</span>
            <div className="min-w-0 flex-1">
              <p className="font-moul text-sm">កត់ត្រាវត្តមាន</p>
              <p className="mt-0.5 text-xs opacity-90">
                វត្តមានប្រចាំថ្ងៃ
              </p>
            </div>
          </div>
        </Link>
      ) : (
        <DisabledCard
          title="កត់ត្រាវត្តមាន"
          desc="សម្រាប់តែគ្រូបន្ទុកថ្នាក់"
          icon="✓"
        />
      )}

      {/* Scores — live link */}
      {canEnterScores ? (
        <Link
          href={`/teacher/classes/${classId}/scores`}
          className="rounded-card bg-brand-600 block p-4 text-white active:bg-brand-700"
        >
          <div className="flex items-start gap-3">
            <span className="text-lg leading-none">✎</span>
            <div className="min-w-0 flex-1">
              <p className="font-moul text-sm">បញ្ចូលពិន្ទុ</p>
              <p className="mt-0.5 text-xs opacity-90">
                {subjects.length > 0
                  ? `${subjects.length} មុខវិជ្ជា`
                  : "គ្រប់មុខវិជ្ជា (គ្រូបន្ទុក)"}
              </p>
            </div>
          </div>
        </Link>
      ) : (
        <DisabledCard
          title="បញ្ចូលពិន្ទុ"
          desc="អ្នកមិនបង្រៀនមុខវិជ្ជានេះទេ"
          icon="✎"
        />
      )}
    </div>
  );
}

function DisabledCard({
  title,
  desc,
  icon,
}: {
  title: string;
  desc: string;
  icon: string;
}) {
  return (
    <div className="rounded-card border-border bg-bg border border-dashed p-4 opacity-60">
      <div className="flex items-start gap-3">
        <span className="text-muted text-lg leading-none">{icon}</span>
        <div className="min-w-0 flex-1">
          <p className="font-moul text-muted text-sm">{title}</p>
          <p className="text-muted mt-0.5 text-xs">{desc}</p>
        </div>
      </div>
    </div>
  );
}