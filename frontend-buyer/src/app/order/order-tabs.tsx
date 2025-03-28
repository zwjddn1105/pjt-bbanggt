"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { OrderTimeNotice } from "@/components/order/order-time-notice"
import { OrderItem } from "@/components/order/order-item"

export default function OrderTabs() {
  // 탭 상태 관리를 위한 state
  const [activeTab, setActiveTab] = useState("My 빵긋")

  // 더미 데이터
  const storeItems = [
    {
      id: 1,
      storeName: "빵긋빵긋 역삼 1번출구점",
      totalCount: 30,
      availableCount: 13,
      items: [
        { name: "소보로빵", count: 6 },
        { name: "단팥빵", count: 1 },
        { name: "잡씨드너츠", count: 2 },
        { name: "꽈배기", count: 2 },
        { name: "모듬빵", count: 2 },
      ],
      isNew: true,
    },
    {
      id: 2,
      storeName: "빵긋빵긋 강남점",
      totalCount: 25,
      availableCount: 8,
      items: [
        { name: "크로와상", count: 3 },
        { name: "바게트", count: 2 },
        { name: "치즈빵", count: 3 },
      ],
    },
    {
      id: 3,
      storeName: "빵긋빵긋 선릉점",
      totalCount: 20,
      availableCount: 5,
      items: [
        { name: "식빵", count: 2 },
        { name: "치즈빵", count: 3 },
      ],
    },
  ]

  return (
    <>
      {/* 탭 네비게이션 - 개별 탭에 그림자 적용 */}
      <div className="flex items-center p-4 gap-1">
        <div className="flex flex-1">
          <button
            className={`flex-1 py-3 text-center text-white rounded-l-lg ${
              activeTab === "My 빵긋"
                ? "bg-primary-custom shadow-[0_4px_8px_rgba(0,0,0,0.2)] relative z-10"
                : "bg-gray-300"
            }`}
            onClick={() => setActiveTab("My 빵긋")}
          >
            My 빵긋
          </button>
          <button
            className={`flex-1 py-3 text-center text-white rounded-r-lg ${
              activeTab === "MY 빵집"
                ? "bg-primary-custom shadow-[0_4px_8px_rgba(0,0,0,0.2)] relative z-10"
                : "bg-gray-300"
            }`}
            onClick={() => setActiveTab("MY 빵집")}
          >
            MY 빵집
          </button>
        </div>
        {/* 검색 버튼 */}
        <button className="p-2 text-primary-custom">
          <Search width={28} height={28} />
        </button>
      </div>

      {/* 선택된 탭에 따라 다른 내용 표시 - 스크롤바 숨기기 클래스 적용 */}
      <div className="hide-scrollbar overflow-auto">
        {activeTab === "My 빵긋" ? (
          <>
            {/* 주문 가능 시간 안내 */}
            <OrderTimeNotice />

            {/* 상품(빵굿 매장) 목록 카드 반복 */}
            {storeItems.map((item) => (
              <OrderItem
                key={item.id}
                storeName={item.storeName}
                totalCount={item.totalCount}
                availableCount={item.availableCount}
                items={item.items}
                isNew={item.isNew}
              />
            ))}
          </>
        ) : (
          // MY 빵집 탭 내용
          <div className="p-4">
            <div className="text-center py-8">
              <p className="text-gray-500">등록된 빵집이 없습니다.</p>
              <button className="mt-4 bg-primary-custom text-white px-4 py-2 rounded-md">빵집 등록하기</button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

