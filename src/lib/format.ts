const KHMER_DIGITS = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];
const KHMER_MONTHS = ["មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា", "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"];

export function toKhmerNumerals(value: number | string): string {
  return String(value).replace(/[0-9]/g, (d) => KHMER_DIGITS[Number(d)]);
}

export function formatKhmerDate(date: Date | string): string {
  const d = new Date(date);
  const day = toKhmerNumerals(d.getDate());
  const month = KHMER_MONTHS[d.getMonth()];
  const year = toKhmerNumerals(d.getFullYear());
  return `ថ្ងៃទី ${day} ខែ${month} ឆ្នាំ ${year}`;
}