"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Navigation, MessageCircle } from "lucide-react" // MessageCircle 아이콘 추가
import { useRouter } from "next/navigation" // 라우터 추가

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
  PIZZA_BREAD: "피자빵",
  BAGEL: "베이글",
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
  const [isChatLoading, setIsChatLoading] = useState(false) // 채팅 로딩 상태 추가
  const [isRefundLoading, setIsRefundLoading] = useState(false) // 환불 로딩 상태 추가
  const router = useRouter() // Next.js 라우터 사용

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

  // 새로운 환불 API를 사용하는 함수 추가
  const handleFinishedRefund = async () => {
    // 확인 다이얼로그 표시
    const confirmed = window.confirm("정말로 환불을 요청하시겠습니까?")
    if (!confirmed) {
      console.log("환불 요청이 취소되었습니다.")
      return
    }

    setIsRefundLoading(true)
    try {
      // access_token 가져오기
      const token = localStorage.getItem("access_token")
      if (!token) {
        throw new Error("로그인이 필요합니다")
      }

      // API URL 생성 및 로그 출력
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/refunds`
      console.log(`[환불 API 호출] URL: ${apiUrl}`)
      console.log(`[환불 API 호출] 주문 ID: ${orderId}`)

      // 환불 API 호출
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      })

      console.log(`[환불 API 응답] 상태 코드: ${response.status}`)

      // 응답 데이터 로그 출력
      let responseData
      try {
        responseData = await response.json()
        console.log("[환불 API 응답] 데이터:", responseData)
      } catch (e) {
        console.log("[환불 API 응답] 데이터 없음 또는 JSON이 아님")
      }

      if (!response.ok) {
        throw new Error(responseData?.message || "환불 처리 중 오류가 발생했습니다")
      }

      // 성공 메시지 표시
      console.log("[환불 API] 성공적으로 처리됨")
      alert("환불이 요청되었습니다")

      // 페이지 새로고침 (목록 업데이트를 위해)
      window.location.reload()
    } catch (error) {
      console.error("[환불 API 오류]", error)
      alert(error instanceof Error ? error.message : "환불 처리 중 오류가 발생했습니다")
    } finally {
      setIsRefundLoading(false)
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

  // 채팅 문의 함수 추가
  const handleChatInquiry = async () => {
    if (!bakeryId) {
      alert("빵집 정보가 없어 문의할 수 없습니다.")
      return
    }

    setIsChatLoading(true)
    try {
      // access_token 가져오기
      const token = localStorage.getItem("access_token")
      if (!token) {
        throw new Error("로그인이 필요합니다")
      }

      // 1. 채팅방 존재 여부 확인
      console.log(`[채팅방 확인 API 호출] 빵집 ID: ${bakeryId}`)
      const checkResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat-rooms/check?bakeryId=${bakeryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (!checkResponse.ok) {
        throw new Error("채팅방 확인 중 오류가 발생했습니다")
      }

      const checkData = await checkResponse.json()
      console.log("[채팅방 확인 API 응답]", checkData)

      let chatRoomId: number

      // 2. 채팅방이 없으면 생성
      if (!checkData.isExist) {
        console.log("[채팅방 생성 API 호출] 빵집 ID:", bakeryId)
        const createResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat-rooms`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ bakeryId }),
        })

        if (!createResponse.ok) {
          throw new Error("채팅방 생성 중 오류가 발생했습니다")
        }

        // 채팅방 생성 후 ID 가져오기 위해 다시 확인 API 호출
        const recheckResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat-rooms/check?bakeryId=${bakeryId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        if (!recheckResponse.ok) {
          throw new Error("채팅방 재확인 중 오류가 발생했습니다")
        }

        const recheckData = await recheckResponse.json()
        chatRoomId = recheckData.id
      } else {
        // 이미 존재하는 채팅방 ID 사용
        chatRoomId = checkData.id
      }

      // 3. 채팅방으로 이동
      console.log(`[채팅방으로 이동] 채팅방 ID: ${chatRoomId}`)
      router.push(`/inquiry/${chatRoomId}`)
    } catch (error) {
      console.error("[채팅 문의 오류]", error)
      alert(error instanceof Error ? error.message : "채팅 문의 처리 중 오류가 발생했습니다")
    } finally {
      setIsChatLoading(false)
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

          {/* 가격 정보와 환불 요청 버튼을 같은 줄에 배치 (FINISHED 상태일 때만) */}
          <div className="flex justify-between items-center mt-1">
            <p className="text-sm">가격: {salePrice.toLocaleString()}원</p>

            {/* FINISHED 상태일 때만 환불 요청 버튼 표시 */}
            {productState === "FINISHED" && (
              <button
                className="bg-red-500 text-white text-xs px-3 py-1 rounded-full"
                onClick={handleFinishedRefund}
                disabled={isRefundLoading}
              >
                {isRefundLoading ? (
                  <span className="flex items-center justify-center">
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></span>
                    처리중
                  </span>
                ) : (
                  "환불 요청"
                )}
              </button>
            )}
          </div>

          {/* 버튼 영역 */}
          <div className="mt-2">
            {/* SOLD_OUT 상태일 때 주문 취소와 빵긋 열기 버튼을 한 줄에 배치 */}
            {productState === "SOLD_OUT" && (
              <div className="flex gap-2">
                <button
                  className="flex-1 bg-red-500 text-white text-sm px-4 py-2 rounded-full"
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
                <button
                  className="flex-1 bg-orange-500 text-white text-sm px-4 py-2 rounded-full"
                  onClick={handlePickupComplete}
                  disabled={isLoading}
                >
                  {getButtonText()}
                </button>
              </div>
            )}

            {/* FINISHED 상태일 때 문의하기와 빵긋 열기 버튼을 한 줄에 배치 */}
            {productState === "FINISHED" && (
              <div className="flex gap-2">
                <button
                  className="flex-1 bg-blue-500 text-white text-sm px-4 py-2 rounded-full"
                  onClick={handleChatInquiry}
                  disabled={isChatLoading}
                >
                  {isChatLoading ? (
                    <span className="flex items-center justify-center">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></span>
                      처리 중...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      문의하기
                    </span>
                  )}
                </button>
                <button
                  className="flex-1 bg-orange-500 text-white text-sm px-4 py-2 rounded-full"
                  onClick={handlePickupComplete}
                  disabled={isLoading}
                >
                  {getButtonText()}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
