"use client"

import type React from "react"

import { X, MapPin } from "lucide-react"
import type { VendingMachine } from "@/types/vending-machine"
import { useRef, useEffect } from "react"

interface BreadDetailProps {
  vendingMachine: VendingMachine
  slotId: number
  breadType: number
  onClose: () => void
}

export default function BreadDetail({ vendingMachine, slotId, breadType, onClose }: BreadDetailProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  // 빵 타입에 따른 더미 데이터
  const getBreadData = (type: number) => {
    switch (type) {
      case 1:
        return {
          name: "바게트",
          description: "판매자스 A동 4층 구역",
          price: 5000,
          image: "/bread-pattern.png",
          bakery: "파리바게트",
        }
      case 2:
        return {
          name: "크루아상",
          description: "판매자스 B동 2층 구역",
          price: 3500,
          image: "/bread-pattern.png",
          bakery: "뚜레쥬르",
        }
      case 3:
        return {
          name: "식빵",
          description: "판매자스 C동 1층 구역",
          price: 8000,
          image: "/bread-pattern.png",
          bakery: "성심당",
        }
      default:
        return {
          name: "빵",
          description: "판매자스 구역",
          price: 5000,
          image: "/bread-pattern.png",
          bakery: "빵집",
        }
    }
  }

  const breadData = getBreadData(breadType)

  // 화면 바깥 클릭 시 닫기
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // 모달이 마운트되면 스크롤을 맨 위로 이동
  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.scrollTop = 0
    }
  }, [])

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-t-2xl w-full max-w-md max-h-[85vh] overflow-y-auto pb-20"
        style={{ marginTop: "auto", marginBottom: "72px" }}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{vendingMachine.name}</h2>
            <button onClick={onClose} className="p-1" aria-label="닫기">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-start mb-4">
            <MapPin className="w-5 h-5 mr-2 text-gray-500 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">{vendingMachine.address}</span>
          </div>

          {/* 빵 상세 정보 카드 */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="relative bg-gradient-to-r from-yellow-100 to-orange-100 p-4">
              <div className="bg-white rounded-xl p-2 shadow-md">
                <img
                  src={breadData.image || "/placeholder.svg"}
                  alt={breadData.name}
                  className="w-full h-48 object-cover rounded-lg"
                />

                <div className="p-4">
                  <h3 className="text-lg font-bold mb-1">{breadData.bakery}</h3>
                  <p className="text-gray-600 text-sm mb-2">{breadData.description}</p>
                  <p className="text-orange-500 font-bold">{breadData.price.toLocaleString()}원</p>
                </div>

                <div className="flex gap-2 p-2">
                  <button className="flex-1 py-2 border border-orange-500 text-orange-500 rounded-full text-sm">
                    원래가니까 보기
                  </button>
                  <button className="flex-1 py-2 bg-orange-500 text-white rounded-full text-sm">결제하기</button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-4 mb-4">
            <button onClick={onClose} className="w-1/3 py-3 border border-gray-300 rounded-full text-gray-700">
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

