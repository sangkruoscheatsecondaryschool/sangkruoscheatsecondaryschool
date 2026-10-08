import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-dvh bg-bg">
      <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-6 p-6 pt-safe pb-safe">
        <div className="text-center">
          <h1 className="font-moul text-2xl">ប្រព័ន្ធគ្រប់គ្រងសាលា</h1>
          <p className="text-muted mt-2 text-sm">School Management System</p>
        </div>

        <nav className="grid gap-3">
          <Link
            href="/login"
            className="touch-target rounded-card bg-brand-600 px-4 py-5 text-left text-white shadow-sm active:bg-brand-700"
          >
            <p className="font-moul text-lg">ចូលប្រើប្រាស់</p>
            <p className="mt-1 text-xs opacity-90">
              Staff login — Admin &amp; Teacher
            </p>
          </Link>

          <Link
            href="/check"
            className="touch-target rounded-card border border-border bg-surface px-4 py-5 text-left active:bg-slate-50"
          >
            <p className="font-moul text-lg">ពិនិត្យលទ្ធផលសិក្សា</p>
            <p className="text-muted mt-1 text-xs">
              Public report card — Student ID + DOB
            </p>
          </Link>
        </nav>

        <p className="text-muted text-center text-xs">
          © 2026-2027 Academic Year
        </p>
      </div>
    </main>
  );
}