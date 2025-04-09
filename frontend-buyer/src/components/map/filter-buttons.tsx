"use client"

import { useState } from "react"
import { X, Bookmark } from "lucide-react"
import { fetchBookmarkedBakeries, removeBakeryBookmark } from "../../services/breadgut-api"
import type { BakeryResponse } from "../../types/api-types"

interface FilterButtonsProps {
  onFilterChange?: (showBookmarkedOnly: boolean) => void
  onBookmarkClick?: () => void
}

export default function FilterButtons({ onFilterChange, onBookmarkClick }: FilterButtonsProps) {
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState<boolean>(false)
  const [showBookmarkPopup, setShowBookmarkPopup] = useState<boolean>(false)
  const [bookmarkedBakeries, setBookmarkedBakeries] = useState<BakeryResponse[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleBookmarkedFilterClick = () => {
    const newValue = !showBookmarkedOnly
    setShowBookmarkedOnly(newValue)

    if (onFilterChange) {
      onFilterChange(newValue)
    }
  }

  const handleMyBakeriesClick = () => {
    setShowBookmarkPopup(true)
    fetchBookmarkedBakeriesList()
  }

  const fetchBookmarkedBakeriesList = async () => {
    setLoading(true)
    setError(null)

    try {
      const bakeries = await fetchBookmarkedBakeries()
      setBookmarkedBakeries(bakeries)
    } catch (err) {
      console.error("북마크된 빵집 목록을 가져오는데 실패했습니다:", err)
      setError("북마크된 빵집 목록을 가져오는데 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveBookmark = async (bakeryId: number) => {
    try {
      await removeBakeryBookmark(bakeryId)
      // 북마크 제거 후 목록 다시 불러오기
      fetchBookmarkedBakeriesList()

      // 북마크 변경 이벤트 발생 (지도 업데이트를 위해)
      if (onBookmarkClick) {
        onBookmarkClick()
      }
    } catch (err) {
      console.error("북마크 제거에 실패했습니다:", err)
      alert("북마크 제거에 실패했습니다. 다시 시도해주세요.")
    }
  }

  return (
    <>
      <div className="flex gap-2 overflow-x-auto py-2 no-scrollbar">
        <button
          onClick={handleMyBakeriesClick}
          className="px-4 py-1 rounded-full text-sm whitespace-nowrap bg-white text-gray-700"
        >
          내 빵집 보기
        </button>
        <button
          onClick={handleBookmarkedFilterClick}
          className={`px-4 py-1 rounded-full text-sm whitespace-nowrap ${
            showBookmarkedOnly ? "bg-orange-500 text-white" : "bg-white text-gray-700"
          }`}
        >
          내 빵집 빵긋 보기
        </button>
      </div>

      {/* 북마크된 빵집 목록 팝업 */}
      {showBookmarkPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold">내 빵집 목록</h3>
              <button onClick={() => setShowBookmarkPopup(false)} className="p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : error ? (
                <div className="text-red-500 text-center p-4">{error}</div>
              ) : bookmarkedBakeries.length === 0 ? (
                <div className="text-gray-500 text-center p-4">북마크한 빵집이 없습니다.</div>
              ) : (
                <ul className="divide-y">
                  {bookmarkedBakeries.map((bakery) => (
                    <li key={bakery.id} className="py-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium">{bakery.name}</p>
                        <p className="text-sm text-gray-500">{bakery.address}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveBookmark(bakery.id)}
                        className="p-2 text-orange-500 hover:bg-orange-50 rounded-full"
                        aria-label="북마크 제거"
                      >
                        <Bookmark className="w-5 h-5 fill-orange-500" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="p-4 border-t">
              <button
                onClick={() => setShowBookmarkPopup(false)}
                className="w-full py-2 bg-orange-500 text-white rounded-lg"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

