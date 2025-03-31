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

/**
 * 장바구니 아이템 컴포넌트
 *
 * @param id - 아이템 ID
 * @param name - 상품 이름
 * @param bakery - 빵집 이름
 * @param quantity - 수량
 * @param price - 가격
 * @param image - 이미지 경로
 * @param isSelected - 선택 여부
 * @param onSelectChange - 선택 상태 변경 핸들러
 * @param onDelete - 삭제 핸들러
 *
 * @remarks
 * API 연동 시 수정 사항:
 * - 이미지 경로가 없는 경우 기본 이미지 사용
 * - 삭제 버튼 클릭 시 실제 API 호출 필요
 */
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

  // 아이템 삭제
  const handleDelete = () => {
    console.log(`아이템 삭제: ${id}`)
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
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover"
          onError={(e) => {
            // 이미지 로드 실패 시 기본 이미지로 대체
            const target = e.target as HTMLImageElement
            target.src = "/bread-pattern.png"
          }}
        />
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

