// 사용자 데이터 타입
export interface UserData {
  id: number;
  name: string;
  noticeCheck: boolean;
  tickets: number;
  bakeryName: string | null;
  business: boolean;
}

// 사업자 인증 데이터 타입
export interface BusinessVerificationData {
  name: string;
  businessNumber: string;
  address: string;
}

// 환불 상태 타입
export type RefundState = "PROCESSING" | "COMPLETED" | "EXPIRED";

// 환불 데이터 타입
export interface RefundItem {
  refundId: number;
  orderId: number;
  vendingMachineName: string;
  customerName: string;
  createdAt: string;
  refundPrice: number;
}

// 환불 API 응답 타입
export interface RefundsResponse {
  pageToken: string;
  data: RefundItem[];
  hasNext: boolean;
}
