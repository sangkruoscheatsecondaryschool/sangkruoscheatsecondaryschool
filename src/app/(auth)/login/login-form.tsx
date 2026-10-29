"use client";

import { useActionState } from "react";
import { signInAction, type LoginState } from "@/lib/auth/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { t } from "@/lib/i18n";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(signInAction, null);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-slate-700">
          {t("auth.email")}
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="admin@school.edu.kh"
          required
          className="font-inter" // Use Inter for email
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-slate-700">
          {t("auth.password")}
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          required
        />
      </div>

      {state?.error ? (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {t("auth.invalidCredentials")}
        </div>
      ) : null}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? t("common.loading") : t("auth.login")}
      </Button>
    </form>
  );
}