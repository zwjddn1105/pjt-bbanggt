import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// 로그인이 필요하지 않은 공개 경로들
const publicPaths = ["/login", "/auth/kakao"]

export async function middleware(request: NextRequest) {
  // 현재 요청 경로
  const path = request.nextUrl.pathname

  // 이미지 파일 및 정적 자산 요청은 건너뛰기
  if (
    path.includes("/_next/") ||
    path.includes("/images/") ||
    path.endsWith(".png") ||
    path.endsWith(".jpg") ||
    path.endsWith(".jpeg") ||
    path.endsWith(".svg") ||
    path.endsWith(".gif") ||
    path === "/favicon.ico"
  ) {
    return NextResponse.next()
  }


  console.log("미들웨어 실행:", path)

  // 공개 경로인지 확인
  const isPublicPath = publicPaths.some((publicPath) => path.startsWith(publicPath) || path === publicPath)

  // API 요청은 건너뛰기 (선택적)
  if (path.startsWith("/api") && !path.startsWith("/api/auth")) {
    return NextResponse.next()
  }

  // auth_token 쿠키 확인
  const authToken = request.cookies.get("auth_token")?.value
  console.log("미들웨어 - 인증 토큰:", authToken ? "있음" : "없음")

  let isAuthenticated = false

  if (authToken) {
    try {
      // 토큰 유효성 검증 - 간단한 API 요청으로 확인
      // 사용자 정보 API를 호출하여 토큰이 유효한지 확인
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://43.203.248.254:8082"
      const response = await fetch(`${apiUrl}/api/v1/users/me`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        // 캐시 방지
        cache: "no-store",
      })

      // 응답 상태 코드로 유효성 판단 (200이면 유효, 401/403이면 만료)
      isAuthenticated = response.status === 200
      console.log("미들웨어 - 토큰 검증 결과:", isAuthenticated ? "유효함" : "유효하지 않음")

      // 토큰이 만료되었다면 쿠키 삭제
      if (!isAuthenticated) {
        console.log("미들웨어 - 만료된 토큰 감지, 쿠키 삭제 예정")
      }
    } catch (error) {
      console.error("미들웨어 - 토큰 검증 실패:", error)
      isAuthenticated = false
    }
  }

  // 인증되지 않았고 공개 경로가 아닌 경우 로그인 페이지로 리다이렉트
  if (!isAuthenticated && !isPublicPath) {
    console.log("미들웨어 - 인증 실패, 로그인으로 리다이렉트")
    const loginUrl = new URL("/login", request.url)
    // 로그인 후 원래 페이지로 돌아갈 수 있도록 리다이렉트 URL 추가
    loginUrl.searchParams.set("redirect", path)

    const response = NextResponse.redirect(loginUrl)

    // 만료된 토큰이 있었다면 쿠키 삭제
    if (authToken && !isAuthenticated) {
      response.cookies.delete("auth_token")
    }

    return response
  }

  // 이미 인증되었는데 로그인 페이지에 접근하는 경우 홈으로 리다이렉트 (선택적)
  if (isAuthenticated && path === "/login") {
    console.log("미들웨어 - 이미 인증됨, 홈으로 리다이렉트")
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
