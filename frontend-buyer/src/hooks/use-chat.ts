"use client"

import { useState, useCallback, useEffect } from "react"
import { ChatService } from "@/services"
import type { ChatRequest, ChatResponse } from "@/types/api-types"

export const useChat = (chatRoomId: number) => {
  const [messages, setMessages] = useState<ChatResponse[]>([])
  const [pageToken, setPageToken] = useState<string | undefined>(undefined)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // 채팅 메시지 목록 조회
  const fetchMessages = useCallback(
    async (reset = false) => {
      if (!chatRoomId || (isLoading && !reset)) return

      try {
        setIsLoading(true)
        setError(null)

        // 초기화 요청이면 pageToken 초기화
        const token = reset ? undefined : pageToken

        const response = await ChatService.findAll(chatRoomId, token)

        setMessages((prev) => (reset ? response.data : [...prev, ...response.data]))
        setPageToken(response.pageToken)
        setHasMore(response.hasNext)

        return response.data
      } catch (err: any) {
        setError(err.message || "채팅 메시지를 불러오는 중 오류가 발생했습니다.")
        return []
      } finally {
        setIsLoading(false)
      }
    },
    [chatRoomId, pageToken, isLoading],
  )

  // 채팅 메시지 전송
  const sendMessage = useCallback(
    async (content: string) => {
      if (!chatRoomId || !content.trim()) return null

      try {
        setError(null)

        const request: ChatRequest = {
          chatRoomId,
          content,
        }

        await ChatService.create(request)

        // 메시지 전송 후 최신 메시지 목록 다시 조회
        await fetchMessages(true)

        return true
      } catch (err: any) {
        setError(err.message || "메시지 전송 중 오류가 발생했습니다.")
        return false
      }
    },
    [chatRoomId, fetchMessages],
  )

  // 컴포넌트 마운트 시 메시지 목록 조회
  useEffect(() => {
    if (chatRoomId) {
      fetchMessages(true)
    }
  }, [chatRoomId])

  return {
    messages,
    hasMore,
    isLoading,
    error,
    fetchMessages,
    sendMessage,
    loadMore: fetchMessages,
  }
}

