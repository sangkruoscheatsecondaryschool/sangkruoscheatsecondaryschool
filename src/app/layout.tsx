import type { Metadata, Viewport } from "next";
import { Moul, Kantumruy_Pro, Inter } from "next/font/google";
import { PwaRegister } from "@/components/pwa-register";
import "./globals.css";

const moul = Moul({ subsets: ["khmer"], weight: "400", variable: "--font-moul", display: "swap" });
const kantumruy = Kantumruy_Pro({ subsets: ["khmer", "latin"], weight: ["400", "500", "600", "700"], variable: "--font-kantumruy", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: { default: "ប្រព័ន្ធគ្រប់គ្រងសាលា", template: "%s | ប្រព័ន្ធគ្រប់គ្រងសាលា" },
  description: "ប្រព័ន្ធគ្រប់គ្រងសាលារៀន",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "School" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#2563eb",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="km" className={`${moul.variable} ${kantumruy.variable} ${inter.variable}`}>
      <body className="antialiased">
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}