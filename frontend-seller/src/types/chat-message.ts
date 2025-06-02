// 채팅 메시지 타입
export interface ChatMessage {
  id: number;
  senderId: number;
  roomId: number;
  createdAt: string;
  content: string;
}

// 채팅 메시지 응답 타입
export interface ChatMessagesResponse {
  pageToken: string | null;
  data: ChatMessage[];
  hasNext: boolean;
}

// 채팅 메시지 전송 요청 타입
export interface SendMessageRequest {
  content: string;
  chatRoomId: number;
}
