// 빵 종류 열거형 수정
export enum BreadType {
  SOBORO = "SOBORO",
  SWEET_RED_BEAN = "SWEET_RED_BEAN",
  WHITE_BREAD = "WHITE_BREAD",
  BAGUETTE = "BAGUETTE",
  CROISSANT = "CROISSANT",
  PIZZA_BREAD = "PIZZA_BREAD",
  BAGEL = "BAGEL",
  GARLIC_BREAD = "GARLIC_BREAD",
  OTHER = "OTHER",
}

// 빵 종류 옵션 타입
export interface BreadTypeOption {
  value: BreadType;
  label: string;
}

// AI 분석 결과 타입
export interface BreadAnalysisResult {
  breads: {
    classification: string;
    stock: number;
  }[];
}

// 빵 등록 가능 여부 응답 타입
export interface BreadValidationResult {
  containsBadBread: boolean;
}

// 빵 정보 타입
export interface BreadInfo {
  breadType: BreadType;
  originalPrice: number | "";
  discountRate: number | "";
  finalPrice: number | "";
  quantity: number;
  productName: string;
}
