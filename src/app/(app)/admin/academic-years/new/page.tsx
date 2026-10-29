// page.tsx
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { NewYearForm } from "./new-year-form";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";

export const instant = false;
export const metadata = { title: "បន្ថែមឆ្នាំសិក្សា" };

export default function NewAcademicYearPage() {
  return (
    <div className="max-w-xl mx-auto space-y-6 animate-in fade-in duration-300">
      <Link href="/admin/academic-years" className="inline-flex items-center text-sm text-slate-500 hover:text-primary-600 mb-2">
        <ArrowLeft className="h-4 w-4 mr-1" /> ត្រឡប់ក្រោយ
      </Link>
      <PageHeader title="បន្ថែមឆ្នាំសិក្សាថ្មី" description="បង្កើតឆ្នាំសិក្សាថ្មី" />
      <Card className="p-6 md:p-8">
        <NewYearForm />
      </Card>
    </div>
  );
}