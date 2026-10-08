import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      <main className="flex flex-1 items-center justify-center p-6 pt-safe pb-safe">
        <div className="w-full max-w-sm">{children}</div>
      </main>
    </div>
  );
}