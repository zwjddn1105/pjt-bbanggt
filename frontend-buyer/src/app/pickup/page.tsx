"use client"

import { ShoppingCart } from "lucide-react"
import { useState, useEffect } from "react"
import { Header } from "@/components/ui/header"
import PickupTimer from "@/components/pickup-timer"
import { PickupItem } from "@/components/pickup/pickup-item"
import { useCartCount } from "@/hooks/use-cart-count"

export default function PickupPage() {
  // 장바구니 아이템 수 가져오기
  const { count } = useCartCount()

  // 픽업 가능 시간 여부 상태
  const [isPickupAvailable, setIsPickupAvailable] = useState<boolean>(true)

  // 더미 데이터
  const pickupItems = [
    { id: 1, storeName: "빵긋빵긋 역삼점 1호점", productName: "소보로빵", quantity: 1, price: 3200 },
    { id: 2, storeName: "빵긋빵긋 강남점", productName: "크로와상", quantity: 2, price: 4500 },
    { id: 3, storeName: "빵긋긋빵긋 역삼점 1호점", productName: "단팥빵", quantity: 1, price: 2800 },
  ]

  // 현재 시간이 픽업 가능 시간인지 확인
  useEffect(() => {
    const checkPickupAvailability = () => {
      const now = new Date()
      const hours = now.getHours()
      const minutes = now.getMinutes()

      // 오전 9시 30분부터 오후 8시까지는 픽업 불가능
      const isUnavailableTime =
        (hours > 9 || (hours === 9 && minutes >= 30)) && // 9:30 이후
        hours < 20 // 20:00 이전

      setIsPickupAvailable(!isUnavailableTime)
    }

    // 초기 실행
    checkPickupAvailability()

    // 1분마다 업데이트
    const intervalId = setInterval(checkPickupAvailability, 60000)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <main className="pb-20">
      <Header title="빵긋 픽업" icon={ShoppingCart} count={count} />

      {/* 픽업 타이머 */}
      <div className="p-4">
        <PickupTimer />
      </div>

      {/* 픽업 불가능 시간에는 메시지 표시, 가능 시간에는 더미 데이터 표시 */}
      {isPickupAvailable ? (
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
      ) : (
        <div className="p-4">
          <div className="bg-orange-100 p-6 rounded-lg text-center">
            <p className="text-lg font-medium text-orange-800">픽업 가능한 시간이 아닙니다</p>
            <p className="text-sm text-gray-600 mt-2">픽업 가능 시간: 오후 8시 ~ 오전 9시 30분</p>
          </div>
        </div>
      )}
    </main>
  )
}

