import type { ClassOption } from "@/lib/admin/students/queries";

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
      className="rounded-card border-border bg-surface mb-4 space-y-2 border p-3"
    >
      <input type="hidden" name="year" value={yearId} />

      <div>
        <label className="text-muted mb-1 block text-[11px] font-medium uppercase">
          ថ្នាក់
        </label>
        <select
          name="class"
          defaultValue={activeClassId}
          className="rounded-btn border-border bg-surface w-full border px-3 py-2 text-sm"
        >
          <option value="">— គ្រប់ថ្នាក់ —</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              ថ្នាក់ទី {c.grade_level} · {c.class_name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-muted mb-1 block text-[11px] font-medium uppercase">
          ស្វែងរក
        </label>
        <input
          name="q"
          type="text"
          defaultValue={q}
          placeholder="ឈ្មោះ ឬ លេខកូដសិស្ស"
          className="rounded-btn border-border bg-surface w-full border px-3 py-2 text-sm"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="touch-target rounded-btn bg-brand-600 flex-1 px-4 text-sm font-medium text-white active:bg-brand-700"
        >
          រក
        </button>
        <a
          href={`/admin/students?year=${yearId}`}
          className="touch-target rounded-btn border-border bg-surface flex items-center border px-4 text-sm active:bg-slate-50"
        >
          សម្អាត
        </a>
      </div>
    </form>
  );
}