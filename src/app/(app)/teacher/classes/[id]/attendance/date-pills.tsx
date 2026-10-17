import Link from "next/link";

const KHMER_MONTHS_SHORT = [
  "មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា",
  "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ",
];

const KHMER_DAYS = ["អាទិត្យ", "ចន្ទ", "អង្គារ", "ពុធ", "ព្រហ", "សុក្រ", "សៅរ៍"];

function fmtChip(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return {
    day: KHMER_DAYS[d.getDay()],
    date: `${d.getDate()} ${KHMER_MONTHS_SHORT[d.getMonth()]}`,
  };
}

function todayIso(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

export function DatePills({
  classId,
  days,
  activeDate,
}: {
  classId: string;
  days: string[];
  activeDate: string;
}) {
  const today = todayIso();

  return (
    <div className="space-y-2">
      <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1">
        {days.map((d) => {
          const active = d === activeDate;
          const { day, date } = fmtChip(d);
          return (
            <Link
              key={d}
              href={`/teacher/classes/${classId}/attendance?date=${d}`}
              className={`shrink-0 rounded-card border px-3 py-2 text-center text-xs font-medium transition-colors ${
                active
                  ? "border-brand-600 bg-brand-600 text-white"
                  : "border-border bg-surface text-fg active:bg-slate-50"
              }`}
            >
              <p className="leading-tight">{day}</p>
              <p
                className={`mt-0.5 text-[10px] tabular-nums ${
                  active ? "opacity-90" : "text-muted"
                }`}
              >
                {date}
              </p>
            </Link>
          );
        })}
      </div>

      <form
        method="get"
        action={`/teacher/classes/${classId}/attendance`}
        className="flex items-center gap-2"
      >
        <input
          type="date"
          name="date"
          defaultValue={activeDate}
          max={today}
          className="rounded-btn border-border bg-surface flex-1 border px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
        <button
          type="submit"
          className="touch-target rounded-btn border-border bg-surface border px-4 text-sm active:bg-slate-50"
        >
          បង្ហាញ
        </button>
      </form>
    </div>
  );
}