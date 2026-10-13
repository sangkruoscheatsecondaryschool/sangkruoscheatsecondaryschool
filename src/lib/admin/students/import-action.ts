"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/require-role";
import {
  parseImportWorkbook,
  STATUS_KH_TO_ENUM,
  type ImportRow,
} from "./xlsx";

export type ImportReportRow = {
  row_index: number;
  student_code: string;
  ok: boolean;
  error: string | null;
};

export type ImportResult =
  | {
      ok: true;
      inserted: number;
      failed: number;
      total: number;
      report: ImportReportRow[];
    }
  | { ok: false; error: string };

// =========================================================
// Resolve address names → Address codes
// =========================================================
type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

async function resolveAddressCode(
  supabase: SupabaseClient,
  provinceName: string,
  districtName: string,
  communeName: string,
  villageName: string,
): Promise<{ code: string | null; error: string | null }> {
  // If nothing provided → nothing to store.
  if (!provinceName) return { code: null, error: null };

  const { data: province } = await supabase
    .from("provinces")
    .select("id, code")
    .eq("name_kh", provinceName)
    .maybeSingle();
  if (!province) {
    return { code: null, error: `ខេត្ត "${provinceName}" រកមិនឃើញ` };
  }

  // Province-only is valid.
  if (!districtName) return { code: province.code, error: null };

  const { data: district } = await supabase
    .from("districts")
    .select("id, code")
    .eq("province_id", province.id)
    .eq("name_kh", districtName)
    .maybeSingle();
  if (!district) {
    return { code: null, error: `ស្រុក "${districtName}" រកមិនឃើញ` };
  }

  if (!communeName) return { code: district.code, error: null };

  const { data: commune } = await supabase
    .from("communes")
    .select("id, code")
    .eq("district_id", district.id)
    .eq("name_kh", communeName)
    .maybeSingle();
  if (!commune) {
    return { code: null, error: `ឃុំ "${communeName}" រកមិនឃើញ` };
  }

  if (!villageName) return { code: commune.code, error: null };

  const { data: village } = await supabase
    .from("villages")
    .select("code")
    .eq("commune_id", commune.id)
    .eq("name_kh", villageName)
    .maybeSingle();
  if (!village) {
    return { code: null, error: `ភូមិ "${villageName}" រកមិនឃើញ` };
  }

  return { code: village.code, error: null };
}

// =========================================================
// Row → RPC payload
// =========================================================
type Payload = Record<string, string | null>;

async function prepareRow(
  supabase: SupabaseClient,
  row: ImportRow,
  classIdByName: Map<string, string>,
): Promise<{ payload: Payload | null; error: string | null }> {
  // Required fields
  if (!row.student_code) return { payload: null, error: "ខ្វះលេខកូដសិស្ស" };
  if (!row.name_kh) return { payload: null, error: "ខ្វះឈ្មោះសិស្ស" };
  if (!row.dob || !/^\d{4}-\d{2}-\d{2}$/.test(row.dob)) {
    return { payload: null, error: "ថ្ងៃកំណើតមិនត្រឹមត្រូវ (ត្រូវជា YYYY-MM-DD)" };
  }
  if (!row.class_name) return { payload: null, error: "ខ្វះថ្នាក់" };

  const classId = classIdByName.get(row.class_name);
  if (!classId) {
    return { payload: null, error: `ថ្នាក់ "${row.class_name}" រកមិនឃើញ` };
  }

  // Gender
  const gender = row.gender ? row.gender.toUpperCase() : "";
  if (gender && gender !== "M" && gender !== "F") {
    return { payload: null, error: "ភេទត្រូវជា M ឬ F" };
  }

  // Status: accept enum or Khmer label
  let status = (row.status || "active").trim();
  if (STATUS_KH_TO_ENUM[status]) status = STATUS_KH_TO_ENUM[status];
  if (!["active", "dropped_s1", "dropped_s2", "graduated"].includes(status)) {
    status = "active";
  }

  // Resolve addresses (both optional)
  const [pob, cur] = await Promise.all([
    resolveAddressCode(supabase, row.pob_province, row.pob_district, row.pob_commune, row.pob_village),
    resolveAddressCode(supabase, row.cur_province, row.cur_district, row.cur_commune, row.cur_village),
  ]);

  if (pob.error) return { payload: null, error: `ទីកន្លែងកំណើត៖ ${pob.error}` };
  if (cur.error) return { payload: null, error: `អាសយដ្ឋានបច្ចុប្បន្ន៖ ${cur.error}` };

  return {
    payload: {
      class_id: classId,
      student_code: row.student_code,
      name_kh: row.name_kh,
      gender: gender || null,
      dob: row.dob,
      place_of_birth_code: pob.code,
      current_address_code: cur.code ?? pob.code,
      current_address_detail: row.current_address_detail || null,
      mother_name: row.mother_name || null,
      father_name: row.father_name || null,
      contact_number: row.contact_number || null,
      status,
    },
    error: null,
  };
}

