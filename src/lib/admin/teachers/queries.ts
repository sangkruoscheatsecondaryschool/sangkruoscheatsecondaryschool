import "server-only";
import { createClient } from "@/lib/supabase/server";

export type TeacherRow = {
  id: string;
  full_name_kh: string;
  full_name_en: string | null;
  email: string | null;
  gender: string | null;
  dob: string | null;
  phone: string | null;
  contact_address_code: string | null;
  joined_date: string | null;
  specialist_1_subject_id: string | null;
  specialist_1_name: string | null;
  specialist_2_subject_id: string | null;
  specialist_2_name: string | null;
  notes: string | null;
};

export type SubjectOption = {
  id: string;
  subject_name: string;
  code: string;
};

export async function listSubjectOptions(): Promise<SubjectOption[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("subjects")
    .select("id, subject_name, code")
    .order("subject_name", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listTeachers(opts: {
  q?: string;
  subjectId?: string;
} = {}): Promise<TeacherRow[]> {
  const supabase = await createClient();

  let query = supabase
    .from("profiles")
    .select(
      "id, full_name_kh, full_name_en, gender, dob, phone, contact_address_code, joined_date, specialist_1_subject_id, specialist_2_subject_id, notes",
    )
    .eq("role", "teacher")
    .order("full_name_kh", { ascending: true });

  if (opts.q && opts.q.trim().length > 0) {
    const like = `%${opts.q.trim()}%`;
    query = query.or(`full_name_kh.ilike.${like},full_name_en.ilike.${like}`);
  }

  if (opts.subjectId) {
    query = query.or(
      `specialist_1_subject_id.eq.${opts.subjectId},specialist_2_subject_id.eq.${opts.subjectId}`,
    );
  }

  const { data: teachers, error } = await query;
  if (error) throw new Error(error.message);
  if (!teachers || teachers.length === 0) return [];

  // Resolve subject names
  const subjectIds = new Set<string>();
  for (const t of teachers) {
    if (t.specialist_1_subject_id) subjectIds.add(t.specialist_1_subject_id);
    if (t.specialist_2_subject_id) subjectIds.add(t.specialist_2_subject_id);
  }

  const { data: subjects } = subjectIds.size
    ? await supabase
        .from("subjects")
        .select("id, subject_name")
        .in("id", Array.from(subjectIds))
    : { data: [] };

  const subjectName = new Map(
    (subjects ?? []).map((s) => [s.id, s.subject_name]),
  );

  // Fetch emails via a small SQL function (auth.users is not directly readable)
  const ids = teachers.map((t) => t.id);
  const { data: emailRows } = await supabase.rpc("get_user_emails", {
    p_ids: ids,
  });

  const emailById = new Map(
    (emailRows ?? []).map((r: { id: string; email: string }) => [
      r.id,
      r.email,
    ]),
  );

  return teachers.map((t) => ({
    id: t.id,
    full_name_kh: t.full_name_kh,
    full_name_en: t.full_name_en,
    email: emailById.get(t.id) ?? null,
    gender: t.gender,
    dob: t.dob,
    phone: t.phone,
    contact_address_code: t.contact_address_code,
    joined_date: t.joined_date,
    specialist_1_subject_id: t.specialist_1_subject_id,
    specialist_1_name: t.specialist_1_subject_id
      ? (subjectName.get(t.specialist_1_subject_id) ?? null)
      : null,
    specialist_2_subject_id: t.specialist_2_subject_id,
    specialist_2_name: t.specialist_2_subject_id
      ? (subjectName.get(t.specialist_2_subject_id) ?? null)
      : null,
    notes: t.notes,
  }));
}

export async function getTeacherById(id: string): Promise<TeacherRow | null> {
  const supabase = await createClient();

  const { data: t, error } = await supabase
    .from("profiles")
    .select(
      "id, full_name_kh, full_name_en, gender, dob, phone, contact_address_code, joined_date, specialist_1_subject_id, specialist_2_subject_id, notes",
    )
    .eq("id", id)
    .eq("role", "teacher")
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!t) return null;

  const subjectIds = [
    t.specialist_1_subject_id,
    t.specialist_2_subject_id,
  ].filter((v): v is string => Boolean(v));

  const { data: subjects } = subjectIds.length
    ? await supabase
        .from("subjects")
        .select("id, subject_name")
        .in("id", subjectIds)
    : { data: [] };

  const subjectName = new Map(
    (subjects ?? []).map((s) => [s.id, s.subject_name]),
  );

  const { data: emailRows } = await supabase.rpc("get_user_emails", {
    p_ids: [id],
  });
  const email =
    (emailRows as { id: string; email: string }[] | null)?.[0]?.email ?? null;

  return {
    id: t.id,
    full_name_kh: t.full_name_kh,
    full_name_en: t.full_name_en,
    email,
    gender: t.gender,
    dob: t.dob,
    phone: t.phone,
    contact_address_code: t.contact_address_code,
    joined_date: t.joined_date,
    specialist_1_subject_id: t.specialist_1_subject_id,
    specialist_1_name: t.specialist_1_subject_id
      ? (subjectName.get(t.specialist_1_subject_id) ?? null)
      : null,
    specialist_2_subject_id: t.specialist_2_subject_id,
    specialist_2_name: t.specialist_2_subject_id
      ? (subjectName.get(t.specialist_2_subject_id) ?? null)
      : null,
    notes: t.notes,
  };
}