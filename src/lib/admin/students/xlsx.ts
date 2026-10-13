import "server-only";
import ExcelJS from "exceljs";

// =========================================================
// Column definitions shared by template, import, export
// =========================================================
export const TEMPLATE_COLUMNS = [
  { key: "student_code",          header: "លេខកូដសិស្ស *",           width: 14 },
  { key: "name_kh",               header: "ឈ្មោះសិស្ស *",             width: 22 },
  { key: "gender",                header: "ភេទ (M/F)",                 width: 10 },
  { key: "dob",                   header: "ថ្ងៃកំណើត (YYYY-MM-DD) *", width: 20 },
  { key: "class_name",            header: "ថ្នាក់ (ឧ. 7A) *",          width: 12 },
  { key: "status",                header: "ស្ថានភាព",                    width: 16 },
  { key: "pob_province",          header: "ខេត្តកំណើត",                 width: 18 },
  { key: "pob_district",          header: "ស្រុកកំណើត",                 width: 18 },
  { key: "pob_commune",           header: "ឃុំកំណើត",                   width: 18 },
  { key: "pob_village",           header: "ភូមិកំណើត",                  width: 18 },
  { key: "cur_province",          header: "ខេត្តបច្ចុប្បន្ន",              width: 18 },
  { key: "cur_district",          header: "ស្រុកបច្ចុប្បន្ន",              width: 18 },
  { key: "cur_commune",           header: "ឃុំបច្ចុប្បន្ន",                width: 18 },
  { key: "cur_village",           header: "ភូមិបច្ចុប្បន្ន",               width: 18 },
  { key: "current_address_detail",header: "អាសយដ្ឋានបន្ថែម",            width: 24 },
  { key: "mother_name",           header: "ឈ្មោះម្តាយ",                  width: 22 },
  { key: "father_name",           header: "ឈ្មោះឪពុក",                  width: 22 },
  { key: "contact_number",        header: "លេខទូរសព្ទ",                   width: 16 },
] as const;

export type TemplateColumnKey = (typeof TEMPLATE_COLUMNS)[number]["key"];

export type ImportRow = {
  student_code: string;
  name_kh: string;
  gender: string;
  dob: string;
  class_name: string;
  status: string;
  pob_province: string;
  pob_district: string;
  pob_commune: string;
  pob_village: string;
  cur_province: string;
  cur_district: string;
  cur_commune: string;
  cur_village: string;
  current_address_detail: string;
  mother_name: string;
  father_name: string;
  contact_number: string;
};

// =========================================================
// Build template workbook
// =========================================================
export async function buildTemplateWorkbook(opts: {
  classNames: string[];
  provinceNames: string[];
}): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "School Management";
  wb.created = new Date();

  const ws = wb.addWorksheet("សិស្ស", {
    views: [{ state: "frozen", ySplit: 1 }],
  });

  // Header row
  ws.columns = TEMPLATE_COLUMNS.map((c) => ({
    header: c.header,
    key: c.key,
    width: c.width,
  }));

  // Header styling
  const headerRow = ws.getRow(1);
  headerRow.font = { bold: true, size: 11 };
  headerRow.alignment = { vertical: "middle", horizontal: "center" };
  headerRow.height = 28;
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFDBEAFE" },
    };
    cell.border = {
      top: { style: "thin", color: { argb: "FF93C5FD" } },
      left: { style: "thin", color: { argb: "FF93C5FD" } },
      bottom: { style: "thin", color: { argb: "FF93C5FD" } },
      right: { style: "thin", color: { argb: "FF93C5FD" } },
    };
  });

  // Sample row
  ws.addRow({
    student_code: "S001",
    name_kh: "សុខ ដារា",
    gender: "M",
    dob: "2012-05-15",
    class_name: opts.classNames[0] ?? "7A",
    status: "active",
    pob_province: "ភ្នំពេញ",
    pob_district: "ខណ្ឌចំការមន",
    pob_commune: "សង្កាត់ទន្លេបាសាក់",
    pob_village: "ភូមិ១",
    cur_province: "",
    cur_district: "",
    cur_commune: "",
    cur_village: "",
    current_address_detail: "",
    mother_name: "",
    father_name: "",
    contact_number: "012345678",
  });

  // Data validations
  const maxRow = 5000;
  for (let r = 2; r <= maxRow; r++) {
    // Gender
    ws.getCell(`C${r}`).dataValidation = {
      type: "list",
      allowBlank: true,
      formulae: ['"M,F"'],
    };
    // Class name
    if (opts.classNames.length > 0) {
      ws.getCell(`E${r}`).dataValidation = {
        type: "list",
        allowBlank: false,
        formulae: [`"${opts.classNames.join(",")}"`],
      };
    }
    // Status
    ws.getCell(`F${r}`).dataValidation = {
      type: "list",
      allowBlank: true,
      formulae: ['"active,dropped_s1,dropped_s2,graduated"'],
    };
    // Provinces (place of birth + current)
    if (opts.provinceNames.length > 0) {
      ws.getCell(`G${r}`).dataValidation = {
        type: "list",
        allowBlank: true,
        formulae: [`"${opts.provinceNames.join(",")}"`],
      };
      ws.getCell(`K${r}`).dataValidation = {
        type: "list",
        allowBlank: true,
        formulae: [`"${opts.provinceNames.join(",")}"`],
      };
    }
  }

  const arrayBuffer = await wb.xlsx.writeBuffer();
  return Buffer.from(arrayBuffer);
}

