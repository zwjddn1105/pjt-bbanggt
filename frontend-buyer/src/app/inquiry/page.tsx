"use client"

import { useState } from "react"
import { Header } from "@/components/ui/header"
import { Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// 더미 데이터 - 채팅방 목록
const chatRooms = [
  { id: 1, name: "태원베이커리", message: "맛있게 드세요 ~~", time: "오후 1:28" },
  { id: 2, name: "정우베이커리", message: "맛있게 드세요 ~~", time: "오후 1:28" },
  { id: 3, name: "수현베이커리", message: "맛있게 드세요 ~~", time: "오후 1:28" },
  { id: 4, name: "명균베이커리", message: "맛있게 드세요 ~~", time: "오후 1:28" },
  { id: 5, name: "진수베이커리", message: "맛있게 드세요 ~~", time: "오후 1:28" },
  { id: 6, name: "경민베이커리", message: "맛있게 드세요 ~~", time: "오후 1:28" },
  { id: 7, name: "비상베이커리", message: "맛있게 드세요 ~~", time: "오후 1:28" },
]

export default function InquiryPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // 검색 기능
  const filteredChatRooms = chatRooms.filter((room) => room.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <main className="pb-20">
      <Header title="문의하기 목록" backLink="/" />

      {/* 검색창 */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="빵집 이름 검색"
            className="w-full bg-gray-100 rounded-full py-2 pl-10 pr-4 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* 메시지 섹션 제목 */}
      <div className="px-4 py-2">
        <h2 className="text-sm font-medium text-gray-500">메시지</h2>
      </div>

      {/* 채팅방 목록 */}
      <div className="divide-y">
        {filteredChatRooms.map((room) => (
          <Link key={room.id} href={`/inquiry/${room.id}`}>
            <div className="flex items-center p-4 hover:bg-gray-50">
              {/* 프로필 이미지 */}
              <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                <Image
                  src="/bread-pattern.png"
                  alt={`${room.name} 프로필`}
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>

              {/* 채팅 정보 */}
              <div className="flex-1">
                <h3 className="font-medium text-orange-500">{room.name}</h3>
                <p className="text-sm text-gray-600 truncate">{room.message}</p>
              </div>

              {/* 시간 */}
              <div className="text-xs text-gray-400">{room.time}</div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}

