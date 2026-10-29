"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { School, LayoutDashboard, Users, BookOpen, Calendar, FileText, Settings, Database, GraduationCap, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CurrentUser } from "@/lib/auth/get-current-user";

export function AppSidebar({ 
  user, 
  isMobileDrawer = false 
}: { 
  user: CurrentUser; 
  isMobileDrawer?: boolean;
}) {
  const pathname = usePathname();
  const isAdmin = user.profile.role === "admin";

  const navGroups = isAdmin ? [
    {
      label: "ទូទៅ",
      items: [
        { href: "/dashboard", label: "ផ្ទាំងគ្រប់គ្រង", icon: LayoutDashboard, exact: true },
      ],
    },
    {
      label: "ការគ្រប់គ្រង",
      items: [
        { href: "/admin/academic-years", label: "ឆ្នាំសិក្សា", icon: Calendar },
        { href: "/admin/classes", label: "ថ្នាក់រៀន", icon: School },
        { href: "/admin/students", label: "សិស្ស", icon: Users },
        { href: "/admin/subjects", label: "មុខវិជ្ជា", icon: BookOpen },
      ],
    },
    {
      label: "គ្រូបង្រៀន",
      items: [
        { href: "/admin/teachers", label: "បញ្ជីគ្រូ", icon: GraduationCap },
        { href: "/admin/teacher-assignments", label: "ការចាត់តាំងគ្រូ", icon: Briefcase },
        { href: "/admin/timetable", label: "តារាងកាលវិភាគ", icon: Calendar }, // 👈 Updated
      ],
    },
    {
      label: "របាយការណ៍ & ប្រព័ន្ធ",
      items: [
        { href: "/admin/reports", label: "របាយការណ៍", icon: FileText },
        { href: "/admin/settings/school", label: "ការកំណត់សាលា", icon: Settings },
        { href: "/admin/settings/backup", label: "បម្រុងទុក", icon: Database },
      ],
    }
  ] : [
    {
      label: "ទូទៅ",
      items: [
        { href: "/dashboard", label: "ផ្ទាំងគ្រប់គ្រង", icon: LayoutDashboard, exact: true },
        { href: "/teacher", label: "ថ្នាក់របស់ខ្ញុំ", icon: School },
      ],
    }
  ];

  return (
    <aside 
      className={cn(
        "flex flex-col bg-white", 
        isMobileDrawer ? "w-full h-full min-h-full bg-white" : "fixed inset-y-0 left-0 z-50 hidden w-64 border-r border-slate-200 md:flex"
      )}
    >
      {!isMobileDrawer && (
        <div className="flex h-16 items-center gap-3 border-b border-slate-100 px-6 shrink-0">
          <School className="h-6 w-6 text-primary-600" />
          <span className="font-moul text-lg truncate">ប្រព័ន្ធគ្រប់គ្រង</span>
        </div>
      )}
      
      <div className={cn("py-6 flex-1", isMobileDrawer ? "block" : "overflow-y-auto")}>
        <nav className="space-y-6 px-3">
          {navGroups.map((group, i) => (
            <div key={i}>
              <h4 className="px-3 mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                {group.label}
              </h4>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = (item as any).exact ? pathname === item.href : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive ? "bg-primary-50 text-primary-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      )}
                    >
                      <item.icon className={cn("h-5 w-5", isActive ? "text-primary-600" : "text-slate-400")} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}