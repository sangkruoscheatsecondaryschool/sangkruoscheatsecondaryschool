"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";

function getEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase env vars missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.",
    );
  }

  try {
    const u = new URL(url);
    if (u.protocol !== "http:" && u.protocol !== "https:") {
      throw new Error("bad protocol");
    }
  } catch {
    throw new Error(
      `NEXT_PUBLIC_SUPABASE_URL is not a valid URL: "${url}". It must be a full https URL like https://xxxxx.supabase.co`,
    );
  }

  return { url, key };
}

export function createClient() {
  const { url, key } = getEnv();
  return createBrowserClient<Database>(url, key);
}