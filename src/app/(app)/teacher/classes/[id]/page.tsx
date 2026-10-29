import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ArrowLeft, Users } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getTeacherClassDetail } from "@/lib/teacher/queries";
import { ClassActions } from "./class-actions";
import { RosterList } from "./roster-list";
import { Card, CardContent } from "@/components/ui/card";

export const instant = false;

export default async function TeacherClassPage({ params }: { params: Promise<{ id: string }> }) {
  await connection();

  const user = await getCurrentUser();
  if (!user) return null;

  const { id } = await params;
  const detail = await getTeacherClassDetail(user.id, id);

  if (!detail) notFound();

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20">
      <Link href="/teacher" className="inline-flex items-center text-sm text-slate-500 hover:text-primary-600 mb-2">
        <ArrowLeft className="h-4 w-4 mr-1" /> ត្រឡប់ក្រោយ
      </Link>

      {/* Header Card */}
      <Card className="border-none shadow-md bg-gradient-to-br from-primary-900 to-primary-700 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Users className="w-32 h-32" />
        </div>
        <CardContent className="p-6 relative z-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-moul text-3xl">{detail.class_name}</h1>
              <p className="text-primary-100 mt-1">
                ថ្នាក់ទី {detail.grade_level} · ឆ្នាំសិក្សា {detail.academic_year_name}
              </p>
            </div>
            {detail.is_homeroom && (
              <span className="bg-white/20 text-white backdrop-blur-sm shrink-0 rounded-full px-3 py-1 text-xs font-semibold border border-white/30">
                គ្រូបន្ទុក
              </span>
            )}
          </div>
          
          <div className="mt-6 flex flex-wrap gap-2">
             <div className="bg-white/10 rounded-lg px-3 py-1.5 text-sm border border-white/10 flex items-center gap-2">
                <Users className="h-4 w-4 opacity-70" /> សិស្សសរុប {detail.students.length} នាក់
             </div>
             {detail.subjects_taught.length > 0 && (
               <div className="bg-white/10 rounded-lg px-3 py-1.5 text-sm border border-white/10">
                 បង្រៀន {detail.subjects_taught.length} មុខវិជ្ជា
               </div>
             )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <ClassActions
        classId={detail.class_id}
        className={detail.class_name}
        subjects={detail.subjects_taught}
        isHomeroom={detail.is_homeroom}
      />

      {/* Roster */}
      <div>
        <h2 className="font-moul text-xl text-slate-800 mb-4">បញ្ជីឈ្មោះសិស្ស</h2>
        <RosterList students={detail.students} />
      </div>
    </div>
  );
}