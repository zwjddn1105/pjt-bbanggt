import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // URL에서 인증 코드 추출
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      console.error("인증 코드가 없습니다.");
      // 인증 코드가 없으면 에러 페이지나 홈으로 리다��렉트
      return NextResponse.redirect(new URL("/", request.url));
    }

    // 백엔드 API로 인증 코드 전송
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const response = await fetch(`${baseUrl}/api/v1/auth/login/kakao`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      throw new Error("백엔드 API 요청 실패");
    }

    // 응답 데이터 처리
    const data = await response.json();

    // 로그인 성공 시 쿠키나 로컬 스토리지에 토큰 저장 (예시)
    // 실제 구현은 백엔드 응답에 따라 달라질 수 있음
    const redirectUrl = new URL("/", request.url);
    const nextResponse = NextResponse.redirect(redirectUrl);

    // 백엔드에서 토큰을 제공한다면 쿠키에 저장
    if (data.accessToken) {
      nextResponse.cookies.set("auth_token", data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1주일
        path: "/",
      });
    }

    return nextResponse;
  } catch (error) {
    console.error("카카오 로그인 처리 중 오류 발생:", error);
    // 오류 발생 시 홈페이지로 리다이렉트
    return NextResponse.redirect(new URL("/", request.url));
  }
}
