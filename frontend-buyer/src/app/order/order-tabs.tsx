"use client"

import { useState } from "react"
import { Star } from "lucide-react"

export default function OrderTabs() {
  // 탭 상태 관리를 위한 state
  const [activeTab, setActiveTab] = useState("My 빵긋")

  return (
    <>
      {/* 탭 네비게이션 */}
      <div className="flex border-b">
        <button
          className={`flex-1 py-3 text-center ${
            activeTab === "My 빵긋" ? "border-b-2 border-primary-custom text-primary-custom" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("My 빵긋")}
        >
          My 빵긋
        </button>
        <button
          className={`flex-1 py-3 text-center ${
            activeTab === "MY 빵집" ? "border-b-2 border-primary-custom text-primary-custom" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("MY 빵집")}
        >
          MY 빵집
        </button>
        {/* 검색 버튼 */}
        <button className="p-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary-custom"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </button>
      </div>

      {/* 선택된 탭에 따라 다른 내용 표시 - 스크롤바 숨기기 클래스 적용 */}
      <div className="hide-scrollbar overflow-auto">
        {activeTab === "My 빵긋" ? (
          <>
            {/* 주문 가능 시간 안내 */}
            <div className="p-4 text-sm">
              <p>20:00~9:00 까지 주문 가능합니다</p>
              <p>9:30까지 빵긋에서 찾아가세요</p>
            </div>

            {/* 상품(빵굿 매장) 목록 카드 반복 */}
            {[1, 2, 3].map((item) => (
              <div key={item} className="mx-4 mb-4 p-4 border rounded-3xl">
                <div className="flex">
                  {/* 빵 이미지 그리드 (9칸) */}
                  <div className="flex-shrink-0 mr-4">
                    <div className="grid grid-cols-3 gap-1">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((img) => (
                        <div key={img} className="w-10 h-10 bg-gray-200 relative">
                          {/* 첫 번째 이미지에 NEW 뱃지 */}
                          {img === 1 && (
                            <div className="absolute -top-1 -left-1 bg-red-500 text-white text-xs px-1 rounded">
                              NEW
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 매장 정보 및 빵 재고 표시 */}
                  <div>
                    <h3 className="font-bold">빵긋빵긋 역삼점 1호점</h3>
                    <p className="text-sm">잔여 갯수: 13/30</p>
                    <p className="text-sm">소보로: 6개</p>
                    <p className="text-sm">단팥빵: 1개</p>
                    <p className="text-sm">[더보기]</p>

                    {/* 별점 표시 (별 5개 고정) */}
                    <div className="flex text-primary-custom mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} fill="#FF9671" className="w-4 h-4" />
                      ))}
                    </div>
                  </div>

                  {/* 우측 '자세히 보기' 버튼 */}
                  <div className="ml-auto">
                    <button className="text-sm text-gray-500">자세히 보기</button>
                  </div>
                </div>
              </div>
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

