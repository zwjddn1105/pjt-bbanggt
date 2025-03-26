import { Suspense } from "react"
import { ShoppingCart } from "lucide-react"
import OrderTabs from "./order-tabs"
import OrderSkeleton from "./order-skeleton"

export default function OrderPage() {
  return (
    <main className="pb-20">
      {/* 상단 헤더 - 서버 컴포넌트로 유지 */}
      <header className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">빵긋 주문</h1>
          <div className="relative">
            <ShoppingCart className="h-6 w-6" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </div>
        </div>
      </header>

      {/* 탭 부분은 클라이언트 컴포넌트로 분리하고 Suspense로 감싸기 */}
      <Suspense fallback={<OrderSkeleton />}>
        <OrderTabs />
      </Suspense>
    </main>
  )
}

