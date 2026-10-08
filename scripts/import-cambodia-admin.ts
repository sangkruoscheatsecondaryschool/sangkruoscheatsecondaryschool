import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// -----------------------------------------------------------------------------
// Load .env.local manually (tsx does not auto-load Next.js env files).
// -----------------------------------------------------------------------------
try {
  const envPath = resolve(process.cwd(), ".env.local");
  const lines = readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
} catch {
  console.warn("No .env.local found — relying on ambient env vars.");
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env.",
  );
  process.exit(1);
}
const file = process.argv[2];
if (!file) {
  console.error(
    "Usage: pnpm import:admin <path-to-json>",
  );
  process.exit(1);
}

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------
type District = {
  code: string;
  province_code: string;
  name_kh: string;
  name_en: string;
};
type Commune = {
  code: string;
  district_code: string;
  name_kh: string;
  name_en: string;
};
type Village = {
  code: string;
  commune_code: string;
  name_kh: string;
  name_en: string;
};
type Payload = {
  districts: District[];
  communes: Commune[];
  villages: Village[];
};

// Untyped client so the script doesn't depend on generated DB types.
const supabase: SupabaseClient = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function chunkedInsert(
  table: string,
  rows: Record<string, unknown>[],
  chunkSize = 500,
): Promise<void> {
  let inserted = 0;
  for (let i = 0; i < rows.length; i += chunkSize) {
    const batch = rows.slice(i, i + chunkSize);
    const { error } = await supabase.from(table).upsert(batch, {
      onConflict: "code",
      ignoreDuplicates: false,
    });
    if (error) throw new Error(`${table} batch ${i}: ${error.message}`);
    inserted += batch.length;
    console.log(`  ${table}: ${inserted}/${rows.length}`);
  }
}

async function main() {
  const path = resolve(process.cwd(), file);
  console.log(`Reading ${path}`);
  const raw = readFileSync(path, "utf8");
  const data = JSON.parse(raw) as Payload;

  // Load province code→id map
  const { data: provinces, error: pErr } = await supabase
    .from("provinces")
    .select("id, code");
  if (pErr) throw pErr;
  const provinceByCode = new Map(
    (provinces ?? []).map((p) => [p.code, p.id]),
  );

  // Insert districts
  console.log(`\nDistricts (${data.districts.length})`);
  await chunkedInsert(
    "districts",
    data.districts.map((d) => ({
      code: d.code,
      province_id: provinceByCode.get(d.province_code),
      name_kh: d.name_kh,
      name_en: d.name_en,
    })),
  );

  // Load district code→id map
  const { data: districts, error: dErr } = await supabase
    .from("districts")
    .select("id, code");
  if (dErr) throw dErr;
  const districtByCode = new Map(
    (districts ?? []).map((d) => [d.code, d.id]),
  );

  // Insert communes
  console.log(`\nCommunes (${data.communes.length})`);
  await chunkedInsert(
    "communes",
    data.communes.map((c) => ({
      code: c.code,
      district_id: districtByCode.get(c.district_code),
      name_kh: c.name_kh,
      name_en: c.name_en,
    })),
  );

  // Load commune code→id map
  const { data: communes, error: cErr } = await supabase
    .from("communes")
    .select("id, code");
  if (cErr) throw cErr;
  const communeByCode = new Map(
    (communes ?? []).map((c) => [c.code, c.id]),
  );

  // Insert villages
  console.log(`\nVillages (${data.villages.length})`);
  await chunkedInsert(
    "villages",
    data.villages.map((v) => ({
      code: v.code,
      commune_id: communeByCode.get(v.commune_code),
      name_kh: v.name_kh,
      name_en: v.name_en,
    })),
  );

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});