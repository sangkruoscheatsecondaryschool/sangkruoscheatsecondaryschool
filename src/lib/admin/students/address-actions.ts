"use server";

import {
  listDistricts,
  listCommunes,
  listVillages,
  loadAddressChain,
  resolveAddress,
  type AdminUnit,
  type AddressChain,
  type AddressDisplay,
} from "./address-queries";

export async function loadDistrictsAction(
  provinceId: string,
): Promise<AdminUnit[]> {
  if (!provinceId) return [];
  return listDistricts(provinceId);
}

export async function loadCommunesAction(
  districtId: string,
): Promise<AdminUnit[]> {
  if (!districtId) return [];
  return listCommunes(districtId);
}

export async function loadVillagesAction(
  communeId: string,
): Promise<AdminUnit[]> {
  if (!communeId) return [];
  return listVillages(communeId);
}

export async function loadAddressChainAction(
  code: string | null,
): Promise<AddressChain> {
  return loadAddressChain(code);
}

export async function resolveAddressAction(
  code: string | null,
): Promise<AddressDisplay | null> {
  return resolveAddress(code);
}