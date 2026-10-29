import { redirect } from "next/navigation";
import { connection } from "next/server";
import { fetchPublicReport } from "@/lib/public/report";
import { clearReportSession, getReportSession } from "@/lib/public/session";
import { ReportView } from "./report-view";
import { ReportActions } from "./report-actions";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const instant = false;

export const metadata = { title: "លទ្ធផលសិក្សា" };

export default async function ReportPage() {
  await connection();

  const session = await getReportSession();
  if (!session) redirect("/check");

  const report = await fetchPublicReport(session.code, session.dob);

  if (!report) {
    await clearReportSession();
    redirect("/check");
  }

  return (
    <div className="min-h-dvh bg-slate-50 pb-20 print:bg-white print:pb-0">
      {/* Header (Screen Only) */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 print:hidden">
        <div className="mx-auto max-w-4xl flex h-16 items-center justify-between px-4">
          <Link href="/check" className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-primary-600">
            <ArrowLeft className="h-4 w-4 mr-1" /> ស្វែងរកថ្មី
          </Link>
          <span className="font-moul text-slate-900">លទ្ធផលសិក្សា</span>
          <ReportActions />
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl p-4 md:p-8 mt-2 print:p-0 print:m-0">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 md:p-8 print:shadow-none print:border-none print:p-0">
          <ReportView report={report} />
        </div>
      </main>
    </div>
  );
}