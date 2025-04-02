"use client"

import { useState } from "react"

interface FilterButtonsProps {
  onFilterChange?: (showBookmarkedOnly: boolean) => void
  onBookmarkClick?: () => void
}

export default function FilterButtons({ onFilterChange, onBookmarkClick }: FilterButtonsProps) {
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState<boolean>(false)

  const handleBookmarkedFilterClick = () => {
    const newValue = !showBookmarkedOnly
    setShowBookmarkedOnly(newValue)

    if (onFilterChange) {
      onFilterChange(newValue)
    }
  }

  return (
    <div className="flex gap-2 overflow-x-auto py-2 no-scrollbar">
      <button
        onClick={onBookmarkClick}
        className="px-4 py-1 rounded-full text-sm whitespace-nowrap bg-gray-100 text-gray-700"
      >
        빵집 북마크 하기
      </button>
      <button
        onClick={handleBookmarkedFilterClick}
        className={`px-4 py-1 rounded-full text-sm whitespace-nowrap ${
          showBookmarkedOnly ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700"
        }`}
      >
        내 빵집 빵긋 보기
      </button>
    </div>
  )
}

