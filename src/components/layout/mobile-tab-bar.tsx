"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Calendar, FileText, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CurrentUser } from "@/lib/auth/get-current-user";

export function MobileTabBar({ user }: { user: CurrentUser }) {
  const pathname = usePathname();

  const tabs = [
    { href: "/dashboard", label: "ទំព័រដើម", icon: LayoutDashboard },
    { href: "/admin/students", label: "សិស្ស", icon: Users },
    { href: "/admin/timetable", label: "កាលវិភាគ", icon: Calendar },
    { href: "/admin/reports", label: "របាយការណ៍", icon: FileText },
  ];

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 border-t border-slate-200 bg-white/90 backdrop-blur-md pb-safe md:hidden print:hidden">
      <nav className="flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const isActive = pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1",
                isActive ? "text-primary-600" : "text-slate-500 hover:text-slate-900"
              )}
            >
              <tab.icon className={cn("h-5 w-5", isActive && "fill-primary-100")} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}