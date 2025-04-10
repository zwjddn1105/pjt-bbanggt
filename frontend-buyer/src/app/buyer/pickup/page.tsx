"use client"

import { useEffect, useState } from "react"
import { Header } from "../../../components/ui/header"
import PickupTimer from "../../../components/pickup-timer"
import { PickupItem } from "../../../components/pickup/pickup-item"

// API 명세서에 맞게 타입 정의 수정
interface PickupItemType {
  orderId: number
  address: string
  bakeryName: string
  price: number
  salePrice: number
  count: number
  image: string
  productState: string
  breadType: string
  bakeryId: number
  vendingMachineId: number
  latitude: number
  longitude: number
  vendingMachineName: string
  slotNumber: number
  paymentDate?: string
}

export default function PickupPage() {
  const [pickupItems, setPickupItems] = useState<PickupItemType[]>([])
  const [isPickupAvailable, setIsPickupAvailable] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 픽업 가능 시간 체크
  useEffect(() => {
    const checkPickupAvailability = () => {
      const now = new Date()
      const hours = now.getHours()
      const minutes = now.getMinutes()
      const isUnavailableTime = (hours > 9 || (hours === 9 && minutes >= 30)) && hours < 20
      setIsPickupAvailable(!isUnavailableTime)
    }

    checkPickupAvailability()
    const intervalId = setInterval(checkPickupAvailability, 60000)
    return () => clearInterval(intervalId)
  }, [])

  // API 호출
  useEffect(() => {
    const fetchPickupItems = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const token = localStorage.getItem("access_token")
        if (!token) {
          // console.warn("Access Token 없음")
          setIsLoading(false)
          return
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/order/myOrder`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          throw new Error(`API 응답 실패: ${res.status}`)
        }

        const data: PickupItemType[] = await res.json()

        // 1. SOLD_OUT과 FINISHED 상태인 항목만 필터링
        const filteredItems = data.filter(
          (item) => item.productState === "SOLD_OUT" || item.productState === "FINISHED",
        )

        // 2. 정렬 로직 적용:
        // - 먼저 SOLD_OUT이 FINISHED보다 앞에 오도록 정렬
        // - 각 상태 내에서는 paymentDate 기준으로 최신순 정렬
        const sortedItems = filteredItems.sort((a, b) => {
          // 먼저 상태별로 정렬 (SOLD_OUT이 먼저)
          if (a.productState !== b.productState) {
            return a.productState === "SOLD_OUT" ? -1 : 1
          }

          // 같은 상태 내에서는 paymentDate 기준으로 최신순 정렬
          if (a.paymentDate && b.paymentDate) {
            return new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()
          }

          // paymentDate가 없는 경우 처리
          if (a.paymentDate) return -1
          if (b.paymentDate) return 1
          return 0
        })

        setPickupItems(sortedItems)
      } catch (error) {
        // console.error("픽업 데이터 불러오기 실패", error)
        setError("픽업 데이터를 불러오는데 실패했습니다.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPickupItems()
  }, [])

  return (
    <main className="pb-20">
      <Header title="빵긋 픽업" />

      <div className="p-4">
        <PickupTimer />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="p-4 text-center text-red-500">{error}</div>
        // ) : isPickupAvailable ? (
        // 확인 끝나면 주석 제거 시간제한 다시
      ) : (
        <div className="px-4">
          {pickupItems.length > 0 ? (
            pickupItems.map((item) => (
              <PickupItem
                key={item.orderId}
                orderId={item.orderId}
                bakeryName={item.bakeryName}
                breadType={item.breadType}
                count={item.count}
                price={item.price}
                salePrice={item.salePrice}
                image={item.image}
                productState={item.productState}
                address={item.address}
                vendingMachineName={item.vendingMachineName}
                // 추가 필드들 전달
                vendingMachineId={item.vendingMachineId}
                latitude={item.latitude}
                longitude={item.longitude}
                slotNumber={item.slotNumber}
                bakeryId={item.bakeryId}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center mt-8">픽업 가능한 빵이 없습니다.</p>
          )}
        </div>
        // 확인 끝나면 주석 제거 시간제한
        // ) : (
        //   <div className="p-4">
        //     <div className="bg-orange-100 p-6 rounded-lg text-center">
        //       <p className="text-lg font-medium text-orange-800">픽업 가능한 시간이 아닙니다</p>
        //       <p className="text-sm text-gray-600 mt-2">픽업 가능 시간: 오후 8시 ~ 오전 9시 30분</p>
        //     </div>
        //   </div>
      )}
    </main>
  )
}

