interface CartSummaryProps {
  selectedItems: number
  totalItems: number
  selectedTypes: number
  totalTypes: number
  totalPrice: number
}

export default function CartSummary({
  selectedItems,
  totalItems,
  selectedTypes,
  totalTypes,
  totalPrice,
}: CartSummaryProps) {
  return (
    <div className="px-4 py-3 border-t border-b">
      <div className="flex justify-between items-center">
        <div className="font-medium">
          선택: {selectedTypes}/{totalTypes}개 품목 (총 {selectedItems}개)
        </div>
        <div className="flex items-center">
          <span className="mr-1">Total</span>
          <span className="text-lg font-bold text-orange-500">{totalPrice.toLocaleString()}원</span>
        </div>
      </div>
    </div>
  )
}

