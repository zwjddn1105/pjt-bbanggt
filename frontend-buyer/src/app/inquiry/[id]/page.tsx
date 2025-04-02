import { notFound } from "next/navigation"
import ChatDetail from "@/components/inquiry/chat-detail"

interface ChatDetailPageProps {
  params: {
    id: string
  }
}

export default function ChatDetailPage({ params }: ChatDetailPageProps) {
  // URL 파라미터에서 채팅방 ID 가져오기
  const chatRoomId = Number.parseInt(params.id)

  // 유효하지 않은 ID인 경우 404 페이지로 리다이렉트
  if (isNaN(chatRoomId)) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ChatDetail chatRoomId={chatRoomId} />
    </div>
  )
}

