import Link from "next/link";
import { connection } from "next/server";
import { AppShell } from "@/components/app-shell";
import { getCurrentAcademicYear } from "@/lib/admin/academic-years/queries";
import { ImportForm } from "./import-form";

export const instant = false;

export const metadata = { title: "នាំចូលសិស្សពី Excel" };

export default async function ImportStudentsPage() {
  await connection();

  const year = await getCurrentAcademicYear();

  return (
    <AppShell title="នាំចូលសិស្សពី Excel" backHref="/admin/students">
      <div className="space-y-4">
        <div className="rounded-card border-border bg-surface border p-4">
          <p className="font-moul text-sm">របៀបប្រើប្រាស់</p>
          <ol className="text-muted mt-2 list-inside list-decimal space-y-1 text-sm">
            <li>
              ទាញយកឯកសារគំរូ (Template) ខាងក្រោម។
            </li>
            <li>
              បំពេញទិន្នន័យសិស្សក្នុងឯកសារ — សូមកុំប្តូរឈ្មោះជួរឈរ។
            </li>
            <li>
              រក្សាទុកជា .xlsx រួចផ្ទុកឡើងក្នុងទម្រង់ខាងក្រោម។
            </li>
            <li>
              ត្រួតពិនិត្យលទ្ធផល — ជួរដែលមានបញ្ហានឹងបង្ហាញពីមូលហេតុ។
            </li>
          </ol>
        </div>

        <a
          href="/api/admin/students/template"
          className="touch-target rounded-btn border-border bg-surface flex items-center justify-center border px-4 py-3 text-sm font-medium active:bg-slate-50"
        >
          ⬇️ ទាញយកឯកសារគំរូ (Template)
        </a>

        {!year ? (
          <div className="rounded-card border border-dashed border-border bg-surface p-4 text-center">
            <p className="text-muted text-sm">
              មិនមានឆ្នាំសិក្សាបច្ចុប្បន្នទេ។ សូមកំណត់ឆ្នាំបច្ចុប្បន្នជាមុន។
            </p>
          </div>
        ) : (
          <ImportForm yearId={year.id} yearName={year.year_name} />
        )}

        <Link
          href="/admin/students"
          className="text-brand-700 block text-center text-sm underline-offset-4 hover:underline"
        >
          ត្រឡប់ទៅបញ្ជីសិស្ស
        </Link>
      </div>
    </AppShell>
  );
}