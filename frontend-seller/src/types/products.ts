// 상품 상태 타입
export type ProductState = "AVAILABLE" | "SOLD" | "EXPIRED" | "DELETED";

// 상품 정보 타입
export interface Product {
  id: number;
  memo: string; // 빵긋 위치 정보
  count: number; // 등록된 수량
  productState: ProductState;
}

// API 응답 타입
export interface ProductsResponse {
  data: Product[];
  pageToken?: string;
  hasNext?: boolean;
}

// 상품 필터 타입
export type ProductFilter = "전체" | "재고있음" | "품절";
