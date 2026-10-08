import Link from "next/link";
import { AppShell } from "@/components/app-shell";

export const instant = false;

export const metadata = { title: "គ្រប់គ្រងប្រព័ន្ធ" };

const items = [
  {
    href: "/admin/academic-years",
    title: "ឆ្នាំសិក្សា",
    desc: "ឆ្នាំសិក្សា និងខែតាមឆមាស",
  },
  {
    href: "/admin/classes",
    title: "ថ្នាក់រៀន",
    desc: "ថ្នាក់ និងគ្រូបន្ទុកថ្នាក់",
  },
  {
    href: "/admin/students",
    title: "សិស្ស",
    desc: "បញ្ជីសិស្ស និងលេខកូដ",
  },
  {
    href: "/admin/subjects",
    title: "មុខវិជ្ជា",
    desc: "មុខវិជ្ជា និងពិន្ទុពេញតាមកម្រិតថ្នាក់",
  },
] as const;

export default function AdminHomePage() {
  return (
    <AppShell title="គ្រប់គ្រងប្រព័ន្ធ" backHref="/dashboard">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <MenuCard key={item.href} {...item} />
        ))}
      </div>
    </AppShell>
  );
}

function MenuCard({
  href,
  title,
  desc,
  soon,
}: {
  href: string;
  title: string;
  desc: string;
  soon?: boolean;
}) {
  const inner = (
    <>
      <p className="font-moul text-base">{title}</p>
      <p className="text-muted mt-1 text-xs">{desc}</p>
      {soon ? (
        <span className="text-muted mt-2 inline-block text-[10px] uppercase tracking-wide">
          នឹងមកដល់
        </span>
      ) : null}
    </>
  );

  const base =
    "rounded-card border-border bg-surface block border p-4 transition-colors";

  if (soon) {
    return (
      <div className={`${base} cursor-not-allowed opacity-60`}>{inner}</div>
    );
  }

  return (
    <Link href={href} className={`${base} active:bg-brand-50`}>
      {inner}
    </Link>
  );
}