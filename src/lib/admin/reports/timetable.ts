import "server-only";
import { createClient } from "@/lib/supabase/server";
import { getCurrentAcademicYear } from "@/lib/admin/academic-years/queries";

export type PeriodInfo = {
  id: string;
  period_number: number;
  start_time: string;
  end_time: string;
  label: string | null;
  is_morning: boolean;
};

export type CellInfo = {
  subject_name: string;
  teacher_name_kh: string | null;
  class_name?: string;
};

export type TimetableGrid = {
  title: string;
  subtitle: string;
  academic_year_name: string;
  class_name: string;
  homeroom_teacher_name: string | null;
  teacher_name: string | null;
  periods: PeriodInfo[];
  grid: Record<number, Record<string, CellInfo>>;
};

// =========================================================
// 1. By Class
// =========================================================
export async function fetchClassTimetable(
  classId: string,
): Promise<TimetableGrid | null> {
  const supabase = await createClient();

  const { data: cls, error: cErr } = await supabase
    .from("classes")
    .select("id, class_name, academic_year_id, homeroom_teacher_id")
    .eq("id", classId)
    .maybeSingle();
  if (cErr || !cls) return null;

  let homeroomTeacherName = null;
  if (cls.homeroom_teacher_id) {
    const { data: t } = await supabase
      .from("profiles")
      .select("full_name_kh")
      .eq("id", cls.homeroom_teacher_id)
      .maybeSingle();
    homeroomTeacherName = t?.full_name_kh ?? null;
  }

  const { data: year } = await supabase
    .from("academic_years")
    .select("year_name")
    .eq("id", cls.academic_year_id)
    .maybeSingle();

  const { data: periods, error: pErr } = await supabase
    .from("periods")
    .select("id, period_number, start_time, end_time, label")
    .eq("academic_year_id", cls.academic_year_id)
    .order("period_number");
  if (pErr || !periods) return null;

  const { data: entries, error: eErr } = await supabase
    .from("timetable_entries")
    .select(
      "day_of_week, period_id, subjects(subject_name), profiles(full_name_kh)",
    )
    .eq("class_id", classId);
  if (eErr) return null;

  const grid: Record<number, Record<string, CellInfo>> = {};
  for (const e of entries ?? []) {
    const sub = e.subjects as unknown as { subject_name: string } | null;
    const t = e.profiles as unknown as { full_name_kh: string } | null;
    if (!grid[e.day_of_week]) grid[e.day_of_week] = {};
    grid[e.day_of_week][e.period_id] = {
      subject_name: sub?.subject_name ?? "—",
      teacher_name_kh: t?.full_name_kh ?? "—",
    };
  }

  return {
    title: "តារាងម៉ោងបង្រៀន",
    subtitle: `ថ្នាក់ទី ${cls.class_name}`,
    academic_year_name: year?.year_name ?? "",
    class_name: cls.class_name,
    homeroom_teacher_name: homeroomTeacherName,
    teacher_name: null,
    periods: periods.map((p) => ({
      ...p,
      is_morning: p.start_time < "12:00:00",
    })),
    grid,
  };
}

// =========================================================
// 2. By Teacher
// =========================================================
export async function fetchTeacherTimetable(
  teacherId: string,
): Promise<TimetableGrid | null> {
  const supabase = await createClient();
  const currentYear = await getCurrentAcademicYear();
  if (!currentYear) return null;

  const { data: teacher } = await supabase
    .from("profiles")
    .select("full_name_kh")
    .eq("id", teacherId)
    .maybeSingle();
  if (!teacher) return null;

  const { data: periods, error: pErr } = await supabase
    .from("periods")
    .select("id, period_number, start_time, end_time, label")
    .eq("academic_year_id", currentYear.id)
    .order("period_number");
  if (pErr || !periods) return null;

  const { data: entries, error: eErr } = await supabase
    .from("timetable_entries")
    .select("day_of_week, period_id, classes(class_name), subjects(subject_name)")
    .eq("teacher_id", teacherId)
    .eq("academic_year_id", currentYear.id);
  if (eErr) return null;

  const grid: Record<number, Record<string, CellInfo>> = {};
  for (const e of entries ?? []) {
    const sub = e.subjects as unknown as { subject_name: string } | null;
    const cls = e.classes as unknown as { class_name: string } | null;
    if (!grid[e.day_of_week]) grid[e.day_of_week] = {};
    grid[e.day_of_week][e.period_id] = {
      subject_name: sub?.subject_name ?? "—",
      teacher_name_kh: null,
      class_name: cls?.class_name ?? "—",
    };
  }

  return {
    title: "តារាងម៉ោងបង្រៀន",
    subtitle: `គ្រូបង្រៀន ${teacher.full_name_kh}`,
    academic_year_name: currentYear.year_name,
    class_name: teacher.full_name_kh,
    homeroom_teacher_name: null,
    teacher_name: teacher.full_name_kh,
    periods: periods.map((p) => ({
      ...p,
      is_morning: p.start_time < "12:00:00",
    })),
    grid,
  };
}

