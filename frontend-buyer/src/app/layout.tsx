import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import BottomNavTab from "@/components/bottom-navtab"
import { AuthProvider } from "@/context/auth-context"

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
      <body className="pb-16 hide-scrollbar overflow-auto">
        <AuthProvider>
          {children}
          <BottomNavTab/>
        </AuthProvider>
      </body>
    </html>
  )
}

