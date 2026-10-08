import { AppShell } from "@/components/app-shell";
import { NewYearForm } from "./new-year-form";

export const instant = false;

export const metadata = { title: "បន្ថែមឆ្នាំសិក្សា" };

export default function NewAcademicYearPage() {
  return (
    <AppShell title="បន្ថែមឆ្នាំសិក្សា" backHref="/admin/academic-years">
      <NewYearForm />
    </AppShell>
  );
}