// =========================================================
// 3. All Teachers (Master Schedule)
// =========================================================
export type MasterTimetableRow = {
  teacher_id: string;
  name_kh: string;
  gender: string | null;
  homeroom_class: string | null;
  schedule: Record<number, Record<number, { subject: string; className: string }>>;
};

export type MasterTimetableData = {
  academic_year_name: string;
  teachers: MasterTimetableRow[];
};

export async function fetchAllTeachersTimetable(): Promise<MasterTimetableData | null> {
  const supabase = await createClient();
  const currentYear = await getCurrentAcademicYear();
  if (!currentYear) return null;

  const { data: teachers, error: tErr } = await supabase
    .from("profiles")
    .select("id, full_name_kh, gender")
    .eq("role", "teacher")
    .order("full_name_kh", { ascending: true });
  if (tErr || !teachers) return null;

  const { data: classes } = await supabase
    .from("classes")
    .select("id, class_name, homeroom_teacher_id")
    .eq("academic_year_id", currentYear.id);

  const homeroomMap = new Map<string, string>();
  for (const c of classes ?? []) {
    if (c.homeroom_teacher_id) {
      homeroomMap.set(c.homeroom_teacher_id, c.class_name);
    }
  }

  const { data: periods } = await supabase
    .from("periods")
    .select("id, period_number, start_time")
    .eq("academic_year_id", currentYear.id)
    .order("period_number");

  const periodToSlot = new Map<string, number>();
  let morningCount = 0;
  let afternoonCount = 0;

  for (const p of periods ?? []) {
    const isMorning = p.start_time < "12:00:00";
    if (isMorning && morningCount < 4) {
      morningCount++;
      periodToSlot.set(p.id, morningCount);
    } else if (!isMorning && afternoonCount < 4) {
      afternoonCount++;
      periodToSlot.set(p.id, 4 + afternoonCount);
    }
  }

  const { data: entries, error: eErr } = await supabase
    .from("timetable_entries")
    .select(`
      teacher_id,
      day_of_week,
      period_id,
      subjects(code),
      classes(class_name)
    `)
    .eq("academic_year_id", currentYear.id);
  if (eErr) return null;

  const teacherSchedules = new Map<string, MasterTimetableRow>();

  for (const t of teachers) {
    teacherSchedules.set(t.id, {
      teacher_id: t.id,
      name_kh: t.full_name_kh,
      gender: t.gender,
      homeroom_class: homeroomMap.get(t.id) ?? null,
      schedule: {},
    });
  }

  for (const e of entries ?? []) {
    const slot = periodToSlot.get(e.period_id);
    if (!slot) continue;

    const sub = e.subjects as unknown as { code: string } | null;
    const cls = e.classes as unknown as { class_name: string } | null;
    const row = teacherSchedules.get(e.teacher_id);

    if (row && sub && cls) {
      if (!row.schedule[e.day_of_week]) row.schedule[e.day_of_week] = {};
      row.schedule[e.day_of_week][slot] = {
        subject: sub.code,
        className: cls.class_name,
      };
    }
  }

  return {
    academic_year_name: currentYear.year_name,
    teachers: Array.from(teacherSchedules.values()),
  };
}