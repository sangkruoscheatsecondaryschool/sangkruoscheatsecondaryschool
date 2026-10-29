"use client";

import { useRouter } from "next/navigation";
import type { TeacherOption } from "@/lib/admin/teacher-assignments/queries";
import { Card } from "@/components/ui/card";

export function TeacherSelector({
  yearId,
  teachers,
  yearName,
}: {
  yearId: string;
  teachers: TeacherOption[];
  yearName: string;
}) {
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const teacherId = e.target.value;
    if (teacherId) {
      router.push(`/admin/teacher-assignments/manage?year=${yearId}&teacher=${teacherId}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-primary-50 text-primary-800 p-4 rounded-xl border border-primary-100 flex items-center justify-between">
        <span className="font-medium">ឆ្នាំសិក្សា</span>
        <span className="font-inter font-bold">{yearName}</span>
      </div>

      {teachers.length === 0 ? (
        <Card className="p-8 text-center text-slate-500">
          មិនមានគណនីគ្រូនៅឡើយទេ។ សូមបង្កើតគណនីគ្រូជាមុនសិន។
        </Card>
      ) : (
        <Card className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">ជ្រើសរើសគ្រូបង្រៀន</label>
            <select
              onChange={handleChange}
              defaultValue=""
              className="flex h-12 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-base focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            >
              <option value="" disabled>— ជ្រើសរើសគ្រូ —</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.full_name_kh} {t.full_name_en ? `(${t.full_name_en})` : ""}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500 mt-2">ពេលអ្នកជ្រើសរើសគ្រូ ប្រព័ន្ធនឹងបង្ហាញថ្នាក់រៀនដោយស្វ័យប្រវត្តិ។</p>
          </div>
        </Card>
      )}
    </div>
  );
}