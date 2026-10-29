import Link from "next/link";
import { connection } from "next/server";
import { ArrowLeft, School, GraduationCap, Users, Layers } from "lucide-react"; // 👈 Added Layers
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";

export const instant = false;
export const metadata = { title: "របាយការណ៍តារាងកាលវិភាគ" };

export default async function TimetableReportsHub() {
  await connection();

  const items = [
    { href: "/admin/reports/timetable/class", title: "តាមថ្នាក់", desc: "តារាងម៉ោងសម្រាប់ថ្នាក់រៀនមួយៗ", icon: School, color: "text-blue-500", bg: "bg-blue-50" },
    { href: "/admin/reports/timetable/teacher", title: "តាមគ្រូបង្រៀន", desc: "កាលវិភាគបង្រៀនសម្រាប់គ្រូម្នាក់ៗ", icon: GraduationCap, color: "text-green-500", bg: "bg-green-50" },
    { href: "/admin/reports/timetable/all", title: "គ្រប់ថ្នាក់ទាំងអស់", desc: "បោះពុម្ពកាលវិភាគសម្រាប់សាលាទាំងមូល", icon: Layers, color: "text-orange-500", bg: "bg-orange-50" },
    { href: "/admin/reports/timetable/all-teachers", title: "គ្រូទាំងអស់", desc: "តារាងធំបង្ហាញគ្រូទាំងអស់", icon: Users, color: "text-purple-500", bg: "bg-purple-50" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <Link href="/admin/reports" className="inline-flex items-center text-sm text-slate-500 hover:text-primary-600 mb-2">
        <ArrowLeft className="h-4 w-4 mr-1" /> ត្រឡប់ក្រោយ
      </Link>
      
      <PageHeader title="របាយការណ៍តារាងកាលវិភាគ" description="ជ្រើសរើសប្រភេទតារាងកាលវិភាគដែលចង់បោះពុម្ព" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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