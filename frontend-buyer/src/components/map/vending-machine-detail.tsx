"use client"

import type React from "react"

import { X } from "lucide-react"
import type { VendingMachine } from "../../types/vending-machine"
import type { SlotResponse, VendingMachineSlotResponse, BreadType } from "../../types/api-types"
import { useEffect, useRef, useState } from "react"
import { fetchVendingMachineById } from "../../services/breadgut-api"

interface VendingMachineDetailProps {
  vendingMachine: VendingMachine
  onClose: () => void
  onBreadDetailClick: (slotId: number, breadType: string, bakeryName: string, orderId: number) => void
}

// 빵 타입별 한글 이름 매핑
const breadTypeNames: Record<BreadType, string> = {
  SOBORO: "소보로빵",
  SWEET_RED_BEAN: "단팥빵",
  WHITE_BREAD: "식빵",
  BAGUETTE: "바게트",
  CROISSANT: "크루아상",
  PIZZA_BREAD : "피자빵",
  BAGEL : "베이글",
  GARLIC_BREAD: "마늘빵",
  OTHER: "기타",
  MIXED_BREAD: "모듬빵",
}

export default function VendingMachineDetail({
  vendingMachine,
  onClose,
  onBreadDetailClick,
}: VendingMachineDetailProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const [selectedSlot, setSelectedSlot] = useState<SlotResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [vendingMachineDetail, setVendingMachineDetail] = useState<VendingMachineSlotResponse | null>(null)
  const [showBakeryList, setShowBakeryList] = useState(false) // 빵집 목록 팝업 표시 여부
  const [showBreadTypeList, setShowBreadTypeList] = useState(false) // 빵 종류 목록 팝업 표시 여부

  // API에서 자판기 상세 정보 가져오기
  useEffect(() => {
    const fetchVendingMachineDetail = async () => {
      try {
        setLoading(true)
        const data = await fetchVendingMachineById(vendingMachine.id)
        setVendingMachineDetail(data)
        setLoading(false)
      } catch (err) {
        // console.error("자판기 상세 정보를 가져오는데 실패했습니다:", err)
        setError("자판기 상세 정보를 가져오는데 실패했습니다.")
        setLoading(false)
      }
    }

    fetchVendingMachineDetail()
  }, [vendingMachine.id])

  // 슬롯 배경색 결정 함수
  const getSlotBackground = (slot: SlotResponse) => {
    // 선��된 슬롯인 경우 다른 스타일 적용
    if (selectedSlot && selectedSlot.slotNumber === slot.slotNumber) {
      return "bg-blue-200 border-2 border-blue-500"
    }

    // 빵이 없거나 AVAILABLE이 아닌 경우 회색 배경
    if (!slot.orderSummaryResponse || slot.orderSummaryResponse.productState !== "AVAILABLE") {
      return "bg-gray-300"
    }
    // 북마크된 빵집의 빵인 경우 특별한 테두리 추가
    if (slot.orderSummaryResponse.mark) {
      return "bg-white border-2 border-[#EC9A5E]" // 북마크된 빵집은 특별한 테두리 색상 적용
    }
    // AVAILABLE인 경우 흰색 배경 (이미지가 보이도록)
    return "bg-white"
  }

  // 슬롯 내용물 결정 함수
  const getSlotContent = (slot: SlotResponse) => {
    // 빵이 없거나 AVAILABLE이 아닌 경우 아무것도 표시하지 않음
    if (!slot.orderSummaryResponse || slot.orderSummaryResponse.productState !== "AVAILABLE") {
      return null
    }

    // 빵 타입에 따라 다른 이미지 표시
    const breadType = slot.orderSummaryResponse.breadType
    const imagePath = `/${breadType}.jpg`

    return (
      <img
        src={imagePath || "/placeholder.svg"}
        alt={`${breadType} 빵`}
        className="w-full h-full object-cover rounded-md"
        onError={(e) => {
          // 이미지 로드 실패 시 기본 이미지로 대체
          e.currentTarget.src = "/bread-pattern.png"
          e.currentTarget.className = "w-8 h-8 object-contain"
        }}
      />
    )
  }

  // 슬롯 클릭 핸들러
  const handleSlotClick = (slot: SlotResponse) => {
    // 빵이 없거나 AVAILABLE이 아닌 경우 선택할 수 없음
    if (!slot.orderSummaryResponse || slot.orderSummaryResponse.productState !== "AVAILABLE") {
      return
    }

    // 이미 선택된 슬롯을 다시 클릭하면 선택 해제
    if (selectedSlot && selectedSlot.slotNumber === slot.slotNumber) {
      setSelectedSlot(null)
    } else {
      setSelectedSlot(slot)
    }
  }

  // 빵긋 보기 버튼 클릭 핸들러
  const handleBreadDetailClick = () => {
    if (
      selectedSlot &&
      selectedSlot.orderSummaryResponse &&
      selectedSlot.orderSummaryResponse.productState === "AVAILABLE"
    ) {
      // API에서 가져온 빵집 이름 사용
      const bakeryName = selectedSlot.orderSummaryResponse.bakeryName || "빵집"
      onBreadDetailClick(
        selectedSlot.slotNumber,
        selectedSlot.orderSummaryResponse.breadType,
        bakeryName,
        selectedSlot.orderSummaryResponse.orderId,
      )
    }
  }

  const handleKakaoMapSearch = () => {
    if (!vendingMachineDetail) return

    // 카카오맵 URL 생성 (위도/경도로 지도 표시)
    const kakaoMapUrl = `https://map.kakao.com/link/map/${vendingMachineDetail.vendingMachineName},${vendingMachine.latitude},${vendingMachine.longitude}`
    window.open(kakaoMapUrl, "_blank")
  }

  // 빵집 목록 보기 버튼 클릭 핸들러
  const handleBakeryListClick = () => {
    setShowBakeryList(true)
  }

  // 빵 종류 목록 보기 버튼 클릭 핸들러
  const handleBreadTypeListClick = () => {
    setShowBreadTypeList(true)
  }

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

  // 로딩 중 표시
  if (loading) {
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
        onClick={handleBackdropClick}
      >
        <div className="bg-white rounded-xl p-8 max-w-md">
          <div className="flex justify-center">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-center mt-4">자판기 정보를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  // 에러 표시
  if (error) {
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
        onClick={handleBackdropClick}
      >
        <div className="bg-white rounded-xl p-8 max-w-md">
          <p className="text-red-500 text-center">{error}</p>
          <div className="flex justify-center mt-4">
            <button onClick={onClose} className="px-4 py-2 bg-orange-500 text-white rounded-lg">
              닫기
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 데이터가 없는 경우
  if (!vendingMachineDetail) {
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
        onClick={handleBackdropClick}
      >
        <div className="bg-white rounded-xl p-8 max-w-md">
          <p className="text-center">자판기 정보를 찾을 수 없습니다.</p>
          <div className="flex justify-center mt-4">
            <button onClick={onClose} className="px-4 py-2 bg-orange-500 text-white rounded-lg">
              닫기
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 사용 가능한 슬롯 수 계산
  const availableSlots = vendingMachineDetail.slotResponseList.filter(
    (slot) => slot.orderSummaryResponse && slot.orderSummaryResponse.productState === "AVAILABLE",
  )

  // 빵 종류 계산
  const breadTypes = new Set(
    vendingMachineDetail.slotResponseList
      .filter((slot) => slot.orderSummaryResponse && slot.orderSummaryResponse.productState === "AVAILABLE")
      .map((slot) => slot.orderSummaryResponse?.breadType),
  )

  // 중복되지 않는 빵집 목록 계산
  const uniqueBakeries = Array.from(
    new Set(
      vendingMachineDetail.slotResponseList
        .filter((slot) => slot.orderSummaryResponse && slot.orderSummaryResponse.productState === "AVAILABLE")
        .map((slot) => slot.orderSummaryResponse?.bakeryName)
        .filter(Boolean), // undefined나 null 제거
    ),
  )

  // 빵 종류별 갯수 계산
  const breadTypeCounts: Record<BreadType, number> = {} as Record<BreadType, number>

  // 모든 빵 타입에 대해 초기값 0으로 설정
  Object.keys(breadTypeNames).forEach((type) => {
    breadTypeCounts[type as BreadType] = 0
  })

  // 사용 가능한 슬롯에서 빵 타입별 갯수 계산
  availableSlots.forEach((slot) => {
    if (slot.orderSummaryResponse?.breadType) {
      const breadType = slot.orderSummaryResponse.breadType
      breadTypeCounts[breadType] = (breadTypeCounts[breadType] || 0) + 1
    }
  })

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
            <h2 className="text-xl font-bold">{vendingMachineDetail.vendingMachineName}</h2>
            <button onClick={onClose} className="p-1" aria-label="닫기">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="bg-red-100 rounded-xl p-4 mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-700">
                남은 빵긋: {availableSlots.length}/{vendingMachineDetail.slotResponseList.length}
              </span>
              <button
                onClick={handleKakaoMapSearch}
                className="bg-orange-200 text-orange-800 text-xs px-2 py-1 rounded-full"
              >
                카카오 지도 찾아보기
              </button>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-700">남은 빵 종류: {breadTypes.size}</span>
              <button
                onClick={handleBreadTypeListClick}
                className="bg-orange-200 text-orange-800 text-xs px-2 py-1 rounded-full"
              >
                확인하기
              </button>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">참여 빵집: {uniqueBakeries.length}</span>
              <button
                onClick={handleBakeryListClick}
                className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full"
              >
                목록보기
              </button>
            </div>
          </div>

          {/* 자판기 슬롯 그리드 */}
          <div
            className="grid gap-2 mb-6"
            style={{
              gridTemplateColumns: `repeat(${vendingMachineDetail.width}, 1fr)`,
              gridTemplateRows: `repeat(${vendingMachineDetail.height}, 1fr)`,
            }}
          >
            {vendingMachineDetail.slotResponseList.map((slot) => (
              <div
                key={slot.slotNumber}
                className={`${getSlotBackground(slot)} w-full aspect-square rounded-md flex items-center justify-center overflow-hidden cursor-pointer transition-all duration-200 ${
                  slot.orderSummaryResponse && slot.orderSummaryResponse.productState === "AVAILABLE"
                    ? "hover:opacity-80"
                    : "cursor-not-allowed"
                }`}
                onClick={() => handleSlotClick(slot)}
              >
                {getSlotContent(slot)}
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-4 mb-4">
            <button onClick={onClose} className="flex-1 mr-2 py-3 border border-gray-300 rounded-full text-gray-700">
              취소
            </button>
            <button
              onClick={handleBreadDetailClick}
              className={`flex-1 ml-2 py-3 rounded-full ${
                selectedSlot &&
                selectedSlot.orderSummaryResponse &&
                selectedSlot.orderSummaryResponse.productState === "AVAILABLE"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={
                !selectedSlot ||
                !selectedSlot.orderSummaryResponse ||
                selectedSlot.orderSummaryResponse.productState !== "AVAILABLE"
              }
            >
              빵긋보기
            </button>
          </div>
        </div>
      </div>

      {/* 빵집 목록 팝업 */}
      {showBakeryList && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center"
          onClick={() => setShowBakeryList(false)}
        >
          <div className="bg-white rounded-xl p-6 max-w-xs w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">참여 빵집 목록</h3>
              <button onClick={() => setShowBakeryList(false)} className="p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-60 overflow-y-auto">
              {uniqueBakeries.length > 0 ? (
                <ul className="divide-y">
                  {uniqueBakeries.map((bakery, index) => (
                    <li key={index} className="py-2">
                      {bakery}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-500 py-4">참여 빵집이 없습니다.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 빵 종류 목록 팝업 */}
      {showBreadTypeList && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center"
          onClick={() => setShowBreadTypeList(false)}
        >
          <div className="bg-white rounded-xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">빵 종류 목록</h3>
              <button onClick={() => setShowBreadTypeList(false)} className="p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(breadTypeCounts).map(([type, count]) => (
                  <div key={type} className="flex flex-col items-center p-2 border rounded-lg">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden mb-2">
                      <img
                        src={`/${type}.jpg`}
                        alt={breadTypeNames[type as BreadType]}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/bread-pattern.png"
                        }}
                      />
                    </div>
                    <p className="font-medium text-center">{breadTypeNames[type as BreadType]}</p>
                    <p className="text-sm text-gray-600 text-center">{count > 0 ? `${count}개` : "없음"}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

