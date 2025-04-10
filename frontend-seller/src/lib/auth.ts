"use client";

import axios from "axios";

// 로그인 상태 확인 함수
export function isLoggedIn(): boolean {
  // 브라우저 환경에서만 실행
  if (typeof window === "undefined") return false;

  // 쿠키에서 auth_token 확인
  return document.cookie.includes("auth_token=");
}

// 쿠키에서 토큰 값 가져오기
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;

  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "auth_token") {
      return value;
    }
  }
  return null;
}

// 로그아웃 함수
export async function logout(): Promise<void> {
  try {
    const authToken = getAuthToken();
    console.log(authToken);
    if (!authToken) {
      console.error("토큰이 없습니다.");
      return;
    }
    document.cookie =
      "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
    console.log("aaaaaaaaaaaaaaaaa");
    console.log(baseUrl);
    // API 로그아웃 요청
    // withCredentials: true를 설정하면 쿠키가 자동으로 요청에 포함됨
    // 이렇게 하면 refresh-token 쿠키도 자동으로 요청에 포함됨
    await axios.post(
      `${baseUrl}/api/v1/auth/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${authToken}`, // accessToken을 Authorization 헤더에 포함
        },
        withCredentials: true, // 중요: 쿠키를 요청에 포함시킴
      }
    );
    console.log("bbbbbbbbbbbbbbbbbbbbbbb");
    // 성공적으로 로그아웃 API 호출 후 쿠키 삭제

    document.cookie =
      "refresh-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    console.log("로그아웃 완료");
  } catch (error) {
    console.error("로그아웃 중 오류 발생:", error);
  }
}
