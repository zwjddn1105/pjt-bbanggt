"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { fetchChatMessages, sendChatMessage } from "@/lib/chat"
import type { ChatResponse } from "@/types/chat"

// 메시지 타입 정의
interface ChatMessage {
  id: number
  senderId: number
  roomId: number
  content: string
  createdAt: string
}

interface ChatDetailProps {
  chatRoomId: number
}

export default function ChatDetail({ chatRoomId }: ChatDetailProps) {
  const router = useRouter()
  const [messages, setMessages] = useState<ChatResponse[]>([])
  const [inputText, setInputText] = useState("")
  const [loading, setLoading] = useState(true)
  const [bakeryName, setBakeryName] = useState("")
  const [pageToken, setPageToken] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [userId, setUserId] = useState<number>(0) // 실제 구현에서는 로그인 사용자 ID를 가져와야 함
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // 메시지 목록 가져오기
  const loadMessages = useCallback(
    async (refresh = false) => {
      try {
        if (refresh) {
          setPageToken(null)
        }

        const token = refresh ? null : pageToken
        const response = await fetchChatMessages(chatRoomId, token)

        if (refresh) {
          setMessages(response.data.reverse()) // 최신 메시지가 아래에 오도록 역순 정렬
          // 첫 로딩 시 베이커리 이름 설정 (실제 구현에서는 API에서 가져와야 함)
          if (response.data.length > 0 && !bakeryName) {
            // 여기서는 임시로 "베이커리"라는 이름을 사용
            // 실제로는 API에서 베이커리 정보를 가져와야 함
            setBakeryName("베이커리")
          }
        } else {
          // 이전 메시지는 위에 추가
          setMessages((prev) => [...response.data.reverse(), ...prev])
        }

        setPageToken(response.pageToken)
        setHasMore(response.hasNext)
      } catch (error) {
        console.error("메시지를 불러오는 중 오류가 발생했습니다:", error)
      } finally {
        setLoading(false)
      }
    },
    [chatRoomId, pageToken, bakeryName],
  )

  // 폴링 설정
  useEffect(() => {
    loadMessages(true)

    // 5초마다 새 메시지 확인
    const intervalId = setInterval(() => {
      loadMessages(true)
    }, 5000)

    return () => clearInterval(intervalId)
  }, [loadMessages])

  // 새 메시지가 추가되면 스크롤을 아래로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // 메시지 전송
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!inputText.trim()) return

    const trimmedText = inputText.trim()
    setInputText("")

    try {
      await sendChatMessage(chatRoomId, trimmedText)
      // 메시지 전송 후 즉시 새로고침하여 전송된 메시지 확인
      loadMessages(true)
    } catch (error) {
      console.error("메시지 전송 중 오류가 발생했습니다:", error)
    }
  }

  // 시간 포맷팅
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const formattedHours = hours < 10 ? `0${hours}` : hours
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes

    return `${formattedHours}:${formattedMinutes}`
  }

  // 날짜 포맷팅 (YYYY년 M월 D일)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    return `${year}년 ${month}월 ${day}일 입니다`
  }

  // 날짜 구분선 표시 여부 확인
  const shouldShowDateSeparator = (message: ChatResponse, index: number) => {
    if (index === 0) return true

    const currentDate = new Date(message.createdAt).toDateString()
    const prevDate = new Date(messages[index - 1].createdAt).toDateString()

    return currentDate !== prevDate
  }

  // 더 불러오기
  const handleLoadMore = () => {
    if (hasMore && !loading) {
      loadMessages()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* 헤더 */}
      <div className="flex items-center mb-4">
        <Link href="/inquiry" className="mr-4">
          <span className="text-2xl">&larr;</span>
        </Link>
        <h1 className="text-xl font-bold">{bakeryName}</h1>
      </div>

      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4" ref={messagesContainerRef}>
        {loading && messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full text-gray-500">대화를 시작해보세요.</div>
        ) : (
          <>
            {/* 더 불러오기 버튼 */}
            {hasMore && (
              <div className="text-center py-2">
                <button
                  onClick={handleLoadMore}
                  className="text-sm text-gray-500 hover:text-gray-700"
                  disabled={loading}
                >
                  {loading ? "불러오는 중..." : "이전 메시지 더 보기"}
                </button>
              </div>
            )}

            {/* 메시지 목록 */}
            {messages.map((message, index) => {
              const isMyMessage = message.senderId === userId

              return (
                <div key={message.id}>
                  {shouldShowDateSeparator(message, index) && (
                    <div className="flex justify-center my-4">
                      <span className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">
                        {formatDate(message.createdAt)}
                      </span>
                    </div>
                  )}

                  <div className={`flex ${isMyMessage ? "justify-end" : "justify-start"}`}>
                    <div className="max-w-[70%]">
                      {!isMyMessage && (
                        <div className="mb-1 ml-1">
                          <span className="font-semibold text-sm">{bakeryName}</span>
                        </div>
                      )}

                      <div className="flex items-end gap-2">
                        {!isMyMessage && (
                          <div className="order-1">
                            <span className="text-xs text-gray-500">{formatTime(message.createdAt)}</span>
                          </div>
                        )}

                        <div
                          className={`px-4 py-2 rounded-2xl ${
                            isMyMessage
                              ? "bg-gray-100 rounded-tr-none"
                              : "bg-white border border-gray-200 rounded-tl-none"
                          }`}
                        >
                          <p>{message.content}</p>
                        </div>

                        {isMyMessage && (
                          <div>
                            <span className="text-xs text-gray-500">{formatTime(message.createdAt)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* 스크롤 위치 참조용 div */}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* 메시지 입력 폼 */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          placeholder="메시지 입력"
          className="flex-1 p-3 rounded-full bg-gray-100"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="px-4 py-2 text-orange-500 font-semibold disabled:text-gray-400"
        >
          전송
        </button>
      </form>
    </div>
  )
}

