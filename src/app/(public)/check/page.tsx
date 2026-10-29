import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { ArrowLeft, Search } from "lucide-react";
import { getReportSession } from "@/lib/public/session";
import { CheckForm } from "./check-form";
import { Card } from "@/components/ui/card";

export const instant = false;

export const metadata = { title: "ពិនិត្យលទ្ធផលសិក្សា" };

export default async function CheckPage() {
  await connection();

  const session = await getReportSession();
  if (session) redirect("/check/report");

  return (
    <div className="min-h-dvh bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="text-center">
          <Link href="/" className="inline-flex items-center text-sm text-slate-500 hover:text-primary-600 mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" /> ត្រឡប់ទៅទំព័រដើម
          </Link>
          <div className="mx-auto w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mb-4">
            <Search className="h-8 w-8" />
          </div>
          <h1 className="font-moul text-2xl text-slate-900">ពិនិត្យលទ្ធផលសិក្សា</h1>
          <p className="text-slate-500 mt-2 text-sm">
            សូមបញ្ចូលលេខកូដសិស្ស និងថ្ងៃខែឆ្នាំកំណើត ដើម្បីមើលលទ្ធផលសិក្សា
          </p>
        </div>

        <Card className="p-6 md:p-8 shadow-lg border-transparent">
          <CheckForm />
        </Card>

      </div>
    </div>
  );
}