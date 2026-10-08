import Link from "next/link";
import { connection } from "next/server";
import { AppShell } from "@/components/app-shell";
import { listSubjectsWithConfigs } from "@/lib/admin/subjects/queries";
import { SubjectCard } from "./subject-card";

export const instant = false;

export const metadata = { title: "មុខវិជ្ជា" };

export default async function SubjectsPage() {
  await connection();

  const subjects = await listSubjectsWithConfigs();

  return (
    <AppShell title="មុខវិជ្ជា" backHref="/admin">
      <Link
        href="/admin/subjects/new"
        className="touch-target rounded-btn bg-brand-600 mb-4 flex w-full items-center justify-center px-4 font-medium text-white active:bg-brand-700"
      >
        + បន្ថែមមុខវិជ្ជាថ្មី
      </Link>

      {subjects.length === 0 ? (
        <div className="rounded-card border border-dashed border-border bg-surface p-6 text-center">
          <p className="text-muted text-sm">
            មិនមានមុខវិជ្ជានៅឡើយទេ។
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {subjects.map((s) => (
            <li key={s.id}>
              <SubjectCard subject={s} />
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}