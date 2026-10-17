import Link from "next/link";
import { connection } from "next/server";
import { AppShell } from "@/components/app-shell";

export const instant = false;
export const metadata = { title: "របាយការណ៍" };

export default async function ReportsHubPage() {
  await connection();

  type ReportItem = {
    href: string;
    title: string;
    desc: string;
    soon?: boolean;
  };

  const items: ReportItem[] = [
    {
        href: "/admin/reports/ranking",
        title: "ចំណាត់ថ្នាក់សិស្ស",
        desc: "ប្រចាំខែ · ប្រចាំឆមាស · ប្រចាំឆ្នាំ",
    },
    {
        href: "/admin/reports/timetable",
        title: "តារាងកាលវិភាគបង្រៀន",
        desc: "តាមថ្នាក់ · តាមគ្រូ · ទាំងអស់",
    },
    {
        href: "/admin/reports/attendance",
        title: "របាយការណ៍វត្តមាន",
        desc: "ប្រចាំខែ តាមថ្នាក់",
    },
    {
        href: "/admin/reports/statistics",
        title: "ស្ថិតិសាលា",
        desc: "ចំនួនសិស្ស លទ្ធផល និងច្រើនទៀត",
    },
  ];

  return (
    <AppShell title="របាយការណ៍" backHref="/admin">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((i) => {
          const base =
            "rounded-card border-border bg-surface block border p-4";
          const inner = (
            <>
              <p className="font-moul text-base">{i.title}</p>
              <p className="text-muted mt-1 text-xs">{i.desc}</p>
              {i.soon ? (
                <span className="text-muted mt-2 inline-block text-[10px] uppercase">
                  នឹងមកដល់
                </span>
              ) : null}
            </>
          );
          return i.soon ? (
            <div key={i.href} className={`${base} cursor-not-allowed opacity-60`}>
              {inner}
            </div>
          ) : (
            <Link key={i.href} href={i.href} className={`${base} active:bg-brand-50`}>
              {inner}
            </Link>
          );
        })}
      </div>
    </AppShell>
  );
}