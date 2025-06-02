// 상품 상세 정보 타입
export interface ProductDetail {
  orderId: number;
  address: string;
  bakeryName: string;
  price: number;
  salePrice: number;
  count: number;
  image: string;
  productState: string;
  breadType: string;
  bakeryId: number;
  vendingMachineId: number;
  latitude: number;
  longitude: number;
  vendingMachineName: string;
  slotNumber: number;
  paymentDate: string | null;
}

// 빵 종류에 따른 한글 이름 매핑
export const breadTypeMap: Record<string, string> = {
  SOBORO: "소보로빵",
  SWEET_RED_BEAN: "단팥빵",
  WHITE_BREAD: "식빵",
  BAGUETTE: "바게트",
  CROISSANT: "크루아상",
  PIZZA_BREAD: "피자빵",
  BAGEL: "베이글",
  GARLIC_BREAD: "마늘빵",
  OTHER: "기타",
};

// 상품 상태에 따른 한글 이름 매핑
export const productStateMap: Record<string, string> = {
  AVAILABLE: "판매중",
  SOLD: "판매됨",
  SOLD_OUT: "판매완료",
  EXPIRED: "기간만료",
  DELETED: "삭제됨",
};

// 상품 상태에 따른 배지 색상 매핑
export const productStateBadgeColorMap: Record<string, string> = {
  AVAILABLE: "bg-green-100 text-green-800",
  SOLD: "bg-blue-100 text-blue-800",
  SOLD_OUT: "bg-red-100 text-red-800",
  EXPIRED: "bg-gray-100 text-gray-800",
  DELETED: "bg-gray-100 text-gray-800",
};
