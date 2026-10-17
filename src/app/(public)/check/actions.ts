"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { fetchPublicReport } from "@/lib/public/report";
import {
  clearReportSession,
  setReportSession,
} from "@/lib/public/session";

export type CheckState = { error?: string } | null;

const schema = z.object({
  student_code: z
    .string()
    .trim()
    .min(1, "សូមបញ្ចូលលេខកូដសិស្ស។")
    .max(30),
  dob: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "សូមបញ្ចូលថ្ងៃកំណើតត្រឹមត្រូវ។"),
});

export async function checkReportAction(
  _prev: CheckState,
  formData: FormData,
): Promise<CheckState> {
  const parsed = schema.safeParse({
    student_code: formData.get("student_code"),
    dob: formData.get("dob"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "ទិន្នន័យមិនត្រឹមត្រូវ។",
    };
  }

  const report = await fetchPublicReport(
    parsed.data.student_code,
    parsed.data.dob,
  );

  if (!report) {
    return {
      error: "លេខកូដសិស្ស ឬថ្ងៃកំណើតមិនត្រឹមត្រូវ។",
    };
  }

  await setReportSession({
    code: parsed.data.student_code,
    dob: parsed.data.dob,
  });

  redirect("/check/report");
}

export async function clearReportAction() {
  await clearReportSession();
  redirect("/check");
}