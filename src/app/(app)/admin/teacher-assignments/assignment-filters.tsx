import type {
  ClassOption,
  TeacherOption,
} from "@/lib/admin/teacher-assignments/queries";

export function AssignmentFilters({
  teachers,
  classes,
  activeTeacherId,
  activeClassId,
  yearId,
}: {
  teachers: TeacherOption[];
  classes: ClassOption[];
  activeTeacherId: string;
  activeClassId: string;
  yearId: string;
}) {
  return (
    <form
      method="get"
      action="/admin/teacher-assignments"
      className="rounded-card border-border bg-surface mb-4 space-y-2 border p-3"
    >
      <input type="hidden" name="year" value={yearId} />

      <div>
        <label className="text-muted mb-1 block text-[11px] font-medium uppercase">
          គ្រូបង្រៀន
        </label>
        <select
          name="teacher"
          defaultValue={activeTeacherId}
          className="rounded-btn border-border bg-surface w-full border px-3 py-2 text-sm"
        >
          <option value="">— គ្រប់គ្រូ —</option>
          {teachers.map((t) => (
            <option key={t.id} value={t.id}>
              {t.full_name_kh}
              {t.full_name_en ? ` (${t.full_name_en})` : ""}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-muted mb-1 block text-[11px] font-medium uppercase">
          ថ្នាក់រៀន
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

      <div className="flex gap-2">
        <button
          type="submit"
          className="touch-target rounded-btn bg-brand-600 flex-1 px-4 text-sm font-medium text-white active:bg-brand-700"
        >
          រក
        </button>
        <a
          href={`/admin/teacher-assignments?year=${yearId}`}
          className="touch-target rounded-btn border-border bg-surface flex items-center border px-4 text-sm active:bg-slate-50"
        >
          សម្អាត
        </a>
      </div>
    </form>
  );
}