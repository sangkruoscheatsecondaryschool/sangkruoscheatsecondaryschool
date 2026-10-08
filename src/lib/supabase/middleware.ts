import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "./database.types";

function isValidHttpUrl(value: string | undefined): value is string {
  if (!value) return false;
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!isValidHttpUrl(url) || !key) {
    // Env not configured yet (or misconfigured). Let the request pass through
    // so the app still loads and you can see the diagnostic page. Phase 3
    // route guards will handle unauthenticated users once env is set.
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[supabase/middleware] Supabase env vars missing or invalid. " +
          "Check .env.local — NEXT_PUBLIC_SUPABASE_URL must be a full https URL.",
      );
    }
    return response;
  }

  const supabase = createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Phase 3 will add route guards here based on `user`.
  void user;

  return response;
}