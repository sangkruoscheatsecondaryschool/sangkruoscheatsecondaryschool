import Link from "next/link";
import type { ReactNode } from "react";

type AppHeaderProps = {
  title: string;
  backHref?: string;
  right?: ReactNode;
};

export function AppHeader({ title, backHref, right }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/95 pt-safe backdrop-blur">
      <div className="mx-auto flex min-h-16 max-w-3xl items-center gap-1 px-2 py-2">
        {backHref ? (
          <Link
            href={backHref}
            aria-label="ត្រឡប់ក្រោយ"
            className="touch-target flex shrink-0 items-center justify-center rounded-btn text-brand-700 active:bg-brand-50"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
        ) : null}

        <h1 className="font-moul moul-safe min-w-0 flex-1 truncate px-1 pt-1 text-base leading-[1.8]">
          {title}
        </h1>

        {right ? (
          <div className="flex shrink-0 items-center gap-1">{right}</div>
        ) : null}
      </div>
    </header>
  );
}