"use client"

import { useState } from "react"
import { MapPin, Clock, Navigation, X, Package, Info } from "lucide-react"
import { addBakeryBookmark, removeBakeryBookmark } from "../../services/breadgut-api"
import type { VendingMachine } from "../../types/vending-machine"
import VendingMachineDetail from "./vending-machine-detail"
import BreadDetail from "./bread-detail"

interface MarkerDetailProps {
  vendingMachine: VendingMachine
  onClose: () => void
  onBookmarkChange?: (isBookmarked: boolean) => void
}

export default function MarkerDetail({ vendingMachine, onClose, onBookmarkChange }: MarkerDetailProps) {
  const [isBookmarked, setIsBookmarked] = useState(vendingMachine.isBookmarked || false)
  const [isLoading, setIsLoading] = useState(false)
  const [showVendingMachineDetail, setShowVendingMachineDetail] = useState(false)
  const [showBreadDetail, setShowBreadDetail] = useState(false)
  const [selectedBread, setSelectedBread] = useState<{
    slotId: number
    breadType: string
    bakeryName: string
    orderId: number
  } | null>(null)

  const handleBookmarkToggle = async () => {
    if (isLoading) return

    // 빵집 ID가 없는 경우 처리
    if (!vendingMachine.bakeryId) {
      console.error("빵집 ID가 없습니다.")
      alert("북마크 처리에 필요한 정보가 없습니다.")
      return
    }

    setIsLoading(true)
    try {
      if (isBookmarked) {
        // 북마크 삭제 - 빵집 ID 사용
        await removeBakeryBookmark(vendingMachine.bakeryId)
      } else {
        // 북마크 추가 - 빵집 ID 사용
        await addBakeryBookmark(vendingMachine.bakeryId)
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

  const handleDetailClick = () => {
    setShowVendingMachineDetail(true)
  }

  const handleBreadDetailClick = (slotId: number, breadType: string, bakeryName: string, orderId: number) => {
    setSelectedBread({ slotId, breadType, bakeryName, orderId })
    setShowVendingMachineDetail(false)
    setShowBreadDetail(true)
  }

  // 빵 상세에서 자판기 상세로 돌아가는 함수
  const handleBackToVendingMachine = () => {
    setShowBreadDetail(false)
    setShowVendingMachineDetail(true)
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-10 z-10" onClick={onClose} />
      <div className="fixed bottom-16 left-0 right-0 max-h-[60vh] overflow-y-auto bg-white rounded-t-2xl shadow-lg p-4 z-20">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{vendingMachine.name}</h2>
          <button onClick={onClose} className="p-1" aria-label="닫기">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center mb-2">
          <span className="text-gray-600">빵긋 자판기</span>
          {/* <button
            onClick={handleBookmarkToggle}
            disabled={isLoading}
            className="ml-auto p-1"
            aria-label={isBookmarked ? "북마크 제거" : "북마크 추가"}
          >
            <Bookmark className={`w-6 h-6 ${isBookmarked ? "fill-orange-500 text-orange-500" : "text-gray-400"}`} />
          </button> */}
        </div>

        {vendingMachine.address && (
          <div className="flex items-start mb-2">
            <MapPin className="w-5 h-5 mr-2 text-gray-500 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">{vendingMachine.address}</span>
          </div>
        )}

        <div className="flex items-start mb-2">
          <Clock className="w-5 h-5 mr-2 text-gray-500 mt-0.5 flex-shrink-0" />
          <span className="text-gray-700">오후 8시부터 오전 9시까지지</span>
        </div>

        <div className="flex items-start mb-2">
          <Package className="w-5 h-5 mr-2 text-gray-500 mt-0.5 flex-shrink-0" />
          <span className="text-gray-700">
            현재 재고:{" "}
            <span className={`font-bold ${vendingMachine.availableCount > 0 ? "text-green-600" : "text-red-600"}`}>
              {vendingMachine.availableCount > 0 ? `${vendingMachine.availableCount}개` : "품절"}
            </span>
          </span>
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
            onClick={handleDetailClick}
            className="flex-1 ml-2 py-2 border border-gray-300 text-gray-600 rounded-lg flex items-center justify-center"
          >
            <Info className="w-5 h-5 mr-1" />
            자세히 보기
          </button>
        </div>
      </div>

      {/* 빵긋 자판기 상세 정보 모달 */}
      {showVendingMachineDetail && (
        <VendingMachineDetail
          vendingMachine={vendingMachine}
          onClose={() => setShowVendingMachineDetail(false)}
          onBreadDetailClick={handleBreadDetailClick}
        />
      )}

      {/* 빵 상세 정보 모달 */}
      {showBreadDetail && selectedBread && (
        <BreadDetail
          vendingMachine={vendingMachine}
          slotId={selectedBread.slotId}
          breadType={selectedBread.breadType}
          bakeryName={selectedBread.bakeryName}
          orderId={selectedBread.orderId}
          onClose={() => setShowBreadDetail(false)}
          onBackToVendingMachine={handleBackToVendingMachine} // 자판기 상세로 돌아가는 함수 전달
        />
      )}
    </>
  )
}

