import Link from "next/link";
import { CheckSquare, Edit3 } from "lucide-react";
import type { SubjectTaught } from "@/lib/teacher/queries";
import { Card } from "@/components/ui/card";

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
  const canEnterScores = subjects.length > 0 || isHomeroom;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {/* Attendance */}
      {isHomeroom ? (
        <Link href={`/teacher/classes/${classId}/attendance`}>
          <Card className="p-5 flex items-center gap-4 hover:shadow-md hover:border-green-300 transition-all active:scale-[0.98] group">
            <div className="bg-green-100 text-green-600 p-3 rounded-xl group-hover:scale-110 transition-transform">
              <CheckSquare className="h-6 w-6" />
            </div>
            <div>
              <p className="font-moul text-base text-slate-900 group-hover:text-green-700 transition-colors">កត់ត្រាវត្តមាន</p>
              <p className="text-slate-500 text-xs mt-0.5">វត្តមានប្រចាំថ្ងៃ</p>
            </div>
          </Card>
        </Link>
      ) : (
        <Card className="p-5 flex items-center gap-4 opacity-50 cursor-not-allowed bg-slate-50 border-dashed">
          <div className="bg-slate-200 text-slate-400 p-3 rounded-xl">
            <CheckSquare className="h-6 w-6" />
          </div>
          <div>
            <p className="font-moul text-base text-slate-500">កត់ត្រាវត្តមាន</p>
            <p className="text-slate-400 text-xs mt-0.5">សម្រាប់តែគ្រូបន្ទុកថ្នាក់</p>
          </div>
        </Card>
      )}

      {/* Scores */}
      {canEnterScores ? (
        <Link href={`/teacher/classes/${classId}/scores`}>
          <Card className="p-5 flex items-center gap-4 hover:shadow-md hover:border-blue-300 transition-all active:scale-[0.98] group">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-xl group-hover:scale-110 transition-transform">
              <Edit3 className="h-6 w-6" />
            </div>
            <div>
              <p className="font-moul text-base text-slate-900 group-hover:text-blue-700 transition-colors">បញ្ចូលពិន្ទុ</p>
              <p className="text-slate-500 text-xs mt-0.5">
                {subjects.length > 0 ? `សម្រាប់ ${subjects.length} មុខវិជ្ជា` : "គ្រប់មុខវិជ្ជា"}
              </p>
            </div>
          </Card>
        </Link>
      ) : (
        <Card className="p-5 flex items-center gap-4 opacity-50 cursor-not-allowed bg-slate-50 border-dashed">
          <div className="bg-slate-200 text-slate-400 p-3 rounded-xl">
            <Edit3 className="h-6 w-6" />
          </div>
          <div>
            <p className="font-moul text-base text-slate-500">បញ្ចូលពិន្ទុ</p>
            <p className="text-slate-400 text-xs mt-0.5">អ្នកមិនបង្រៀនមុខវិជ្ជានេះទេ</p>
          </div>
        </Card>
      )}
    </div>
  );
}