import { Search } from "lucide-react";
import type { ClassOption } from "@/lib/admin/students/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function StudentFilters({
  classes,
  activeClassId,
  q,
  yearId,
}: {
  classes: ClassOption[];
  activeClassId: string;
  q: string;
  yearId: string;
}) {
  return (
    <form
      method="get"
      action="/admin/students"
      className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row gap-3"
    >
      <input type="hidden" name="year" value={yearId} />

      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <Input
          name="q"
          type="text"
          defaultValue={q}
          placeholder="ស្វែងរកឈ្មោះ ឬលេខកូដសិស្ស..."
          className="pl-10 h-11 bg-slate-50 border-transparent focus:bg-white"
        />
      </div>

      <div className="flex gap-2">
        <select
          name="class"
          defaultValue={activeClassId}
          className="rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 h-11 sm:w-48"
        >
          <option value="">-- គ្រប់ថ្នាក់ --</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              ថ្នាក់ទី {c.grade_level} · {c.class_name}
            </option>
          ))}
        </select>

        <Button type="submit" className="h-11 px-6">រក</Button>
        
        {(q || activeClassId) && (
          <a
            href={`/admin/students?year=${yearId}`}
            className="inline-flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 px-3 text-sm transition-colors"
          >
            សម្អាត
          </a>
        )}
      </div>
    </form>
  );
}