// =========================================================
// Main action
// =========================================================
export async function importStudentsAction(
  _prev: ImportResult | null,
  formData: FormData,
): Promise<ImportResult> {
  await requireRole("admin");

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "សូមជ្រើសរើសឯកសារ XLSX។" };
  }

  const yearId = formData.get("year_id");
  if (typeof yearId !== "string" || !yearId) {
    return { ok: false, error: "ខ្វះឆ្នាំសិក្សា។" };
  }

  let rows: ImportRow[];
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    rows = await parseImportWorkbook(buffer);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "អានឯកសារមិនបានសម្រេច។";
    return { ok: false, error: msg };
  }

  if (rows.length === 0) {
    return { ok: false, error: "គ្មានទិន្នន័យក្នុងឯកសារ។" };
  }

  if (rows.length > 500) {
    return {
      ok: false,
      error: `ចំនួនជួរដែលអនុញ្ញាតគឺ ៥០០។ ឯកសាររបស់អ្នកមាន ${rows.length} ជួរ។`,
    };
  }

  const supabase = await createClient();

  // Load classes for the year
  const { data: classes, error: cErr } = await supabase
    .from("classes")
    .select("id, class_name")
    .eq("academic_year_id", yearId);

  if (cErr) return { ok: false, error: cErr.message };

  const classIdByName = new Map(
    (classes ?? []).map((c) => [c.class_name, c.id]),
  );

  // Prepare payloads
  const report: ImportReportRow[] = [];
  const payloads: { index: number; payload: Payload }[] = [];
  const PREP_ERRORS: ImportReportRow[] = [];

  for (let i = 0; i < rows.length; i++) {
    const { payload, error } = await prepareRow(
      supabase,
      rows[i],
      classIdByName,
    );
    if (error || !payload) {
      PREP_ERRORS.push({
        row_index: i + 2, // +2 = header + 0-index
        student_code: rows[i].student_code,
        ok: false,
        error: error ?? "ទិន្នន័យមិនត្រឹមត្រូវ",
      });
      continue;
    }
    payloads.push({ index: i + 2, payload });
  }

  // Bulk insert via RPC (atomic per row)
  const { data: bulkResults, error: bErr } = await supabase.rpc(
    "bulk_create_students",
    { p_rows: payloads.map((p) => p.payload) },
  );

  if (bErr) return { ok: false, error: bErr.message };

  for (let i = 0; i < (bulkResults ?? []).length; i++) {
    const r = bulkResults[i];
    report.push({
      row_index: payloads[i].index,
      student_code: r.student_code ?? "",
      ok: r.ok,
      error: r.error,
    });
  }

  // Merge prep errors
  const allReport = [...PREP_ERRORS, ...report].sort(
    (a, b) => a.row_index - b.row_index,
  );

  const inserted = allReport.filter((r) => r.ok).length;
  const failed = allReport.length - inserted;

  revalidatePath("/admin/students");

  return {
    ok: true,
    inserted,
    failed,
    total: allReport.length,
    report: allReport,
  };
}