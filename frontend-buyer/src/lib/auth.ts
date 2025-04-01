"use client"

// 로그인 상태 확인 함수
export function isLoggedIn(): boolean {
  // 브라우저 환경에서만 실행
  if (typeof window === "undefined") return false

  // 쿠키에서 auth_token 확인
  return document.cookie.includes("auth_token=")
}

// 로그아웃 함수
export async function logout(): Promise<void> {
  // 쿠키 삭제
  document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"

  // 페이지 새로고침 (선택적)
  window.location.href = "/"
}

