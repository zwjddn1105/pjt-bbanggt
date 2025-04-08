import axios from "axios";
import type { BusinessVerificationData } from "../types/mypage-types";
import { getTokenFromCookie } from "./mypage-api";

// 사업자 인증 요청
export const verifyBusiness = async (
  data: BusinessVerificationData
): Promise<void> => {
  const token = getTokenFromCookie();

  if (!token) {
    throw new Error("인증 토큰이 없습니다.");
  }

  await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/bakery/createBakery`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
