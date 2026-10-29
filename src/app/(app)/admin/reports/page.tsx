import Link from "next/link";
import { connection } from "next/server";
import { Trophy, Calendar, CheckSquare, PieChart } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";

export const instant = false;
export const metadata = { title: "របាយការណ៍" };

export default async function ReportsHubPage() {
  await connection();

  const items = [
    {
      href: "/admin/reports/ranking",
      title: "ចំណាត់ថ្នាក់សិស្ស",
      desc: "ចំណាត់ថ្នាក់ប្រចាំខែ · ឆមាស · ឆ្នាំ",
      icon: Trophy,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      href: "/admin/reports/timetable",
      title: "តារាងកាលវិភាគ",
      desc: "តាមថ្នាក់ · តាមគ្រូ · គ្រូទាំងអស់",
      icon: Calendar,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      href: "/admin/reports/attendance",
      title: "របាយការណ៍វត្តមាន",
      desc: "វត្តមានប្រចាំខែ តាមថ្នាក់រៀន",
      icon: CheckSquare,
      color: "text-green-500",
      bg: "bg-green-50",
    },
    {
      href: "/admin/reports/statistics",
      title: "ស្ថិតិសាលា",
      desc: "ចំនួនសិស្ស លទ្ធផល និងការវិភាគ",
      icon: PieChart,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader title="របាយការណ៍" description="មជ្ឈមណ្ឌលរបាយការណ៍ និងស្ថិតិសាលា" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="group block">
            <Card className="h-full p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg border-transparent hover:border-slate-200">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-2xl ${item.bg} ${item.color} shrink-0`}>
                  <item.icon className="h-6 w-6" />
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