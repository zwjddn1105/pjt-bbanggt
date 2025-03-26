import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "마이페이지 - 빵긋",
  description: "빵긋 마이페이지에서 회원 정보와 주문 내역을 확인하세요",
}

export default function MyPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="bg-white min-h-screen">{children}</div>
}

