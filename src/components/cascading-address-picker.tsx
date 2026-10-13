"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import type { AdminUnit } from "@/lib/admin/students/address-queries";
import {
  loadAddressChainAction,
  loadCommunesAction,
  loadDistrictsAction,
  loadVillagesAction,
} from "@/lib/admin/students/address-actions";

type Props = {
  name: string;
  label?: string;
  provinces: AdminUnit[]; // server-rendered, cached
  defaultValue?: string | null; // an address code, length 2/4/6/8
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

  const [districts, setDistricts] = useState<AdminUnit[]>([]);
  const [communes, setCommunes] = useState<AdminUnit[]>([]);
  const [villages, setVillages] = useState<AdminUnit[]>([]);
  const [hydrating, setHydrating] = useState(Boolean(defaultValue));
  const [, startTransition] = useTransition();

  // Hydrate from a code — one server action returns everything.
  useEffect(() => {
    if (!defaultValue) {
      setHydrating(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const chain = await loadAddressChainAction(defaultValue);
      if (cancelled) return;
      setDistricts(chain.districts);
      setCommunes(chain.communes);
      setVillages(chain.villages);

      const code = defaultValue;
      const p = chain.provinces.find((x) => x.code === code.slice(0, 2));
      const d = chain.districts.find((x) => x.code === code.slice(0, 4));
      const c = chain.communes.find((x) => x.code === code.slice(0, 6));
      const v = chain.villages.find((x) => x.code === code.slice(0, 8));
      setProvinceId(p?.id ?? "");
      setDistrictId(d?.id ?? "");
      setCommuneId(c?.id ?? "");
      setVillageId(v?.id ?? "");
      setHydrating(false);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue]);

  // Compute the address code from the deepest non-empty selection.
  const computedCode = useMemo(() => {
    if (villageId) {
      const v = villages.find((x) => x.id === villageId);
      if (v) return v.code;
    }
    if (communeId) {
      const c = communes.find((x) => x.id === communeId);
      if (c) return c.code;
    }
    if (districtId) {
      const d = districts.find((x) => x.id === districtId);
      if (d) return d.code;
    }
    if (provinceId) {
      const p = provinces.find((x) => x.id === provinceId);
      if (p) return p.code;
    }
    return "";
  }, [
    villageId,
    communeId,
    districtId,
    provinceId,
    villages,
    communes,
    districts,
    provinces,
  ]);

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
          ខេត្ត/ក្រុង {required ? <span className="text-red-600">*</span> : null}
        </label>
        <select
          value={provinceId}
          onChange={(e) => onProvinceChange(e.target.value)}
          disabled={disabled}
          required={required}
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

      <input type="hidden" name={name} value={computedCode} />

      {computedCode ? (
        <p className="text-muted text-xs">
          លេខកូដអាសយដ្ឋាន៖ <span className="font-mono">{computedCode}</span>
        </p>
      ) : required ? (
        <p className="text-xs text-amber-700">
          សូមជ្រើសរើសខេត្តយ៉ាងតិច។
        </p>
      ) : null}
    </div>
  );
}