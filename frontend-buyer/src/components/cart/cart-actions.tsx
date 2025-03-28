"use client"

import { useRouter } from "next/navigation"

export default function CartActions() {
  const router = useRouter()

  // 뒤로 가기
  const handleGoBack = () => {
    router.back()
  }

  // 주문하기 (API 연동 시 구현)
  const handleOrder = () => {
    console.log("주문하기 클릭")
    // API 호출 예시: placeOrder(selectedItems)
    // 성공 시 주문 완료 페이지로 이동
    // router.push('/order/complete')
  }

  return (
    <div className="fixed bottom-16 left-0 right-0 px-4 py-3 bg-white border-t">
      <div className="flex gap-3">
        <button onClick={handleGoBack} className="flex-1 py-3 bg-gray-700 text-white rounded-md font-medium">
          돌아가기
        </button>
        <button onClick={handleOrder} className="flex-1 py-3 bg-orange-400 text-white rounded-md font-medium">
          주문하기
        </button>
      </div>
    </div>
  )
}

