"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ActionResult } from "@/lib/actions/types";
import type { TermMonth } from "@/lib/admin/term-months/queries";
import { monthCommandAction } from "@/lib/admin/term-months/actions";

export function MonthRow({
  month,
  isFirst,
  isLast,
}: {
  month: TermMonth;
  isFirst: boolean;
  isLast: boolean;
}) {
  const router = useRouter();
  const [state, action, pending] = useActionState<
    ActionResult | null,
    FormData
  >(monthCommandAction, null);

  useEffect(() => {
    if (state?.ok) router.refresh();
  }, [state, router]);

  return (
    <div className="rounded-btn border-border bg-bg border p-2">
      <div className="flex items-center gap-2">
        <div className="flex flex-col gap-0.5">
          <MiniBtn
            action={action}
            monthId={month.id}
            command="move_up"
            disabled={isFirst || pending}
            label="ឡើង"
          >
            ▲
          </MiniBtn>
          <MiniBtn
            action={action}
            monthId={month.id}
            command="move_down"
            disabled={isLast || pending}
            label="ចុះ"
          >
            ▼
          </MiniBtn>
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm">{month.month_name_kh}</p>
          {month.is_semester_exam ? (
            <span className="mt-0.5 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-800">
              ប្រឡងឆមាស
            </span>
          ) : null}
        </div>

        <MiniBtn
          action={action}
          monthId={month.id}
          command={month.is_semester_exam ? "unset_exam" : "set_exam"}
          disabled={pending}
          label={
            month.is_semester_exam ? "ដកចេញពីប្រឡង" : "កំណត់ជាប្រឡង"
          }
          className="rounded-btn border-border bg-surface border px-2 py-1 text-[11px] whitespace-nowrap active:bg-slate-50"
        >
          {month.is_semester_exam ? "ដកប្រឡង" : "កំណត់ប្រឡង"}
        </MiniBtn>

        <ConfirmBtn
          action={action}
          monthId={month.id}
          command="remove"
          disabled={pending}
          message={`លុបខែ ${month.month_name_kh}?`}
        />
      </div>

      {state && !state.ok ? (
        <p className="mt-2 text-xs text-red-700">{state.error}</p>
      ) : null}
    </div>
  );
}

function MiniBtn({
  action,
  monthId,
  command,
  disabled,
  label,
  className,
  children,
}: {
  action: (formData: FormData) => void;
  monthId: string;
  command: string;
  disabled?: boolean;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <form action={action}>
      <input type="hidden" name="month_id" value={monthId} />
      <input type="hidden" name="command" value={command} />
      <button
        type="submit"
        disabled={disabled}
        aria-label={label}
        className={
          className ??
          "touch-target flex h-6 w-6 items-center justify-center rounded text-xs text-slate-600 active:bg-slate-100 disabled:opacity-30"
        }
      >
        {children}
      </button>
    </form>
  );
}

function ConfirmBtn({
  action,
  monthId,
  command,
  disabled,
  message,
}: {
  action: (formData: FormData) => void;
  monthId: string;
  command: string;
  disabled?: boolean;
  message: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      <input type="hidden" name="month_id" value={monthId} />
      <input type="hidden" name="command" value={command} />
      <button
        type="submit"
        disabled={disabled}
        aria-label="លុប"
        className="touch-target flex h-8 w-8 items-center justify-center rounded text-red-600 active:bg-red-50 disabled:opacity-30"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 6h18" />
          <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        </svg>
      </button>
    </form>
  );
}