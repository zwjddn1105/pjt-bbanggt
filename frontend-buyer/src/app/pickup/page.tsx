// "use client"

// import { useState, useEffect } from "react"
// import { Header } from "@/components/ui/header"
// import PickupTimer from "@/components/pickup-timer"
// import { PickupItem } from "@/components/pickup/pickup-item"


// export default function PickupPage() {


//   // 픽업 가능 시간 여부 상태
//   const [isPickupAvailable, setIsPickupAvailable] = useState<boolean>(true)

//   // 더미 데이터
//   const pickupItems = [
//     { id: 1, storeName: "빵긋빵긋 역삼점 1호점", productName: "소보로빵", quantity: 1, price: 3200 },
//     { id: 2, storeName: "빵긋빵긋 강남점", productName: "크로와상", quantity: 2, price: 4500 },
//     { id: 3, storeName: "빵긋긋빵긋 역삼점 1호점", productName: "단팥빵", quantity: 1, price: 2800 },
//   ]

//   // 현재 시간이 픽업 가능 시간인지 확인
//   useEffect(() => {
//     const checkPickupAvailability = () => {
//       const now = new Date()
//       const hours = now.getHours()
//       const minutes = now.getMinutes()

//       // 오전 9시 30분부터 오후 8시까지는 픽업 불가능
//       const isUnavailableTime =
//         (hours > 9 || (hours === 9 && minutes >= 30)) && // 9:30 이후
//         hours < 20 // 20:00 이전

//       setIsPickupAvailable(!isUnavailableTime)
//     }

//     // 초기 실행
//     checkPickupAvailability()

//     // 1분마다 업데이트
//     const intervalId = setInterval(checkPickupAvailability, 60000)

//     return () => clearInterval(intervalId)
//   }, [])

//   return (
//     <main className="pb-20">
//       <Header title="빵긋 픽업"/>

//       {/* 픽업 타이머 */}
//       <div className="p-4">
//         <PickupTimer />
//       </div>

//       {/* 픽업 불가능 시간에는 메시지 표시, 가능 시간에는 더미 데이터 표시 */}
//       {isPickupAvailable ? (
//         <div className="px-4">
//           {pickupItems.map((item) => (
//             <PickupItem
//               key={item.id}
//               storeName={item.storeName}
//               productName={item.productName}
//               quantity={item.quantity}
//               price={item.price}
//             />
//           ))}
//         </div>
//       ) : (
//         <div className="p-4">
//           <div className="bg-orange-100 p-6 rounded-lg text-center">
//             <p className="text-lg font-medium text-orange-800">픽업 가능한 시간이 아닙니다</p>
//             <p className="text-sm text-gray-600 mt-2">픽업 가능 시간: 오후 8시 ~ 오전 9시 30분</p>
//           </div>
//         </div>
//       )}
//     </main>
//   )
// }

"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/ui/header"
import PickupTimer from "@/components/pickup-timer"
import { PickupItem } from "@/components/pickup/pickup-item"

// 타입 정의
interface PickupItemType {
  id: number
  address: string
  bakeryName: string
  price: number
  salePrice: number
  count: number
  image: string
  productState: string
  breadType: string
}

export default function PickupPage() {
  const [pickupItems, setPickupItems] = useState<PickupItemType[]>([])
  const [isPickupAvailable, setIsPickupAvailable] = useState(true)

  // 픽업 가능 시간 체크
  useEffect(() => {
    const checkPickupAvailability = () => {
      const now = new Date()
      const hours = now.getHours()
      const minutes = now.getMinutes()
      const isUnavailableTime =
        (hours > 9 || (hours === 9 && minutes >= 30)) && hours < 20
      setIsPickupAvailable(!isUnavailableTime)
    }

    checkPickupAvailability()
    const intervalId = setInterval(checkPickupAvailability, 60000)
    return () => clearInterval(intervalId)
  }, [])

  // API 호출
  useEffect(() => {
    const fetchPickupItems = async () => {
      try {
        const token = localStorage.getItem("access_token")
        if (!token) {
          console.warn("Access Token 없음")
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
        const soldOutItems = data.filter(item => item.productState === "SOLD_OUT")
        setPickupItems(soldOutItems)
      } catch (error) {
        console.error("픽업 데이터 불러오기 실패", error)
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

      {isPickupAvailable ? (
        <div className="px-4">
          {pickupItems.length > 0 ? (
            pickupItems.map(item => (
              <PickupItem
                key={item.id}
                id={item.id}
                bakeryName={item.bakeryName}
                breadType={item.breadType}
                count={item.count}
                salePrice={item.salePrice}
                image={item.image}
                productState={item.productState}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center mt-8">픽업 가능한 빵이 없습니다.</p>
          )}
        </div>
      ) : (
        <div className="p-4">
          <div className="bg-orange-100 p-6 rounded-lg text-center">
            <p className="text-lg font-medium text-orange-800">픽업 가능한 시간이 아닙니다</p>
            <p className="text-sm text-gray-600 mt-2">픽업 가능 시간: 오후 8시 ~ 오전 9시 30분</p>
          </div>
        </div>
      )}
    </main>
  )
}
