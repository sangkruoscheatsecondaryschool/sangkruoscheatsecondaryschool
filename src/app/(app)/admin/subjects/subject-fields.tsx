"use client";

import { Input } from "@/components/ui/input";

export type SubjectDefaults = {
  subject_name?: string;
  code?: string;
  p_max_grade7?: number;
  p_max_grade8?: number;
  p_max_grade9?: number;
};

export function SubjectFields({ defaults }: { defaults?: SubjectDefaults }) {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h3 className="font-moul text-lg text-slate-800 border-b pb-2">ព័ត៌មានមុខវិជ្ជា</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">ឈ្មោះមុខវិជ្ជា *</label>
            <Input
              name="subject_name"
              type="text"
              defaultValue={defaults?.subject_name}
              required
              maxLength={150}
              autoComplete="off"
              placeholder="ឧ. គណិតវិទ្យា"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">កូដមុខវិជ្ជា *</label>
            <Input
              name="code"
              type="text"
              defaultValue={defaults?.code}
              required
              maxLength={20}
              pattern="[A-Za-z0-9_\-]+"
              autoComplete="off"
              autoCapitalize="characters"
              placeholder="ឧ. MAT"
              className="font-inter uppercase"
            />
            <p className="text-xs text-slate-500">អក្សរអង់គ្លេស ឬលេខ (ឧទាហរណ៍៖ KHM, MAT)</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="font-moul text-lg text-slate-800 border-b pb-2">ពិន្ទុពេញតាមកម្រិតថ្នាក់</h3>
        
        <div className="grid grid-cols-3 gap-3">
          {[7, 8, 9].map((g) => (
            <div key={g} className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 text-center block">ថ្នាក់ទី {g}</label>
              <Input
                name={`p_max_grade${g}`}
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0.01"
                max="10000"
                defaultValue={defaults?.[`p_max_grade${g}` as keyof SubjectDefaults] ?? 50}
                required
                className="text-center font-inter text-lg"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}