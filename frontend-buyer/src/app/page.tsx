import { ShoppingCart, Star } from "lucide-react"
import Image from "next/image"

export default function Page() {
  return (
    <main className="pb-20">
      {/* 상단 헤더 */}
      <header className="p-4 border-b">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Image src="/mascot.png" alt="빵긋 마스코트" width={40} height={40} className="mr-2" />
            <h1 className="text-2xl font-bold">빵긋 홈</h1>
          </div>
          <div className="relative">
            <ShoppingCart className="h-6 w-6" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">오늘의 추천 빵집</h2>

        {/* 추천 빵집 카드 */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center mb-3">
            <div className="w-12 h-12 bg-bread-brown rounded-full flex items-center justify-center text-white mr-3">
              <Image src="/mascot.png" alt="빵긋 마스코트" width={36} height={36} />
            </div>
            <div>
              <h3 className="font-bold">빵긋빵긋 역삼점</h3>
              <div className="flex text-primary-custom">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} fill="#FF9671" className="w-4 h-4" />
                ))}
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            역삼역 3번 출구에서 도보 5분 거리에 위치한 프리미엄 베이커리입니다. 매일 아침 신선한 빵을 구워 판매합니다.
          </p>
          <button className="w-full bg-primary-custom text-white py-2 rounded-md">주문하기</button>
        </div>

        {/* 인기 메뉴 섹션 */}
        <h2 className="text-xl font-semibold mb-4">인기 메뉴</h2>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-white rounded-lg shadow p-3">
              <div className="w-full h-32 bg-gray-200 rounded-md mb-2"></div>
              <h3 className="font-medium">소보로 빵</h3>
              <p className="text-sm text-gray-500">3,200원</p>
              <div className="flex text-primary-custom mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} fill="#FF9671" className="w-3 h-3" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

