"use client";

import type { SubjectOption, TeacherRow } from "@/lib/admin/teachers/queries";
import type { AdminUnit } from "@/lib/admin/students/address-queries";
import { CascadingAddressPicker } from "@/components/cascading-address-picker";
import { Input } from "@/components/ui/input";

export type TeacherDefaults = Partial<
  Pick<
    TeacherRow,
    | "full_name_kh" | "full_name_en" | "gender" | "dob" | "phone"
    | "contact_address_code" | "joined_date" | "specialist_1_subject_id"
    | "specialist_2_subject_id" | "notes"
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
    <div className="space-y-8">
      {/* Personal */}
      <section className="space-y-4">
        <h3 className="font-moul text-lg text-slate-800 border-b pb-2">ព័ត៌មានផ្ទាល់ខ្លួន</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">ឈ្មោះជាភាសាខ្មែរ *</label>
            <Input name="full_name_kh" defaultValue={defaults?.full_name_kh} required />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">ឈ្មោះជាភាសាអង់គ្លេស</label>
            <Input name="full_name_en" defaultValue={defaults?.full_name_en ?? ""} className="font-inter" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">ភេទ</label>
            <select
              name="gender"
              defaultValue={defaults?.gender ?? ""}
              className="flex h-12 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-base focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            >
              <option value="">— មិនកំណត់ —</option>
              <option value="M">ប្រុស</option>
              <option value="F">ស្រី</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">ថ្ងៃកំណើត</label>
            <Input name="dob" type="date" defaultValue={defaults?.dob ?? ""} className="font-inter" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">លេខទូរសព្ទ</label>
            <Input name="phone" type="tel" defaultValue={defaults?.phone ?? ""} className="font-inter" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">ថ្ងៃចូលបម្រើការ</label>
            <Input name="joined_date" type="date" defaultValue={defaults?.joined_date ?? ""} className="font-inter" />
          </div>
        </div>
      </section>

      {/* Address */}
      <section className="space-y-4">
        <h3 className="font-moul text-lg text-slate-800 border-b pb-2">អាសយដ្ឋានបច្ចុប្បន្ន</h3>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <CascadingAddressPicker
            name="contact_address_code"
            label=""
            provinces={provinces}
            defaultValue={defaults?.contact_address_code ?? null}
          />
        </div>
      </section>

      {/* Specializations */}
      <section className="space-y-4">
        <h3 className="font-moul text-lg text-slate-800 border-b pb-2">មុខវិជ្ជាជំនាញ</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">មុខវិជ្ជាជំនាញទី១</label>
            <select
              name="specialist_1_subject_id"
              defaultValue={defaults?.specialist_1_subject_id ?? ""}
              className="flex h-12 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-base focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            >
              <option value="">— មិនកំណត់ —</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.subject_name} · {s.code}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">មុខវិជ្ជាជំនាញទី២ (ស្រេចចិត្ត)</label>
            <select
              name="specialist_2_subject_id"
              defaultValue={defaults?.specialist_2_subject_id ?? ""}
              className="flex h-12 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-base focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            >
              <option value="">— មិនកំណត់ —</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.subject_name} · {s.code}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Notes */}
      <section className="space-y-4">
        <h3 className="font-moul text-lg text-slate-800 border-b pb-2">កំណត់សម្គាល់</h3>
        <textarea
          name="notes"
          rows={3}
          defaultValue={defaults?.notes ?? ""}
          className="flex w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-base focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
        />
      </section>
    </div>
  );
}