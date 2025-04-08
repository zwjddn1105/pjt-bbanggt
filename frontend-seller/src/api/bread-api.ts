import axios from "axios";
import type {
  BreadAnalysisResult,
  BreadValidationResult,
} from "../types/bread";

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

// 빵 이미지 분석 API
export const analyzeBreadImage = async (
  imageFile: File
): Promise<BreadAnalysisResult> => {
  const authToken = getAuthToken();

  if (!authToken) {
    throw new Error("인증 토큰이 없습니다. 로그인이 필요합니다.");
  }

  try {
    const formData = new FormData();
    formData.append("multipartFile", imageFile); // "image"에서 "multipartFile"로 변경

    const response = await axios.post<BreadAnalysisResult>(
      `${process.env.NEXT_PUBLIC_BASE_URL}/ai`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("빵 이미지 분석 중 오류가 발생했습니다:", error);
    throw error;
  }
};

// 빵 등록 가능 여부 확인 API
export const validateBreadType = async (
  imageFile: File
): Promise<BreadValidationResult> => {
  const authToken = getAuthToken();

  if (!authToken) {
    throw new Error("인증 토큰이 없습니다. 로그인이 필요합니다.");
  }

  try {
    const formData = new FormData();
    formData.append("multipartFile", imageFile); // "image"에서 "multipartFile"로 변경

    const response = await axios.post<BreadValidationResult>(
      `${process.env.NEXT_PUBLIC_BASE_URL}/ai/2`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("빵 등록 가능 여부 확인 중 오류가 발생했습니다:", error);
    throw error;
  }
};
