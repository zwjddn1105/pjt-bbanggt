"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { fetchChatRooms } from "@/lib/chat"
import type { ChatRoomBuyerOnlyResponse } from "@/types/chat"

export default function ChatList() {
  const router = useRouter()
  const [chatRooms, setChatRooms] = useState<ChatRoomBuyerOnlyResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [searchText, setSearchText] = useState("")
  const [pageToken, setPageToken] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)

  // 채팅방 목록 가져오기
  const loadChatRooms = useCallback(
    async (refresh = false) => {
      try {
        if (refresh) {
          setPageToken(null)
        }

        const token = refresh ? null : pageToken
        const response = await fetchChatRooms(token)

        if (refresh) {
          setChatRooms(response.data)
        } else {
          setChatRooms((prev) => [...prev, ...response.data])
        }

        setPageToken(response.pageToken)
        setHasMore(response.hasNext)
      } catch (error) {
        console.error("채팅방 목록을 불러오는 중 오류가 발생했습니다:", error)
      } finally {
        setLoading(false)
      }
    },
    [pageToken],
  )

  // 폴링 설정
  useEffect(() => {
    loadChatRooms(true)

    // 30초마다 채팅방 목록 업데이트
    const intervalId = setInterval(() => {
      loadChatRooms(true)
    }, 30000)

    return () => clearInterval(intervalId)
  }, [loadChatRooms])

  // 채팅방 필터링
  const filteredChatRooms = chatRooms.filter((room) => room.name.toLowerCase().includes(searchText.toLowerCase()))

  // 시간 포맷팅
  const formatTime = (dateString: string) => {
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
                className="py-4 flex justify-between items-center hover:bg-gray-50"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-orange-500">{room.name}</h3>
                  <p className="text-gray-600 text-sm truncate">{room.lastContent || "새로운 대화를 시작하세요."}</p>
                </div>
                <span className="text-xs text-gray-500">{formatTime(room.createdAt)}</span>
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

