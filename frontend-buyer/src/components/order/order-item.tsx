"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import StoreDetailModal from "./store-detail-modal"
import BreadDetailPopup from "./bread-detail-popup"
import Image from "next/image"

// API 연동 시 이 인터페이스를 API 응답 구조에 맞게 수정해야 함
interface OrderItemProps {
  storeName: string
  availableCount: number
  totalCount: number
  items: { name: string; count: number }[]
  isNew?: boolean
  // API 연동 시 추가 필요한 필드:
  // storeId?: string; // 매장 상세 페이지로 이동 시 필요
  // imageUrls?: string[]; // 실제 이미지 URL 배열
  // rating?: number; // 별점 (1-5)
}

/**
 * 주문 가능한 매장 아이템 컴포넌트
 *
 * @param storeName - 매장 이름
 * @param availableCount - 현재 이용 가능한 수량
 * @param totalCount - 총 수량
 * @param items - 판매 중인 상품 목록
 * @param isNew - 신규 매장 여부
 *
 * @remarks
 * API 연동 시 수정 사항:
 * 1. 더미 이미지 그리드를 실제 상품 이미지로 교체
 * 2. 별점을 API에서 받아온 실제 평점으로 표시
 * 3. '자세히 보기' 버튼에 매장 ID를 사용한 상세 페이지 링크 추가
 * 4. 재고 상태에 따른 조건부 렌더링 추가 (품절 표시 등)
 *
 * 기능적 측면:
 * - 이미지 클릭 시 상품 상세 모달 표시 기능 추가 필요
 * - 별점 컴포넌트를 별도로 분리하여 재사용성 높이기
 * - 재고가 적을 경우 경고 표시 추가
 */
export function OrderItem({ storeName, availableCount, totalCount, items, isNew = false }: OrderItemProps) {
  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false)
  // 빵 상세 팝업 상태 관리
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  // 재고 상태에 따른 스타일 변경 로직 (API 연동 후 구현)
  // const stockStatus = availableCount / totalCount < 0.2 ? 'low' : 'normal';

  // 더보기 버튼 클릭 핸들러
  const handleMoreClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsPopupOpen(true)
  }

  // 표시할 아이템 제한 (최대 3개)
  const displayItems = items.slice(0, 3)
  const hasMoreItems = items.length > 3

  return (
    <>
      <Card className="mx-4">
        <div className="flex">
          {/* 이미지 그리드 - API 연동 시 실제 이미지로 교체 필요 */}
          <div className="flex-shrink-0 mr-4">
            <div className="w-32 h-32 relative rounded-md overflow-hidden">
              <Image src="/bread-pattern.png" alt="매장 이미지" fill className="object-cover" />
              {isNew && <div className="absolute top-1 left-1 bg-red-500 text-white text-xs px-1 rounded">NEW</div>}
            </div>
          </div>

          {/* 상품 정보 - API 데이터로 교체 필요 */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h3 className="font-bold">{storeName}</h3>
              <p className="text-sm">
                잔여 갯수: {availableCount}/{totalCount}
              </p>
              {displayItems.map((item, index) => (
                <p key={index} className="text-sm">
                  {item.name}: {item.count}개
                </p>
              ))}
            </div>

            {/* 하단 정보 및 버튼 */}
            <div className="flex justify-between items-center mt-auto">
              {hasMoreItems ? (
                <button className="text-sm text-blue-500 hover:underline" onClick={handleMoreClick}>
                  [더보기]
                </button>
              ) : (
                <span className="text-sm text-transparent">빈공간</span>
              )}
              <button className="text-sm text-gray-500" onClick={() => setIsModalOpen(true)}>
                자세히 보기
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* 매장 상세 모달 */}
      <StoreDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        storeName={storeName}
        availableCount={availableCount}
      />

      {/* 빵 상세 팝업 */}
      <BreadDetailPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        storeName={storeName}
        availableCount={availableCount}
        totalCount={totalCount}
        items={items}
      />
    </>
  )
}

