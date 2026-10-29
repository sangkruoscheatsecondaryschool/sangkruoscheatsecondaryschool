"use client";

import type { ClassOption } from "@/lib/admin/students/queries";
import type { AdminUnit } from "@/lib/admin/students/address-queries";
import { CascadingAddressPicker } from "@/components/cascading-address-picker";
import { Input } from "@/components/ui/input";

export type StudentDefaults = {
  student_code?: string;
  name_kh?: string;
  gender?: string | null;
  dob?: string;
  class_id?: string;
  place_of_birth_code?: string | null;
  current_address_code?: string | null;
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
  provinces: AdminUnit[];
  defaults?: StudentDefaults;
}) {
  return (
    <div className="space-y-8">
      {/* ----- Basic Info ----- */}
      <section className="space-y-4">
        <h3 className="font-moul text-lg text-slate-800 border-b pb-2">ព័ត៌មានមូលដ្ឋាន</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">លេខកូដសិស្ស *</label>
            <Input
              name="student_code"
              defaultValue={defaults?.student_code}
              required
              placeholder="S001"
              className="font-inter uppercase"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">ឈ្មោះសិស្ស *</label>
            <Input
              name="name_kh"
              defaultValue={defaults?.name_kh}
              required
              placeholder="ឈ្មោះពេញ"
            />
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
            <label className="text-sm font-medium text-slate-700">ថ្ងៃខែឆ្នាំកំណើត *</label>
            <Input
              name="dob"
              type="date"
              defaultValue={defaults?.dob}
              required
              className="font-inter"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">ថ្នាក់រៀន *</label>
            <select
              name="class_id"
              defaultValue={defaults?.class_id ?? ""}
              required
              className="flex h-12 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-base focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            >
              <option value="" disabled>— ជ្រើសរើសថ្នាក់ —</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  ថ្នាក់ទី {c.grade_level} · {c.class_name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">ស្ថានភាពសិក្សា</label>
            <select
              name="status"
              defaultValue={defaults?.status ?? "active"}
              className="flex h-12 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-base focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            >
              <option value="active">កំពុងសិក្សា</option>
              <option value="dropped_s1">បានបោះបង់ ឆមាសទី១</option>
              <option value="dropped_s2">បានបោះបង់ ឆមាសទី២</option>
              <option value="graduated">បានបញ្ចប់ការសិក្សា</option>
            </select>
          </div>
        </div>
      </section>

      {/* ----- Address ----- */}
      <section className="space-y-4">
        <h3 className="font-moul text-lg text-slate-800 border-b pb-2">អាសយដ្ឋាន</h3>
        
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <CascadingAddressPicker
            name="place_of_birth_code"
            label="ទីកន្លែងកំណើត"
            provinces={provinces}
            defaultValue={defaults?.place_of_birth_code}
          />
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <CascadingAddressPicker
            name="current_address_code"
            label="អាសយដ្ឋានបច្ចុប្បន្ន"
            provinces={provinces}
            defaultValue={defaults?.current_address_code}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">អាសយដ្ឋានបន្ថែម (ផ្ទះលេខ ផ្លូវ)</label>
          <Input
            name="current_address_detail"
            defaultValue={defaults?.current_address_detail ?? ""}
            placeholder="ឧ. ផ្ទះលេខ ១២ ផ្លូវ ២៧១"
          />
        </div>
      </section>

      {/* ----- Family ----- */}
      <section className="space-y-4">
        <h3 className="font-moul text-lg text-slate-800 border-b pb-2">ព័ត៌មានគ្រួសារ</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">ឈ្មោះម្តាយ</label>
            <Input name="mother_name" defaultValue={defaults?.mother_name ?? ""} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">ឈ្មោះឪពុក</label>
            <Input name="father_name" defaultValue={defaults?.father_name ?? ""} />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">លេខទូរសព្ទទំនាក់ទំនង</label>
          <Input
            name="contact_number"
            type="tel"
            defaultValue={defaults?.contact_number ?? ""}
            placeholder="0xx xxx xxx"
            className="font-inter"
          />
        </div>
      </section>
    </div>
  );
}