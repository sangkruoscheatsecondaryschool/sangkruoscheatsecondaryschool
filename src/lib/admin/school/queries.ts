import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export type SchoolSettings = {
  id: string;
  school_name_kh: string;
  school_name_en: string | null;
  school_code: string | null;
  ministry_line_kh: string;
  department_line_kh: string | null;
  district_line_kh: string | null;
  address_code: string | null;
  phone: string | null;
  email: string | null;
  principal_name_kh: string | null;
  motto_kh: string;
  logo_url: string | null;
};

export const getSchoolSettings = cache(
  async (): Promise<SchoolSettings | null> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("school_settings")
      .select(
        "id, school_name_kh, school_name_en, school_code, ministry_line_kh, department_line_kh, district_line_kh, address_code, phone, email, principal_name_kh, motto_kh, logo_url",
      )
      .limit(1)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  },
);