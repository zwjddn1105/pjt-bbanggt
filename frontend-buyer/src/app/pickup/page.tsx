import { ShoppingBag } from "lucide-react"
import PickupTimer from "@/components/pickup-timer"

export default function PickupPage() {
  return (
    <main className="pb-20">
      {/* 상단 헤더 */}
      <header className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">빵긋 픽업</h1>
          <div className="relative">
            <ShoppingBag className="h-6 w-6" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              2
            </span>
          </div>
        </div>
      </header>

      {/* 픽업 타이머 */}
      <div className="p-4">
        <PickupTimer />
      </div>

      {/* 픽업 상품 목록 */}
      <div className="px-4">
        {[1, 2, 3].map((item) => (
          <div key={item} className="border border-primary-custom rounded-xl p-4 mb-4">
            <div className="flex">
              {/* 빵 이미지 */}
              <div className="w-20 h-20 bg-gray-200 rounded-md mr-3"></div>

              {/* 상품 정보 */}
              <div className="flex-1">
                <p className="text-sm text-gray-600">빵굿빵굿 역삼점 1호점</p>
                <h3 className="font-medium">소보로빵</h3>
                <p className="text-sm">수량: 1개</p>
                <p className="text-sm">가격: 3,200원 x 1개</p>

                {/* 픽업 완료 버튼 */}
                <button className="mt-2 bg-primary-custom text-white text-sm px-4 py-1 rounded-full">픽업 완료</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

