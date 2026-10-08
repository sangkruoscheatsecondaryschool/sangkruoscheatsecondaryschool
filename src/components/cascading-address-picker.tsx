"use client";

import { useEffect, useState, useTransition } from "react";
import type {
  CommuneOption,
  DistrictOption,
  ProvinceOption,
  VillageOption,
} from "@/lib/admin/students/address-queries";
import {
  loadCommunesAction,
  loadDistrictsAction,
  loadVillagesAction,
  loadVillageAncestryAction,
} from "@/lib/admin/students/address-actions";

type Props = {
  name: string; // form field name — submits the village UUID
  label?: string;
  provinces: ProvinceOption[];
  defaultValue?: string | null; // pre-selected village id
  required?: boolean;
};

export function CascadingAddressPicker({
  name,
  label = "អាសយដ្ឋាន",
  provinces,
  defaultValue,
  required,
}: Props) {
  const [provinceId, setProvinceId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [communeId, setCommuneId] = useState("");
  const [villageId, setVillageId] = useState("");

  const [districts, setDistricts] = useState<DistrictOption[]>([]);
  const [communes, setCommunes] = useState<CommuneOption[]>([]);
  const [villages, setVillages] = useState<VillageOption[]>([]);

  const [hydrating, setHydrating] = useState(Boolean(defaultValue));
  const [, startTransition] = useTransition();

  // Initial hydration from defaultValue
  useEffect(() => {
    if (!defaultValue) {
      setHydrating(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const ancestry = await loadVillageAncestryAction(defaultValue);
      if (cancelled || !ancestry) {
        setHydrating(false);
        return;
      }
      const [ds, cs, vs] = await Promise.all([
        loadDistrictsAction(ancestry.province_id),
        loadCommunesAction(ancestry.district_id),
        loadVillagesAction(ancestry.commune_id),
      ]);
      if (cancelled) return;
      setProvinceId(ancestry.province_id);
      setDistrictId(ancestry.district_id);
      setCommuneId(ancestry.commune_id);
      setVillageId(ancestry.village_id);
      setDistricts(ds);
      setCommunes(cs);
      setVillages(vs);
      setHydrating(false);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue]);

  const onProvinceChange = (v: string) => {
    setProvinceId(v);
    setDistrictId("");
    setCommuneId("");
    setVillageId("");
    setDistricts([]);
    setCommunes([]);
    setVillages([]);
    if (!v) return;
    startTransition(async () => {
      setDistricts(await loadDistrictsAction(v));
    });
  };

  const onDistrictChange = (v: string) => {
    setDistrictId(v);
    setCommuneId("");
    setVillageId("");
    setCommunes([]);
    setVillages([]);
    if (!v) return;
    startTransition(async () => {
      setCommunes(await loadCommunesAction(v));
    });
  };

  const onCommuneChange = (v: string) => {
    setCommuneId(v);
    setVillageId("");
    setVillages([]);
    if (!v) return;
    startTransition(async () => {
      setVillages(await loadVillagesAction(v));
    });
  };

  const disabled = hydrating;

  return (
    <div className="space-y-3">
      <p className="text-fg text-sm font-medium">{label}</p>

      <div>
        <label className="text-muted mb-1 block text-[11px] font-medium uppercase">
          ខេត្ត/ក្រុង
        </label>
        <select
          value={provinceId}
          onChange={(e) => onProvinceChange(e.target.value)}
          disabled={disabled}
          className="rounded-btn border-border bg-surface w-full border px-3 py-2.5 text-sm disabled:opacity-60"
        >
          <option value="">— ជ្រើសរើសខេត្ត/ក្រុង —</option>
          {provinces.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name_kh}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-muted mb-1 block text-[11px] font-medium uppercase">
          ស្រុក/ខណ្ឌ
        </label>
        <select
          value={districtId}
          onChange={(e) => onDistrictChange(e.target.value)}
          disabled={disabled || !provinceId || districts.length === 0}
          className="rounded-btn border-border bg-surface w-full border px-3 py-2.5 text-sm disabled:opacity-60"
        >
          <option value="">
            {provinceId && districts.length === 0
              ? "— គ្មានទិន្នន័យ —"
              : "— ជ្រើសរើសស្រុក/ខណ្ឌ —"}
          </option>
          {districts.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name_kh}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-muted mb-1 block text-[11px] font-medium uppercase">
          ឃុំ/សង្កាត់
        </label>
        <select
          value={communeId}
          onChange={(e) => onCommuneChange(e.target.value)}
          disabled={disabled || !districtId || communes.length === 0}
          className="rounded-btn border-border bg-surface w-full border px-3 py-2.5 text-sm disabled:opacity-60"
        >
          <option value="">
            {districtId && communes.length === 0
              ? "— គ្មានទិន្នន័យ —"
              : "— ជ្រើសរើសឃុំ/សង្កាត់ —"}
          </option>
          {communes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name_kh}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-muted mb-1 block text-[11px] font-medium uppercase">
          ភូមិ
        </label>
        <select
          value={villageId}
          onChange={(e) => setVillageId(e.target.value)}
          disabled={disabled || !communeId || villages.length === 0}
          className="rounded-btn border-border bg-surface w-full border px-3 py-2.5 text-sm disabled:opacity-60"
        >
          <option value="">
            {communeId && villages.length === 0
              ? "— គ្មានទិន្នន័យ —"
              : "— ជ្រើសរើសភូមិ —"}
          </option>
          {villages.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name_kh}
            </option>
          ))}
        </select>
      </div>

      {/* The actual form value */}
      <input
        type="hidden"
        name={name}
        value={villageId}
        required={required && Boolean(villageId) === false ? false : undefined}
      />
      {required && !villageId && !hydrating ? (
        <p className="text-xs text-amber-700">
          សូមជ្រើសរើសអាសយដ្ឋានឲ្យបានពេញលេញ។
        </p>
      ) : null}
    </div>
  );
}