// =========================================================
// Parse uploaded workbook
// =========================================================
export async function parseImportWorkbook(
  buffer: Buffer,
): Promise<ImportRow[]> {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(buffer as unknown as ArrayBuffer);

  const ws = wb.worksheets[0];
  if (!ws) throw new Error("No worksheet found in file");

  const headerRow = ws.getRow(1);
  if (headerRow.cellCount === 0) throw new Error("Empty worksheet");

  // Map header → column index
  const headerMap = new Map<string, number>();
  headerRow.eachCell((cell, colNumber) => {
    const v = cell.value;
    const text = typeof v === "string" ? v.trim() : String(v ?? "").trim();
    if (text) headerMap.set(text, colNumber);
  });

  // Match columns by expected header text
  const columnIndex: Record<string, number | undefined> = {};
  for (const col of TEMPLATE_COLUMNS) {
    const idx = headerMap.get(col.header);
    columnIndex[col.key] = idx;
  }

  // Sanity: require the two absolute-must-have columns
  if (!columnIndex.student_code || !columnIndex.name_kh) {
    throw new Error(
      "សូមប្រើឯកសារគំរូដែលបានទាញយកពីប្រព័ន្ធ — មិនឃើញជួរឈរចាំបាច់។",
    );
  }

  const rows: ImportRow[] = [];

  ws.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;

    const read = (key: TemplateColumnKey): string => {
      const idx = columnIndex[key];
      if (!idx) return "";
      const cell = row.getCell(idx);
      const v = cell.value;
      if (v == null) return "";
      if (typeof v === "string") return v.trim();
      if (typeof v === "number") return String(v);
      if (typeof v === "boolean") return String(v);
      if (v instanceof Date) {
        // Format as YYYY-MM-DD
        const y = v.getUTCFullYear();
        const m = String(v.getUTCMonth() + 1).padStart(2, "0");
        const d = String(v.getUTCDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
      }
      if (typeof v === "object" && "text" in v && typeof v.text === "string") {
        return v.text.trim();
      }
      if (
        typeof v === "object" &&
        "richText" in v &&
        Array.isArray((v as { richText: { text: string }[] }).richText)
      ) {
        return (v as { richText: { text: string }[] }).richText
          .map((r) => r.text)
          .join("")
          .trim();
      }
      return String(v).trim();
    };

    const rowObj: ImportRow = {
      student_code: read("student_code"),
      name_kh: read("name_kh"),
      gender: read("gender").toUpperCase(),
      dob: read("dob"),
      class_name: read("class_name"),
      status: read("status").toLowerCase() || "active",
      pob_province: read("pob_province"),
      pob_district: read("pob_district"),
      pob_commune: read("pob_commune"),
      pob_village: read("pob_village"),
      cur_province: read("cur_province"),
      cur_district: read("cur_district"),
      cur_commune: read("cur_commune"),
      cur_village: read("cur_village"),
      current_address_detail: read("current_address_detail"),
      mother_name: read("mother_name"),
      father_name: read("father_name"),
      contact_number: read("contact_number"),
    };

    // Skip fully-empty rows
    const hasContent = Object.values(rowObj).some((v) => v !== "");
    if (hasContent) rows.push(rowObj);
  });

  return rows;
}

// =========================================================
// Build export workbook
// =========================================================
export type ExportRow = {
  student_code: string;
  name_kh: string;
  gender: string;
  dob: string;
  class_name: string;
  status_kh: string;
  pob_province: string;
  pob_district: string;
  pob_commune: string;
  pob_village: string;
  cur_province: string;
  cur_district: string;
  cur_commune: string;
  cur_village: string;
  current_address_detail: string;
  mother_name: string;
  father_name: string;
  contact_number: string;
};

export async function buildExportWorkbook(
  rows: ExportRow[],
): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "School Management";
  wb.created = new Date();

  const ws = wb.addWorksheet("សិស្ស", {
    views: [{ state: "frozen", ySplit: 1 }],
  });

  ws.columns = TEMPLATE_COLUMNS.map((c) => ({
    header: c.header.replace(" *", ""),
    key: c.key,
    width: c.width,
  }));

  const headerRow = ws.getRow(1);
  headerRow.font = { bold: true, size: 11 };
  headerRow.height = 28;
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFDBEAFE" },
    };
    cell.border = {
      top: { style: "thin", color: { argb: "FF93C5FD" } },
      left: { style: "thin", color: { argb: "FF93C5FD" } },
      bottom: { style: "thin", color: { argb: "FF93C5FD" } },
      right: { style: "thin", color: { argb: "FF93C5FD" } },
    };
  });

  for (const r of rows) {
    ws.addRow({
      student_code: r.student_code,
      name_kh: r.name_kh,
      gender: r.gender,
      dob: r.dob,
      class_name: r.class_name,
      status: r.status_kh,
      pob_province: r.pob_province,
      pob_district: r.pob_district,
      pob_commune: r.pob_commune,
      pob_village: r.pob_village,
      cur_province: r.cur_province,
      cur_district: r.cur_district,
      cur_commune: r.cur_commune,
      cur_village: r.cur_village,
      current_address_detail: r.current_address_detail,
      mother_name: r.mother_name,
      father_name: r.father_name,
      contact_number: r.contact_number,
    });
  }

  const arrayBuffer = await wb.xlsx.writeBuffer();
  return Buffer.from(arrayBuffer);
}

// =========================================================
// Status helper
// =========================================================
export const STATUS_KH: Record<string, string> = {
  active: "កំពុងសិក្សា",
  dropped_s1: "បោះបង់ ឆមាសទី១",
  dropped_s2: "បោះបង់ ឆមាសទី២",
  graduated: "បានបញ្ចប់",
};

export const STATUS_KH_TO_ENUM: Record<string, string> = {
  "កំពុងសិក្សា": "active",
  "បោះបង់ ឆមាសទី១": "dropped_s1",
  "បោះបង់ ឆមាសទី២": "dropped_s2",
  "បានបញ្ចប់": "graduated",
};