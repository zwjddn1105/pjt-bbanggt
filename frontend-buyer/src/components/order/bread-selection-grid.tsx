"use client"

import { useState } from "react"
import Image from "next/image"

interface BreadItem {
  id: number
  selected: boolean
  available: boolean
}

interface BreadSelectionGridProps {
  initialSelectedCount?: number
}

export default function BreadSelectionGrid({ initialSelectedCount = 0 }: BreadSelectionGridProps) {
  // 더미 데이터 - 실제로는 API에서 가져와야 함
  const [breadItems, setBreadItems] = useState<BreadItem[]>(
    Array(48)
      .fill(null)
      .map((_, index) => ({
        id: index,
        // 모든 빵이 선택되지 않은 상태로 시작
        selected: false,
        available: Math.random() > 0.4, // 약 60%는 사용 가능
      })),
  )

  const [selectedCount, setSelectedCount] = useState(0)

  const handleBreadClick = (index: number) => {
    const item = breadItems[index]

    // 이미 선택된 빵을 클릭하면 선택 해제
    if (item.selected) {
      setBreadItems(breadItems.map((bread, i) => (i === index ? { ...bread, selected: false } : bread)))
      setSelectedCount(0) // 선택된 빵이 없으므로 0으로 설정
    }
    // 선택 가능한 빵을 클릭하면 해당 빵만 선택하고 나머지는 선택 해제
    else if (item.available) {
      setBreadItems(
        breadItems.map((bread, i) => ({
          ...bread,
          // 클릭한 빵만 선택 상태로, 나머지는 모두 선택 해제
          selected: i === index,
        })),
      )
      setSelectedCount(1) // 항상 1개만 선택됨
    }
  }

  return (
    <div className="mt-4">
      <div className="grid grid-cols-8 gap-2">
        {breadItems.map((item, index) => (
          <div
            key={item.id}
            className={`w-8 h-8 rounded-md flex items-center justify-center cursor-pointer ${
              !item.available
                ? "bg-gray-300" // 비어있는 칸은 회색 배경
                : item.selected
                  ? "bg-white border-2 border-orange-400" // 선택된 빵은 흰색 배경에 주황색 테두리
                  : "bg-white border border-gray-200" // 선택 가능한 빵은 흰색 배경에 연한 테두리
            }`}
            onClick={() => item.available && handleBreadClick(index)}
          >
            {item.available && (
              <Image src="/bread-pattern.png" alt="빵 아이콘" width={16} height={16} className="object-contain" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

