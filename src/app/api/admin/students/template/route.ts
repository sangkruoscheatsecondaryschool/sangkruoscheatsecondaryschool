import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/require-role";
import { buildTemplateWorkbook } from "@/lib/admin/students/xlsx";
import { listClassesInYear } from "@/lib/admin/students/queries";
import { listProvinces } from "@/lib/admin/students/address-queries";
import { getCurrentAcademicYear } from "@/lib/admin/academic-years/queries";

export async function GET() {
  await connection();
  await requireRole("admin");

  const year = await getCurrentAcademicYear();
  const [classes, provinces] = await Promise.all([
    year ? listClassesInYear(year.id) : Promise.resolve([]),
    listProvinces(),
  ]);

  const buffer = await buildTemplateWorkbook({
    classNames: classes.map((c) => c.class_name),
    provinceNames: provinces.map((p) => p.name_kh),
  });

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="student-template.xlsx"`,
      "Cache-Control": "no-store",
    },
  });
}