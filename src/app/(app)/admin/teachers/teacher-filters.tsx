import { Search } from "lucide-react";
import type { SubjectOption } from "@/lib/admin/teachers/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function TeacherFilters({
  subjects,
  q,
  subjectId,
}: {
  subjects: SubjectOption[];
  q: string;
  subjectId: string;
}) {
  return (
    <form
      method="get"
      action="/admin/teachers"
      className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row gap-3"
    >
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <Input
          name="q"
          type="text"
          defaultValue={q}
          placeholder="ស្វែងរកឈ្មោះគ្រូ..."
          className="pl-10 h-11 bg-slate-50 border-transparent focus:bg-white"
        />
      </div>

      <div className="flex gap-2">
        <select
          name="subject"
          defaultValue={subjectId}
          className="rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 h-11 sm:w-56"
        >
          <option value="">-- គ្រប់មុខវិជ្ជាជំនាញ --</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.subject_name} · {s.code}
            </option>
          ))}
        </select>

        <Button type="submit" className="h-11 px-6">រក</Button>
        
        {(q || subjectId) && (
          <a
            href="/admin/teachers"
            className="inline-flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 px-3 text-sm transition-colors"
          >
            សម្អាត
          </a>
        )}
      </div>
    </form>
  );
}