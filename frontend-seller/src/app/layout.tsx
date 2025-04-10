import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import Navbar from "../components/navbar";
import { ThemeProvider } from "../components/theme-provider";
import ClientWrapper from "../components/client-wrapper";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-kr",
  display: "swap",
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
    <html lang="ko" className={notoSansKr.variable} suppressHydrationWarning>
      <body className="font-sans bg-gray-50 pt-2 dark:bg-gray-900 dark:text-white transition-colors duration-200">
        <ThemeProvider>
          <ClientWrapper>
            <Navbar />
            <main>{children}</main>
          </ClientWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
