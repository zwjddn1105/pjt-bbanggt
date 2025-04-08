import axios from "axios";
import type { RefundState, RefundsResponse } from "../types/refund-types";

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

// 환불 목록 조회
export const fetchRefunds = async (
  state: RefundState = "PROCESSING",
  pageToken?: string
): Promise<RefundsResponse> => {
  // 쿠키에서 토큰 가져오기
  const token = getTokenFromCookie();

  if (!token) {
    throw new Error("인증 토큰이 없습니다.");
  }

  // 쿼리 파라미터 구성
  const params = new URLSearchParams();
  params.append("state", state);
  if (pageToken) {
    params.append("pageToken", pageToken);
  }

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/refunds?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// 환불 승인 처리
export const confirmRefund = async (refundId: number): Promise<void> => {
  // 쿠키에서 토큰 가져오기
  const token = getTokenFromCookie();

  if (!token) {
    throw new Error("인증 토큰이 없습니다.");
  }

  await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/refunds/confirm`,
    { refundId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
