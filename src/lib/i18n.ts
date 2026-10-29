import { km } from "@/locales/km";

export function t(path: string): string {
  const keys = path.split(".");
  let result: any = km;
  for (const key of keys) {
    if (result[key] === undefined) return path; // fallback to key if missing
    result = result[key];
  }
  return result;
}