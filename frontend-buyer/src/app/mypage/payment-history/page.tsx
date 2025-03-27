import { Header } from "@/components/ui/header"
import { PaymentHistoryItem } from "@/components/mypage/payment-history-item"
import Link from "next/link"

export default function PaymentHistoryPage() {
  // 더미 데이터
  const paymentHistory = [
    {
      id: 1,
      date: "2025.03.24 19:45:22",
      storeName: "빵긋빵긋 역삼점",
      items: "소보로빵 외 2개",
      amount: 12600,
      status: "결제완료",
    },
    {
      id: 2,
      date: "2025.03.22 10:15:33",
      storeName: "빵긋빵긋 강남점",
      items: "크로와상 외 1개",
      amount: 8500,
      status: "결제완료",
    },
    {
      id: 3,
      date: "2025.03.20 08:30:15",
      storeName: "빵긋빵긋 역삼점",
      items: "단팥빵 외 3개",
      amount: 15200,
      status: "결제완료",
    },
  ]

  const hasPaymentHistory = paymentHistory.length > 0

  return (
    <main className="pb-20">
      <Header title="결제 내역" backLink="/mypage" />

      {/* 결제 내역 리스트 */}
      {hasPaymentHistory ? (
        <div className="divide-y">
          {paymentHistory.map((item) => (
            <PaymentHistoryItem
              key={item.id}
              date={item.date}
              storeName={item.storeName}
              items={item.items}
              amount={item.amount}
              status={item.status}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-gray-500 mb-4">결제 내역이 없습니다.</p>
          <Link href="/order" className="px-4 py-2 bg-primary-custom text-white rounded-md">
            주문하러 가기
          </Link>
        </div>
      )}
    </main>
  )
}

