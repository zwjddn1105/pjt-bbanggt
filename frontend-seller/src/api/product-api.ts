import axios from "axios";
import type { Product } from "../types/products";

// 쿠키에서 auth_token 가져오는 함수
const getAuthToken = (): string | null => {
  if (typeof document === "undefined") return null; // 서버 사이드에서는 실행하지 않음

  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "auth_token") {
      return value;
    }
  }
  return null;
};

// 내 상품 재고 목록 가져오기 함수
export const fetchMyStocks = async (): Promise<Product[]> => {
  const authToken = getAuthToken();

  if (!authToken) {
    throw new Error("인증 토큰이 없습니다. 로그인이 필요합니다.");
  }

  try {
    const response = await axios.get<Product[]>(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/order/myStocks`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("상품 재고 목록을 가져오는 중 오류가 발생했습니다:", error);
    throw error;
  }
};
