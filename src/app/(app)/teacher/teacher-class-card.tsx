import Link from "next/link";
import type { TeacherClassCard as CardData } from "@/lib/teacher/queries";

export function TeacherClassCard({ card }: { card: CardData }) {
  return (
    <Link
      href={`/teacher/classes/${card.class_id}`}
      className="rounded-card border-border bg-surface block border p-4 active:bg-brand-50"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="font-moul truncate text-base">{card.class_name}</p>
          <p className="text-muted mt-0.5 text-xs">
            ថ្នាក់ទី {card.grade_level} · សិស្ស {card.student_count} នាក់
          </p>
        </div>
        {card.is_homeroom ? (
          <span className="bg-brand-100 text-brand-800 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium">
            គ្រូបន្ទុក
          </span>
        ) : null}
      </div>

      {card.subjects_taught.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {card.subjects_taught.map((s) => (
            <span
              key={s.id}
              className="rounded-btn border-border bg-bg border px-2 py-0.5 text-[10px]"
            >
              {s.subject_name}
            </span>
          ))}
        </div>
      ) : card.is_homeroom ? (
        <p className="text-muted mt-3 text-xs">
          គ្រូបន្ទុកថ្នាក់ — អាចចូលមើលគ្រប់មុខវិជ្ជា
        </p>
      ) : null}
    </Link>
  );
}