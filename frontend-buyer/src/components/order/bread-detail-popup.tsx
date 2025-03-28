"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface BreadDetailPopupProps {
  isOpen: boolean
  onClose: () => void
  storeName: string
  availableCount: number
  totalCount: number
  items: { name: string; count: number }[]
}

export default function BreadDetailPopup({
  isOpen,
  onClose,
  storeName,
  availableCount,
  totalCount,
  items,
}: BreadDetailPopupProps) {
  const [isVisible, setIsVisible] = useState(false)

  // 팝업이 열릴 때 애니메이션을 위한 상태 관리
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden" // 배경 스크롤 방지
      setTimeout(() => setIsVisible(true), 10)
    } else {
      setIsVisible(false)
      setTimeout(() => {
        document.body.style.overflow = "" // 배경 스크롤 복원
      }, 300) // 애니메이션 시간과 일치시킴
    }
  }, [isOpen])

  if (!isOpen) return null

  // 진행 바 계산
  const progressPercentage = (availableCount / totalCount) * 100

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/50" />

      {/* 팝업 컨텐츠 */}
      <div
        className={`relative w-4/5 max-w-md bg-[#FFF8E1] rounded-xl p-5 transition-transform duration-300 ease-out ${
          isVisible ? "scale-100" : "scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 매장 이름 */}
        <h2 className="text-xl font-bold text-center text-[#5D4037] mb-4">{storeName}</h2>

        {/* 진행 바 */}
        <div className="h-4 bg-gray-200 rounded-full mb-2">
          <div className="h-full bg-orange-500 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
        </div>

        {/* 잔여량 */}
        <p className="text-center mb-4">
          잔여량: {availableCount}/{totalCount}
        </p>

        {/* 빵 종류 그리드 */}
        <div className="grid grid-cols-3 gap-3">
          {items.map((item, index) => (
            <div key={index} className="bg-[#FFF3CD] p-3 rounded-lg text-center">
              <div className="w-16 h-16 mx-auto mb-2 relative">
                <Image src="/mascot.png" alt={item.name} fill className="object-contain" />
              </div>
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-xs">{item.count}개</p>
            </div>
          ))}
        </div>

        {/* 닫기 버튼 */}
        <div className="mt-4 text-center">
          <button onClick={onClose} className="px-4 py-2 bg-orange-400 text-white rounded-full text-sm">
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}

