import type { SubjectOption } from "@/lib/admin/teachers/queries";

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
      className="rounded-card border-border bg-surface mb-4 space-y-2 border p-3"
    >
      <div>
        <label className="text-muted mb-1 block text-[11px] font-medium uppercase">
          ស្វែងរក
        </label>
        <input
          name="q"
          type="text"
          defaultValue={q}
          placeholder="ឈ្មោះគ្រូ"
          className="rounded-btn border-border bg-surface w-full border px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="text-muted mb-1 block text-[11px] font-medium uppercase">
          មុខវិជ្ជាជំនាញ
        </label>
        <select
          name="subject"
          defaultValue={subjectId}
          className="rounded-btn border-border bg-surface w-full border px-3 py-2 text-sm"
        >
          <option value="">— គ្រប់មុខវិជ្ជា —</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.subject_name} · {s.code}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="touch-target rounded-btn bg-brand-600 flex-1 px-4 text-sm font-medium text-white active:bg-brand-700"
        >
          រក
        </button>
        <a
          href="/admin/teachers"
          className="touch-target rounded-btn border-border bg-surface flex items-center border px-4 text-sm active:bg-slate-50"
        >
          សម្អាត
        </a>
      </div>
    </form>
  );
}