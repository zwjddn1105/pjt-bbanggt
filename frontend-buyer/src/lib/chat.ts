import type { PageInfoChatResponse, PageInfoChatRoomBuyerOnlyResponse } from "../types/chat"

// 환경 변수에서 API URL 가져오기
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://43.203.248.254:8082"

// 인증 토큰을 가져오는 함수 (로컬 스토리지에서)
const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("access_token")
  }
  return null
}

// API 요청 헤더 생성
const createHeaders = (): HeadersInit => {
  const token = getAuthToken()
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  return headers
}

// 채팅방 목록 조회 (구매자 전용)
export const fetchChatRooms = async (pageToken?: string | null): Promise<PageInfoChatRoomBuyerOnlyResponse> => {
  try {
    const params = new URLSearchParams()
    if (pageToken) {
      params.append("pageToken", pageToken)
    }

    const response = await fetch(
      `${API_BASE_URL}/api/v1/chat-rooms/buyer${params.toString() ? `?${params.toString()}` : ""}`,
      {
        method: "GET",
        headers: createHeaders(),
      },
    )

    if (!response.ok) {
      throw new Error("채팅방 목록 조회에 실패했습니다.")
    }

    return await response.json()
  } catch (error) {
    // console.error("채팅방 목록 조회 오류:", error)
    throw error
  }
}

// 채팅 메시지 조회
export const fetchChatMessages = async (
  chatRoomId: number,
  pageToken?: string | null,
): Promise<PageInfoChatResponse> => {
  try {
    const params = new URLSearchParams()
    params.append("chatRoomId", chatRoomId.toString())
    if (pageToken) {
      params.append("pageToken", pageToken)
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/chats?${params.toString()}`, {
      method: "GET",
      headers: createHeaders(),
    })

    if (!response.ok) {
      throw new Error("채팅 메시지 조회에 실패했습니다.")
    }

    return await response.json()
  } catch (error) {
    // console.error("채팅 메시지 조회 오류:", error)
    throw error
  }
}

// 채팅 메시지 전송
export const sendChatMessage = async (chatRoomId: number, content: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/chats`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify({
        chatRoomId,
        content,
      }),
    })

    if (!response.ok) {
      throw new Error("채팅 메시지 전송에 실패했습니다.")
    }
  } catch (error) {
    // console.error("채팅 메시지 전송 오류:", error)
    throw error
  }
}

// 채팅방 생성
export const createChatRoom = async (bakeryId: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/chat-rooms`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify({
        bakeryId,
      }),
    })

    if (!response.ok) {
      throw new Error("채팅방 생성에 실패했습니다.")
    }
  } catch (error) {
    // console.error("채팅방 생성 오류:", error)
    throw error
  }
}

