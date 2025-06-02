import { api } from "../lib/api"
import type { ChatRequest, PageInfoChatResponse } from "../types/api-types"

// 채팅 메시지 관련 API 서비스
export const ChatService = {
  // 채팅 메시지 목록 조회
  findAll: async (chatRoomId: number, pageToken?: string): Promise<PageInfoChatResponse> => {
    let url = `/api/v1/chats?chatRoomId=${chatRoomId}`

    if (pageToken) {
      url += `&pageToken=${pageToken}`
    }

    return api.get<PageInfoChatResponse>(url)
  },

  // 채팅 메시지 전송
  create: async (request: ChatRequest): Promise<void> => {
    return api.post("/api/v1/chats", request)
  },
}

