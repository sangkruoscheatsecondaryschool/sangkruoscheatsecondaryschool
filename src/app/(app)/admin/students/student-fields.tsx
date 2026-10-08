"use client";

import type { ClassOption } from "@/lib/admin/students/queries";
import type { ProvinceOption } from "@/lib/admin/students/address-queries";
import { CascadingAddressPicker } from "@/components/cascading-address-picker";

export type StudentDefaults = {
  student_code?: string;
  name_kh?: string;
  gender?: string | null;
  dob?: string;
  class_id?: string;
  place_of_birth_village_id?: string | null;
  current_address_village_id?: string | null;
  current_address_detail?: string | null;
  mother_name?: string | null;
  father_name?: string | null;
  contact_number?: string | null;
  status?: "active" | "dropped_s1" | "dropped_s2" | "graduated";
};

export function StudentFields({
  classes,
  provinces,
  defaults,
}: {
  classes: ClassOption[];
  provinces: ProvinceOption[];
  defaults?: StudentDefaults;
}) {
  return (
    <div className="space-y-5">
      {/* ----- Basic ----- */}
      <section className="space-y-4">
        <h3 className="font-moul text-muted text-xs uppercase">
          ព័ត៌មានមូលដ្ឋាន
        </h3>

        <div>
          <label className="text-fg mb-1 block text-sm font-medium">
            លេខកូដសិស្ស
          </label>
          <input
            name="student_code"
            type="text"
            defaultValue={defaults?.student_code}
            required
            maxLength={30}
            autoComplete="off"
            autoCapitalize="characters"
            placeholder="S001"
            className="rounded-btn border-border bg-surface w-full border px-3 py-2.5 font-mono uppercase outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </div>

        <div>
          <label className="text-fg mb-1 block text-sm font-medium">
            ឈ្មោះសិស្ស
          </label>
          <input
            name="name_kh"
            type="text"
            defaultValue={defaults?.name_kh}
            required
            maxLength={150}
            autoComplete="off"
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
              ថ្ងៃកំណើត
            </label>
            <input
              name="dob"
              type="date"
              defaultValue={defaults?.dob}
              required
              className="rounded-btn border-border bg-surface w-full border px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>
        </div>

        <div>
          <label className="text-fg mb-1 block text-sm font-medium">
            ថ្នាក់រៀន
          </label>
          <select
            name="class_id"
            defaultValue={defaults?.class_id ?? ""}
            required
            className="rounded-btn border-border bg-surface w-full border px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          >
            <option value="" disabled>
              — ជ្រើសរើសថ្នាក់ —
            </option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                ថ្នាក់ទី {c.grade_level} · {c.class_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-fg mb-1 block text-sm font-medium">
            ស្ថានភាព
          </label>
          <select
            name="status"
            defaultValue={defaults?.status ?? "active"}
            className="rounded-btn border-border bg-surface w-full border px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          >
            <option value="active">កំពុងសិក្សា</option>
            <option value="dropped_s1">បានបោះបង់ ឆមាសទី១</option>
            <option value="dropped_s2">បានបោះបង់ ឆមាសទី២</option>
            <option value="graduated">បានបញ្ចប់ការសិក្សា</option>
          </select>
        </div>
      </section>

      {/* ----- Address ----- */}
      <section className="space-y-4">
        <h3 className="font-moul text-muted text-xs uppercase">
          អាសយដ្ឋាន
        </h3>

        <CascadingAddressPicker
          name="place_of_birth_village_id"
          label="ទីកន្លែងកំណើត"
          provinces={provinces}
          defaultValue={defaults?.place_of_birth_village_id}
        />

        <CascadingAddressPicker
          name="current_address_village_id"
          label="អាសយដ្ឋានបច្ចុប្បន្ន"
          provinces={provinces}
          defaultValue={defaults?.current_address_village_id}
        />

        <div>
          <label className="text-fg mb-1 block text-sm font-medium">
            អាសយដ្ឋានបន្ថែម (ផ្ទះលេខ ផ្លូវ)
          </label>
          <input
            name="current_address_detail"
            type="text"
            defaultValue={defaults?.current_address_detail ?? ""}
            maxLength={200}
            autoComplete="off"
            placeholder="ឧ. ផ្ទះលេខ ១២ ផ្លូវ ២៧១"
            className="rounded-btn border-border bg-surface w-full border px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
          <p className="text-muted mt-1 text-xs">
            ប្រសិនបើទុកទទេ អាសយដ្ឋានបច្ចុប្បន្ននឹងប្រើទីកន្លែងកំណើត។
          </p>
        </div>
      </section>

      {/* ----- Family ----- */}
      <section className="space-y-4">
        <h3 className="font-moul text-muted text-xs uppercase">គ្រួសារ</h3>

        <div>
          <label className="text-fg mb-1 block text-sm font-medium">
            ឈ្មោះម្តាយ
          </label>
          <input
            name="mother_name"
            type="text"
            defaultValue={defaults?.mother_name ?? ""}
            maxLength={150}
            autoComplete="off"
            className="rounded-btn border-border bg-surface w-full border px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </div>

        <div>
          <label className="text-fg mb-1 block text-sm font-medium">
            ឈ្មោះឪពុក
          </label>
          <input
            name="father_name"
            type="text"
            defaultValue={defaults?.father_name ?? ""}
            maxLength={150}
            autoComplete="off"
            className="rounded-btn border-border bg-surface w-full border px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </div>

        <div>
          <label className="text-fg mb-1 block text-sm font-medium">
            លេខទូរសព្ទទំនាក់ទំនង
          </label>
          <input
            name="contact_number"
            type="tel"
            inputMode="tel"
            defaultValue={defaults?.contact_number ?? ""}
            maxLength={30}
            autoComplete="off"
            placeholder="0xx xxx xxx"
            className="rounded-btn border-border bg-surface w-full border px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </div>
      </section>
    </div>
  );
}