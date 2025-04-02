"use client"

import { useState } from "react"
import { Bookmark, MapPin, Clock, Navigation, X } from "lucide-react"
import { addBakeryBookmark, removeBakeryBookmark } from "@/services/breadgut-api"
import type { VendingMachine } from "@/types/vending-machine"

interface MarkerDetailProps {
  vendingMachine: VendingMachine
  onClose: () => void
  onBookmarkChange?: (isBookmarked: boolean) => void
}

export default function MarkerDetail({ vendingMachine, onClose, onBookmarkChange }: MarkerDetailProps) {
  const [isBookmarked, setIsBookmarked] = useState(vendingMachine.isBookmarked || false)
  const [isLoading, setIsLoading] = useState(false)

  const handleBookmarkToggle = async () => {
    if (isLoading) return

    setIsLoading(true)
    try {
      if (isBookmarked) {
        await removeBakeryBookmark(Number(vendingMachine.id))
      } else {
        await addBakeryBookmark(Number(vendingMachine.id))
      }

      const newBookmarkState = !isBookmarked
      setIsBookmarked(newBookmarkState)

      if (onBookmarkChange) {
        onBookmarkChange(newBookmarkState)
      }
    } catch (error) {
      console.error("북마크 상태 변경 중 오류:", error)
      alert("북마크 상태 변경에 실패했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleNavigation = () => {
    // 카카오맵 길찾기 URL 생성
    const kakaoMapUrl = `https://map.kakao.com/link/to/${vendingMachine.name},${vendingMachine.latitude},${vendingMachine.longitude}`
    window.open(kakaoMapUrl, "_blank")
  }

  return (
    <div className="fixed bottom-16 left-0 right-0 bg-white rounded-t-2xl shadow-lg p-4 z-20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{vendingMachine.name}</h2>
        <button onClick={onClose} className="p-1" aria-label="닫기">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center mb-2">
        <span className="text-gray-600">빵긋 자판기</span>
        <button
          onClick={handleBookmarkToggle}
          disabled={isLoading}
          className="ml-auto p-1"
          aria-label={isBookmarked ? "북마크 제거" : "북마크 추가"}
        >
          <Bookmark className={`w-6 h-6 ${isBookmarked ? "fill-orange-500 text-orange-500" : "text-gray-400"}`} />
        </button>
      </div>

      {vendingMachine.address && (
        <div className="flex items-start mb-2">
          <MapPin className="w-5 h-5 mr-2 text-gray-500 mt-0.5 flex-shrink-0" />
          <span className="text-gray-700">{vendingMachine.address}</span>
        </div>
      )}

      <div className="flex items-start mb-2">
        <Clock className="w-5 h-5 mr-2 text-gray-500 mt-0.5 flex-shrink-0" />
        <span className="text-gray-700">24시간 운영</span>
      </div>

      <div className="mt-4 flex justify-between">
        <button
          onClick={handleNavigation}
          className="flex-1 mr-2 py-2 bg-orange-500 text-white rounded-lg flex items-center justify-center"
        >
          <Navigation className="w-5 h-5 mr-1" />
          길찾기
        </button>
        <button
          onClick={handleBookmarkToggle}
          disabled={isLoading}
          className={`flex-1 ml-2 py-2 border rounded-lg flex items-center justify-center ${
            isBookmarked ? "border-orange-500 text-orange-500" : "border-gray-300 text-gray-600"
          }`}
        >
          <Bookmark className={`w-5 h-5 mr-1 ${isBookmarked ? "fill-orange-500" : ""}`} />
          {isBookmarked ? "저장됨" : "저장하기"}
        </button>
      </div>
    </div>
  )
}

