import type { ReactNode } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileTabBar } from "@/components/layout/mobile-tab-bar";
import { AppTopbar } from "@/components/layout/app-topbar";

export const instant = false;

export default async function AppLayout({ children }: { children: ReactNode }) {
  await connection();
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="flex min-h-dvh bg-slate-50">
      {/* Desktop Sidebar */}
      <AppSidebar user={user} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col md:pl-64 print:pl-0 transition-all duration-300">
        <AppTopbar user={user} />
        
        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 print:p-0">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileTabBar user={user} />
    </div>
  );
}