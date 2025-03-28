"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Trash2 } from "lucide-react"

interface CartItemProps {
  id: number
  name: string
  bakery: string
  quantity: number
  price: number
  image: string
  isSelected?: boolean
  onSelectChange: (id: number, selected: boolean) => void
  onDelete: (id: number) => void
}

export default function CartItem({
  id,
  name,
  bakery,
  quantity,
  price,
  image,
  isSelected = true,
  onSelectChange,
  onDelete,
}: CartItemProps) {
  const [selected, setSelected] = useState(isSelected)

  // 부모 컴포넌트에서 isSelected prop이 변경되면 상태 업데이트
  useEffect(() => {
    setSelected(isSelected)
  }, [isSelected])

  // 선택 상태 토글
  const toggleSelection = () => {
    const newSelected = !selected
    setSelected(newSelected)
    onSelectChange(id, newSelected)
  }

  // 아이템 삭제 (API 연동 시 구현)
  const handleDelete = () => {
    console.log(`아이템 삭제: ${id}`)
    // API 호출 예시: deleteCartItem(id)
    onDelete(id)
  }

  return (
    <div className="flex items-center py-3 border-b">
      {/* 선택 체크박스 */}
      <div
        className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mr-3 cursor-pointer ${
          selected ? "bg-orange-400" : "border-2 border-gray-300"
        }`}
        onClick={toggleSelection}
      >
        {selected && <div className="w-2 h-2 bg-white rounded-full"></div>}
      </div>

      {/* 상품 이미지 */}
      <div className="w-14 h-14 relative rounded-md overflow-hidden mr-3">
        <Image src={image || "/bread-pattern.png"} alt={name} fill className="object-cover" />
      </div>

      {/* 상품 정보 */}
      <div className="flex-1">
        <h3 className="font-medium">{name}</h3>
        <p className="text-sm text-gray-500">빵집: {bakery}</p>
        <div className="flex justify-between mt-1">
          <p className="text-sm">개수: {quantity}개</p>
          <p className="text-sm">가격: {price.toLocaleString()}원</p>
        </div>
      </div>

      {/* 삭제 버튼 */}
      <button className="ml-2 p-2 text-gray-400" onClick={handleDelete}>
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  )
}

