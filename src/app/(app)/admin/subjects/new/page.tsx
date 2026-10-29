import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { NewSubjectForm } from "./new-subject-form";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";

export const instant = false;
export const metadata = { title: "បន្ថែមមុខវិជ្ជា" };

export default function NewSubjectPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      <Link href="/admin/subjects" className="inline-flex items-center text-sm text-slate-500 hover:text-primary-600 mb-2">
        <ArrowLeft className="h-4 w-4 mr-1" /> ត្រឡប់ក្រោយ
      </Link>

      <PageHeader
        title="បន្ថែមមុខវិជ្ជាថ្មី"
        description="បង្កើតមុខវិជ្ជាថ្មី និងកំណត់ពិន្ទុពេញសម្រាប់ថ្នាក់នីមួយៗ"
      />
      
      <Card className="p-6 md:p-8">
        <NewSubjectForm />
      </Card>
    </div>
  );
}