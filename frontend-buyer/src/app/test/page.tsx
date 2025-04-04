// app/test-inquiry/page.tsx
"use client"

import InquiryButton from "@/components/inquiry/inquiry-button"

export default function TestInquiryPage() {
  const testBakeryId = 501  // 테스트용 빵집 ID (원하는 숫자로 바꿔도 돼)

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">문의하기 버튼 테스트</h1>
      <InquiryButton bakeryId={testBakeryId} />
    </main>
  )
}
