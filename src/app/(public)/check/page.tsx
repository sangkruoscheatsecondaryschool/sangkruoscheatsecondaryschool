import { redirect } from "next/navigation";
import { connection } from "next/server";
import { AppShell } from "@/components/app-shell";
import { getReportSession } from "@/lib/public/session";
import { CheckForm } from "./check-form";

export const instant = false;

export const metadata = { title: "ពិនិត្យលទ្ធផលសិក្សា" };

export default async function CheckPage() {
  await connection();

  const session = await getReportSession();
  if (session) redirect("/check/report");

  return (
    <AppShell title="ពិនិត្យលទ្ធផលសិក្សា" backHref="/">
      <div className="space-y-4">
        <div className="rounded-card border-border bg-surface border p-4">
          <p className="font-moul text-sm">ស្វែងរកលទ្ធផលសិក្សា</p>
          <p className="text-muted mt-2 text-xs">
            សូមបញ្ចូលលេខកូដសិស្ស និងថ្ងៃខែឆ្នាំកំណើត ដើម្បីមើលលទ្ធផលសិក្សា។
            គ្មានតម្រូវការបង្កើតគណនីទេ។
          </p>
        </div>

        <CheckForm />
      </div>
    </AppShell>
  );
}