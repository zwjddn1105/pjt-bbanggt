import { ShoppingCart } from "lucide-react"
import { Header } from "@/components/ui/header"
import PickupTimer from "@/components/pickup-timer"
import { PickupItem } from "@/components/pickup/pickup-item"

export default function PickupPage() {
  // 더미 데이터
  const pickupItems = [
    { id: 1, storeName: "빵긋빵긋 역삼점 1호점", productName: "소보로빵", quantity: 1, price: 3200 },
    { id: 2, storeName: "빵긋빵긋 강남점", productName: "크로와상", quantity: 2, price: 4500 },
    { id: 3, storeName: "빵긋빵긋 역삼점 1호점", productName: "단팥빵", quantity: 1, price: 2800 },
  ]

  return (
    <main className="pb-20">
      <Header title="빵긋 픽업" icon={ShoppingCart} count={2} />

      {/* 픽업 타이머 */}
      <div className="p-4">
        <PickupTimer />
      </div>

      {/* 픽업 상품 목록 */}
      <div className="px-4">
        {pickupItems.map((item) => (
          <PickupItem
            key={item.id}
            storeName={item.storeName}
            productName={item.productName}
            quantity={item.quantity}
            price={item.price}
          />
        ))}
      </div>
    </main>
  )
}

