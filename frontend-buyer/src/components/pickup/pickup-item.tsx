import { Card } from "@/components/ui/card"

interface PickupItemProps {
  storeName: string
  productName: string
  quantity: number
  price: number
}

export function PickupItem({ storeName, productName, quantity, price }: PickupItemProps) {
  return (
    <Card className="border-primary-custom">
      <div className="flex">
        {/* 빵 이미지 */}
        <div className="w-20 h-20 bg-gray-200 rounded-md mr-3"></div>

        {/* 상품 정보 */}
        <div className="flex-1">
          <p className="font-bold">{storeName}</p>
          <h3 className="font-medium">{productName}</h3>
          <p className="text-sm">수량: {quantity}개</p>
          <p className="text-sm">
            가격: {price.toLocaleString()}원 x {quantity}개
          </p>

          {/* 픽업 완료 버튼 */}
          <button className="mt-2 bg-primary-custom text-white text-sm px-4 py-1 rounded-full">픽업 완료</button>
        </div>
      </div>
    </Card>
  )
}

