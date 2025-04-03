// 채팅방 관련 타입 정의
export interface ChatRoom {
  chatRoomId: number;
  customerName: string;
  createdAt: string;
  lastContent: string;
  isOwner: boolean;
}

// 페이징 정보 타입
export interface PageInfo {
  pageNumber: number;
  pageSize: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

// 페이지 응답 타입
export interface ChatRoomsPageResponse {
  content: ChatRoom[];
  pageable: PageInfo;
  totalElements: number;
  totalPages: number;
  last: boolean; // null이 아닌 boolean 타입으로 명확하게 지정
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

// 채팅방 목록 조회 파라미터
export interface FetchChatRoomsParams {
  page?: number;
  size?: number;
}

// 채팅방 필터 타입
export type ChatFilter = "전체" | "답장함" | "답장 안함";
