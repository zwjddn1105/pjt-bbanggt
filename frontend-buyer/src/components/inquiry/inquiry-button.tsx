"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createChatRoom } from "../../lib/chat"

interface InquiryButtonProps {
  bakeryId: number
}

export default function InquiryButton({ bakeryId }: InquiryButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    try {
      setLoading(true)
      await createChatRoom(bakeryId)
      router.push("/inquiry")
    } catch (error) {
      // console.error("채팅방 생성 실패:", error)
      alert("문의하기 채팅방을 생성하는 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:bg-gray-400"
    >
      {loading ? "처리 중..." : "문의하기"}
    </button>
  )
}

