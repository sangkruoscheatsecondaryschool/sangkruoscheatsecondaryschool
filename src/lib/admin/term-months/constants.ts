export const KHMER_MONTHS = [
  { number: 1, name_kh: "មករា" },
  { number: 2, name_kh: "កុម្ភៈ" },
  { number: 3, name_kh: "មីនា" },
  { number: 4, name_kh: "មេសា" },
  { number: 5, name_kh: "ឧសភា" },
  { number: 6, name_kh: "មិថុនា" },
  { number: 7, name_kh: "កក្កដា" },
  { number: 8, name_kh: "សីហា" },
  { number: 9, name_kh: "កញ្ញា" },
  { number: 10, name_kh: "តុលា" },
  { number: 11, name_kh: "វិច្ឆិកា" },
  { number: 12, name_kh: "ធ្នូ" },
] as const;

export type KhmerMonth = (typeof KHMER_MONTHS)[number];