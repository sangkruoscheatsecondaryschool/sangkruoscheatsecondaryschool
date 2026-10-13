"use client";

import type { SubjectOption, TeacherRow } from "@/lib/admin/teachers/queries";
import type { AdminUnit } from "@/lib/admin/students/address-queries";
import { CascadingAddressPicker } from "@/components/cascading-address-picker";

export type TeacherDefaults = Partial<
  Pick<
    TeacherRow,
    | "full_name_kh"
    | "full_name_en"
    | "gender"
    | "dob"
    | "phone"
    | "contact_address_code"
    | "joined_date"
    | "specialist_1_subject_id"
    | "specialist_2_subject_id"
    | "notes"
  >
>;

export function TeacherFields({
  subjects,
  provinces,
  defaults,
}: {
  subjects: SubjectOption[];
  provinces: AdminUnit[];
  defaults?: TeacherDefaults;
}) {
  return (
    <div className="space-y-5">
      {/* Personal */}
      <section className="space-y-4">
        <h3 className="font-moul text-muted text-xs uppercase">
          ព័ត៌មានផ្ទាល់ខ្លួន
        </h3>

        <div>
          <label className="text-fg mb-1 block text-sm font-medium">
            ឈ្មោះជាភាសាខ្មែរ *
          </label>
          <input
            name="full_name_kh"
            type="text"
            defaultValue={defaults?.full_name_kh}
            required
            maxLength={150}
            className="rounded-btn border-border bg-surface w-full border px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </div>

        <div>
          <label className="text-fg mb-1 block text-sm font-medium">
            ឈ្មោះជាភាសាអង់គ្លេស
          </label>
          <input
            name="full_name_en"
            type="text"
            defaultValue={defaults?.full_name_en ?? ""}
            maxLength={150}
            className="rounded-btn border-border bg-surface w-full border px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-fg mb-1 block text-sm font-medium">
              ភេទ
            </label>
            <select
              name="gender"
              defaultValue={defaults?.gender ?? ""}
              className="rounded-btn border-border bg-surface w-full border px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            >
              <option value="">— មិនកំណត់ —</option>
              <option value="M">ប្រុស</option>
              <option value="F">ស្រី</option>
            </select>
          </div>

          <div>
            <label className="text-fg mb-1 block text-sm font-medium">
              ថ្ងៃខែឆ្នាំកំណើត
            </label>
            <input
              name="dob"
              type="date"
              defaultValue={defaults?.dob ?? ""}
              className="rounded-btn border-border bg-surface w-full border px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-fg mb-1 block text-sm font-medium">
              លេខទូរសព្ទ
            </label>
            <input
              name="phone"
              type="tel"
              inputMode="tel"
              defaultValue={defaults?.phone ?? ""}
              maxLength={30}
              className="rounded-btn border-border bg-surface w-full border px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>

          <div>
            <label className="text-fg mb-1 block text-sm font-medium">
              ថ្ងៃចូលបម្រើការ
            </label>
            <input
              name="joined_date"
              type="date"
              defaultValue={defaults?.joined_date ?? ""}
              className="rounded-btn border-border bg-surface w-full border px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>
        </div>
      </section>

      {/* Address */}
      <section className="space-y-4">
        <h3 className="font-moul text-muted text-xs uppercase">
          អាសយដ្ឋានបច្ចុប្បន្ន
        </h3>
        <CascadingAddressPicker
          name="contact_address_code"
          label=""
          provinces={provinces}
          defaultValue={defaults?.contact_address_code ?? null}
        />
      </section>

      {/* Specializations */}
      <section className="space-y-4">
        <h3 className="font-moul text-muted text-xs uppercase">
          មុខវិជ្ជាឯកទេស
        </h3>

        <div>
          <label className="text-fg mb-1 block text-sm font-medium">
            មុខវិជ្ជាឯកទេសទី១
          </label>
          <select
            name="specialist_1_subject_id"
            defaultValue={defaults?.specialist_1_subject_id ?? ""}
            className="rounded-btn border-border bg-surface w-full border px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          >
            <option value="">— មិនកំណត់ —</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.subject_name} · {s.code}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-fg mb-1 block text-sm font-medium">
            មុខវិជ្ជាឯកទេសទី២ (ប្រសិនបើមាន)
          </label>
          <select
            name="specialist_2_subject_id"
            defaultValue={defaults?.specialist_2_subject_id ?? ""}
            className="rounded-btn border-border bg-surface w-full border px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          >
            <option value="">— មិនកំណត់ —</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.subject_name} · {s.code}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Notes */}
      <section className="space-y-4">
        <h3 className="font-moul text-muted text-xs uppercase">
          កំណត់សម្គាល់
        </h3>
        <textarea
          name="notes"
          rows={3}
          maxLength={1000}
          defaultValue={defaults?.notes ?? ""}
          className="rounded-btn border-border bg-surface w-full border px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
      </section>
    </div>
  );
}