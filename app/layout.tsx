import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TestSessionProvider } from "@/components/test-session-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "특급꿀벌 | 내 성향에 딱 맞는 군 직무 찾기",
  description: "가볍게 탐색하는 성향 기반 군 직무 추천 서비스, 특급꿀벌",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col"><TestSessionProvider>{children}</TestSessionProvider></body>
    </html>
  );
}
