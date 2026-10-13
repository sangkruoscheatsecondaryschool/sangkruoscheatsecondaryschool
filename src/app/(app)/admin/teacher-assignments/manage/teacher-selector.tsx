"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { TeacherOption } from "@/lib/admin/teacher-assignments/queries";

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
  const [teacherId, setTeacherId] = useState("");
  const [navigating, setNavigating] = useState(false);

  const go = () => {
    if (!teacherId) return;
    setNavigating(true);
    router.push(
      `/admin/teacher-assignments/manage?year=${yearId}&teacher=${teacherId}`,
    );
  };

  return (
    <div className="space-y-4">
      <div className="rounded-card border-border bg-surface border p-3 text-sm">
        ឆ្នាំសិក្សា៖ <span className="font-medium">{yearName}</span>
      </div>

      {teachers.length === 0 ? (
        <div className="rounded-card border border-dashed border-border bg-surface p-6 text-center">
          <p className="text-muted text-sm">
            មិនមានគណនីគ្រូនៅឡើយទេ។
          </p>
        </div>
      ) : (
        <>
          <div>
            <label className="text-fg mb-1 block text-sm font-medium">
              ជ្រើសរើសគ្រូបង្រៀន
            </label>
            <select
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              className="rounded-btn border-border bg-surface w-full border px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            >
              <option value="">— ជ្រើសរើសគ្រូ —</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.full_name_kh}
                  {t.full_name_en ? ` (${t.full_name_en})` : ""}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={go}
            disabled={!teacherId || navigating}
            className="touch-target rounded-btn bg-brand-600 w-full px-4 py-3 font-medium text-white active:bg-brand-700 disabled:opacity-60"
          >
            {navigating ? "កំពុងផ្ទុក..." : "បន្ត"}
          </button>
        </>
      )}
    </div>
  );
}