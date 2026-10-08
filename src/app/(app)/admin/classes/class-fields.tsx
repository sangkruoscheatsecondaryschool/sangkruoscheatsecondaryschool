"use client";

import type { TeacherOption } from "@/lib/admin/classes/queries";

export type ClassDefaults = {
  class_name?: string;
  grade_level?: number;
  homeroom_teacher_id?: string | null;
};

export function ClassFields({
  teachers,
  defaults,
}: {
  teachers: TeacherOption[];
  defaults?: ClassDefaults;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-fg mb-1 block text-sm font-medium">
          ឈ្មោះថ្នាក់
        </label>
        <input
          name="class_name"
          type="text"
          defaultValue={defaults?.class_name}
          required
          maxLength={50}
          autoComplete="off"
          placeholder="7A"
          className="rounded-btn border-border bg-surface w-full border px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
        <p className="text-muted mt-1 text-xs">
          ឧទាហរណ៍៖ 7A, 8B, 9C
        </p>
      </div>

      <div>
        <label className="text-fg mb-1 block text-sm font-medium">
          កម្រិតថ្នាក់
        </label>
        <select
          name="grade_level"
          defaultValue={defaults?.grade_level ?? 7}
          required
          className="rounded-btn border-border bg-surface w-full border px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        >
          <option value={7}>ថ្នាក់ទី ៧</option>
          <option value={8}>ថ្នាក់ទី ៨</option>
          <option value={9}>ថ្នាក់ទី ៩</option>
        </select>
      </div>

      <div>
        <label className="text-fg mb-1 block text-sm font-medium">
          គ្រូបន្ទុកថ្នាក់
        </label>
        <select
          name="homeroom_teacher_id"
          defaultValue={defaults?.homeroom_teacher_id ?? ""}
          className="rounded-btn border-border bg-surface w-full border px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        >
          <option value="">— មិនកំណត់ —</option>
          {teachers.map((t) => (
            <option key={t.id} value={t.id}>
              {t.full_name_kh}
              {t.full_name_en ? ` (${t.full_name_en})` : ""}
            </option>
          ))}
        </select>
        {teachers.length === 0 ? (
          <p className="text-muted mt-1 text-xs">
            មិនមានគ្រូនៅឡើយទេ។ សូមបង្កើតគណនីគ្រូជាមុនសិន។
          </p>
        ) : null}
      </div>
    </div>
  );
}