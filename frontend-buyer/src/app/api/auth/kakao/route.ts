import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    // 요청 본문에서 인증 코드 추출
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json({ message: "인증 코드가 없습니다." }, { status: 400 })
    }

    // 카카오 토큰 API 호출 (클라이언트 시크릿 없이)
    const tokenResponse = await fetch("https://kauth.kakao.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: "816bd85980092eeaa14987da42be1788",
        redirect_uri: "https://j12a209.p.ssafy.io/buyer/auth/kakao",
        code,
        // 클라이언트 시크릿 사용하지 않음
      }),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json()
      // console.error("카카오 토큰 발급 실패:", errorData)
      return NextResponse.json({ message: "카카오 토큰 발급에 실패했습니다." }, { status: 500 })
    }

    // 토큰 응답 파싱
    const tokenData = await tokenResponse.json()
    const { access_token, refresh_token, expires_in } = tokenData

    // 카카오 사용자 정보 API 호출
    const userResponse = await fetch("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    })

    if (!userResponse.ok) {
      // console.error("카카오 사용자 정보 조회 실패")
      return NextResponse.json({ message: "사용자 정보 조회에 실패했습니다." }, { status: 500 })
    }

    // 사용자 정보 파싱
    const userData = await userResponse.json()

    // 쿠키에 리프레시 토큰 저장 (HTTP-only, Secure)
    cookies().set({
      name: "refresh-token",
      value: refresh_token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60, // 30일
      path: "/",
    })

    // 응답 반환
    return NextResponse.json({
      message: "로그인 성공",
      accessToken: access_token, // 카카오 액세스 토큰을 그대로 사용
      user: {
        id: userData.id,
        nickname: userData.properties?.nickname || "사용자",
        email: userData.kakao_account?.email,
      },
    })
  } catch (error) {
    // console.error("카카오 로그인 처리 오류:", error)
    return NextResponse.json({ message: "로그인 처리 중 오류가 발생했습니다." }, { status: 500 })
  }
}

