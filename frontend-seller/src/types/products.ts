// 상품 상태 타입
export type ProductState = "AVAILABLE" | "SOLD" | "EXPIRED" | "DELETED";

// 상품 정보 타입
export interface Product {
  id: number;
  memo: string; // 빵긋 위치 정보
  count: number; // 등록된 수량
  productState: ProductState;
  vendingMachineId: number; // 벤딩머신 ID 추가
  name?: string; // 벤딩머신 이름 추가
}

// 페이징 정보 타입
export interface PageInfo {
  offset: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  unpaged: boolean;
  paged: boolean;
  pageNumber: number;
  pageSize: number;
}

// 상품 목록 응답 타입
export interface ProductsResponse {
  totalElements: number;
  totalPages: number;
  size: number;
  content: Product[];
  number: number;
  sort: {
    empty: boolean;
    unsorted: boolean;
    sorted: boolean;
  };
  numberOfElements: number;
  pageable: PageInfo;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// 상품 필터 타입
export type ProductFilter = "전체" | "재고있음" | "품절";

// 상품 목록 조회 파라미터
export interface FetchProductsParams {
  page?: number;
  size?: number;
}
