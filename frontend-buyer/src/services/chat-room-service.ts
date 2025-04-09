import { api } from "../lib/api"
import type { ChatRoomCreateRequest, PageInfoChatRoomBuyerOnlyResponse } from "../types/api-types"

// 채팅방 관련 API 서비스 (구매자 관점)
export const ChatRoomService = {
  // 채팅방 생성
  create: async (request: ChatRoomCreateRequest): Promise<void> => {
    return api.post("/api/v1/chat-rooms", request)
  },

  // 구매자 관점의 채팅방 목록 조회
  findAllBuyerOnly: async (pageToken?: string): Promise<PageInfoChatRoomBuyerOnlyResponse> => {
    let url = "/api/v1/chat-rooms/buyer"

    if (pageToken) {
      url += `?pageToken=${pageToken}`
    }

    return api.get<PageInfoChatRoomBuyerOnlyResponse>(url)
  },
}

