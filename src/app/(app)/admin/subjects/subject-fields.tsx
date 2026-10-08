"use client";

export type SubjectDefaults = {
  subject_name?: string;
  code?: string;
  p_max_grade7?: number;
  p_max_grade8?: number;
  p_max_grade9?: number;
};

export function SubjectFields({ defaults }: { defaults?: SubjectDefaults }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-fg mb-1 block text-sm font-medium">
          ឈ្មោះមុខវិជ្ជា
        </label>
        <input
          name="subject_name"
          type="text"
          defaultValue={defaults?.subject_name}
          required
          maxLength={150}
          autoComplete="off"
          className="rounded-btn border-border bg-surface w-full border px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
      </div>

      <div>
        <label className="text-fg mb-1 block text-sm font-medium">
          កូដមុខវិជ្ជា
        </label>
        <input
          name="code"
          type="text"
          defaultValue={defaults?.code}
          required
          maxLength={20}
          pattern="[A-Za-z0-9_\-]+"
          autoComplete="off"
          autoCapitalize="characters"
          placeholder="KHM"
          className="rounded-btn border-border bg-surface w-full border px-3 py-2.5 font-mono uppercase outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
        <p className="text-muted mt-1 text-xs">
          អក្សរអង់គ្លេស លេខ _ និង - ឧទាហរណ៍ KHM, MAT, ENG
        </p>
      </div>

      <div>
        <p className="text-fg mb-2 block text-sm font-medium">
          ពិន្ទុពេញតាមកម្រិតថ្នាក់
        </p>
        <div className="grid grid-cols-3 gap-2">
          {[7, 8, 9].map((g) => (
            <div key={g}>
              <label className="text-muted mb-1 block text-center text-[11px]">
                ថ្នាក់ {g}
              </label>
              <input
                name={`p_max_grade${g}`}
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0.01"
                max="10000"
                defaultValue={
                  defaults?.[`p_max_grade${g}` as keyof SubjectDefaults] ?? 50
                }
                required
                className="rounded-btn border-border bg-surface w-full border px-2 py-2.5 text-center tabular-nums outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}