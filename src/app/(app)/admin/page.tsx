import { redirect } from "next/navigation";

export const instant = false;

export const metadata = { title: "គ្រប់គ្រងប្រព័ន្ធ" };

export default function AdminPage() {
  redirect("/dashboard");
}
