import "server-only";
import { createClient } from "@/lib/supabase/server";

export type ProvinceOption = {
  id: string;
  code: string;
  name_kh: string;
  name_en: string;
};

export type DistrictOption = ProvinceOption & { province_id: string };
export type CommuneOption = ProvinceOption & { district_id: string };
export type VillageOption = ProvinceOption & { commune_id: string };

export async function listProvinces(): Promise<ProvinceOption[]> {
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
): Promise<DistrictOption[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("districts")
    .select("id, code, name_kh, name_en, province_id")
    .eq("province_id", provinceId)
    .order("code", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listCommunes(
  districtId: string,
): Promise<CommuneOption[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("communes")
    .select("id, code, name_kh, name_en, district_id")
    .eq("district_id", districtId)
    .order("code", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listVillages(
  communeId: string,
): Promise<VillageOption[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("villages")
    .select("id, code, name_kh, name_en, commune_id")
    .eq("commune_id", communeId)
    .order("code", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export type VillageAncestry = {
  province_id: string;
  district_id: string;
  commune_id: string;
  village_id: string;
};

export async function getVillageAncestry(
  villageId: string,
): Promise<VillageAncestry | null> {
  const supabase = await createClient();

  const { data: village, error: vErr } = await supabase
    .from("villages")
    .select("id, commune_id")
    .eq("id", villageId)
    .maybeSingle();
  if (vErr) throw new Error(vErr.message);
  if (!village) return null;

  const { data: commune, error: cErr } = await supabase
    .from("communes")
    .select("id, district_id")
    .eq("id", village.commune_id)
    .maybeSingle();
  if (cErr) throw new Error(cErr.message);
  if (!commune) return null;

  const { data: district, error: dErr } = await supabase
    .from("districts")
    .select("id, province_id")
    .eq("id", commune.district_id)
    .maybeSingle();
  if (dErr) throw new Error(dErr.message);
  if (!district) return null;

  return {
    province_id: district.province_id,
    district_id: district.id,
    commune_id: commune.id,
    village_id: village.id,
  };
}

export type AddressDisplay = {
  village_name_kh: string;
  commune_name_kh: string;
  district_name_kh: string;
  province_name_kh: string;
};

export async function getVillageAddressDisplay(
  villageId: string | null,
): Promise<AddressDisplay | null> {
  if (!villageId) return null;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("villages")
    .select(
      `name_kh,
       communes!inner(
         name_kh,
         districts!inner(
           name_kh,
           provinces!inner(name_kh)
         )
       )`,
    )
    .eq("id", villageId)
    .maybeSingle();

  if (error || !data) return null;

  // Supabase returns nested shape; extract safely
  const v = data as unknown as {
    name_kh: string;
    communes: {
      name_kh: string;
      districts: {
        name_kh: string;
        provinces: { name_kh: string };
      };
    };
  };

  return {
    village_name_kh: v.name_kh,
    commune_name_kh: v.communes.name_kh,
    district_name_kh: v.communes.districts.name_kh,
    province_name_kh: v.communes.districts.provinces.name_kh,
  };
}