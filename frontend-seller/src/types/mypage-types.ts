// 사용자 데이터 타입 정의
export interface UserData {
  id: number;
  name: string;
  noticeCheck: boolean;
  tickets: number;
  bakeryName: string;
  business?: boolean; // 아직 백엔드에서 구현되지 않았으므로 옵셔널로 설정
}

// API 응답 타입
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}
