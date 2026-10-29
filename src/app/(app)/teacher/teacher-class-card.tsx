import Link from "next/link";
import { Users, BookOpen } from "lucide-react";
import type { TeacherClassCard as CardData } from "@/lib/teacher/queries";
import { Card } from "@/components/ui/card";

export function TeacherClassCard({ card }: { card: CardData }) {
  return (
    <Link href={`/teacher/classes/${card.class_id}`} className="block group">
      <Card className="h-full p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-primary-200 active:scale-[0.98]">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-moul text-xl text-slate-900 group-hover:text-primary-600 transition-colors">
              {card.class_name}
            </h3>
            <p className="text-slate-500 text-sm mt-1 flex items-center gap-1.5">
              <Users className="h-4 w-4" /> {card.student_count} នាក់
            </p>
          </div>
          {card.is_homeroom && (
            <span className="bg-primary-100 text-primary-800 shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide">
              គ្រូបន្ទុក
            </span>
          )}
        </div>

        {card.subjects_taught.length > 0 ? (
          <div className="mt-5">
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">មុខវិជ្ជាបង្រៀន</p>
            <div className="flex flex-wrap gap-1.5">
              {card.subjects_taught.map((s) => (
                <span
                  key={s.id}
                  className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-700"
                >
                  {s.subject_name}
                </span>
              ))}
            </div>
          </div>
        ) : card.is_homeroom ? (
          <div className="mt-5">
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">មុខវិជ្ជាបង្រៀន</p>
            <p className="text-slate-500 text-xs italic">អាចចូលមើលគ្រប់មុខវិជ្ជា (គ្រូបន្ទុក)</p>
          </div>
        ) : null}
      </Card>
    </Link>
  );
}