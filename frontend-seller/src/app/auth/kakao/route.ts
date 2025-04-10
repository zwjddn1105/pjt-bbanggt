import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: Request) {
  try {
    // URL에서 인증 코드 추출
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      console.error("인증 코드가 없습니다.");
      // 인증 코드가 없으면 에러 페이지나 홈으로 리다이렉트
      return NextResponse.redirect(new URL("/", request.url));
    }

    // 백엔드 API로 인증 코드 전송
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    console.log("API 요청 시작:", `${baseUrl}/api/v1/auth/login/kakao`);

    // axios를 사용하여 API 요청
    const response = await axios.post(
      `${baseUrl}/api/v1/auth/login/kakao`,
      { code, environment: "WEB" },
      {
        headers: { "Content-Type": "application/json" },
        // 쿠키 헤더를 받기 위한 설정
        withCredentials: true,
      }
    );

    console.log("API 응답 상태:", response.status);
    console.log("API 응답 데이터:", response.data);

    // 응답 데이터에서 accessToken 가져오기
    const accessToken = response.data.accessToken;

    // 응답 데이터에서 userId 가져오기 (추가된 부분)
    const userId = response.data.userId;

    // 응답 헤더에서 refresh-token 쿠키 가져오기
    const setCookieHeader = response.headers["set-cookie"];
    console.log("Set-Cookie 헤더:", setCookieHeader);

    // refresh-token 쿠키 파싱
    let refreshToken = null;
    if (setCookieHeader && Array.isArray(setCookieHeader)) {
      // set-cookie 헤더가 배열로 반환될 수 있음
      for (const cookie of setCookieHeader) {
        if (cookie.includes("refresh-token=")) {
          const match = cookie.match(/refresh-token=([^;]+)/);
          if (match) {
            refreshToken = match[1];
            console.log("추출된 refresh-token:", refreshToken);
            break;
          }
        }
      }
    }

    // 리다이렉트 응답 생성
    const redirectUrl = new URL("/mypage", request.url);
    const nextResponse = NextResponse.redirect(redirectUrl);

    // accessToken을 쿠키에 저장
    if (accessToken) {
      // console.log(
      //   "accessToken 쿠키 설정:",
      //   accessToken.substring(0, 10) + "..."
      // );
      nextResponse.cookies.set("auth_token", accessToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1주일
        path: "/",
      });
    } else {
      // console.error("accessToken이 응답에 없습니다.");
    }

    // userId를 쿠키에 저장 (추가된 부분)
    if (userId) {
      // console.log("userId 쿠키 설정:", userId);
      nextResponse.cookies.set("userId", userId.toString(), {
        httpOnly: false, // 자바스크립트에서 접근 가능하도록
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1주일
        path: "/",
      });
    } else {
      // console.error("userId가 응답에 없습니다.");
    }

    // refresh-token도 필요하다면 저장
    if (refreshToken) {
      // console.log(
      //   "refresh-token 쿠키 설정:",
      //   refreshToken.substring(0, 10) + "..."
      // );
      nextResponse.cookies.set("refresh-token", refreshToken, {
        httpOnly: true, // 보안을 위해 httpOnly 설정
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1주일
        path: "/",
      });
    } else {
      // console.log("refresh-token을 응답 헤더에서 찾지 못했습니다.");
    }

    return nextResponse;
  } catch (error) {
    // console.error("카카오 로그인 처리 중 오류 발생:", error);

    // 오류 세부 정보 출력
    if (axios.isAxiosError(error)) {
      // console.error("API 오류 상세:", {
      //   status: error.response?.status,
      //   data: error.response?.data,
      //   message: error.message,
      // });
    }

    // 오류 발생 시 홈페이지로 리다이렉트
    return NextResponse.redirect(new URL("/", request.url));
  }
}
