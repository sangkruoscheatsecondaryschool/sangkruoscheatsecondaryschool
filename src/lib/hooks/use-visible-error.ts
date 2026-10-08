"use client";

import { useEffect, useState } from "react";
import type { ActionResult } from "@/lib/actions/types";

/**
 * Mirrors a useActionState error into a local, auto-dismissing value.
 *
 * Why: useActionState's returned state survives navigations in Next.js
 * Router Cache. Reading it directly in the render makes errors stick
 * around after the user leaves the page and comes back. By mirroring
 * into a useState we own, we can auto-clear it via a timer, and it
 * resets automatically if the component truly remounts.
 */
export function useVisibleError(
  state: ActionResult | null,
  autoDismissMs = 8000,
): string | null {
  const [error, setError] = useState<string | null>(null);

  // Mirror into local state whenever the action result changes.
  useEffect(() => {
    if (state && !state.ok) {
      setError(state.error);
    } else if (state?.ok) {
      setError(null);
    }
  }, [state]);

  // Auto-dismiss after N ms.
  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(null), autoDismissMs);
    return () => clearTimeout(t);
  }, [error, autoDismissMs]);

  return error;
}