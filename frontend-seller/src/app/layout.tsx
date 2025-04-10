import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Noto_Sans_KR } from "next/font/google"
import Navbar from "../components/navbar"
import { LoadingProvider } from "../components/loading-provider"
import { ErrorBoundary } from "../components/error-boundary"
import { ThemeProvider } from "../components/theme-provider"
import { Suspense } from "react"

// Noto Sans Korean 폰트 설정 (한글 지원이 우수한 폰트)
const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-kr",
  display: "swap", // 폰트 로딩 중에도 텍스트가 보이도록 설정
})

export const metadata: Metadata = {
  title: "빵긋빵긋",
  description: "빵긋 판매자 웹페이지",
}

// 로딩 폴백 컴포넌트
function LoadingFallback() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/90 z-50">
      <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
      <p className="mt-4 text-orange-500">페이지 로딩 중...</p>
    </div>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className={notoSansKr.variable}>
      <body className={`font-sans bg-gray-50 pt-2`}>
        <ThemeProvider>
          <ErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              <LoadingProvider>
                <Navbar />
                <main>{children}</main>
              </LoadingProvider>
            </Suspense>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  )
}
