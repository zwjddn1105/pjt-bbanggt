"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/context/auth-context"

/**
 * 보호된 라우트 컴포넌트
 *
 * @remarks
 * 이 컴포넌트는 현재 개발 중이므로 비활성화되어 있습니다.
 * 실제 구현 시 주석을 해제하고 사용하세요.
 *
 * 사용 예시:
 * ```tsx
 * export default function SomePage() {
 *   return (
 *     <ProtectedRoute>
 *       <YourPageContent />
 *     </ProtectedRoute>
 *   )
 * }
 * ```
 */
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // 개발 중에는 접근 제한을 적용하지 않음
    // 실제 구현 시 아래 주석을 해제하세요
    /*
    if (!isLoading && !user && pathname !== '/login') {
      router.push('/login')
    }
    */
  }, [user, isLoading, router, pathname])

  // 로딩 중일 때 표시할 내용
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">로딩 중...</div>
  }

  // 개발 중에는 항상 children을 렌더링
  return <>{children}</>

  // 실제 구현 시 아래 주석을 해제하세요
  /*
  // 로그인 페이지는 항상 접근 가능
  if (pathname === '/login') {
    return <>{children}</>
  }

  // 로그인하지 않은 경우 null 반환 (useEffect에서 리다이렉트 처리)
  if (!user) {
    return null
  }

  // 로그인한 경우 children 렌더링
  return <>{children}</>
  */
}

