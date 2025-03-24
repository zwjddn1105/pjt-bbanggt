import { ShoppingCart, Star } from "lucide-react"

export default function Page() {
  return (
    <main className="pb-20">
      {/* ✅ 상단 헤더 - 페이지 타이틀과 장바구니 아이콘 */}
      <header className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">빵긋 주문</h1>
          <div className="relative">
            <ShoppingCart className="h-6 w-6" />
            {/* ✅ 장바구니에 담긴 상품 수 표시 */}
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </div>
        </div>
      </header>

      {/* ✅ 상단 탭 네비게이션 */}
      <div className="flex border-b">
        {/* ✅ 현재 활성 탭: My 빵굿 */}
        <button className="flex-1 py-3 text-center border-b-2 border-primary-custom text-primary-custom">
          My 빵긋
        </button>
        {/* TODO: 'MY 빵집' 탭 클릭 시 페이지 전환 구현 필요 */}
        <button className="flex-1 py-3 text-center text-gray-500">MY 빵집</button>
        {/* TODO: 검색 기능 미구현 상태 */}
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

      {/* ✅ 주문 가능 시간 안내 */}
      <div className="p-4 text-sm">
        <p>20:00~9:00 까지 주문 가능합니다</p>
        <p>9:30까지 빵긋에서 찾아가세요</p>
      </div>

      {/* ✅ 상품(빵굿 매장) 목록 카드 반복 */}
      {[1, 2, 3].map((item) => (
        <div key={item} className="mx-4 mb-4 p-4 border rounded-3xl">
          <div className="flex">
            {/* ✅ 빵 이미지 그리드 (9칸) */}
            <div className="flex-shrink-0 mr-4">
              <div className="grid grid-cols-3 gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((img) => (     // 옆에 9칸 빈 네모칸 사진
                  <div key={img} className="w-10 h-10 bg-gray-200 relative">
                    {/* ✅ 첫 번째 이미지에 NEW 뱃지 */}
                    {img === 1 && (
                      <div className="absolute -top-1 -left-1 bg-red-500 text-white text-xs px-1 rounded">NEW</div>
                    )}
                    {/* TODO: 이미지 경로 연결 필요 */}
                  </div>
                ))}
              </div>
            </div>

            {/* ✅ 매장 정보 및 빵 재고 표시 */}
            <div>
              <h3 className="font-bold">빵긋빵긋 역삼점 1호점</h3>
              <p className="text-sm">잔여 갯수: 13/30</p>
              <p className="text-sm">소보로: 6개</p>
              <p className="text-sm">단팥빵: 1개</p>
              <p className="text-sm">[더보기]</p>
              {/* TODO: '더보기' 클릭 시 상세 품목 모달 또는 확장 구현 필요 */}

              {/* ✅ 별점 표시 (별 5개 고정) */}
              <div className="flex text-primary-custom mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} fill="#FF9671" className="w-4 h-4" />
                ))}
              </div>
            </div>

            {/* ✅ 우측 '자세히 보기' 버튼 */}
            <div className="ml-auto">
              {/* TODO: '자세히 보기' 클릭 시 상세 페이지 연결 필요 */}
              <button className="text-sm text-gray-500">자세히 보기</button>
            </div>
          </div>
        </div>
      ))}
    </main>
  )
}
