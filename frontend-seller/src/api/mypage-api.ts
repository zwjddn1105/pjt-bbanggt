import axios from "axios";
import type { UserData } from "../types/mypage-types";

// 쿠키에서 토큰 가져오기
const getTokenFromCookie = (): string | null => {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith("auth_token=")) {
      return cookie.substring("auth_token=".length, cookie.length);
    }
  }
  return null;
};

// 사용자 데이터 가져오기
export const fetchUserData = async (): Promise<UserData> => {
  // 쿠키에서 토큰 가져오기
  const token = getTokenFromCookie();

  if (!token) {
    throw new Error("인증 토큰이 없습니다.");
  }

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/users/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  // 응답 데이터에 business 필드가 없으면 기본값으로 false 설정
  const data = {
    ...response.data,
    business: response.data.business ?? false,
  };

  return data;
};
