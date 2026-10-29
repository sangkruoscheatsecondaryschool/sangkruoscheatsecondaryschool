import Link from "next/link";
import { connection } from "next/server";
import { Users, School, BookOpen, FileText, Calendar } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getCurrentAcademicYear } from "@/lib/admin/academic-years/queries";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { formatKhmerDate, toKhmerNumerals } from "@/lib/format";

export const instant = false;

export default async function DashboardPage() {
  await connection();
  const user = await getCurrentUser();
  if (!user) return null;

  const isAdmin = user.profile.role === "admin";

  let studentCount = 0;
  let teacherCount = 0;
  let currentYearName = "—";

  if (isAdmin) {
    const supabase = await createClient();
    const [year, students, teachers] = await Promise.all([
      getCurrentAcademicYear(),
      supabase.from("students").select("*", { count: "exact", head: true }).eq("status", "active"),
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "teacher"),
    ]);
    currentYearName = year?.year_name ?? "—";
    studentCount = students.count ?? 0;
    teacherCount = teachers.count ?? 0;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Greeting */}
      <div>
        <h1 className="font-moul text-2xl md:text-3xl text-slate-900">
          សួស្តី, {user.profile.full_name_kh}
        </h1>
        <p className="text-slate-500 mt-2 text-sm md:text-base">
          {formatKhmerDate(new Date())} · ឆ្នាំសិក្សា {currentYearName}
        </p>
      </div>

      {isAdmin ? (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-4 bg-primary-50 text-primary-600 rounded-2xl">
                  <Users className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">សិស្សសកម្ម</p>
                  <p className="text-3xl font-inter font-bold text-slate-900 mt-1">{toKhmerNumerals(studentCount)}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-4 bg-orange-50 text-accent-500 rounded-2xl">
                  <School className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">គ្រូបង្រៀន</p>
                  <p className="text-3xl font-inter font-bold text-slate-900 mt-1">{toKhmerNumerals(teacherCount)}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-4 bg-green-50 text-success-500 rounded-2xl">
                  <Calendar className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">ឆ្នាំសិក្សា</p>
                  <p className="text-xl font-inter font-bold text-slate-900 mt-1">{currentYearName}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="font-moul text-lg text-slate-800 mb-4">សកម្មភាពរហ័ស</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/admin/students/new">
                <Card className="hover:-translate-y-1 hover:shadow-md transition-all duration-200 border-transparent hover:border-primary-200 cursor-pointer">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-3 h-full">
                    <Users className="h-8 w-8 text-primary-500" />
                    <span className="font-medium text-slate-700 text-sm">បន្ថែមសិស្ស</span>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/admin/reports">
                <Card className="hover:-translate-y-1 hover:shadow-md transition-all duration-200 border-transparent hover:border-primary-200 cursor-pointer">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-3 h-full">
                    <FileText className="h-8 w-8 text-orange-500" />
                    <span className="font-medium text-slate-700 text-sm">របាយការណ៍</span>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/admin/timetable">
                <Card className="hover:-translate-y-1 hover:shadow-md transition-all duration-200 border-transparent hover:border-primary-200 cursor-pointer">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-3 h-full">
                    <Calendar className="h-8 w-8 text-green-500" />
                    <span className="font-medium text-slate-700 text-sm">តារាងកាលវិភាគ</span>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/admin/subjects">
                <Card className="hover:-translate-y-1 hover:shadow-md transition-all duration-200 border-transparent hover:border-primary-200 cursor-pointer">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-3 h-full">
                    <BookOpen className="h-8 w-8 text-purple-500" />
                    <span className="font-medium text-slate-700 text-sm">មុខវិជ្ជា</span>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </>
      ) : (
        <Card className="bg-primary-600 text-white border-none">
          <CardContent className="p-8 text-center space-y-4">
            <School className="h-12 w-12 mx-auto text-primary-200" />
            <h2 className="font-moul text-2xl">ថ្នាក់របស់ខ្ញុំ</h2>
            <p className="text-primary-100">ចូលមើលថ្នាក់រៀន បញ្ចូលពិន្ទុ និងកត់ត្រាវត្តមាន</p>
            <Link href="/teacher" className="inline-block mt-4 px-6 py-3 bg-white text-primary-700 rounded-xl font-medium hover:bg-slate-100 transition-colors">
              ចូលទៅកាន់ថ្នាក់រៀន
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}