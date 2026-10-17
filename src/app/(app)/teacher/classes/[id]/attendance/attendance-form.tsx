"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  AttendanceContext,
  AttendanceStatus,
} from "@/lib/teacher/attendance-queries";
import {
  saveAttendanceAction,
  type SaveAttendanceResult,
} from "@/lib/teacher/attendance-actions";

type State = Record<string, AttendanceStatus>;

export function AttendanceForm({ ctx }: { ctx: AttendanceContext }) {
  const router = useRouter();
  const [state, action, pending] = useActionState<
    SaveAttendanceResult | null,
    FormData
  >(saveAttendanceAction, null);

  const [q, setQ] = useState("");

  // Build initial state: existing status, else default 'present'
  const [statuses, setStatuses] = useState<State>(() => {
    const m: State = {};
    for (const s of ctx.students) {
      m[s.id] = s.status ?? "present";
    }
    return m;
  });

  useEffect(() => {
    if (state?.ok && state.saved > 0) {
      router.refresh();
    }
  }, [state, router]);

  const needle = q.trim().toLowerCase();
  const visible = useMemo(() => {
    if (!needle) return null;
    const set = new Set<string>();
    for (const s of ctx.students) {
      if (
        s.name_kh.toLowerCase().includes(needle) ||
        s.student_code.toLowerCase().includes(needle)
      ) {
        set.add(s.id);
      }
    }
    return set;
  }, [needle, ctx.students]);

  const counts = useMemo(() => {
    let present = 0;
    let perm = 0;
    let absent = 0;
    for (const s of ctx.students) {
      const st = statuses[s.id];
      if (st === "present") present++;
      else if (st === "absent_permission") perm++;
      else absent++;
    }
    return { present, perm, absent };
  }, [statuses, ctx.students]);

  const setStatus = (id: string, status: AttendanceStatus) => {
    setStatuses((prev) => ({ ...prev, [id]: status }));
  };

  const markAllPresent = () => {
    const m: State = {};
    for (const s of ctx.students) m[s.id] = "present";
    setStatuses(m);
  };

  return (
    <form action={action} className="space-y-4 pb-24">
      <input type="hidden" name="class_id" value={ctx.class_id} />
      <input type="hidden" name="date" value={ctx.date} />

      {/* Summary card */}
      <div className="rounded-card border-border bg-surface border p-3">
        <p className="text-muted text-[10px] font-medium uppercase">
          សង្ខេបវត្តមាន
        </p>
        <div className="mt-2 grid grid-cols-3 gap-2 text-center">
          <SummaryChip label="មានវត្តមាន" count={counts.present} tone="green" />
          <SummaryChip label="មានច្បាប់" count={counts.perm} tone="amber" />
          <SummaryChip label="គ្មានច្បាប់" count={counts.absent} tone="red" />
        </div>
      </div>

      {/* Bulk actions + search */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={markAllPresent}
            className="touch-target rounded-btn border border-green-300 bg-green-50 flex-1 px-3 py-2 text-sm font-medium text-green-800 active:bg-green-100"
          >
            ✓ មានវត្តមានទាំងអស់
          </button>
        </div>

        <input
          type="search"
          inputMode="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ស្វែងរកឈ្មោះ ឬលេខកូដសិស្ស"
          className="rounded-btn border-border bg-surface w-full border px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
      </div>

      {state && !state.ok ? (
        <div
          role="alert"
          className="rounded-btn border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {state.error}
        </div>
      ) : null}

      {state?.ok ? (
        <div
          role="status"
          className={`rounded-btn border p-3 text-sm ${
            state.failed === 0
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-amber-200 bg-amber-50 text-amber-900"
          }`}
        >
          <p>
            បានរក្សាទុក {state.saved} · បរាជ័យ {state.failed}
          </p>
          {state.errors.length > 0 ? (
            <ul className="mt-2 space-y-1 text-xs">
              {state.errors.map((e, i) => (
                <li key={i}>
                  <span className="font-medium">{e.name}</span> — {e.message}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      {/* Student list */}
      <ul className="space-y-2">
        {ctx.students.map((s) => {
          const matched = !visible || visible.has(s.id);
          const current = statuses[s.id] ?? "present";

          return (
            <li
              key={s.id}
              className={`rounded-card border-border bg-surface border p-3 ${
                matched ? "" : "hidden"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                    s.gender === "F"
                      ? "bg-pink-100 text-pink-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {s.gender === "F" ? "F" : s.gender === "M" ? "M" : "—"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">{s.name_kh}</p>
                  <p className="text-muted truncate font-mono text-[11px]">
                    {s.student_code}
                  </p>
                </div>
              </div>

              <input type="hidden" name={`name__${s.id}`} value={s.name_kh} />
              <input
                type="hidden"
                name={`attn__${s.id}`}
                value={current}
              />

              <div className="mt-2 grid grid-cols-3 gap-1">
                <SegButton
                  active={current === "present"}
                  tone="green"
                  onClick={() => setStatus(s.id, "present")}
                  label="មាន"
                  icon="✓"
                />
                <SegButton
                  active={current === "absent_permission"}
                  tone="amber"
                  onClick={() => setStatus(s.id, "absent_permission")}
                  label="ច្បាប់"
                  icon="⚑"
                />
                <SegButton
                  active={current === "absent_no_permission"}
                  tone="red"
                  onClick={() => setStatus(s.id, "absent_no_permission")}
                  label="គ្មាន"
                  icon="✗"
                />
              </div>
            </li>
          );
        })}
      </ul>

      {needle && visible && visible.size === 0 ? (
        <div className="rounded-card border border-dashed border-border bg-surface p-6 text-center">
          <p className="text-muted text-sm">រកមិនឃើញសិស្ស។</p>
        </div>
      ) : null}

      {/* Sticky save bar */}
      <div className="bg-surface/95 fixed inset-x-0 bottom-0 z-30 border-t border-border pb-safe backdrop-blur">
        <div className="mx-auto flex max-w-3xl gap-2 p-3">
          <button
            type="submit"
            disabled={pending}
            className="touch-target rounded-btn bg-brand-600 flex-1 px-4 py-3 font-medium text-white active:bg-brand-700 disabled:opacity-60"
          >
            {pending ? "កំពុងរក្សាទុក..." : "រក្សាទុកវត្តមាន"}
          </button>
        </div>
      </div>
    </form>
  );
}

function SummaryChip({
  label,
  count,
  tone,
}: {
  label: string;
  count: number;
  tone: "green" | "amber" | "red";
}) {
  const cls =
    tone === "green"
      ? "border-green-200 bg-green-50 text-green-800"
      : tone === "amber"
        ? "border-amber-200 bg-amber-50 text-amber-900"
        : "border-red-200 bg-red-50 text-red-800";

  return (
    <div className={`rounded-btn border ${cls} px-2 py-2`}>
      <p className="text-[10px] uppercase">{label}</p>
      <p className="mt-0.5 text-lg font-semibold tabular-nums">{count}</p>
    </div>
  );
}

function SegButton({
  active,
  tone,
  onClick,
  label,
  icon,
}: {
  active: boolean;
  tone: "green" | "amber" | "red";
  onClick: () => void;
  label: string;
  icon: string;
}) {
  const activeCls =
    tone === "green"
      ? "border-green-600 bg-green-600 text-white"
      : tone === "amber"
        ? "border-amber-500 bg-amber-500 text-white"
        : "border-red-600 bg-red-600 text-white";

  const inactiveCls =
    tone === "green"
      ? "border-green-200 bg-green-50 text-green-800 active:bg-green-100"
      : tone === "amber"
        ? "border-amber-200 bg-amber-50 text-amber-900 active:bg-amber-100"
        : "border-red-200 bg-red-50 text-red-800 active:bg-red-100";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`touch-target rounded-btn flex items-center justify-center gap-1 border px-2 py-1.5 text-xs font-medium transition-colors ${
        active ? activeCls : inactiveCls
      }`}
      aria-pressed={active}
    >
      <span aria-hidden>{icon}</span>
      <span>{label}</span>
    </button>
  );
}