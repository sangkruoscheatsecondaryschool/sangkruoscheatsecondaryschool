"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Menu, X, School } from "lucide-react";
import { AppSidebar } from "./app-sidebar";
import type { CurrentUser } from "@/lib/auth/get-current-user";
import { cn } from "@/lib/utils";

export function MobileDrawer({ user }: { user: CurrentUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Wait until mounted to use portals (Next.js SSR safety)
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* Trigger Button (Stays in the top bar) */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Drawer Panel (Teleported to <body>) */}
      {mounted && createPortal(
        <>
          {/* Dark Overlay */}
          {isOpen && (
            <div
              className="fixed inset-0 z-[55] bg-slate-900/50 backdrop-blur-sm md:hidden animate-in fade-in"
              onClick={() => setIsOpen(false)}
            />
          )}

          {/* Sliding Panel */}
          <div
            className={cn(
              "fixed inset-y-0 left-0 z-[60] w-72 bg-white shadow-2xl transition-transform duration-300 md:hidden flex flex-col",
              isOpen ? "translate-x-0" : "-translate-x-full"
            )}
          >
            <div className="flex h-16 items-center justify-between px-4 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2">
                <School className="h-6 w-6 text-primary-600" />
                <span className="font-moul text-lg">ប្រព័ន្ធគ្រប់គ្រង</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div 
              className="flex-1 overflow-y-auto bg-white" 
              onClick={() => setIsOpen(false)}
            >
              <AppSidebar user={user} isMobileDrawer />
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}