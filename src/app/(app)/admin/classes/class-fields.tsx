"use client";

import type { TeacherOption } from "@/lib/admin/classes/queries";
import { Input } from "@/components/ui/input";

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
    <div className="space-y-8">
      <section className="space-y-4">
        <h3 className="font-moul text-lg text-slate-800 border-b pb-2">ព័ត៌មានថ្នាក់រៀន</h3>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">ឈ្មោះថ្នាក់ *</label>
          <Input
            name="class_name"
            type="text"
            defaultValue={defaults?.class_name}
            required
            maxLength={50}
            autoComplete="off"
            placeholder="ឧ. 7A, 8B, 9C"
            className="font-inter uppercase"
          />
          <p className="text-xs text-slate-500 mt-1">
            សូមបញ្ចូលឈ្មោះថ្នាក់ជាអក្សរឡាតាំង ឬលេខ (ឧទាហរណ៍៖ 7A)
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">កម្រិតថ្នាក់ *</label>
          <select
            name="grade_level"
            defaultValue={defaults?.grade_level ?? 7}
            required
            className="flex h-12 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-base focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
          >
            <option value={7}>ថ្នាក់ទី ៧</option>
            <option value={8}>ថ្នាក់ទី ៨</option>
            <option value={9}>ថ្នាក់ទី ៩</option>
          </select>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="font-moul text-lg text-slate-800 border-b pb-2">គ្រូបន្ទុកថ្នាក់</h3>
        
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">ជ្រើសរើសគ្រូបន្ទុកថ្នាក់</label>
          <select
            name="homeroom_teacher_id"
            defaultValue={defaults?.homeroom_teacher_id ?? ""}
            className="flex h-12 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-base focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
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
            <p className="text-xs text-amber-600 mt-1">
              មិនមានគ្រូនៅឡើយទេ។ សូមបង្កើតគណនីគ្រូជាមុនសិន។
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}