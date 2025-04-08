// 판매자 상품 정보 타입
export interface SellerProduct {
  orderId: number;
  address: string;
  bakeryName: string;
  price: number;
  salePrice: number;
  count: number;
  image: string;
  productState: ProductState;
  breadType: string;
  bakeryId: number;
  vendingMachineId: number;
  latitude: number;
  longitude: number;
  vendingMachineName: string;
  slotNumber: number;
  paymentDate: string;
}

// 상품 상태 타입
export type ProductState =
  | "AVAILABLE"
  | "SOLD"
  | "SOLD_OUT"
  | "EXPIRED"
  | "DELETED";

// 판매자 상품 목록 응답 타입
export type SellerProductsResponse = SellerProduct[];

// 판매자 상품 필터 타입
export type SellerProductFilter = "전체" | "판매중" | "판매완료";
