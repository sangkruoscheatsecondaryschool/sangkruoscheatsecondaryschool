const KHMER_DIGITS = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];

export function toKhmer(
  value: number | string | null | undefined,
  decimals?: number,
): string {
  if (value === null || value === undefined) return "—";
  let s: string;
  if (typeof value === "number") {
    s = decimals !== undefined ? value.toFixed(decimals) : String(value);
  } else {
    s = value;
  }
  return s.replace(/[0-9]/g, (d) => KHMER_DIGITS[Number(d)]);
}

export function toKhmerOrdinal(value: number, width = 2): string {
  return toKhmer(String(value).padStart(width, "0"));
}

const KHMER_MONTHS = [
  "មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា",
  "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ",
];

export function formatKhmerDate(
  iso: string,
  opts: { khmerNumerals?: boolean } = {},
): string {
  const [y, m, d] = iso.split("-").map(Number);
  const kn = opts.khmerNumerals ?? true;
  const day = kn ? toKhmer(d) : String(d);
  const year = kn ? toKhmer(y) : String(y);
  return `${day} ${KHMER_MONTHS[m - 1]} ${year}`;
}