import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    // Authorization 헤더에서 액세스 토큰 추출
    const authHeader = request.headers.get("Authorization")

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const accessToken = authHeader.split(" ")[1]

      // 카카오 로그아웃 API 호출
      await fetch("https://kapi.kakao.com/v1/user/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      })
    }

    // 리프레시 토큰 쿠키 삭제
    cookies().delete("refresh-token")

    return NextResponse.json({ message: "로그아웃 성공" })
  } catch (error) {
    // console.error("로그아웃 오류:", error)

    // 오류가 발생해도 쿠키는 삭제
    cookies().delete("refresh-token")

    return NextResponse.json({ message: "로그아웃 처리 중 오류가 발생했습니다." }, { status: 500 })
  }
}

