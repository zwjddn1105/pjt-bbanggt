// 채팅방 관련 타입 정의
export interface ChatRoom {
  chatRoomId: number;
  customerName: string;
  createdAt: string;
  lastContent: string;
  isOwner: boolean;
}

export interface ChatRoomsResponse {
  pageToken: string;
  data: ChatRoom[];
  hasNext: boolean;
}

// 채팅방 목록 조회 파라미터
export interface FetchChatRoomsParams {
  pageToken?: string;
}

// 채팅방 필터 타입
export type ChatFilter = "전체" | "답장함" | "답장 안함";
