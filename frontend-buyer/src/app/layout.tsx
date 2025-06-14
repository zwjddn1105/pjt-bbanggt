import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import BottomNavTab from "../components/bottom-navtab"
import { AuthProvider } from "../context/auth-context"
import Script from 'next/script';
export const metadata: Metadata = {
  title: "빵긋 - 빵 주문 앱",
  description: "맛있는 빵을 주문하고 픽업하세요",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className="hide-scrollbar">
      <head>
        {/* PortOne(아임포트) SDK 스크립트 로드 */}
        <Script src="https://cdn.iamport.kr/v1/iamport.js" strategy="beforeInteractive" />
      </head>
      <body className="pb-16 hide-scrollbar overflow-auto">
        <AuthProvider>
          {children}
          <BottomNavTab/>
        </AuthProvider>
      </body>
    </html>
  )
}

