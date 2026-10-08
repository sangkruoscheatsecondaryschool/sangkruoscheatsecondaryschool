import { AppShell } from "@/components/app-shell";

export const instant = false;

export const metadata = { title: "គ្រូបង្រៀន" };

export default function TeacherHomePage() {
  return (
    <AppShell title="គ្រូបង្រៀន">
      <div className="space-y-3">
        <p className="text-muted text-sm">
          Teacher features will be built in Phase 5.
        </p>
      </div>
    </AppShell>
  );
}