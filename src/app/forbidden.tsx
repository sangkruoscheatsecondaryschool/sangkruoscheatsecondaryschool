import Link from "next/link";

export default function Forbidden() {
  return (
    <div className="bg-bg flex min-h-dvh items-center justify-center p-6">
      <div className="rounded-card border-border bg-surface w-full max-w-sm border p-6 text-center">
        <h1 className="font-moul text-xl">គ្មានសិទ្ធិចូលប្រើប្រាស់</h1>
        <p className="text-muted mt-2 text-sm">
          គណនីរបស់អ្នកមិនមានសិទ្ធិចូលមើលទំព័រនេះទេ។
        </p>
        <Link
          href="/dashboard"
          className="touch-target rounded-btn bg-brand-600 mt-4 inline-flex items-center justify-center px-4 text-sm font-medium text-white active:bg-brand-700"
        >
          ត្រឡប់ទៅផ្ទាំងគ្រប់គ្រង
        </Link>
      </div>
    </div>
  );
}