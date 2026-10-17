import Link from "next/link";
import { connection } from "next/server";
import { AppShell } from "@/components/app-shell";

export const instant = false;
export const metadata = { title: "របាយការណ៍ចំណាត់ថ្នាក់" };

export default async function RankingHubPage() {
  await connection();

  const items = [
    {
      href: "/admin/reports/ranking/monthly",
      title: "ចំណាត់ថ្នាក់ប្រចាំខែ",
      desc: "លទ្ធផលប្រឡងប្រចាំខែ",
    },
    {
      href: "/admin/reports/ranking/semester",
      title: "ចំណាត់ថ្នាក់ប្រចាំឆមាស",
      desc: "មធ្យមភាគប្រចាំខែ ប្រឡងឆមាស និងប្រចាំឆមាស",
    },
    {
      href: "/admin/reports/ranking/annual",
      title: "ចំណាត់ថ្នាក់ប្រចាំឆ្នាំ",
      desc: "មធ្យមភាគឆមាសទី១ ទី២ និងប្រចាំឆ្នាំ",
    },
  ];

  return (
    <AppShell title="របាយការណ៍ចំណាត់ថ្នាក់" backHref="/admin/reports">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((i) => (
          <Link
            key={i.href}
            href={i.href}
            className="rounded-card border-border bg-surface border p-4 active:bg-brand-50"
          >
            <p className="font-moul text-base">{i.title}</p>
            <p className="text-muted mt-1 text-xs">{i.desc}</p>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}