"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { fetchChatRooms, fetchChatMessages } from "@/lib/chat"
import type { ChatRoomBuyerOnlyResponse } from "@/types/chat"

// 마지막 메시지 시간을 저장하는 타입
interface LastMessageTimes {
  [chatRoomId: number]: string
}

export default function ChatList() {
  const router = useRouter()
  const [chatRooms, setChatRooms] = useState<ChatRoomBuyerOnlyResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [searchText, setSearchText] = useState("")
  const [pageToken, setPageToken] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [readMessages, setReadMessages] = useState<Record<number, { time: string; lastContent: string }>>({})
  const [lastMessageTimes, setLastMessageTimes] = useState<LastMessageTimes>({})

  // 중복 제거 로직
  const mergeUniqueRooms = (prev: ChatRoomBuyerOnlyResponse[], next: ChatRoomBuyerOnlyResponse[]) => {
    const combined = [...prev, ...next]
    const unique = Array.from(new Map(combined.map((room) => [room.chatRoomId, room])).values())
    return unique
  }

  // 읽은 메시지 정보 로드
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedReadMessages = localStorage.getItem("readMessages")
      if (savedReadMessages) {
        setReadMessages(JSON.parse(savedReadMessages))
      }

      // 저장된 마지막 메시지 시간 로드
      const savedLastMessageTimes = localStorage.getItem("lastMessageTimes")
      if (savedLastMessageTimes) {
        setLastMessageTimes(JSON.parse(savedLastMessageTimes))
      }
    }
  }, [])

  // 채팅방 목록 가져오기
  const loadChatRooms = useCallback(
    async (refresh = false) => {
      try {
        if (refresh) {
          setPageToken(null)
        }

        const token = refresh ? null : pageToken
        const response = await fetchChatRooms(token)

        const rooms = response.data
        if (refresh) {
          setChatRooms(mergeUniqueRooms([], rooms))
        } else {
          setChatRooms((prev) => mergeUniqueRooms(prev, rooms))
        }

        setPageToken(response.pageToken)
        setHasMore(response.hasNext)

        // 각 채팅방의 마지막 메시지 시간 가져오기
        for (const room of rooms) {
          fetchLastMessageTime(room.chatRoomId)
        }
      } catch (error) {
        console.error("채팅방 목록을 불러오는 중 오류가 발생했습니다:", error)
      } finally {
        setLoading(false)
      }
    },
    [pageToken],
  )

  // 채팅방의 마지막 메시지 시간 가져오기
  const fetchLastMessageTime = async (chatRoomId: number) => {
    try {
      // 각 채팅방의 첫 페이지 메시지만 가져옴 (최신 메시지)
      const response = await fetchChatMessages(chatRoomId, null)

      if (response.data.length > 0) {
        // 메시지는 역순으로 정렬되어 있으므로, 마지막 메시지는 배열의 첫 번째 요소
        const lastMessage = response.data[0]

        // 마지막 메시지 시간 저장
        setLastMessageTimes((prev) => {
          const updated = { ...prev, [chatRoomId]: lastMessage.createdAt }

          // 로컬 스토리지에 저장
          if (typeof window !== "undefined") {
            localStorage.setItem("lastMessageTimes", JSON.stringify(updated))
          }

          return updated
        })
      }
    } catch (error) {
      console.error(`채팅방 ${chatRoomId}의 마지막 메시지 시간을 가져오는 중 오류가 발생했습니다:`, error)
    }
  }

  // 폴링 설정
  useEffect(() => {
    loadChatRooms(true)

    const intervalId = setInterval(() => {
      loadChatRooms(true)
    }, 30000)

    return () => clearInterval(intervalId)
  }, [loadChatRooms])

  // 채팅방 필터링
  const filteredChatRooms = chatRooms.filter((room) => room.name.toLowerCase().includes(searchText.toLowerCase()))

  // 시간 포맷팅
  const formatTime = (dateString: string) => {
    if (!dateString) return ""

    const date = new Date(dateString)
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? "오후" : "오전"
    const formattedHours = hours % 12 || 12
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes

    return `${ampm} ${formattedHours}:${formattedMinutes}`
  }

  // 더 불러오기
  const handleLoadMore = () => {
    if (hasMore && !loading) {
      loadChatRooms()
    }
  }

  // 메시지가 읽지 않은 새 메시지인지 확인
  const isNewMessage = (room: ChatRoomBuyerOnlyResponse) => {
    // 해당 채팅방의 읽음 정보가 없으면 새 메시지로 간주
    if (!readMessages[room.chatRoomId]) {
      return true
    }

    const readInfo = readMessages[room.chatRoomId]

    // 마지막 읽은 시간과 마지막 콘텐츠를 비교
    // 시간 비교
    const lastReadTime = new Date(readInfo.time).getTime()
    const messageTime = new Date(room.createdAt).getTime()

    // 콘텐츠 비교 (마지막으로 읽은 콘텐츠와 현재 콘텐츠가 다르면 새 메시지)
    const contentChanged = readInfo.lastContent !== room.lastContent

    // 시간이 더 최신이거나 콘텐츠가 변경되었으면 새 메시지로 간주
    return messageTime > lastReadTime || contentChanged
  }

  return (
    <div className="flex flex-col">
      {/* 검색 */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="빵집 이름 검색"
          className="w-full p-3 rounded-lg bg-gray-100"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <h2 className="text-lg font-semibold mb-2">메시지</h2>

      {/* 채팅방 목록 */}
      {loading && chatRooms.length === 0 ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="flex flex-col divide-y">
          {filteredChatRooms.length === 0 ? (
            <div className="py-8 text-center text-gray-500">문의 내역이 없습니다.</div>
          ) : (
            filteredChatRooms.map((room) => (
              <Link
                href={`/inquiry/${room.chatRoomId}`}
                key={room.chatRoomId}
                className="py-4 flex justify-between items-center hover:bg-gray-50 relative"
                onClick={() => {
                  // 채팅방 클릭 시 읽음 상태 업데이트
                  const updatedReadMessages = {
                    ...readMessages,
                    [room.chatRoomId]: {
                      time: new Date().toISOString(),
                      lastContent: room.lastContent,
                    },
                  }
                  setReadMessages(updatedReadMessages)
                  localStorage.setItem("readMessages", JSON.stringify(updatedReadMessages))
                }}
              >
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="font-semibold text-orange-500">{room.name}</h3>
                    {isNewMessage(room) && (
                      <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">NEW</span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm truncate">{room.lastContent || "새로운 대화를 시작하세요."}</p>
                </div>
                <span className="text-xs text-gray-500">
                  {/* 마지막 메시지 시간 표시 (없으면 생성 시간 표시) */}
                  {formatTime(lastMessageTimes[room.chatRoomId] || room.createdAt)}
                </span>
              </Link>
            ))
          )}

          {/* 더 불러오기 버튼 */}
          {hasMore && filteredChatRooms.length > 0 && (
            <button
              onClick={handleLoadMore}
              className="py-3 text-center text-gray-500 hover:bg-gray-50"
              disabled={loading}
            >
              {loading ? "불러오는 중..." : "더 보기"}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

