import { connection } from "next/server";
import { AppShell } from "@/components/app-shell";
import { Placeholder } from "@/components/placeholder";

export const instant = false;

export const metadata = { title: "ពិនិត្យលទ្ធផលសិក្សា" };

export default async function CheckPage() {
  await connection();
  return (
    <AppShell title="ពិនិត្យលទ្ធផលសិក្សា" backHref="/">
      <Placeholder
        title="ស្វែងរកលទ្ធផលសិក្សា"
        description="Public report card lookup (Student ID + DOB) will be built in Phase 6."
      />
    </AppShell>
  );
}