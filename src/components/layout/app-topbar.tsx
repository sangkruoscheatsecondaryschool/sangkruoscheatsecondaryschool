"use client";

import { LogOut } from "lucide-react";
import { signOutAction } from "@/lib/auth/actions";
import type { CurrentUser } from "@/lib/auth/get-current-user";
import { MobileDrawer } from "./mobile-drawer";

export function AppTopbar({ user }: { user: CurrentUser }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 md:px-8 backdrop-blur-md print:hidden">
      
      {/* Mobile Hamburger & Title */}
      <div className="flex items-center gap-2 md:hidden">
        <MobileDrawer user={user} />
        <span className="font-moul text-sm text-slate-900 hidden sm:block">ប្រព័ន្ធគ្រប់គ្រង</span>
      </div>

      {/* User Info & Logout */}
      <div className="flex items-center gap-4 ml-auto">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-slate-900 leading-tight">{user.profile.full_name_kh}</p>
          <p className="text-xs text-slate-500">{user.profile.role === "admin" ? "នាយក / លេខាធិការ" : "គ្រូបង្រៀន"}</p>
        </div>
        <form action={signOutAction}>
          <button
            type="submit"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
            title="ចាកចេញ"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </form>
      </div>
    </header>
  );
}