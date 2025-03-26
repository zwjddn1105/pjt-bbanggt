import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import Navbar from "@/components/navbar";

// Noto Sans Korean 폰트 설정 (한글 지원이 우수한 폰트)
const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-kr",
  display: "swap", // 폰트 로딩 중에도 텍스트가 보이도록 설정
});

export const metadata: Metadata = {
  title: "빵긋빵긋",
  description: "빵긋 판매자 웹페이지",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={notoSansKr.variable}>
      <body className={`font-sans bg-gray-50 pt-2`}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
