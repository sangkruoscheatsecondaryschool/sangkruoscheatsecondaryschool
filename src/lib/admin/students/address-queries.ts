import "server-only";
import { createClient } from "@/lib/supabase/server";

export type AdminUnit = {
  id: string;
  code: string;
  name_kh: string;
  name_en: string;
};

export type AddressDisplay = {
  level: "province" | "district" | "commune" | "village";
  code: string;
  village_name_kh: string | null;
  commune_name_kh: string | null;
  district_name_kh: string | null;
  province_name_kh: string;
};

export async function listProvinces(): Promise<AdminUnit[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("provinces")
    .select("id, code, name_kh, name_en")
    .order("code", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listDistricts(
  provinceId: string,
): Promise<AdminUnit[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("districts")
    .select("id, code, name_kh, name_en")
    .eq("province_id", provinceId)
    .order("code", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listCommunes(districtId: string): Promise<AdminUnit[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("communes")
    .select("id, code, name_kh, name_en")
    .eq("district_id", districtId)
    .order("code", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listVillages(communeId: string): Promise<AdminUnit[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("villages")
    .select("id, code, name_kh, name_en")
    .eq("commune_id", communeId)
    .order("code", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

// =========================================================
// Resolve a code into the display structure.
// Uses the SQL function for one round-trip.
// =========================================================
export async function resolveAddress(
  code: string | null,
): Promise<AddressDisplay | null> {
  if (!code || code.length < 2) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("resolve_address", {
    p_code: code,
  });
  if (error || !data) return null;
  return data as AddressDisplay;
}

// =========================================================
// One-shot chain loader: given a partial code, return
// the lists needed to hydrate the picker.
// =========================================================
export type AddressChain = {
  provinces: AdminUnit[];
  districts: AdminUnit[];
  communes: AdminUnit[];
  villages: AdminUnit[];
};

export async function loadAddressChain(
  code: string | null,
): Promise<AddressChain> {
  const provinces = await listProvinces();

  if (!code || code.length < 2) {
    return { provinces, districts: [], communes: [], villages: [] };
  }

  const province = provinces.find((p) => p.code === code.slice(0, 2));
  if (!province) {
    return { provinces, districts: [], communes: [], villages: [] };
  }

  const districts = await listDistricts(province.id);

  if (code.length < 4) {
    return { provinces, districts, communes: [], villages: [] };
  }

  const district = districts.find((d) => d.code === code.slice(0, 4));
  if (!district) {
    return { provinces, districts, communes: [], villages: [] };
  }

  const communes = await listCommunes(district.id);

  if (code.length < 6) {
    return { provinces, districts, communes, villages: [] };
  }

  const commune = communes.find((c) => c.code === code.slice(0, 6));
  if (!commune) {
    return { provinces, districts, communes, villages: [] };
  }

  const villages = await listVillages(commune.id);
  return { provinces, districts, communes, villages };
}