import type { ReactNode } from "react";
import { connection } from "next/server";
import { requireRole } from "@/lib/auth/require-role";

export const instant = false;

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  await connection();
  await requireRole("admin");
  return <>{children}</>;
}