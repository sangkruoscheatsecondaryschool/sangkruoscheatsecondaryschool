import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { LoginForm } from "./login-form";
import { connection } from "next/server";

export const instant = false;

export const metadata = { title: "ចូលប្រើប្រាស់" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {

  await connection();

  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  const { next } = await searchParams;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="font-moul text-xl">ចូលប្រើប្រាស់</h1>
        <p className="text-muted mt-1 text-xs">Staff Login</p>
      </div>

      <LoginForm next={next} />

      <Link
        href="/"
        className="text-brand-700 block text-center text-sm underline-offset-4 hover:underline"
      >
        ត្រឡប់ទៅទំព័រដើម
      </Link>
    </div>
  );
}