import { redirect } from "next/navigation";
import { connection } from "next/server";
import { AppShell } from "@/components/app-shell";
import { fetchPublicReport } from "@/lib/public/report";
import {
  clearReportSession,
  getReportSession,
} from "@/lib/public/session";
import { ReportView } from "./report-view";
import { ReportActions } from "./report-actions";

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
    <AppShell
      title="លទ្ធផលសិក្សា"
      backHref="/check"
      right={<ReportActions />}
    >
      <ReportView report={report} />
    </AppShell>
  );
}