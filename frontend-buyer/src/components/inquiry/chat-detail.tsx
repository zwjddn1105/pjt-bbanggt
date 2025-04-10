"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { fetchChatMessages, sendChatMessage, fetchChatRooms } from "../../lib/chat"
import type { ChatResponse } from "../../types/chat"

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
  const [userId, setUserId] = useState<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const [readMessages, setReadMessages] = useState<Record<number, { time: string; lastContent: string }>>({})
  const [lastContent, setLastContent] = useState<string>("")
  const [isAtBottom, setIsAtBottom] = useState(true)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [prevMessagesLength, setPrevMessagesLength] = useState(0)

  // 사용자 ID 가져오기
  useEffect(() => {
    // 로컬 스토리지와 쿠키에서 사용자 ID 가져오기
    const getUserId = () => {
      if (typeof window !== "undefined") {
        // 1. 로컬 스토리지에서 확인
        const userIdFromStorage = localStorage.getItem("user_id")
        if (userIdFromStorage) {
          return Number.parseInt(userIdFromStorage, 10)
        }

        // 2. 쿠키에서 확인
        const cookies = document.cookie.split(";")
        for (const cookie of cookies) {
          const [name, value] = cookie.trim().split("=")
          if (name === "user_id" && value) {
            return Number.parseInt(value, 10)
          }
        }
      }
      return null
    }

    const fetchedUserId = getUserId()
    if (fetchedUserId) {
      // console.log("🔍 사용자 ID 확인:", fetchedUserId)
      setUserId(fetchedUserId)
    } else {
      // console.warn("⚠️ 사용자 ID를 찾을 수 없습니다.")
    }
  }, [])

  // 스크롤 위치 감지
  useEffect(() => {
    const handleScroll = () => {
      if (!messagesContainerRef.current) return

      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current
      // 스크롤이 하단에서 20px 이내에 있으면 하단으로 간주
      const isBottom = scrollHeight - scrollTop - clientHeight < 20
      setIsAtBottom(isBottom)
    }

    const container = messagesContainerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll)
      return () => container.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // 읽은 메시지 정보 로드
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedReadMessages = localStorage.getItem("readMessages")
      if (savedReadMessages) {
        setReadMessages(JSON.parse(savedReadMessages))
      }
    }
  }, [])

  // 채팅방 정보 가져오기 (빵집 이름 포함)
  const fetchChatRoomInfo = useCallback(async () => {
    try {
      // 채팅방 목록 API를 호출하여 모든 채팅방 정보를 가져옵니다
      const response = await fetchChatRooms(null)

      // 현재 채팅방 ID와 일치하는 채팅방 찾기
      const chatRoom = response.data.find((room) => room.chatRoomId === chatRoomId)

      // 채팅방을 찾았으면 빵집 이름 설정
      if (chatRoom) {
        setBakeryName(chatRoom.name)
        setLastContent(chatRoom.lastContent)
      } else {
        // 채팅방을 찾지 못한 경우 기본값 설정
        setBakeryName("베이커리")
      }
    } catch (error) {
      // console.error("채팅방 정보를 가져오는 중 오류가 발생했습니다:", error)
      // 오류 발생 시 기본값 설정
      setBakeryName("베이커리")
    }
  }, [chatRoomId])

  // 컴포넌트 마운트 시 채팅방 정보 가져오기
  useEffect(() => {
    fetchChatRoomInfo()
  }, [fetchChatRoomInfo])

  // 메시지 목록 가져오기
  const loadMessages = useCallback(
    async (refresh = false) => {
      try {
        if (refresh) {
          setPageToken(null)
        }

        const token = refresh ? null : pageToken
        const response = await fetchChatMessages(chatRoomId, token)

        // 현재 메시지 길이 저장
        setPrevMessagesLength(messages.length)

        if (refresh) {
          setMessages(response.data.reverse()) // 최신 메시지가 아래에 오도록 역순 정렬
        } else {
          // 이전 메시지는 위에 추가
          setMessages((prev) => [...response.data.reverse(), ...prev])
        }

        setPageToken(response.pageToken)
        setHasMore(response.hasNext)

        // 메시지를 로드할 때마다 읽음 상태 업데이트
        if (typeof window !== "undefined" && response.data.length > 0) {
          // 채팅방 정보 다시 가져와서 최신 lastContent 확인
          await fetchChatRoomInfo()

          const updatedReadMessages = {
            ...readMessages,
            [chatRoomId]: {
              time: new Date().toISOString(),
              lastContent: lastContent,
            },
          }
          setReadMessages(updatedReadMessages)
          localStorage.setItem("readMessages", JSON.stringify(updatedReadMessages))
        }
      } catch (error) {
        // console.error("메시지를 불러오는 중 오류가 발생했습니다:", error)
      } finally {
        setLoading(false)
        if (refresh) {
          setIsInitialLoad(false)
        }
      }
    },
    [chatRoomId, pageToken, readMessages, lastContent, fetchChatRoomInfo, messages.length],
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

  // 스크롤 관리
  useEffect(() => {
    // 초기 로딩 시 또는 사용자가 스크롤을 하단에 위치시켰을 때만 스크롤 이동
    if (isInitialLoad || isAtBottom || messages.length > prevMessagesLength) {
      messagesEndRef.current?.scrollIntoView({ behavior: isInitialLoad ? "auto" : "smooth" })
    }
  }, [messages, isInitialLoad, isAtBottom, prevMessagesLength])

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
      // 메시지 전송 후 항상 스크롤을 아래로 이동
      setIsAtBottom(true)
    } catch (error) {
      // console.error("메시지 전송 중 오류가 발생했습니다:", error)
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

  // 메시지가 내 메시지인지 확인하는 함수
  const isMyMessage = (message: ChatResponse) => {
    // 사용자 ID가 있는 경우 senderId와 비교
    if (userId !== null) {
      const isMine = message.senderId === userId
      return isMine
    }

    // 사용자 ID를 알 수 없는 경우 (fallback)
    // console.warn("사용자 ID를 알 수 없어 시간 기반으로 메시지 소유자를 추정합니다.")
    const now = new Date().getTime()
    const messageTime = new Date(message.createdAt).getTime()
    const timeDiff = now - messageTime

    // 최근 1시간 이내의 메시지는 사용자가 보낸 것으로 가정
    return timeDiff < 3600000
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
              const myMessage = isMyMessage(message)

              return (
                <div key={message.id}>
                  {shouldShowDateSeparator(message, index) && (
                    <div className="flex justify-center my-4">
                      <span className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">
                        {formatDate(message.createdAt)}
                      </span>
                    </div>
                  )}

                  <div className={`flex ${myMessage ? "justify-end" : "justify-start"}`}>
                    <div className="max-w-[70%]">
                      {!myMessage && (
                        <div className="mb-1 ml-1">
                          <span className="font-semibold text-sm">{bakeryName}</span>
                        </div>
                      )}

                      <div className="flex items-end gap-2">
                        {!myMessage && (
                          <div className="order-1">
                            <span className="text-xs text-gray-500">{formatTime(message.createdAt)}</span>
                          </div>
                        )}

                        <div
                          className={`px-4 py-2 rounded-2xl ${
                            myMessage
                              ? "bg-gray-100 rounded-tr-none"
                              : "bg-white border border-gray-200 rounded-tl-none"
                          }`}
                        >
                          <p>{message.content}</p>
                        </div>

                        {myMessage && (
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

      {/* 스크롤 하단으로 이동 버튼 (스크롤이 위에 있을 때만 표시) */}
      {!isAtBottom && messages.length > 0 && (
        <button
          onClick={() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
            setIsAtBottom(true)
          }}
          className="fixed bottom-24 right-4 bg-gray-800 text-white rounded-full p-2 shadow-lg"
          aria-label="스크롤 하단으로 이동"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      )}
    </div>
  )
}
