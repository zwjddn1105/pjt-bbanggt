// "use client"

// import { Card } from "@/components/ui/card"
// import Image from "next/image"

// // API 연동 시 이 인터페이스를 API 응답 구조에 맞게 수정해야 함
// interface PickupItemProps {
//   storeName: string
//   productName: string
//   quantity: number
//   price: number
//   // API 연동 시 추가 필요한 필드:
//   // orderId?: string; // 주문 ID
//   // orderStatus?: 'pending' | 'ready' | 'completed'; // 주문 상태
//   // imageUrl?: string; // 상품 이미지 URL
//   // pickupTime?: string; // 픽업 예정 시간
// }

// /**
//  * 픽업 상품 아이템 컴포넌트
//  *
//  * @param storeName - 매장 이름
//  * @param productName - 상품 이름
//  * @param quantity - 수량
//  * @param price - 가격
//  *
//  * @remarks
//  * API 연동 시 수정 사항:
//  * 1. 더미 이미지를 실제 상품 이미지로 교체
//  * 2. 픽업 완료 버튼 클릭 시 API 호출 추가
//  * 3. 주문 상태에 따른 조건부 렌더링 추가
//  * 4. 픽업 시간 정보 표시 추가
//  *
//  * 기능적 측면:
//  * - 픽업 완료 버튼 클릭 시 확인 모달 표시 필요
//  * - 픽업 상태에 따른 다른 UI 표시 (대기 중, 준비 완료, 픽업 완료 등)
//  * - QR 코드나 바코드 표시 기능 추가 필요 (매장 확인용)
//  */
// export function PickupItem({ storeName, productName, quantity, price }: PickupItemProps) {
//   // 픽업 완료 처리 함수 (API 연동 후 구현)
//   const handlePickupComplete = () => {
//     // API 호출 예시:
//     // await completePickup(orderId);
//     console.log("픽업 완료 처리")
//   }

//   return (
//     <Card className="border-primary-custom">
//       <div className="flex">
//         {/* 빵 이미지 */}
//         <div className="w-20 h-20 relative rounded-md mr-3 overflow-hidden">
//           <Image src="/bread-pattern.png" alt={productName} fill className="object-cover" />
//         </div>

//         {/* 상품 정보 - API 데이터로 교체 필요 */}
//         <div className="flex-1">
//           <p className="text-sm text-gray-600">{storeName}</p>
//           <h3 className="font-medium">{productName}</h3>
//           <p className="text-sm">수량: {quantity}개</p>
//           <p className="text-sm">
//             가격: {price.toLocaleString()}원 x {quantity}개
//           </p>

//           {/* 픽업 완료 버튼 - API 연동 시 실제 픽업 완료 API 호출 필요 */}
//           <button
//             className="mt-2 bg-primary-custom text-white text-sm px-4 py-1 rounded-full"
//             onClick={handlePickupComplete}
//           >
//             픽업 완료
//           </button>
//         </div>
//       </div>
//     </Card>
//   )
// }

"use client"

import { Card } from "@/components/ui/card"
import Image from "next/image"

interface PickupItemProps {
  id: number
  bakeryName: string
  breadType: string
  count: number
  salePrice: number
  image: string
  // 추후에 필요하면 아래 추가
  // productState?: 'AVAILABLE' | 'SOLD_OUT' | 'PENDING'
  productState : string
}

export function PickupItem({
  id,
  bakeryName,
  breadType,
  count,
  salePrice,
  image,
  productState,
}: PickupItemProps) {
  const handlePickupComplete = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/order/${id}/complete`, // 예시
        { method: "POST", credentials: "include" }
      )
      if (!res.ok) throw new Error("픽업 처리 실패")
      alert("픽업이 완료되었습니다!")
    } catch (err) {
      console.error(err)
      alert("픽업 처리 중 오류가 발생했습니다.")
    }
  }

  return (
    <Card className="border-primary-custom">
      <div className="flex">
        {/* 빵 이미지 */}
        <div className="w-20 h-20 relative rounded-md mr-3 overflow-hidden">
          <Image src={image} alt={breadType} fill className="object-cover" />
        </div>

        {/* 상품 정보 */}
        <div className="flex-1">
          <p className="text-sm text-gray-600">{bakeryName}</p>
          <h3 className="font-medium">{breadType}</h3>
          <p className="text-sm">수량: {count}개</p>
          <p className="text-sm">
            가격: {salePrice.toLocaleString()}원 x {count}개
          </p>

          <button
            className="mt-2 bg-primary-custom text-white text-sm px-4 py-1 rounded-full"
            onClick={handlePickupComplete}
          >
            픽업 완료
          </button>
        </div>
      </div>
    </Card>
  )
}
