import Link from "next/link";
import { connection } from "next/server";
import { AppShell } from "@/components/app-shell";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getCurrentAcademicYear } from "@/lib/admin/academic-years/queries";
import { createClient } from "@/lib/supabase/server";

export const instant = false;

export const metadata = { title: "ផ្ទាំងគ្រប់គ្រង" };

export default async function DashboardPage() {
  await connection();

  const user = await getCurrentUser();
  if (!user) return null;

  const isAdmin = user.profile.role === "admin";

  // Fetch quick stats (only for admin to save queries for teachers)
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
    <AppShell title="ផ្ទាំងគ្រប់គ្រង">
      <div className="space-y-6">
        
        {/* ===== User Info Card ===== */}
        <div className="rounded-card border-border bg-surface border p-4">
          <p className="text-muted text-[10px] font-medium uppercase tracking-wide">
            Signed in as
          </p>
          <p className="font-moul mt-1 text-lg">
            {user.profile.full_name_kh}
          </p>
          <p className="text-muted mt-0.5 text-sm">
            {isAdmin ? "នាយក / លេខាធិការ" : "គ្រូបង្រៀន"}
            {user.email ? ` · ${user.email}` : ""}
          </p>
        </div>

        {/* ===== ADMIN VIEW ===== */}
        {isAdmin ? (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-card border-border bg-surface border p-3 text-center">
                <p className="text-muted text-[10px] uppercase">សិស្សសកម្ម</p>
                <p className="mt-1 text-xl font-semibold tabular-nums">{studentCount}</p>
              </div>
              <div className="rounded-card border-border bg-surface border p-3 text-center">
                <p className="text-muted text-[10px] uppercase">គ្រូបង្រៀន</p>
                <p className="mt-1 text-xl font-semibold tabular-nums">{teacherCount}</p>
              </div>
              <div className="rounded-card border-border bg-surface border p-3 text-center">
                <p className="text-muted text-[10px] uppercase">ឆ្នាំសិក្សា</p>
                <p className="mt-1 font-semibold">{currentYearName}</p>
              </div>
            </div>

            {/* Main Admin Entry */}
            <Link
              href="/admin"
              className="rounded-card bg-brand-600 block px-4 py-4 text-white active:bg-brand-700"
            >
              <p className="font-moul text-base">គ្រប់គ្រងប្រព័ន្ធ</p>
              <p className="mt-1 text-xs opacity-90">
                Academic years, classes, students, teachers, subjects, reports
              </p>
            </Link>

            {/* Quick Actions */}
            <div>
              <h2 className="font-moul text-muted text-xs uppercase mb-2">សកម្មភាពរហ័ស</h2>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/admin/students"
                  className="rounded-card border-border bg-surface border p-3 flex flex-col justify-center active:bg-slate-50"
                >
                  <span className="text-lg">👤</span>
                  <span className="text-sm font-medium mt-1">គ្រប់គ្រងសិស្ស</span>
                </Link>
                <Link
                  href="/admin/reports"
                  className="rounded-card border-border bg-surface border p-3 flex flex-col justify-center active:bg-slate-50"
                >
                  <span className="text-lg">📊</span>
                  <span className="text-sm font-medium mt-1">របាយការណ៍</span>
                </Link>
                <Link
                  href="/admin/timetable"
                  className="rounded-card border-border bg-surface border p-3 flex flex-col justify-center active:bg-slate-50"
                >
                  <span className="text-lg">🗓️</span>
                  <span className="text-sm font-medium mt-1">តារាងកាលវិភាគ</span>
                </Link>
                <Link
                  href="/admin/settings/school"
                  className="rounded-card border-border bg-surface border p-3 flex flex-col justify-center active:bg-slate-50"
                >
                  <span className="text-lg">⚙️</span>
                  <span className="text-sm font-medium mt-1">ការកំណត់</span>
                </Link>
              </div>
            </div>
          </>
        ) : (
          /* ===== TEACHER VIEW ===== */
          <Link
            href="/teacher"
            className="rounded-card bg-brand-600 block px-4 py-5 text-white active:bg-brand-700"
          >
            <p className="font-moul text-lg">ថ្នាក់របស់ខ្ញុំ</p>
            <p className="mt-1 text-sm opacity-90">
              ចូលមើលថ្នាក់រៀន បញ្ចូលពិន្ទុ និងកត់ត្រាវត្តមាន
            </p>
          </Link>
        )}
      </div>
    </AppShell>
  );
}