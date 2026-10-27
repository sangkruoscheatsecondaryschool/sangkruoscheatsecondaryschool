import { toKhmer } from "@/lib/khmer/numerals";

export function ReportSignatures({
  principalName,
  homeroomName,
  secondaryTitle = "គ្រូបន្ទុកថ្នាក់", // 👈 Added this prop with a default
  dateIso,
}: {
  principalName?: string | null;
  homeroomName?: string | null;
  secondaryTitle?: string;
  dateIso?: string;
}) {
  const today = dateIso ?? new Date().toISOString().slice(0, 10);
  const [y, m, d] = today.split("-").map(Number);

  return (
    <footer className="mt-8 print:mt-6">
      <div className="grid grid-cols-2 gap-4 text-xs">
        <div className="text-center"><br /><br /><br />
          <p className="font-moul">នាយកសាលា</p>
          <div className="h-14" />
          <p className="font-moul">{principalName ?? "________________"}</p>
        </div>

        <div className="text-center">
          <p>ថ្ងៃ............................ ខែ.................. ឆ្នាំ............ .....ស័ក ព.ស២៥៧...</p>
          <p>
            ធ្វើនៅ ........................ ថ្ងៃទី {toKhmer(d)} ខែ{" "}
            {monthKh(m)} ឆ្នាំ {toKhmer(y)}
          </p>
          <p className="font-moul mt-2">{secondaryTitle}</p>
          <div className="h-12" />
          <p className="font-moul">{homeroomName ?? "________________"}</p>
        </div>
      </div>

      <p className="mt-6 text-center text-[10px] text-slate-500 print:hidden">
        ឯកសារនេះបង្កើតដោយប្រព័ន្ធគ្រប់គ្រងសាលា · បោះពុម្ពថ្ងៃទី{" "}
        {toKhmer(d)} ខែ {monthKh(m)} ឆ្នាំ {toKhmer(y)}
      </p>
    </footer>
  );
}

const KHMER_MONTHS = [
  "មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា",
  "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ",
];

function monthKh(m: number): string {
  return KHMER_MONTHS[m - 1] ?? "";
}