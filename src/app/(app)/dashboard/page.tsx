import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { connection } from "next/server";

export const instant = false;

export const metadata = { title: "ផ្ទាំងគ្រប់គ្រង" };

export default async function DashboardPage() {
  await connection();

  const user = await getCurrentUser();
  if (!user) return null;

  const isAdmin = user.profile.role === "admin";

  return (
    <AppShell title="ផ្ទាំងគ្រប់គ្រង">
      <div className="space-y-4">
        <div className="rounded-card border-border bg-surface border p-4">
          <p className="text-muted text-xs uppercase tracking-wide">
            Signed in as
          </p>
          <p className="font-moul mt-1 text-base">
            {user.profile.full_name_kh}
          </p>
          <p className="text-muted mt-1 text-sm">
            {isAdmin ? "នាយក / លេខាធិការ" : "គ្រូបង្រៀន"}
            {user.email ? ` · ${user.email}` : ""}
          </p>
        </div>

        {isAdmin ? (
          <Link
            href="/admin"
            className="rounded-card bg-brand-600 block px-4 py-4 text-white active:bg-brand-700"
          >
            <p className="font-moul text-base">គ្រប់គ្រងប្រព័ន្ធ</p>
            <p className="mt-1 text-xs opacity-90">
              Academic years, classes, students, teachers, subjects
            </p>
          </Link>
        ) : (
          <Link
            href="/teacher"
            className="rounded-card bg-brand-600 block px-4 py-4 text-white active:bg-brand-700"
          >
            <p className="font-moul text-base">គ្រូបង្រៀន</p>
            <p className="mt-1 text-xs opacity-90">
              Score entry, attendance
            </p>
          </Link>
        )}

        <div className="rounded-card border border-dashed border-border bg-surface p-6 text-center">
          <p className="text-muted text-sm">
            Features will be added in Phases 4 and 5.
          </p>
        </div>
      </div>
    </AppShell>
  );
}