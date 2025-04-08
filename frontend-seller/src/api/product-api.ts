import axios from "axios";
import type { ProductsResponse, FetchProductsParams } from "../types/products";

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
export const fetchMyStocks = async (
  params: FetchProductsParams = {}
): Promise<ProductsResponse> => {
  const authToken = getAuthToken();

  if (!authToken) {
    throw new Error("인증 토큰이 없습니다. 로그인이 필요합니다.");
  }

  try {
    const response = await axios.get<ProductsResponse>(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/order/myStocks`,
      {
        params,
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

// 내 판매 완료 상품 목록 가져오기 함수
export const fetchMySoldout = async (
  params: FetchProductsParams = {}
): Promise<ProductsResponse> => {
  const authToken = getAuthToken();

  if (!authToken) {
    throw new Error("인증 토큰이 없습니다. 로그인이 필요합니다.");
  }

  try {
    const response = await axios.get<ProductsResponse>(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/order/mySoldout`,
      {
        params,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "판매 완료 상품 목록을 가져오는 중 오류가 발생했습니다:",
      error
    );
    throw error;
  }
};

// 다음 페이지 상품 목록 가져오기 함수
export const fetchNextProducts = async (
  type: "stocks" | "soldout",
  currentPage: number
): Promise<ProductsResponse> => {
  return type === "stocks"
    ? fetchMyStocks({ page: currentPage + 1 })
    : fetchMySoldout({ page: currentPage + 1 });
};

// 특정 페이지 상품 목록 가져오기 함수 - 페이지 번호 방식 지원
export const fetchSpecificPage = async (
  type: "stocks" | "soldout",
  page: number
): Promise<ProductsResponse> => {
  return type === "stocks" ? fetchMyStocks({ page }) : fetchMySoldout({ page });
};

// 상품 상세 정보 타입 정의
interface ProductDetail {
  id: number;
  memo: string;
  count: number;
  productState: string;
  price: number;
  discount: number;
  breadType: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

// 상품 상세 정보 조회 함수
export const fetchProductDetail = async (
  productId: number
): Promise<ProductDetail> => {
  const authToken = getAuthToken();

  if (!authToken) {
    throw new Error("인증 토큰이 없습니다. 로그인이 필요합니다.");
  }

  try {
    const response = await axios.get<ProductDetail>(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/order/${productId}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("상품 상세 정보를 가져오는 중 오류가 발생했습니다:", error);
    throw error;
  }
};

// 새로운 상품 등록 API 함수 (spaceId 사용)
export const createOrder = async (productData: {
  spaceId: number;
  productName: string;
  originalPrice: number;
  discountRate: number;
  finalPrice: number;
  quantity: number;
  breadType: string; // BreadType에서 string으로 변경
  image: string | File;
}): Promise<void> => {
  const authToken = getAuthToken();

  if (!authToken) {
    throw new Error("인증 토큰이 없습니다. 로그인이 필요합니다.");
  }

  try {
    // FormData 생성
    const formData = new FormData();

    // 주문 요청 데이터 생성 - 중첩 구조 제거
    const orderRequests = [
      {
        price: productData.originalPrice,
        count: productData.quantity,
        discount: productData.discountRate,
        breadType: productData.breadType,
      },
    ];

    // JSON 데이터를 Blob으로 변환하여 FormData에 추가
    const orderRequestsBlob = new Blob([JSON.stringify(orderRequests)], {
      type: "application/json",
    });
    // "orderRequests"로 키 이름 변경
    formData.append("orderRequests", orderRequestsBlob);

    // 이미지 추가
    if (typeof productData.image === "string") {
      // Base64 문자열을 Blob으로 변환
      const imageBlob = await fetch(productData.image).then((r) => r.blob());
      formData.append("image", imageBlob, "product-image.jpg");
    } else {
      formData.append("image", productData.image);
    }

    // API 호출 시 디버깅 정보 추가
    console.log(
      "요청 URL:",
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/order/createOrder/${productData.spaceId}`
    );
    console.log("spaceId:", productData.spaceId);
    console.log("orderRequests:", orderRequests);
    console.log(
      "formData 내용:",
      Array.from(formData.entries()).map((entry) => {
        if (entry[1] instanceof Blob) {
          return [entry[0], `Blob (${entry[1].size} bytes)`];
        }
        return entry;
      })
    );

    // API 호출
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/order/createOrder/${productData.spaceId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("상품 등록 성공", response.data);
  } catch (error) {
    console.error("상품 등록 중 오류가 발생했습니다:", error);
    if (axios.isAxiosError(error) && error.response) {
      console.error("응답 상태:", error.response.status);
      console.error("응답 데이터:", error.response.data);

      // 특정 오류 메시지 처리
      if (error.response.status === 404) {
        throw new Error(
          "API 엔드포인트를 찾을 수 없습니다. URL을 확인해주세요."
        );
      } else if (error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
    }
    throw error;
  }
};
