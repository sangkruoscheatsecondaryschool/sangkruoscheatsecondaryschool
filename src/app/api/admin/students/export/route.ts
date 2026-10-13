import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/require-role";
import { buildExportWorkbook, STATUS_KH } from "@/lib/admin/students/xlsx";
import { getCurrentAcademicYear } from "@/lib/admin/academic-years/queries";
import {
  resolveAddress,
  type AddressDisplay,
} from "@/lib/admin/students/address-queries";

type AddressParts = {
  province: string;
  district: string;
  commune: string;
  village: string;
};

const EMPTY_ADDR: AddressParts = {
  province: "",
  district: "",
  commune: "",
  village: "",
};

export async function GET(request: Request) {
  await connection();
  await requireRole("admin");

  const url = new URL(request.url);
  const yearId = url.searchParams.get("year");
  const classId = url.searchParams.get("class");
  const q = url.searchParams.get("q");

  const supabase = await createClient();

  // Resolve active year
  let activeYearId = yearId;
  if (!activeYearId) {
    const current = await getCurrentAcademicYear();
    activeYearId = current?.id ?? null;
  }
  if (!activeYearId) {
    return new Response("No active academic year", { status: 400 });
  }

  // Fetch classes in year (filtered if classId)
  let classQuery = supabase
    .from("classes")
    .select("id, class_name, grade_level")
    .eq("academic_year_id", activeYearId);
  if (classId) classQuery = classQuery.eq("id", classId);

  const { data: classes, error: classErr } = await classQuery;
  if (classErr) throw new Error(classErr.message);
  if (!classes || classes.length === 0) {
    return new Response("No classes", { status: 400 });
  }

  const classIds = classes.map((c) => c.id);
  const classById = new Map(classes.map((c) => [c.id, c]));

  // Fetch students
  let studentQuery = supabase
    .from("students")
    .select(
      "student_code, name_kh, gender, dob, class_id, place_of_birth_code, current_address_code, current_address_detail, mother_name, father_name, contact_number, status",
    )
    .in("class_id", classIds)
    .order("student_code", { ascending: true });

  if (q && q.trim().length > 0) {
    const like = `%${q.trim()}%`;
    studentQuery = studentQuery.or(
      `name_kh.ilike.${like},student_code.ilike.${like}`,
    );
  }

  const { data: students, error: studentErr } = await studentQuery;
  if (studentErr) throw new Error(studentErr.message);

  // Collect codes
  const codes = new Set<string>();
  for (const s of students ?? []) {
    if (s.place_of_birth_code) codes.add(s.place_of_birth_code);
    if (s.current_address_code) codes.add(s.current_address_code);
  }

  // Resolve all codes in parallel
  const resolved = new Map<string, AddressDisplay | null>();
  await Promise.all(
    Array.from(codes).map(async (code) => {
      resolved.set(code, await resolveAddress(code));
    }),
  );

  function parts(code: string | null): AddressParts {
    if (!code) return EMPTY_ADDR;
    const d = resolved.get(code);
    if (!d) return EMPTY_ADDR;
    return {
      province: d.province_name_kh,
      district: d.district_name_kh ?? "",
      commune: d.commune_name_kh ?? "",
      village: d.village_name_kh ?? "",
    };
  }

  const exportRows = [];
  for (const s of students ?? []) {
    const pob = parts(s.place_of_birth_code);
    const cur = parts(s.current_address_code);

    exportRows.push({
      student_code: s.student_code,
      name_kh: s.name_kh,
      gender: s.gender ?? "",
      dob: s.dob,
      class_name: classById.get(s.class_id)?.class_name ?? "",
      status_kh: STATUS_KH[s.status] ?? s.status,
      pob_province: pob.province,
      pob_district: pob.district,
      pob_commune: pob.commune,
      pob_village: pob.village,
      cur_province: cur.province,
      cur_district: cur.district,
      cur_commune: cur.commune,
      cur_village: cur.village,
      current_address_detail: s.current_address_detail ?? "",
      mother_name: s.mother_name ?? "",
      father_name: s.father_name ?? "",
      contact_number: s.contact_number ?? "",
    });
  }

  const buffer = await buildExportWorkbook(exportRows);
  const ts = new Date().toISOString().slice(0, 10);

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="students-${ts}.xlsx"`,
      "Cache-Control": "no-store",
    },
  });
}