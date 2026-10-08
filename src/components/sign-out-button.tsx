"use client";

import { signOutAction } from "@/lib/auth/actions";

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        className="touch-target rounded-btn text-brand-700 px-3 text-sm active:bg-brand-50"
      >
        ចាកចេញ
      </button>
    </form>
  );
}