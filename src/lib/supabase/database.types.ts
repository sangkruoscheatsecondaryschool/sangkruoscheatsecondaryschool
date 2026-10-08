// Hand-written placeholder types for Phase 2.
// In Phase 4 (or anytime) replace this with the output of:
//   npx supabase gen types typescript --project-id <id> > src/lib/supabase/database.types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "admin" | "teacher";
export type ScoreType = "monthly" | "semester_exam";
export type AttendanceStatus =
  | "present"
  | "absent_permission"
  | "absent_no_permission";
export type StudentStatus = "active" | "dropped_s1" | "dropped_s2" | "graduated";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name_kh: string;
          full_name_en: string | null;
          role: UserRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name_kh: string;
          full_name_en?: string | null;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      academic_years: {
        Row: {
          id: string;
          year_name: string;
          is_current: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          year_name: string;
          is_current?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["academic_years"]["Insert"]>;
        Relationships: [];
      };
      academic_terms: {
        Row: {
          id: string;
          academic_year_id: string;
          term_number: number;
          term_name_kh: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          academic_year_id: string;
          term_number: number;
          term_name_kh: string;
        };
        Update: Partial<Database["public"]["Tables"]["academic_terms"]["Insert"]>;
        Relationships: [];
      };
      term_months: {
        Row: {
          id: string;
          academic_term_id: string;
          month_number: number;
          month_name_kh: string;
          is_semester_exam: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          academic_term_id: string;
          month_number: number;
          month_name_kh: string;
          is_semester_exam?: boolean;
          display_order: number;
        };
        Update: Partial<Database["public"]["Tables"]["term_months"]["Insert"]>;
        Relationships: [];
      };
      classes: {
        Row: {
          id: string;
          class_name: string;
          academic_year_id: string;
          homeroom_teacher_id: string | null;
          grade_level: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          class_name: string;
          academic_year_id: string;
          homeroom_teacher_id?: string | null;
          grade_level: number;
        };
        Update: Partial<Database["public"]["Tables"]["classes"]["Insert"]>;
        Relationships: [];
      };
      students: {
        Row: {
          id: string;
          student_code: string;
          name_kh: string;
          gender: string | null;
          dob: string;
          class_id: string;
          access_token: string;
          place_of_birth_village_id: string | null;
          current_address_village_id: string | null;
          current_address_detail: string | null;
          mother_name: string | null;
          father_name: string | null;
          contact_number: string | null;
          status: StudentStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_code: string;
          name_kh: string;
          gender?: string | null;
          dob: string;
          class_id: string;
          access_token?: string;
          place_of_birth_village_id?: string | null;
          current_address_village_id?: string | null;
          current_address_detail?: string | null;
          mother_name?: string | null;
          father_name?: string | null;
          contact_number?: string | null;
          status?: StudentStatus;
        };
        Update: Partial<Database["public"]["Tables"]["students"]["Insert"]>;
        Relationships: [];
      };
      provinces: {
        Row: {
          id: string;
          code: string;
          name_kh: string;
          name_en: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          name_kh: string;
          name_en: string;
        };
        Update: Partial<Database["public"]["Tables"]["provinces"]["Insert"]>;
        Relationships: [];
      };
      districts: {
        Row: {
          id: string;
          province_id: string;
          code: string;
          name_kh: string;
          name_en: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          province_id: string;
          code: string;
          name_kh: string;
          name_en: string;
        };
        Update: Partial<Database["public"]["Tables"]["districts"]["Insert"]>;
        Relationships: [];
      };
      communes: {
        Row: {
          id: string;
          district_id: string;
          code: string;
          name_kh: string;
          name_en: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          district_id: string;
          code: string;
          name_kh: string;
          name_en: string;
        };
        Update: Partial<Database["public"]["Tables"]["communes"]["Insert"]>;
        Relationships: [];
      };
      villages: {
        Row: {
          id: string;
          commune_id: string;
          code: string;
          name_kh: string;
          name_en: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          commune_id: string;
          code: string;
          name_kh: string;
          name_en: string;
        };
        Update: Partial<Database["public"]["Tables"]["villages"]["Insert"]>;
        Relationships: [];
      };
      subjects: {
        Row: {
          id: string;
          subject_name: string;
          code: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          subject_name: string;
          code: string;
        };
        Update: Partial<Database["public"]["Tables"]["subjects"]["Insert"]>;
        Relationships: [];
      };
      subject_grade_configs: {
        Row: {
          id: string;
          subject_id: string;
          grade_level: number;
          max_score: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          subject_id: string;
          grade_level: number;
          max_score: number;
        };
        Update: Partial<
          Database["public"]["Tables"]["subject_grade_configs"]["Insert"]
        >;
        Relationships: [];
      };
      scores: {
        Row: {
          id: string;
          student_id: string;
          subject_id: string;
          term_month_id: string;
          score_value: number;
          score_type: ScoreType;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          subject_id: string;
          term_month_id: string;
          score_value: number;
          score_type: ScoreType;
          created_by?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["scores"]["Insert"]>;
        Relationships: [];
      };
      attendance: {
        Row: {
          id: string;
          student_id: string;
          date: string;
          status: AttendanceStatus;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          date: string;
          status: AttendanceStatus;
          created_by?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["attendance"]["Insert"]>;
        Relationships: [];
      };
      teacher_assignments: {
        Row: {
          id: string;
          teacher_id: string;
          class_id: string;
          subject_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          teacher_id: string;
          class_id: string;
          subject_id: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["teacher_assignments"]["Insert"]
        >;
        Relationships: [];
      };
    };
    Views: {
      v_student_scores: {
        Row: {
          id: string;
          student_id: string;
          student_code: string;
          student_name_kh: string;
          class_id: string;
          class_name: string;
          grade_level: number;
          subject_id: string;
          subject_name: string;
          subject_code: string;
          term_month_id: string;
          month_number: number;
          month_name_kh: string;
          is_semester_exam: boolean;
          academic_term_id: string;
          term_number: number;
          academic_year_id: string;
          score_value: number;
          score_type: ScoreType;
          max_score: number | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      get_public_report: {
        Args: { p_student_code: string; p_dob: string };
        Returns: Json;
      };
      get_khmer_grade: {
        Args: { p: number };
        Returns: string | null;
      };
      get_english_grade: {
        Args: { p: number };
        Returns: string | null;
      };
      calculate_subject_semester_percentage: {
        Args: {
          p_student_id: string;
          p_subject_id: string;
          p_academic_term_id: string;
        };
        Returns: number | null;
      };
      calculate_overall_semester_percentage: {
        Args: { p_student_id: string; p_academic_term_id: string };
        Returns: number | null;
      };
      calculate_annual_percentage: {
        Args: { p_student_id: string; p_academic_year_id: string };
        Returns: number | null;
      };
      get_class_rankings: {
        Args: {
          p_class_id: string;
          p_academic_term_id?: string | null;
          p_academic_year_id?: string | null;
        };
        Returns: {
          rank: number;
          student_id: string;
          student_code: string;
          name_kh: string;
          percentage: number | null;
          khmer_grade: string | null;
          english_grade: string | null;
        }[];
      };
      get_student_rank: {
        Args: {
          p_student_id: string;
          p_academic_term_id?: string | null;
          p_academic_year_id?: string | null;
        };
        Returns: {
          rank: number;
          total_students: number;
        }[];
      };
      set_current_academic_year: {
        Args: { p_year_id: string };
        Returns: undefined;
      };
      setup_default_year_terms: {
        Args: { p_academic_year_id: string };
        Returns: undefined;
      };
      add_term_month: {
        Args: {
          p_academic_term_id: string;
          p_month_number: number;
          p_month_name_kh: string;
        };
        Returns: string;
      };
      remove_term_month: {
        Args: { p_month_id: string };
        Returns: undefined;
      };
      move_term_month: {
        Args: { p_month_id: string; p_direction: string };
        Returns: undefined;
      };
      set_semester_exam_month: {
        Args: { p_month_id: string; p_value: boolean };
        Returns: undefined;
      };
      create_subject_with_configs: {
        Args: {
          p_subject_name: string;
          p_code: string;
          p_max_grade7: number;
          p_max_grade8: number;
          p_max_grade9: number;
        };
        Returns: string;
      };
      update_subject_with_configs: {
        Args: {
          p_subject_id: string;
          p_subject_name: string;
          p_code: string;
          p_max_grade7: number;
          p_max_grade8: number;
          p_max_grade9: number;
        };
        Returns: undefined;
      };
      delete_subject_safe: {
        Args: { p_subject_id: string };
        Returns: undefined;
      };
      create_class: {
        Args: {
          p_academic_year_id: string;
          p_class_name: string;
          p_grade_level: number;
          p_homeroom_teacher_id: string | null;
        };
        Returns: string;
      };
      update_class: {
        Args: {
          p_class_id: string;
          p_class_name: string;
          p_grade_level: number;
          p_homeroom_teacher_id: string | null;
        };
        Returns: undefined;
      };
      delete_class_safe: {
        Args: { p_class_id: string };
        Returns: undefined;
      };
      create_student: {
        Args: {
          p_class_id: string;
          p_student_code: string;
          p_name_kh: string;
          p_gender: string | null;
          p_dob: string;
          p_place_of_birth_village_id: string | null;
          p_current_address_village_id: string | null;
          p_current_address_detail: string | null;
          p_mother_name: string | null;
          p_father_name: string | null;
          p_contact_number: string | null;
          p_status: StudentStatus;
        };
        Returns: string;
      };
      update_student: {
        Args: {
          p_student_id: string;
          p_class_id: string;
          p_student_code: string;
          p_name_kh: string;
          p_gender: string | null;
          p_dob: string;
          p_place_of_birth_village_id: string | null;
          p_current_address_village_id: string | null;
          p_current_address_detail: string | null;
          p_mother_name: string | null;
          p_father_name: string | null;
          p_contact_number: string | null;
          p_status: StudentStatus;
        };
        Returns: undefined;
      };
      delete_student_safe: {
        Args: { p_student_id: string };
        Returns: undefined;
      };
    };
    Enums: {
      user_role: UserRole;
      score_type: ScoreType;
      attendance_status: AttendanceStatus;
      student_status: "active" | "dropped_s1" | "dropped_s2" | "graduated";
    };
    CompositeTypes: Record<string, never>;
  };
}