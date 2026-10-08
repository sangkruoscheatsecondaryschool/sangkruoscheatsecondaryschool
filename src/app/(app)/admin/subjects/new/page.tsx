import { AppShell } from "@/components/app-shell";
import { NewSubjectForm } from "./new-subject-form";

export const instant = false;

export const metadata = { title: "បន្ថែមមុខវិជ្ជា" };

export default function NewSubjectPage() {
  return (
    <AppShell title="បន្ថែមមុខវិជ្ជា" backHref="/admin/subjects">
      <NewSubjectForm />
    </AppShell>
  );
}