import { NextResponse } from "next/server";
import { performBackup } from "@/lib/admin/backup/core";

export async function GET(request: Request) {
  // 1. Security check (Vercel Cron sends a specific header)
  const authHeader = request.headers.get("authorization");
  if (
    process.env.NODE_ENV === "production" &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // 2. Run backup without needing an admin user session
  try {
    await performBackup();
    return NextResponse.json({ ok: true, message: "Backup successful" });
  } catch (error: any) {
    console.error("Cron backup failed:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}