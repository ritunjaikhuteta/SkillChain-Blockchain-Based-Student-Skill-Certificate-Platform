import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "SkillChain — Verified Student Skills & Talent Platform",
  description: "A student skill verification, cryptographic credentials, and talent discovery platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col font-sans bg-[#F8F7F3] text-[#191919]">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
