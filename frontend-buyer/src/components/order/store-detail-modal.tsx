"use client"

import { useEffect, useState } from "react"
import { Star, MapPin, ShoppingCart } from "lucide-react"
import BreadSelectionGrid from "./bread-selection-grid"
import Image from "next/image"

interface StoreDetailModalProps {
  isOpen: boolean
  onClose: () => void
  storeName: string
  period?: string
  availableCount?: number
  totalRating?: number
}

export default function StoreDetailModal({
  isOpen,
  onClose,
  storeName,
  period = "11/30 ~ 12/15",
  availableCount = 6,
  totalRating = 5,
}: StoreDetailModalProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [currentView, setCurrentView] = useState<"selection" | "detail">("selection")
  const totalCount = 30 // Assuming a default value for totalCount

  // 모달이 열릴 때 애니메이션을 위한 상태 관리
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden" // 배경 스크롤 방지
      setTimeout(() => setIsVisible(true), 10)
    } else {
      setIsVisible(false)
      setTimeout(() => {
        document.body.style.overflow = "" // 배경 스크롤 복원
        // 모달이 닫힐 때 초기 화면으로 리셋
        setCurrentView("selection")
      }, 300) // 애니메이션 시간과 일치시킴
    }
  }, [isOpen])

  // 빵긋긋보기 버튼 클릭 핸들러
  const handleViewBread = () => {
    setCurrentView("detail")
  }

  // 취소 버튼 클릭 핸들러
  const handleCancel = () => {
    if (currentView === "detail") {
      // 상세 화면에서 취소 시 선택 화면으로 돌아감
      setCurrentView("selection")
    } else {
      // 선택 화면에서 취소 시 모달 닫기
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end justify-center transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* 배경 오버레이 - 블러 효과 적용 */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* 모달 컨텐츠 */}
      <div
        className={`relative w-full max-w-md bg-white rounded-t-3xl overflow-hidden transition-transform duration-300 ease-out ${
          isVisible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* 상단 핸들 */}
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mt-3"></div>

        {currentView === "selection" ? (
          // 빵 선택 화면
          <>
            {/* 매장 정보 카드 */}
            <div className="p-4 border-b">
              <h2 className="text-xl font-bold mb-3">{storeName}</h2>

              <div className="flex">
                {/* 이미지 그리드 */}
                <div className="flex-shrink-0 mr-4">
                  <div className="w-32 h-32 relative rounded-md overflow-hidden">
                    <Image src="/bread-pattern.png" alt="매장 이미지" fill className="object-cover" />
                  </div>
                </div>

                {/* 매장 정보 */}
                <div className="flex-1">
                  <p className="text-sm">
                    잔여 갯수: {availableCount}/{totalCount}
                  </p>
                  <p className="text-sm">소보로: 6개</p>
                  <p className="text-sm">단팥빵: 1개</p>
                  <p className="text-sm">[더보기]</p>

                  {/* 별점 */}
                  <div className="flex text-primary-custom mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} fill="#FF9671" className="w-4 h-4" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 빵 선택 섹션 */}
            <div className="p-4 bg-orange-50">
              {/* 카카오 지도 버튼 */}
              <div className="flex justify-end mb-2">
                <button className="text-sm bg-orange-400 text-white px-3 py-1 rounded-full flex items-center">
                  <MapPin size={14} className="mr-1" />
                  카카오 지도 찾아가기
                </button>
              </div>

              {/* 재고 정보 */}
              <div className="mb-4">
                <p className="text-sm mb-1">남은 빵긋: 13/30</p>
                <p className="text-sm mb-1">남은 빵 종류: 2</p>
                <p className="text-sm flex justify-between">
                  <span>참여 빵긋: 3</span>
                  <button className="text-orange-500 font-medium bg-orange-100 px-2 py-1 rounded-md">목록보기</button>
                </p>
              </div>

              {/* 빵 선택 그리드 */}
              <BreadSelectionGrid initialSelectedCount={0} />

              {/* 하단 버튼 */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleCancel}
                  className="flex-1 py-3 bg-white border border-gray-300 rounded-md font-medium"
                >
                  취소
                </button>
                <button
                  onClick={handleViewBread}
                  className="flex-1 py-3 bg-orange-400 text-white rounded-md font-medium"
                >
                  빵긋보기
                </button>
              </div>
            </div>
          </>
        ) : (
          // 빵 상세 화면 - 모달 크기에 맞게 조정
          <div className="bg-white h-full flex flex-col" style={{ height: "667px" }}>
            {/* 매장 정보 */}
            <div className="p-4 text-center border-b">
              <h2 className="text-xl font-bold">{storeName}</h2>
              <div className="flex items-center justify-center text-gray-500 mt-1">
                <MapPin size={16} className="mr-1" />
                <p className="text-sm">서울특별시 강남구 역삼동 391-2</p>
              </div>
            </div>

            {/* 빵 상세 정보 카드 - 카드 캐러셀 형태 */}
            <div className="p-4 flex-1 overflow-hidden">
              <div className="relative h-full flex items-center justify-center">
                {/* 왼쪽 노란색 카드 */}
                <div className="absolute left-0 w-1/4 h-5/6 bg-yellow-200 rounded-xl shadow-md transform -translate-x-1/4"></div>

                {/* 가운데 흰색 메인 카드 */}
                <div className="relative w-3/4 h-full bg-white rounded-xl border shadow-lg z-10">
                  {/* 빵 이미지 및 정보 */}
                  <div className="p-4 h-full flex flex-col">
                    <div className="mb-4 flex-shrink-0">
                      <div className="w-full h-48 relative rounded-lg overflow-hidden">
                        <Image src="/bread-pattern.png" alt="빵 이미지" fill className="object-cover" />
                      </div>
                    </div>

                    <div className="text-center flex-1">
                      <h3 className="text-lg font-bold">파리바게트</h3>
                      <p className="text-sm text-gray-600 mt-1">샌드박스 A 팩 4개 구성</p>
                      <p className="font-bold mt-2">8000원</p>

                      {/* 추가 내용 공간 */}
                      <div className="mt-8 text-left">
                        <p className="text-sm text-gray-600 mb-2">제품 설명:</p>
                        <p className="text-sm">
                          신선한 재료로 만든 파리바게트의 대표 상품입니다. 4가지 다양한 빵을 한 번에 즐길 수 있는 세트
                          구성입니다.
                        </p>
                        <p className="text-sm mt-4">유통기한: 제조일로부터 3일</p>
                        <p className="text-sm mt-2">보관방법: 서늘하고 건조한 곳에 보관</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 오른쪽 주황색 카드 */}
                <div className="absolute right-0 w-1/4 h-5/6 bg-orange-400 rounded-xl shadow-md transform translate-x-1/4"></div>
              </div>
            </div>

            {/* 하단 네비게이션 - 장바구니 아이콘과 버튼 */}
            <div className="flex items-center justify-between p-4 border-t">
              <div className="relative">
                <ShoppingCart size={32} />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </div>

              <div className="flex gap-3 flex-1 ml-4">
                <button
                  onClick={handleCancel}
                  className="flex-1 py-3 bg-white border border-gray-300 rounded-md font-medium"
                >
                  취소
                </button>
                <button className="flex-1 py-3 bg-orange-400 text-white rounded-md font-medium">장바구니에 담기</button>
                <button className="flex-1 py-3 bg-bread-brown text-white rounded-md font-medium">결제하기</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

