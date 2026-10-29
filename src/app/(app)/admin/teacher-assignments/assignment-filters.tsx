import type { ClassOption, TeacherOption } from "@/lib/admin/teacher-assignments/queries";
import { Button } from "@/components/ui/button";

export function AssignmentFilters({ teachers, classes, activeTeacherId, activeClassId, yearId }: { teachers: TeacherOption[]; classes: ClassOption[]; activeTeacherId: string; activeClassId: string; yearId: string; }) {
  return (
    <form method="get" action="/admin/teacher-assignments" className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row gap-3">
      <input type="hidden" name="year" value={yearId} />
      
      <select name="teacher" defaultValue={activeTeacherId} className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 h-11">
        <option value="">-- គ្រប់គ្រូ --</option>
        {teachers.map((t) => <option key={t.id} value={t.id}>{t.full_name_kh}</option>)}
      </select>

      <select name="class" defaultValue={activeClassId} className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 h-11">
        <option value="">-- គ្រប់ថ្នាក់ --</option>
        {classes.map((c) => <option key={c.id} value={c.id}>ថ្នាក់ទី {c.grade_level} · {c.class_name}</option>)}
      </select>

      <div className="flex gap-2">
        <Button type="submit" className="h-11 px-6">រក</Button>
        {(activeTeacherId || activeClassId) && (
          <a href={`/admin/teacher-assignments?year=${yearId}`} className="inline-flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 px-3 text-sm transition-colors">សម្អាត</a>
        )}
      </div>
    </form>
  );
}