"use server";

import {
  listDistricts,
  listCommunes,
  listVillages,
  getVillageAncestry,
  type DistrictOption,
  type CommuneOption,
  type VillageOption,
  type VillageAncestry,
} from "./address-queries";

export async function loadDistrictsAction(
  provinceId: string,
): Promise<DistrictOption[]> {
  if (!provinceId) return [];
  return listDistricts(provinceId);
}

export async function loadCommunesAction(
  districtId: string,
): Promise<CommuneOption[]> {
  if (!districtId) return [];
  return listCommunes(districtId);
}

export async function loadVillagesAction(
  communeId: string,
): Promise<VillageOption[]> {
  if (!communeId) return [];
  return listVillages(communeId);
}

export async function loadVillageAncestryAction(
  villageId: string,
): Promise<VillageAncestry | null> {
  if (!villageId) return null;
  return getVillageAncestry(villageId);
}