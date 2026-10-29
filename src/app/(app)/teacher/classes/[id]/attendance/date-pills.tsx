import Link from "next/link";

const KHMER_MONTHS_SHORT = ["មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា", "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"];
const KHMER_DAYS = ["អាទិត្យ", "ចន្ទ", "អង្គារ", "ពុធ", "ព្រហ", "សុក្រ", "សៅរ៍"];

function fmtChip(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return { day: KHMER_DAYS[d.getDay()], date: `${d.getDate()} ${KHMER_MONTHS_SHORT[d.getMonth()]}` };
}

export function DatePills({ classId, days, activeDate }: { classId: string; days: string[]; activeDate: string }) {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-3">
      <div className="-mx-1 flex gap-2 overflow-x-auto pb-1">
        {days.map((d) => {
          const active = d === activeDate;
          const { day, date } = fmtChip(d);
          return (
            <Link
              key={d}
              href={`/teacher/classes/${classId}/attendance?date=${d}`}
              className={`shrink-0 rounded-xl border px-4 py-2 text-center text-sm font-medium transition-all ${
                active
                  ? "border-primary-600 bg-primary-600 text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <p className="leading-tight">{day}</p>
              <p className={`mt-0.5 text-[10px] font-inter ${active ? "opacity-90" : "text-slate-400"}`}>{date}</p>
            </Link>
          );
        })}
      </div>

      <form method="get" action={`/teacher/classes/${classId}/attendance`} className="flex items-center gap-2">
        <input
          type="date"
          name="date"
          defaultValue={activeDate}
          max={today}
          className="flex h-11 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100 font-inter"
        />
        <button type="submit" className="h-11 rounded-xl bg-slate-800 px-6 text-sm font-medium text-white hover:bg-slate-900 transition-colors">
          បង្ហាញ
        </button>
      </form>
    </div>
  );
}