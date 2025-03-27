import { ShoppingCart } from "lucide-react"
import { Suspense } from "react"
import { Header } from "@/components/ui/header"
import OrderTabs from "./order-tabs"
import OrderSkeleton from "./order-skeleton"

export default function OrderPage() {
  return (
    <main className="pb-20">
      <Header title="빵긋 주문" icon={ShoppingCart} count={3} />

      {/* 탭 부분은 클라이언트 컴포넌트로 분리하고 Suspense로 감싸기 */}
      <Suspense fallback={<OrderSkeleton />}>
        <OrderTabs />
      </Suspense>
    </main>
  )
}

