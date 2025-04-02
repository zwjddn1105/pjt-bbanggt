import axios from "axios";
import type { VendingMachine, VendingMachineApiResponse } from "../types/map";

// 환경 변수에서 BASE_URL 가져오기
const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1`;

// 쿠키에서 auth_token 가져오기
const getAuthToken = (): string | null => {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "auth_token") {
      return value;
    }
  }
  return null;
};

// 빵긋 자판기 조회 API
export const fetchVendingMachines = async (
  latitude: number,
  longitude: number,
  distance = 5
): Promise<VendingMachine[]> => {
  try {
    const authToken = getAuthToken();

    const response = await axios.get<VendingMachineApiResponse[]>(
      `${BASE_URL}/vending-machines`,
      {
        params: {
          latitude,
          longitude,
          distance,
        },
        headers: {
          Authorization: authToken ? `Bearer ${authToken}` : "",
        },
      }
    );

    // API 응답을 VendingMachine 타입으로 변환
    return response.data.map((item) => ({
      id: item.id,
      name: item.name || "",
      address: item.address || "",
      latitude: item.latitude,
      longitude: item.longitude,
      distance: item.distance?.toString() || "",
      category: item.category || "",
      rating: item.rating || 0,
    }));
  } catch (error) {
    console.error("빵긋 자판기 조회 실패:", error);
    throw error;
  }
};
