import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"

interface OrderItemProps {
  storeName: string
  availableCount: number
  totalCount: number
  items: { name: string; count: number }[]
  isNew?: boolean
}

export function OrderItem({ storeName, availableCount, totalCount, items, isNew = false }: OrderItemProps) {
  return (
    <Card className="mx-4">
      <div className="flex">
        {/* 이미지 그리드 */}
        <div className="flex-shrink-0 mr-4">
          <div className="grid grid-cols-3 gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((img) => (
              <div key={img} className="w-10 h-10 bg-gray-200 relative">
                {img === 1 && isNew && (
                  <div className="absolute -top-1 -left-1 bg-red-500 text-white text-xs px-1 rounded">NEW</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 상품 정보 */}
        <div>
          <h3 className="font-bold">{storeName}</h3>
          <p className="text-sm">
            잔여 갯수: {availableCount}/{totalCount}
          </p>
          {items.map((item, index) => (
            <p key={index} className="text-sm">
              {item.name}: {item.count}개
            </p>
          ))}
          <br />
          <p className="text-sm">[더보기]</p>

          {/* 별점 표시 */}
          {/* <div className="flex text-primary-custom mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} fill="#FF9671" className="w-4 h-4" />
            ))}
          </div> */}
        </div>

        {/* 버튼 */}
        <div className="ml-auto">
          <button className="text-sm text-gray-500">자세히 보기</button>
        </div>
      </div>
    </Card>
  )
}

