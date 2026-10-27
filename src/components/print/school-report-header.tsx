import Image from "next/image";
import type { SchoolSettings } from "@/lib/admin/school/queries";
import { toKhmer } from "@/lib/khmer/numerals";

export function SchoolReportHeader({
  settings,
  academicYearName,
  title,
  subtitle,
}: {
  settings: SchoolSettings;
  academicYearName: string;
  title: string;
  subtitle?: string;
}) {
  const yearKh = academicYearName.replace(/[0-9]/g, (d) => toKhmer(Number(d)));

  return (
    <header className="mb-4 print:mb-3">
            <div className="grid grid-cols-3 items-start gap-2 w-full">
        {/* ===== Left: school identity ===== */}
        <div className="font-moul text-[12px] leading-relaxed">
          {settings.logo_url ? (
            <Image
              src={settings.logo_url}
              alt="Emblem"
              width={56}
              height={56}
              className="h-18 w-18 object-contain ml-6 mb-1"
              unoptimized
            />
          ) : null}
          <p>
            {settings.district_line_kh ??
              "ការិ.អយក នៃរដ្ឋបាល..............................."}
          </p>
          <p>{settings.school_name_kh}</p>
        </div>

        {/* ===== Center: national header ===== */}
        <div className="font-moul text-center text-[12px] leading-relaxed">
          <p className="text-[14px]">ព្រះរាជាណាចក្រកម្ពុជា</p>
          <p>{settings.motto_kh}</p>
          <p className="mt-0.5 text-[12px]">━━•❅•°•❈•°•❅•━━</p>
        </div>

        {/* ===== Right: Empty placeholder to keep center aligned ===== */}
        <div></div>
      </div>

      {/* ===== Title block ===== */}
      <div className="mt-3 text-center">
        <h1 className="font-moul text-base">{title}</h1>
        {subtitle ? (
          <p className="font-moul mt-0.5 text-sm">{subtitle}</p>
        ) : null}
        <p className="font-moul mt-1 text-xs">ឆ្នាំសិក្សា {yearKh}</p>
      </div>
    </header>
  );
}