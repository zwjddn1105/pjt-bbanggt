import axios from "axios";
import type {
  VendingMachineDetailResponse,
  VendingMachine,
} from "../types/map";

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

// 빵긋 자판기 목록 조회 함수
export const fetchVendingMachines = async (
  latitude: number,
  longitude: number,
  distance: number
): Promise<VendingMachine[]> => {
  const authToken = getAuthToken();

  if (!authToken) {
    throw new Error("인증 토큰이 없습니다. 로그인이 필요합니다.");
  }

  try {
    const response = await axios.get<VendingMachine[]>(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/vending-machines`,
      {
        params: {
          latitude,
          longitude,
          distance,
        },
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("빵긋 자판기 목록 조회 실패:", error);
    throw error;
  }
};

// 빵긋 자판기 상세 정보 조회 함수
export const fetchVendingMachineDetail = async (
  vendingMachineId: number | string
): Promise<VendingMachineDetailResponse> => {
  const authToken = getAuthToken();

  if (!authToken) {
    throw new Error("인증 토큰이 없습니다. 로그인이 필요합니다.");
  }

  try {
    console.log(
      `자판기 상세 정보 요청: ID=${vendingMachineId}, 타입=${typeof vendingMachineId}`
    );

    const response = await axios.get<VendingMachineDetailResponse>(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/vending-machines/seller/${vendingMachineId}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    console.log("자판기 상세 정보 응답:", response.data);

    // 응답 데이터 유효성 검사 - 필드 이름 변경 반영
    if (!response.data || !response.data.sellerResponseList) {
      throw new Error("자판기 상세 정보가 올바르지 않습니다.");
    }

    return response.data;
  } catch (error) {
    console.error("빵긋 자판기 상세 정보 조회 실패:", error);

    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error("응답 상태:", error.response.status);
        console.error("응답 데이터:", error.response.data);
      }
    }

    throw new Error("자판기 상세 정보를 가져오는 중 오류가 발생했습니다.");
  }
};
