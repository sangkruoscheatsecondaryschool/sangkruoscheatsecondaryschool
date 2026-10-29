import Link from "next/link";
import { connection } from "next/server";
import { ArrowLeft, Trophy, CalendarDays, CalendarRange } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";

export const instant = false;
export const metadata = { title: "របាយការណ៍ចំណាត់ថ្នាក់" };

export default async function RankingHubPage() {
  await connection();

  const items = [
    {
      href: "/admin/reports/ranking/monthly",
      title: "ចំណាត់ថ្នាក់ប្រចាំខែ",
      desc: "លទ្ធផលប្រឡងប្រចាំខែ",
      icon: CalendarDays,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      href: "/admin/reports/ranking/semester",
      title: "ចំណាត់ថ្នាក់ប្រចាំឆមាស",
      desc: "មធ្យមភាគប្រចាំខែ ប្រឡង និងឆមាស",
      icon: CalendarRange,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      href: "/admin/reports/ranking/annual",
      title: "ចំណាត់ថ្នាក់ប្រចាំឆ្នាំ",
      desc: "មធ្យមភាគឆមាសទី១ ទី២ និងប្រចាំឆ្នាំ",
      icon: Trophy,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-2 mb-2">
        <Link href="/admin/reports" className="text-sm text-slate-500 hover:text-primary-600 flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" /> ត្រឡប់ក្រោយ
        </Link>
      </div>
      
      <PageHeader title="ចំណាត់ថ្នាក់សិស្ស" description="ជ្រើសរើសប្រភេទរបាយការណ៍ចំណាត់ថ្នាក់" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="group block">
            <Card className="h-full p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg border-transparent hover:border-slate-200">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={`p-4 rounded-2xl ${item.bg} ${item.color} shrink-0 group-hover:scale-110 transition-transform`}>
                  <item.icon className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="font-moul text-lg text-slate-900 group-hover:text-primary-600 transition-colors">{item.title}</h3>
                  <p className="text-slate-500 text-sm mt-1">{item.desc}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}