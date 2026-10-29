import Link from "next/link";
import { connection } from "next/server";
import { Plus } from "lucide-react";
import { listAcademicYears } from "@/lib/admin/academic-years/queries";
import { AcademicYearCard } from "./academic-year-card";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export const instant = false;
export const metadata = { title: "ឆ្នាំសិក្សា" };

export default async function AcademicYearsPage() {
  await connection();
  const years = await listAcademicYears();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader 
        title="ឆ្នាំសិក្សា" 
        description="គ្រប់គ្រងឆ្នាំសិក្សា និងការកំណត់ខែតាមឆមាស"
        action={
          <Link href="/admin/academic-years/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              បន្ថែមឆ្នាំសិក្សាថ្មី
            </Button>
          </Link>
        }
      />

      {years.length === 0 ? (
        <EmptyState 
          title="មិនទាន់មានឆ្នាំសិក្សា" 
          description="សូមបង្កើតឆ្នាំសិក្សាដំបូងរបស់អ្នក ដើម្បីចាប់ផ្តើម។"
          action={
            <Link href="/admin/academic-years/new">
              <Button variant="outline">បង្កើតឆ្នាំសិក្សា</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {years.map((y) => (
            <AcademicYearCard key={y.id} year={y} />
          ))}
        </div>
      )}
    </div>
  );
}