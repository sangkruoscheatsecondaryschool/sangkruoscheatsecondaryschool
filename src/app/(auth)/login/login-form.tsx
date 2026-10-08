"use client";

import { useActionState } from "react";
import { signInAction, type LoginState } from "@/lib/auth/actions";

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    signInAction,
    null,
  );

  return (
    <form action={formAction} className="space-y-4">
        <input type="hidden" name="next" value={next ?? ""} />
      <div>
        <label
          htmlFor="email"
          className="text-fg mb-1 block text-sm font-medium"
        >
          អ៊ីមែល
        </label>
        <input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect="off"
          required
          className="rounded-btn border-border bg-surface w-full border px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="text-fg mb-1 block text-sm font-medium"
        >
          លេខសម្ងាត់
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="rounded-btn border-border bg-surface w-full border px-3 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
      </div>

      {state?.error ? (
        <div
          role="alert"
          className="rounded-btn border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {state.error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="touch-target rounded-btn bg-brand-600 w-full px-4 py-3 font-medium text-white active:bg-brand-700 disabled:opacity-60"
      >
        {pending ? "កំពុងចូល..." : "ចូលប្រើប្រាស់"}
      </button>
    </form>
  );
}