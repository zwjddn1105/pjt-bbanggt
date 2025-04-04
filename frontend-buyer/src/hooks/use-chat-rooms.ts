"use client"

import { useState, useCallback, useEffect } from "react"
import { ChatRoomService } from "@/services"
import type { ChatRoomCreateRequest, ChatRoomBuyerOnlyResponse } from "@/types/api-types"

// 구매자 전용 채팅방 훅
export const useChatRooms = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoomBuyerOnlyResponse[]>([])
  const [pageToken, setPageToken] = useState<string | undefined>(undefined)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // 채팅방 목록 조회 (구매자 관점)
  const fetchChatRooms = useCallback(
    async (reset = false) => {
      try {
        setIsLoading(true)
        setError(null)

        // 초기화 요청이면 pageToken 초기화
        const token = reset ? undefined : pageToken

        const response = await ChatRoomService.findAllBuyerOnly(token)
        setChatRooms((prev) => (reset ? response.data : [...prev, ...response.data]))
        setPageToken(response.pageToken)
        setHasMore(response.hasNext)

        return response.data
      } catch (err: any) {
        setError(err.message || "채팅방 목록을 불러오는 중 오류가 발생했습니다.")
        return []
      } finally {
        setIsLoading(false)
      }
    },
    [pageToken, isLoading],
  )

  // 채팅방 생성
  const createChatRoom = useCallback(
    async (bakeryId: number) => {
      try {
        setError(null)

        const request: ChatRoomCreateRequest = {
          bakeryId,
        }

        await ChatRoomService.create(request)

        // 채팅방 생성 후 목록 다시 조회
        await fetchChatRooms(true)

        return true
      } catch (err: any) {
        setError(err.message || "채팅방 생성 중 오류가 발생했습니다.")
        return false
      }
    },
    [fetchChatRooms],
  )

  // 컴포넌트 마운트 시 채팅방 목록 조회
  useEffect(() => {
    fetchChatRooms(true)
  }, [])

  return {
    chatRooms,
    hasMore,
    isLoading,
    error,
    fetchChatRooms,
    createChatRoom,
    loadMore: fetchChatRooms,
  }
}

