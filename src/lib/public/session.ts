import "server-only";
import { cookies } from "next/headers";

const COOKIE_NAME = "sm_report";
const MAX_AGE_SECONDS = 60 * 60; // 1 hour

export type ReportSession = {
  code: string;
  dob: string;
};

export async function setReportSession(session: ReportSession) {
  const store = await cookies();
  store.set(COOKIE_NAME, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/check",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function getReportSession(): Promise<ReportSession | null> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as ReportSession;
    if (
      typeof parsed.code !== "string" ||
      typeof parsed.dob !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(parsed.dob)
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export async function clearReportSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}