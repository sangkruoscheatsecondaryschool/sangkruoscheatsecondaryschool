import Link from "next/link";
import { redirect } from "next/navigation";
import { School } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { LoginForm } from "./login-form";
import { t } from "@/lib/i18n";

export const instant = false;
export const metadata = { title: t("auth.login") };

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <div className="min-h-dvh grid md:grid-cols-2">
      {/* Left Branding side (Hidden on mobile) */}
      <div className="hidden md:flex flex-col justify-between bg-primary-900 p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20"></div>
        <div className="relative z-10 flex items-center gap-3">
          <School className="h-8 w-8" />
          <span className="font-moul text-2xl">ប្រព័ន្ធគ្រប់គ្រងសាលា</span>
        </div>
        <div className="relative z-10">
          <h2 className="font-moul text-4xl leading-tight mb-4">
            សូមស្វាគមន៍មកកាន់<br />ផ្ទាំងគ្រប់គ្រង
          </h2>
          <p className="text-primary-100 max-w-md">
            សូមចូលប្រើប្រាស់ដើម្បីគ្រប់គ្រងទិន្នន័យសិស្ស បញ្ចូលពិន្ទុ និងបង្កើតរបាយការណ៍
          </p>
        </div>
        <div className="relative z-10 text-sm text-primary-200">
          © 2026-2027 Academic Year
        </div>
      </div>

      {/* Right Form side */}
      <div className="flex flex-col justify-center p-8 md:p-12 bg-white">
        <div className="mx-auto w-full max-w-sm space-y-8">
          <div className="text-center md:text-left">
            <h1 className="font-moul text-2xl">{t("auth.login")}</h1>
            <p className="text-slate-500 mt-2 text-sm">សូមបញ្ចូលអ៊ីមែល និងលេខសម្ងាត់របស់អ្នក</p>
          </div>

          <LoginForm />

          <div className="text-center">
            <Link href="/" className="text-sm text-primary-600 hover:text-primary-700 hover:underline">
              {t("auth.backToHome")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}