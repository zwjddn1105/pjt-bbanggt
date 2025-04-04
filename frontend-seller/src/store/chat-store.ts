import { create } from "zustand";
import { fetchChatRooms, fetchNextChatRooms } from "../api/chatRooms";
import type {
  ChatRoom,
  ChatRoomsPageResponse,
  ChatFilter,
} from "../types/chat";

interface ChatState {
  // 채팅방 목록 상태
  chatRooms: ChatRoom[];
  setChatRooms: (chatRooms: ChatRoom[]) => void;

  // 현재 응답 데이터 (페이지네이션 정보 포함)
  currentResponse: ChatRoomsPageResponse | null;
  setCurrentResponse: (response: ChatRoomsPageResponse | null) => void;

  // 로딩 상태
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;

  // 에러 상태
  error: string | null;
  setError: (error: string | null) => void;

  // 선택된 채팅방 상태
  selectedChatRoom: ChatRoom | null;
  setSelectedChatRoom: (chatRoom: ChatRoom | null) => void;

  // 데이터 로드 액션
  loadChatRooms: () => Promise<void>;
  loadNextPage: () => Promise<void>;
  loadSpecificPage: (page: number) => Promise<void>; // 특정 페이지 로드 함수 추가

  // 필터 상태
  filterStatus: ChatFilter;
  setFilterStatus: (status: ChatFilter) => void;

  // 필터링된 채팅방 목록 가져오기
  getFilteredChatRooms: () => ChatRoom[];

  // 현재 페이지 번호
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  // 초기 상태
  chatRooms: [],
  setChatRooms: (chatRooms) => set({ chatRooms }),

  currentResponse: null,
  setCurrentResponse: (response) => set({ currentResponse: response }),

  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),

  error: null,
  setError: (error) => set({ error }),

  selectedChatRoom: null,
  setSelectedChatRoom: (chatRoom) => set({ selectedChatRoom: chatRoom }),

  filterStatus: "전체",
  setFilterStatus: (status) => set({ filterStatus: status }),

  currentPage: 0,
  setCurrentPage: (page) => set({ currentPage: page }),

  // 필터링된 채팅방 목록 가져오기
  getFilteredChatRooms: () => {
    const { chatRooms, filterStatus } = get();

    if (filterStatus === "전체") {
      return chatRooms;
    } else if (filterStatus === "답장함") {
      return chatRooms.filter((room) => room.isOwner);
    } else {
      return chatRooms.filter((room) => !room.isOwner);
    }
  },

  // 채팅방 목록 로드 액션
  loadChatRooms: async () => {
    const {
      setIsLoading,
      setError,
      setChatRooms,
      setCurrentResponse,
      setCurrentPage,
    } = get();

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetchChatRooms(0); // 첫 페이지 로드
      setChatRooms(response.content);
      setCurrentResponse(response);
      setCurrentPage(0);
    } catch (error) {
      console.error("채팅방 목록을 불러오는 중 오류가 발생했습니다:", error);
      setError(
        error instanceof Error
          ? error.message
          : "채팅방 목록을 불러오는 중 오류가 발생했습니다"
      );
    } finally {
      setIsLoading(false);
    }
  },

  // 다음 페이지 로드 액션
  loadNextPage: async () => {
    const {
      currentPage,
      currentResponse,
      setIsLoading,
      setError,
      setChatRooms,
      setCurrentResponse,
      chatRooms,
      setCurrentPage,
    } = get();

    if (!currentResponse || currentResponse.last) return;

    try {
      setIsLoading(true);
      setError(null);

      const nextResponse = await fetchNextChatRooms(currentPage);

      if (nextResponse) {
        // 기존 채팅방 목록에 새로운 데이터 추가
        setChatRooms([...chatRooms, ...nextResponse.content]);
        setCurrentResponse(nextResponse);
        setCurrentPage(currentPage + 1);
      }
    } catch (error) {
      console.error("다음 페이지를 불러오는 중 오류가 발생했습니다:", error);
      setError(
        error instanceof Error
          ? error.message
          : "다음 페이지를 불러오는 중 오류가 발생했습니다"
      );
    } finally {
      setIsLoading(false);
    }
  },

  // 특정 페이지 로드 액션 추가
  loadSpecificPage: async (page) => {
    const {
      setIsLoading,
      setError,
      setChatRooms,
      setCurrentResponse,
      setCurrentPage,
    } = get();

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetchChatRooms(page);
      setChatRooms(response.content);
      setCurrentResponse(response);
      setCurrentPage(page);
    } catch (error) {
      console.error(`${page} 페이지를 불러오는 중 오류가 발생했습니다:`, error);
      setError(
        error instanceof Error
          ? error.message
          : `${page} 페이지를 불러오는 중 오류가 발생했습니다`
      );
    } finally {
      setIsLoading(false);
    }
  },
}));
