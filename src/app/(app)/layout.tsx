import type { ReactNode } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/get-current-user";

export const instant = false;

export default async function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Explicitly opt this route into dynamic rendering BEFORE any
  // cookie / Date.now() access happens. Next.js 16 + cacheComponents
  // will otherwise try to prerender a shell and fail on the unstable
  // Date.now() used inside the Supabase SSR client.
  await connection();

  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return <div className="bg-bg min-h-dvh">{children}</div>;
}