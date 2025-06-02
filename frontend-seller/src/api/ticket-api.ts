import axios from "axios";
import { getTokenFromCookie } from "./mypage-api";

// 티켓 구매 API
export const purchaseTickets = async (count: number): Promise<void> => {
  const token = getTokenFromCookie();

  if (!token) {
    throw new Error("인증 토큰이 없습니다.");
  }

  await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/users/purchaseTickets`,
    { count },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
