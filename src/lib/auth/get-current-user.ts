import "server-only";
import { connection } from "next/server";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export type CurrentUser = {
  id: string;
  email: string | null;
  profile: {
    id: string;
    full_name_kh: string;
    full_name_en: string | null;
    role: "admin" | "teacher";
  };
};

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  // Force dynamic rendering — we need runtime cookies and Supabase's
  // internal Date.now() is not prerender-safe.
  await connection();

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name_kh, full_name_en, role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) return null;

  return {
    id: user.id,
    email: user.email ?? null,
    profile,
  };
});