"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ActionResult } from "@/lib/actions/types";
import type { SchoolSettings } from "@/lib/admin/school/queries";
import type { AdminUnit } from "@/lib/admin/students/address-queries";
import { updateSchoolSettingsAction } from "@/lib/admin/school/actions";
import { CascadingAddressPicker } from "@/components/cascading-address-picker";

export function SchoolSettingsForm({
  settings,
  provinces,
}: {
  settings: SchoolSettings;
  provinces: AdminUnit[];
}) {
  const router = useRouter();
  const [state, action, pending] = useActionState<
    ActionResult | null,
    FormData
  >(updateSchoolSettingsAction, null);

  useEffect(() => {
    if (state?.ok) router.refresh();
  }, [state, router]);

  return (
    <form action={action} className="space-y-5 pb-24">
      <input type="hidden" name="id" value={settings.id} />

      <section className="space-y-4">
        <h3 className="font-moul text-muted text-xs uppercase">ការកំណត់សាលា</h3>

        <div>
          <label className="text-fg mb-1 block text-sm font-medium">ឈ្មោះសាលា (ខ្មែរ) *</label>
          <input name="school_name_kh" type="text" defaultValue={settings.school_name_kh} required className="rounded-btn border-border bg-surface w-full border px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
        </div>

        <div>
          <label className="text-fg mb-1 block text-sm font-medium">ឈ្មោះសាលា (អង់គ្លេស)</label>
          <input name="school_name_en" type="text" defaultValue={settings.school_name_en ?? ""} className="rounded-btn border-border bg-surface w-full border px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
        </div>

        <div>
          <label className="text-fg mb-1 block text-sm font-medium">លេខកូដសាលា (ពីក្រសួង)</label>
          <input name="school_code" type="text" defaultValue={settings.school_code ?? ""} className="rounded-btn border-border bg-surface w-full border px-3 py-2.5 font-mono outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="font-moul text-muted text-xs uppercase">បន្ទាត់រដ្ឋបាល (សម្រាប់ក្បាលឯកសារ)</h3>

        <div>
          <label className="text-fg mb-1 block text-sm font-medium">ក្រសួង *</label>
          <input name="ministry_line_kh" type="text" defaultValue={settings.ministry_line_kh} required className="rounded-btn border-border bg-surface w-full border px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
        </div>

        <div>
          <label className="text-fg mb-1 block text-sm font-medium">មន្ទីរអប់រំ (ខេត្ត)</label>
          <input name="department_line_kh" type="text" defaultValue={settings.department_line_kh ?? ""} placeholder="ឧ. មន្ទីរអប់រំ យុវជន និងកីឡា ខេត្តកណ្ដាល" className="rounded-btn border-border bg-surface w-full border px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
        </div>

        <div>
          <label className="text-fg mb-1 block text-sm font-medium">ការិយាល័យអប់រំ (ស្រុក)</label>
          <input name="district_line_kh" type="text" defaultValue={settings.district_line_kh ?? ""} placeholder="ឧ. ការិយាល័យអប់រំ យុវជន និងកីឡា ស្រុក..." className="rounded-btn border-border bg-surface w-full border px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="font-moul text-muted text-xs uppercase">ទំនាក់ទំនង</h3>
        
        <CascadingAddressPicker
          name="address_code"
          label="អាសយដ្ឋានសាលា"
          provinces={provinces}
          defaultValue={settings.address_code}
        />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-fg mb-1 block text-sm font-medium">លេខទូរសព្ទ</label>
            <input name="phone" type="tel" defaultValue={settings.phone ?? ""} className="rounded-btn border-border bg-surface w-full border px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
          </div>
          <div>
            <label className="text-fg mb-1 block text-sm font-medium">អ៊ីមែល</label>
            <input name="email" type="email" defaultValue={settings.email ?? ""} className="rounded-btn border-border bg-surface w-full border px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="font-moul text-muted text-xs uppercase">បោះពុម្ព</h3>

        <div>
          <label className="text-fg mb-1 block text-sm font-medium">ប៉ាវចនាជាតិ *</label>
          <input name="motto_kh" type="text" defaultValue={settings.motto_kh} required className="rounded-btn border-border bg-surface w-full border px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
        </div>

        <div>
          <label className="text-fg mb-1 block text-sm font-medium">ឈ្មោះនាយកសាលា</label>
          <input name="principal_name_kh" type="text" defaultValue={settings.principal_name_kh ?? ""} className="rounded-btn border-border bg-surface w-full border px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
        </div>

        <div>
          <label className="text-fg mb-1 block text-sm font-medium">Logo URL</label>
          <input name="logo_url" type="text" defaultValue={settings.logo_url ?? "/moeys_logo.png"} className="rounded-btn border-border bg-surface w-full border px-3 py-2.5 font-mono text-xs outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
          <p className="text-muted mt-1 text-xs">ដាក់ឯកសាររូបតំណាង (emblem) នៅ <code>/public/moeys_logo.png</code></p>
        </div>
      </section>

      {state && !state.ok ? (
        <div role="alert" className="rounded-btn border border-red-200 bg-red-50 p-3 text-sm text-red-700">{state.error}</div>
      ) : null}

      {state?.ok ? (
        <div role="status" className="rounded-btn border border-green-200 bg-green-50 p-3 text-sm text-green-800">បានរក្សាទុកដោយជោគជ័យ។</div>
      ) : null}

      <div className="bg-surface/95 fixed inset-x-0 bottom-0 z-30 border-t border-border pb-safe backdrop-blur">
        <div className="mx-auto flex max-w-3xl gap-2 p-3">
          <button type="submit" disabled={pending} className="touch-target rounded-btn bg-brand-600 flex-1 px-4 py-3 font-medium text-white active:bg-brand-700 disabled:opacity-60">
            {pending ? "កំពុងរក្សាទុក..." : "រក្សាទុក"}
          </button>
        </div>
      </div>
    </form>
  );
}