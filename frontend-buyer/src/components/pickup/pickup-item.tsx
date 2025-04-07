"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Navigation } from "lucide-react" // X 아이콘 추가

// API 명세서에 맞게 Props 인터페이스 수정 (? 제거)
interface PickupItemProps {
  orderId: number
  address: string
  bakeryName: string
  breadType: string
  count: number
  price: number
  salePrice: number
  image: string
  productState: string
  vendingMachineName: string
  vendingMachineId: number
  latitude: number
  longitude: number
  slotNumber: number
  bakeryId: number
}

// 빵 타입별 한글 이름 매핑
const breadTypeNames: Record<string, string> = {
  SOBORO: "소보로빵",
  SWEET_RED_BEAN: "단팥빵",
  WHITE_BREAD: "식빵",
  BAGUETTE: "바게트",
  CROISSANT: "크루아상",
  DONUT: "도넛",
  CREAM_BREAD: "크림빵",
  GARLIC_BREAD: "마늘빵",
  OTHER: "기타",
  MIXED_BREAD: "모듬빵",
}

export function PickupItem({
  orderId,
  address,
  bakeryName,
  breadType,
  count,
  price,
  salePrice,
  image,
  productState,
  vendingMachineName,
  latitude,
  longitude,
  vendingMachineId,
  slotNumber,
  bakeryId,
}: PickupItemProps) {
  const [isLoading, setIsLoading] = useState(false)

  // 빵 타입 한글 이름 가져오기
  const getBreadTypeName = (type: string): string => {
    return breadTypeNames[type] || type
  }

  // 상태에 따른 라벨 텍스트와 스타일 가져오기
  const getStatusLabel = () => {
    if (productState === "SOLD_OUT") {
      return {
        text: "픽업 대기",
        className: "bg-orange-100 text-orange-700",
      }
    } else if (productState === "FINISHED") {
      return {
        text: "픽업완료",
        className: "bg-green-100 text-green-700",
      }
    } else {
      return {
        text: productState,
        className: "bg-gray-100 text-gray-700",
      }
    }
  }

  // 길찾기 기능 추가
  const handleNavigation = () => {
    // 위도와 경도로 길찾기 실행
    const kakaoMapUrl = `https://map.kakao.com/link/to/${vendingMachineName},${latitude},${longitude}`
    window.open(kakaoMapUrl, "_blank")
  }

  // 주문 취소 함수 추가
  const handleRefund = async () => {
    // 확인 다이얼로그 표시
    const confirmed = window.confirm("정말로 주문을 취소하시겠습니까?")
    if (!confirmed) {
      console.log("주문 취소가 취소되었습니다.")
      return
    }

    setIsLoading(true)
    try {
      // access_token 가져오기
      const token = localStorage.getItem("access_token")
      if (!token) {
        throw new Error("로그인이 필요합니다")
      }

      // API URL 생성 및 로그 출력
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/order/${orderId}/refund`
      console.log(`[주문 취소 API 호출] URL: ${apiUrl}`)
      console.log(`[주문 취소 API 호출] 주문 ID: ${orderId}`)
      console.log(`[주문 취소 API 호출] 토큰: ${token.substring(0, 10)}...`)

      // 환불 API 호출
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      console.log(`[주문 취소 API 응답] 상태 코드: ${response.status}`)

      // 응답 데이터 로그 출력
      let responseData
      try {
        responseData = await response.json()
        console.log("[주문 취소 API 응답] 데이터:", responseData)
      } catch (e) {
        console.log("[주문 취소 API 응답] 데이터 없음 또는 JSON이 아님")
      }

      if (!response.ok) {
        throw new Error(responseData?.message || "주문 취소 중 오류가 발생했습니다")
      }

      // 성공 메시지 표시
      console.log("[주문 취소 API] 성공적으로 처리됨")
      alert("주문이 성공적으로 취소되었습니다")

      // 페이지 새로고침 (목록 업데이트를 위해)
      window.location.reload()
    } catch (error) {
      console.error("[주문 취소 API 오류]", error)
      alert(error instanceof Error ? error.message : "주문 취소 중 오류가 발생했습니다")
    } finally {
      setIsLoading(false)
    }
  }

  // handlePickupComplete 함수를 다음과 같이 수정합니다:
  const handlePickupComplete = async () => {
    // FINISHED 상태인 경우 즉시 성공 메시지 표시
    if (productState === "FINISHED") {
      alert(`${vendingMachineName}의 빵긋이 열렸습니다`)
      return
    }

    // SOLD_OUT 상태인 경우 확인 다이얼로그 표시
    if (productState === "SOLD_OUT") {
      const confirmed = window.confirm("정말로 여시겠습니까?")
      if (!confirmed) {
        console.log("픽업 취소됨")
        return // 취소 선택 시 함수 종료
      }

      setIsLoading(true)
      try {
        // access_token 가져오기
        const token = localStorage.getItem("access_token")
        if (!token) {
          throw new Error("로그인이 필요합니다")
        }

        // API URL 생성 및 로그 출력
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/order/${orderId}/pickup`
        console.log(`[픽업 API 호출] URL: ${apiUrl}`)
        console.log(`[픽업 API 호출] 주문 ID: ${orderId}`)
        console.log(`[픽업 API 호출] 토큰: ${token.substring(0, 10)}...`)

        // pickup API 호출
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        console.log(`[픽업 API 응답] 상태 코드: ${response.status}`)

        // 응답 데이터 로그 출력
        let responseData
        try {
          responseData = await response.json()
          console.log("[픽업 API 응답] 데이터:", responseData)
        } catch (e) {
          console.log("[픽업 API 응답] 데이터 없음 또는 JSON이 아님")
        }

        if (!response.ok) {
          throw new Error(responseData?.message || "픽업 처리 중 오류가 발생했습니다")
        }

        // 성공 메시지 표시
        console.log("[픽업 API] 성공적으로 처리됨")
        alert(`${vendingMachineName}의 빵긋이 열립니다`)

        // 성공 후 페이지 새로고침 추가
        window.location.reload()
      } catch (error) {
        console.error("[픽업 API 오류]", error)
        alert(error instanceof Error ? error.message : "픽업 처리 중 오류가 발생했습니다")
      } finally {
        setIsLoading(false)
      }
    }
  }

  // 버튼 텍스트를 상태에 따라 다르게 표시하도록 수정
  const getButtonText = () => {
    if (isLoading) {
      return (
        <span className="flex items-center justify-center">
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></span>
          처리 중...
        </span>
      )
    }
    return "빵긋 열기"
  }

  // 상태 라벨 정보 가져오기
  const statusLabel = getStatusLabel()

  return (
    <Card className="border-primary-custom mb-4">
      <div className="flex">
        {/* 빵 이미지 - Next.js Image 대신 일반 img 태그 사용하여 오류 방지 */}
        <div className="w-20 h-20 relative rounded-md mr-3 overflow-hidden">
          <img
            src={image || "/bread-pattern.png"}
            alt={getBreadTypeName(breadType)}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/bread-pattern.png"
            }}
          />
        </div>

        {/* 상품 정보 */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">{bakeryName}</p>
              <h3 className="font-medium">{getBreadTypeName(breadType)}</h3>
            </div>
            <div className="flex flex-col items-end">
              <span className={`text-xs px-2 py-1 rounded-full mb-1 ${statusLabel.className}`}>{statusLabel.text}</span>
              <button
                onClick={handleNavigation}
                className="w-7 h-7 flex items-center justify-center bg-gray-100 text-gray-700 rounded-full"
                aria-label="길찾기"
              >
                <Navigation className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 벤딩머신 이름 - 글자 크기를 수량/가격과 동일하게 변경 */}
          <p className="text-sm text-gray-700 mt-1">{vendingMachineName}</p>
          <p className="text-xs text-gray-500">{address}</p>

          {/* 빵긋번호 추가 - 글자 크기를 수량/가격과 동일하게 설정 */}
          <p className="text-sm mt-1">빵긋번호: {slotNumber}번</p>

          <p className="text-sm mt-1">수량: {count}개</p>
          <p className="text-sm">
            가격: {salePrice.toLocaleString()}원
          </p>

          {/* 빵긋열기 버튼 */}
          <div className="mt-2 flex gap-2">
            {productState === "SOLD_OUT" && (
              <button
                className="flex-1 bg-red-500 text-white text-sm px-4 py-1 rounded-full"
                onClick={handleRefund}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></span>
                    처리 중...
                  </span>
                ) : (
                  "주문 취소"
                )}
              </button>
            )}
            <button
              className={`${productState === "SOLD_OUT" ? "flex-1" : "w-full"} bg-orange-500 text-white text-sm px-4 py-1 rounded-full`}
              onClick={handlePickupComplete}
              disabled={isLoading}
            >
              {getButtonText()}
            </button>
          </div>
        </div>
      </div>
    </Card>
  )
}

