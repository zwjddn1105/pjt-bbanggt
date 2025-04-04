// 채팅방 목록 응답 타입 (구매자 전용)
export interface ChatRoomBuyerOnlyResponse {
    chatRoomId: number
    name: string
    lastContent: string
    createdAt: string
  }
  
  // 채팅방 목록 페이지네이션 응답 타입
  export interface PageInfoChatRoomBuyerOnlyResponse {
    pageToken: string | null
    data: ChatRoomBuyerOnlyResponse[]
    hasNext: boolean
  }
  
  // 채팅 메시지 응답 타입
  export interface ChatResponse {
    id: number
    senderId: number
    roomId: number
    createdAt: string
    content: string
  }
  
  // 채팅 메시지 페이지네이션 응답 타입
  export interface PageInfoChatResponse {
    pageToken: string | null
    data: ChatResponse[]
    hasNext: boolean
  }
  
  // 채팅 메시지 요청 타입
  export interface ChatRequest {
    content: string
    chatRoomId: number
  }
  
  // 채팅방 생성 요청 타입
  export interface ChatRoomCreateRequest {
    bakeryId: number
  }
  
  // 채팅방 판매자 전용 응답 타입 (필요한 경우)
  export interface ChatRoomSellerOnlyResponse {
    chatRoomId: number
    customerName: string
    createdAt: string
    lastContent: string
    isOwner: boolean
  }
  
  // 채팅방 판매자 전용 페이지네이션 응답 타입 (필요한 경우)
  export interface PageInfoChatRoomSellerOnlyResponse {
    pageToken: string | null
    data: ChatRoomSellerOnlyResponse[]
    hasNext: boolean
  }
  
  