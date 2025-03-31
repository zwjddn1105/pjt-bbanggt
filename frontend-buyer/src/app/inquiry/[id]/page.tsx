"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/ui/header"
import Image from "next/image"

// 채팅방 더미 데이터
const chatRooms = [
  {
    id: 1,
    name: "태원베이커리",
    messages: [
      { id: 1, sender: "bakery", content: "가격 안상향계획", time: "12:49" },
      { id: 2, sender: "bakery", content: "문닫내세요", time: "12:59" },
      { id: 3, sender: "user", content: "빵맛있어용", time: "12:59" },
      { id: 4, sender: "user", content: "포장좀해용", time: "12:59" },
      { id: 5, sender: "bakery", content: "근데맛있죠?", time: "12:59" },
      { id: 6, sender: "user", content: "빵맛있어용", time: "12:59" },
      { id: 7, sender: "bakery", content: "문닫내세요", time: "12:59" },
      { id: 8, sender: "bakery", content: "히히", time: "12:59" },
    ],
  },
  {
    id: 2,
    name: "정우베이커리",
    messages: [
      { id: 1, sender: "bakery", content: "안녕하세요!", time: "12:30" },
      { id: 2, sender: "user", content: "빵이 정말 맛있어요", time: "12:35" },
      { id: 3, sender: "bakery", content: "감사합니다 :)", time: "12:40" },
    ],
  },
  // 나머지 베이커리들의 채팅 데이터도 추가...
]

export default function ChatDetailPage() {
  const params = useParams()
  const chatId = Number(params.id)
  const [newMessage, setNewMessage] = useState("")
  const [chatRoom, setChatRoom] = useState<(typeof chatRooms)[0] | undefined>()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 채팅방 ID로 해당 채팅방 찾기
  useEffect(() => {
    const room = chatRooms.find((room) => room.id === chatId)
    setChatRoom(room)
  }, [chatId])

  // 메시지 목록이 업데이트될 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatRoom?.messages])

  // 메시지 전송 처리
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !chatRoom) return

    // 새 메시지 객체 생성
    const newMessageObj = {
      id: chatRoom.messages.length + 1,
      sender: "user",
      content: newMessage,
      time: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false }),
    }

    // 채팅방 메시지 업데이트
    setChatRoom({
      ...chatRoom,
      messages: [...chatRoom.messages, newMessageObj],
    })

    // 입력창 초기화
    setNewMessage("")
  }

  if (!chatRoom) {
    return <div>채팅방을 찾을 수 없습니다.</div>
  }

  return (
    <main className="flex flex-col h-screen relative">
      {/* 헤더 - 상단에 고정 */}
      <div className="sticky top-0 z-10 bg-white">
        <Header title={chatRoom.name} backLink="/inquiry" />
      </div>

      {/* 채팅 내용 - 스크롤 가능한 영역 */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 pb-20">
        {/* 날짜 표시 */}
        <div className="flex justify-center mb-4">
          <div className="bg-gray-200 rounded-full px-3 py-1 text-xs text-gray-600">📅 2025년 3월 9일 일요일</div>
        </div>

        {/* 메시지 목록 */}
        <div className="space-y-3">
          {chatRoom.messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              {message.sender === "bakery" && (
                <div className="flex items-end">
                  <div className="flex flex-col items-start">
                    <div className="flex items-center mb-1">
                      <span className="text-sm text-gray-600 mr-1">{chatRoom.name}</span>
                      <div className="w-5 h-5 rounded-full overflow-hidden">
                        <Image
                          src="/bread-pattern.png"
                          alt={`${chatRoom.name} 프로필`}
                          width={20}
                          height={20}
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-2 max-w-xs break-words shadow-sm">{message.content}</div>
                    <span className="text-xs text-gray-400 mt-1">{message.time}</span>
                  </div>
                </div>
              )}

              {message.sender === "user" && (
                <div className="flex flex-col items-end">
                  <div className="bg-blue-500 text-white rounded-lg p-2 max-w-xs break-words shadow-sm">
                    {message.content}
                  </div>
                  <span className="text-xs text-gray-400 mt-1">{message.time}</span>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 메시지 입력 - 하단에 고정 (z-index 낮춤) */}
      <form onSubmit={handleSendMessage} className="fixed bottom-16 left-0 right-0 p-2 bg-white border-t z-5">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="메시지 입력"
            className="flex-1 bg-gray-100 rounded-full py-2 px-4 focus:outline-none"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            type="submit"
            className="ml-2 bg-primary-custom text-white rounded-full p-2 w-10 h-10 flex items-center justify-center"
            disabled={!newMessage.trim()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </form>
    </main>
  )
}

