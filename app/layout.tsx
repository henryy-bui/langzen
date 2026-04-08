// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LangZen — Learn English & Korean",
  description:
    "Prepare for IELTS, TOEFL, TOPIK with structured lessons and earn certificates.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
