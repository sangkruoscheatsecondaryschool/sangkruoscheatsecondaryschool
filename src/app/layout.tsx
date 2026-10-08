import type { Metadata, Viewport } from "next";
import { Moul, Kantumruy_Pro, Siemreap } from "next/font/google";
import { PwaRegister } from "@/components/pwa-register";
import "./globals.css";

const moul = Moul({
  subsets: ["khmer"],
  weight: "400",
  variable: "--font-moul",
  display: "swap",
});

const kantumruy = Kantumruy_Pro({
  subsets: ["khmer", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-kantumruy",
  display: "swap",
});

const siemreap = Siemreap({
  subsets: ["khmer"],
  weight: "400",
  variable: "--font-siemreap",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "School Management",
    template: "%s | School Management",
  },
  description:
    "School management system for Cambodian high schools — scores, attendance, report cards.",
  applicationName: "School Management",
  formatDetection: { telephone: false },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "School",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#1e40af",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="km"
      className={`${moul.variable} ${kantumruy.variable} ${siemreap.variable}`}
    >
      <body className="font-kantumruy antialiased">
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}