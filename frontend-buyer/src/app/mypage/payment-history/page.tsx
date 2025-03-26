import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function PaymentHistoryPage() {
  return (
    <main className="pb-20">
      {/* 상단 헤더 */}
      <header className="p-4 border-b flex items-center">
        <Link href="/mypage" className="mr-2">
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-xl font-bold">결제 내역</h1>
      </header>

      {/* 결제 내역 리스트 */}
      <div className="divide-y">
        {/* 결제 기록 항목들 */}
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="font-medium">결제일시</div>
            <div className="text-gray-500 text-sm">2025.03.24 19:45:22</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-orange-100 rounded-md mr-3"></div>
              <div>
                <div className="font-medium">빵긋빵긋 역삼점</div>
                <div className="text-sm text-gray-500">소보로빵 외 2개</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium">12,600원</div>
              <div className="text-xs text-primary-custom">결제완료</div>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="font-medium">결제일시</div>
            <div className="text-gray-500 text-sm">2025.03.22 10:15:33</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-orange-100 rounded-md mr-3"></div>
              <div>
                <div className="font-medium">빵긋빵긋 강남점</div>
                <div className="text-sm text-gray-500">크로와상 외 1개</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium">8,500원</div>
              <div className="text-xs text-primary-custom">결제완료</div>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="font-medium">결제일시</div>
            <div className="text-gray-500 text-sm">2025.03.20 08:30:15</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-orange-100 rounded-md mr-3"></div>
              <div>
                <div className="font-medium">빵긋빵긋 역삼점</div>
                <div className="text-sm text-gray-500">단팥빵 외 3개</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium">15,200원</div>
              <div className="text-xs text-primary-custom">결제완료</div>
            </div>
          </div>
        </div>

        {/* 더 많은 결제 내역 항목들을 추가할 수 있습니다 */}
      </div>

      {/* 결제 내역이 없을 경우 표시할 메시지 */}
      {false && (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-gray-500 mb-4">결제 내역이 없습니다.</p>
          <Link href="/order" className="px-4 py-2 bg-primary-custom text-white rounded-md">
            주문하러 가기
          </Link>
        </div>
      )}
    </main>
  )
}

