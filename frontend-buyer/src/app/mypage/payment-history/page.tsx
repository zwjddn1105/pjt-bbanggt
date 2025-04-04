"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/ui/header"
import { PaymentHistoryItem } from "@/components/mypage/payment-history-item"
import Link from "next/link"
import { OrderService } from "@/services"
import type { OrderResponse, ProductState, BreadType } from "@/types/api-types"
import { apiClient } from '@/config/api'
const fetchOrder = async () => {
  const res = await apiClient.get('/api/v1/order/myOrder')
  return res.data
}
/**
 * 결제 내역 페이지
 *
 * @remarks
 * API 연동 구현:
 * 1. OrderService.getMyOrders()를 호출하여 주문 목록을 가져옴
 * 2. productState가 SOLD_OUT인 주문만 필터링하여 표시
 * 3. 날짜 정보는 백엔드에서 아직 구현되지 않아 임시 데이터 사용
 *
 * 유지보수 참고사항:
 * - 백엔드에서 날짜 API가 구현되면 해당 데이터로 교체 필요
 * - 더미 데이터는 API 연동 실패 시 폴백으로 사용 가능
 */
export default function PaymentHistoryPage() {
  const [paymentHistory, setPaymentHistory] = useState<OrderResponse[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [useDummyData, setUseDummyData] = useState<boolean>(false)

  // 더미 데이터 (API 연동 실패 시 폴백으로 사용 가능)
  // OrderResponse 타입에 맞게 더미 데이터 구조 수정
  const dummyPaymentHistory: OrderResponse[] = [
    {
      id: 1,
      bakeryName: "빵긋빵긋 역삼점",
      price: 12600,
      salePrice: 12600,
      count: 3,
      image: "/mascot.png",
      productState: "SOLD_OUT" as ProductState,
      breadType: "SOBORO" as BreadType,
      memo: "소보로빵 외 2개",
    },
    {
      id: 2,
      bakeryName: "빵긋빵긋 강남점",
      price: 8500,
      salePrice: 8500,
      count: 2,
      image: "/mascot.png",
      productState: "SOLD_OUT" as ProductState,
      breadType: "CROISSANT" as BreadType,
      memo: "크로와상 외 1개",
    },
    {
      id: 3,
      bakeryName: "빵긋빵긋 역삼점",
      price: 15200,
      salePrice: 15200,
      count: 4,
      image: "/mascot.png",
      productState: "SOLD_OUT" as ProductState,
      breadType: "SWEET_RED_BEAN" as BreadType,
      memo: "단팥빵 외 3개",
    },
  ]

  // API에서 주문 내역 가져오기
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true)
        setUseDummyData(false)
        console.log("주문 내역 API 호출 시작...")

        const orders = await OrderService.getMyOrders()
        console.log("API 응답 받음:", orders)

        // SOLD_OUT 상태인 주문만 필터링
        const soldOutOrders = orders.filter((order) => order.productState === "SOLD_OUT")
        console.log("SOLD_OUT 상태 주문만 필터링:", soldOutOrders)

        setPaymentHistory(soldOutOrders)
      } catch (err: any) {
        console.error("주문 내역을 불러오는 중 오류가 발생했습니다:", err)

        // 개발 중에는 API 실패 시 더미 데이터 사용
        console.log("API 실패로 더미 데이터 사용")
        setPaymentHistory(dummyPaymentHistory)
        setUseDummyData(true) // 더미 데이터 사용 상태 설정
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const hasPaymentHistory = paymentHistory.length > 0

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <main className="pb-20">
        <Header title="결제 내역" backLink="/mypage" />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-custom"></div>
        </div>
      </main>
    )
  }

  // 에러 상태 처리 (더미 데이터를 사용하지 않는 경우에만)
  if (error && !useDummyData) {
    return (
      <main className="pb-20">
        <Header title="결제 내역" backLink="/mypage" />
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary-custom text-white rounded-md"
          >
            다시 시도
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="pb-20">
      <Header title="결제 내역" backLink="/mypage" />

      {/* 더미 데이터 사용 시 알림 표시 */}
      {useDummyData && (
        <div className="bg-yellow-100 p-2 text-sm text-yellow-800 text-center">
          API 연동 실패로 더미 데이터를 표시합니다.
          <button onClick={() => window.location.reload()} className="ml-2 underline">
            다시 시도
          </button>
        </div>
      )}

      {/* 결제 내역 리스트 */}
      {hasPaymentHistory ? (
        <div className="divide-y">
          {paymentHistory.map((item) => (
            <PaymentHistoryItem
              key={item.id}
              date={new Date().toLocaleString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })} // 날짜 정보가 없으므로 현재 시간으로 임시 표시
              storeName={item.bakeryName}
              items={`${getBreadTypeKorean(item.breadType)} ${item.count > 1 ? `외 ${item.count - 1}개` : ""}`}
              amount={item.salePrice}
              status="결제완료"
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

/**
 * 빵 타입 영문을 한글로 변환하는 함수
 *
 * @param breadType - API에서 받은 빵 타입 영문 코드
 * @returns 한글로 변환된 빵 타입 이름
 */
function getBreadTypeKorean(breadType: string): string {
  const breadTypeMap: Record<string, string> = {
    SOBORO: "소보로빵",
    SWEET_RED_BEAN: "단팥빵",
    WHITE_BREAD: "식빵",
    BAGUETTE: "바게트",
    CROISSANT: "크로와상",
    DONUT: "도넛",
    CREAM_BREAD: "크림빵",
    GARLIC_BREAD: "마늘빵",
    MIXED_BREAD: "모듬빵",
    OTHER: "기타",
  }

  return breadTypeMap[breadType] || breadType
}

