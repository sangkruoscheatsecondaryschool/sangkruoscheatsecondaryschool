import type { ReactNode } from "react";
import { AppHeader } from "./app-header";
import { SignOutButton } from "./sign-out-button";
import { getCurrentUser } from "@/lib/auth/get-current-user";

type AppShellProps = {
  title: string;
  backHref?: string;
  right?: ReactNode;
  children: ReactNode;
};

export async function AppShell({
  title,
  backHref,
  right,
  children,
}: AppShellProps) {
  const user = await getCurrentUser();

  const rightSlot =
    right ?? (user ? <SignOutButton /> : null);

  return (
    <div className="bg-bg flex min-h-dvh flex-col">
      <AppHeader title={title} backHref={backHref} right={rightSlot} />
      <main className="flex-1">
        <div className="pb-safe mx-auto w-full max-w-3xl p-4">
          {children}
        </div>
      </main>
    </div>
  );
}