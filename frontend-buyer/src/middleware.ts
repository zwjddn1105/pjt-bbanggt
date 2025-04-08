import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// 로그인이 필요하지 않은 공개 경로들
const publicPaths = ["/login", "/auth/kakao"]

export function middleware(request: NextRequest) {
  // 현재 요청 경로
  const path = request.nextUrl.pathname

  console.log("미들웨어 실행:", path) // 디버깅용 로그

  // 공개 경로인지 확인
  const isPublicPath = publicPaths.some((publicPath) => path.startsWith(publicPath) || path === publicPath)

  // API 요청은 건너뛰기 (선택적)
  if (path.startsWith("/api") && !path.startsWith("/api/auth")) {
    return NextResponse.next()
  }

  // auth_token 쿠키 확인
  const authToken = request.cookies.get("auth_token")
  console.log("인증 토큰:", authToken) // 디버깅용 로그

  const isAuthenticated = !!authToken

  // 인증되지 않았고 공개 경로가 아닌 경우 로그인 페이지로 리다이렉트
  if (!isAuthenticated && !isPublicPath) {
    console.log("인증 실패, 리다이렉트") // 디버깅용 로그
    const loginUrl = new URL("/login", request.url)
    // 로그인 후 원래 페이지로 돌아갈 수 있도록 리다이렉트 URL 추가
    loginUrl.searchParams.set("redirect", path)
    return NextResponse.redirect(loginUrl)
  }

  // 이미 인증되었는데 로그인 페이지에 접근하는 경우 홈으로 리다이렉트 (선택적)
  if (isAuthenticated && path === "/login") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

// 미들웨어가 실행될 경로 지정
export const config = {
  matcher: [
    /*
     * 미들웨어를 적용할 경로 패턴을 지정합니다.
     * '/((?!_next/static|_next/image|favicon.ico).*)'는 정적 파일을 제외한 모든 경로에 적용합니다.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
