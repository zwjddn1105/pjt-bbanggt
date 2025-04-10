"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Navigation, MessageCircle, Clock, Bookmark } from "lucide-react"
import { useRouter } from "next/navigation"
import { addBakeryBookmark, removeBakeryBookmark, fetchBakeryById } from "@/services/breadgut-api"

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
  paymentDate?: string
}

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
  paymentDate,
}: PickupItemProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isChatLoading, setIsChatLoading] = useState(false)
  const [isRefundLoading, setIsRefundLoading] = useState(false)
  const [isPickupDisabled, setIsPickupDisabled] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [bookmarkLoading, setBookmarkLoading] = useState(false)
  const router = useRouter()

  // 북마크 상태 가져오기
  useEffect(() => {
    const fetchBookmarkStatus = async () => {
      if (!bakeryId) return

      try {
        const bakeryData = await fetchBakeryById(bakeryId)
        setIsBookmarked(bakeryData.mark ?? false)
      } catch (error) {
        // console.error("빵집 북마크 상태를 가져오는데 실패했습니다:", error)
      }
    }

    fetchBookmarkStatus()
  }, [bakeryId])

  // 결제 시간 기준으로 픽업 버튼 활성화 여부 결정
  useEffect(() => {
    // 결제 시간이 없으면 비활성화하지 않음
    if (!paymentDate) {
      setIsPickupDisabled(false)
      return
    }

    const checkPickupAvailability = () => {
      const now = new Date()
      const paymentDateTime = new Date(paymentDate)

      // 현재 날짜의 오전 9시 30분 시간 생성
      const todayCutoff = new Date(now)
      todayCutoff.setHours(9, 30, 0, 0)

      // 어제 날짜의 오전 9시 30분 시간 생성
      const yesterdayCutoff = new Date(now)
      yesterdayCutoff.setDate(yesterdayCutoff.getDate() - 1)
      yesterdayCutoff.setHours(9, 30, 0, 0)

      // 현재 시간이 오전 9시 30분 이후인지 확인
      const isAfterCutoffToday = now >= todayCutoff

      // 현재 시간이 자정부터 오전 9시 30분 사이인지 확인
      const isBeforeCutoffToday = now < todayCutoff

      // 결제 시간이 오늘 오전 9시 30분 이전인지 확인
      const isPaymentBeforeTodayCutoff =
        paymentDateTime < todayCutoff &&
        paymentDateTime.getDate() === todayCutoff.getDate() &&
        paymentDateTime.getMonth() === todayCutoff.getMonth() &&
        paymentDateTime.getFullYear() === todayCutoff.getFullYear()

      // 결제 시간이 어제 오전 9시 30분 이전인지 확인
      const isPaymentBeforeYesterdayCutoff =
        paymentDateTime < yesterdayCutoff &&
        paymentDateTime.getDate() === yesterdayCutoff.getDate() &&
        paymentDateTime.getMonth() === yesterdayCutoff.getMonth() &&
        paymentDateTime.getFullYear() === yesterdayCutoff.getFullYear()

      // 비활성화 조건:
      // 1. 현재 시간이 오전 9시 30분 이후이고, 결제 시간이 오늘 오전 9시 30분 이전인 경우
      // 2. 현재 시간이 자정부터 오전 9시 30분 사이이고, 결제 시간이 어제 오전 9시 30분 이전인 경우
      const shouldDisable =
        (isAfterCutoffToday && isPaymentBeforeTodayCutoff) || (isBeforeCutoffToday && isPaymentBeforeYesterdayCutoff)

      setIsPickupDisabled(shouldDisable)

      // 디버깅용 로그
      // console.log(`[픽업 버튼 상태] 주문 ID: ${orderId}, 결제 시간: ${paymentDate}`)
      // console.log(`[픽업 버튼 상태] 현재 시간: ${now.toLocaleString()}`)
      // console.log(
      //   `[픽업 버튼 상태] 오늘 9시 30분 이후: ${isAfterCutoffToday}, 오늘 9시 30분 이전 결제: ${isPaymentBeforeTodayCutoff}`,
      // )
      // console.log(
      //   `[픽업 버튼 상태] 오늘 9시 30분 이전: ${isBeforeCutoffToday}, 어제 9시 30분 이전 결제: ${isPaymentBeforeYesterdayCutoff}`,
      // )
      // console.log(`[픽업 버튼 상태] 비활성화: ${shouldDisable}`)
    }

    checkPickupAvailability()

    // 1분마다 상태 업데이트 (시간이 지나면 자동으로 상태 변경)
    const intervalId = setInterval(checkPickupAvailability, 60000)

    return () => clearInterval(intervalId)
  }, [paymentDate, orderId])

  // 북마크 토글 함수
  const handleBookmarkToggle = async () => {
    if (!bakeryId || bookmarkLoading) return

    setBookmarkLoading(true)
    try {
      if (isBookmarked) {
        await removeBakeryBookmark(bakeryId)
      } else {
        await addBakeryBookmark(bakeryId)
      }
      setIsBookmarked(!isBookmarked)
    } catch (error) {
      // console.error("북마크 상태 변경 중 오류:", error)
      alert("북마크 상태 변경에 실패했습니다.")
    } finally {
      setBookmarkLoading(false)
    }
  }

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
    const kakaoMapUrl = `https://map.kakao.com/link/to/${vendingMachineName},${latitude},${longitude}`
    window.open(kakaoMapUrl, "_blank")
  }

  // 주문 취소 함수 추가
  const handleRefund = async () => {
    const confirmed = window.confirm("정말로 주문을 취소하시겠습니까?")
    if (!confirmed) {
      // console.log("주문 취소가 취소되었습니다.")
      return
    }

    setIsLoading(true)
    try {
      const token = localStorage.getItem("access_token")
      if (!token) {
        throw new Error("로그인이 필요합니다")
      }

      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/order/${orderId}/refund`
      // console.log(`[주문 취소 API 호출] URL: ${apiUrl}`)
      // console.log(`[주문 취소 API 호출] 주문 ID: ${orderId}`)
      // console.log(`[주문 취소 API 호출] 토큰: ${token.substring(0, 10)}...`)

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      // console.log(`[주문 취소 API 응답] 상태 코드: ${response.status}`)

      let responseData
      try {
        responseData = await response.json()
        // console.log("[주문 취소 API 응답] 데이터:", responseData)
      } catch (e) {
        // console.log("[주문 취소 API 응답] 데이터 없음 또는 JSON이 아님")
      }

      if (!response.ok) {
        throw new Error(responseData?.message || "주문 취소 중 오류가 발생했습니다")
      }

      // console.log("[주문 취소 API] 성공적으로 처리됨")
      alert("주문이 성공적으로 취소되었습니다")

      window.location.reload()
    } catch (error) {
      // console.error("[주문 취소 API 오류]", error)
      alert(error instanceof Error ? error.message : "주문 취소 중 오류가 발생했습니다")
    } finally {
      setIsLoading(false)
    }
  }

  // 새로운 환불 API를 사용하는 함수 추가
  const handleFinishedRefund = async () => {
    const confirmed = window.confirm("정말로 환불을 요청하시겠습니까?")
    if (!confirmed) {
      // console.log("환불 요청이 취소되었습니다.")
      return
    }

    setIsRefundLoading(true)
    try {
      const token = localStorage.getItem("access_token")
      if (!token) {
        throw new Error("로그인이 필요합니다")
      }

      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/refunds`
      // console.log(`[환불 API 호출] URL: ${apiUrl}`)
      // console.log(`[환불 API 호출] 주문 ID: ${orderId}`)

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      })

      // console.log(`[환불 API 응답] 상태 코드: ${response.status}`)

      let responseData
      try {
        responseData = await response.json()
        // console.log("[환불 API 응답] 데이터:", responseData)
      } catch (e) {
        // console.log("[환불 API 응답] 데이터 없음 또는 JSON이 아님")
      }

      if (!response.ok) {
        throw new Error(responseData?.message || "환불 처리 중 오류가 발생했습니다")
      }

      // console.log("[환불 API] 성공적으로 처리됨")
      alert("환불이 요청되었습니다")

      window.location.reload()
    } catch (error) {
      // console.error("[환불 API 오류]", error)
      alert(error instanceof Error ? error.message : "환불 처리 중 오류가 발생했습니다")
    } finally {
      setIsRefundLoading(false)
    }
  }

  // handlePickupComplete 함수를 다음과 같이 수정합니다:
  const handlePickupComplete = async () => {
    // 픽업 버튼이 비활성화된 경우 알림 표시
    if (isPickupDisabled) {
      alert("픽업 가능 시간이 지났습니다. 다음 픽업 시간(오후 8시)에 다시 시도해주세요.")
      return
    }

    // FINISHED 상태인 경우 즉시 성공 메시지 표시
    if (productState === "FINISHED") {
      alert(`${vendingMachineName}의 빵긋이 열렸습니다`)
      return
    }

    // SOLD_OUT 상태인 경우 확인 다이얼로그 표시
    if (productState === "SOLD_OUT") {
      const confirmed = window.confirm("정말로 여시겠습니까?")
      if (!confirmed) {
        // console.log("픽업 취소됨")
        return
      }

      setIsLoading(true)
      try {
        const token = localStorage.getItem("access_token")
        if (!token) {
          throw new Error("로그인이 필요합니다")
        }

        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/order/${orderId}/pickup`
        // console.log(`[픽업 API 호출] URL: ${apiUrl}`)
        // console.log(`[픽업 API 호출] 주문 ID: ${orderId}`)
        // console.log(`[픽업 API 호출] 토큰: ${token.substring(0, 10)}...`)

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        // console.log(`[픽업 API 응답] 상태 코드: ${response.status}`)

        let responseData
        try {
          responseData = await response.json()
          // console.log("[픽업 API 응답] 데이터:", responseData)
        } catch (e) {
          // console.log("[픽업 API 응답] 데이터 없음 또는 JSON이 아님")
        }

        if (!response.ok) {
          throw new Error(responseData?.message || "픽업 처리 중 오류가 발생했습니다")
        }

        // console.log("[픽업 API] 성공적으로 처리됨")
        alert(`${vendingMachineName}의 빵긋이 열립니다`)

        window.location.reload()
      } catch (error) {
        // console.error("[픽업 API 오류]", error)
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
      const token = localStorage.getItem("access_token")
      if (!token) {
        throw new Error("로그인이 필요합니다")
      }

      // console.log(`[채팅방 확인 API 호출] 빵집 ID: ${bakeryId}`)
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
      // console.log("[채팅방 확인 API 응답]", checkData)

      let chatRoomId: number

      if (!checkData.isExist) {
        // console.log("[채팅방 생성 API 호출] 빵집 ID:", bakeryId)
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
        chatRoomId = checkData.id
      }

      // console.log(`[채팅방으로 이동] 채팅방 ID: ${chatRoomId}`)
      router.push(`/buyer/inquiry/${chatRoomId}`)
    } catch (error) {
      // console.error("[채팅 문의 오류]", error)
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

  // 결제 시간 포맷팅 함수
  const formatPaymentDate = (dateString?: string) => {
    if (!dateString) return ""

    const date = new Date(dateString)
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hours = date.getHours()
    const minutes = date.getMinutes()

    // 오전/오후 표시와 함께 시간 포맷팅
    const ampm = hours < 12 ? "오전" : "오후"
    const formattedHours = hours % 12 || 12 // 12시간제로 변환
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes

    return `${month}/${day} ${ampm} ${formattedHours}:${formattedMinutes}`
  }

  // 상태 라벨 정보 가져오기
  const statusLabel = getStatusLabel()

  return (
    <Card className="border-primary-custom mb-4">
      <div className="flex">
        {/* 빵 이미지 */}
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
              <div className="flex items-center">
                <p className="text-sm text-gray-600">{bakeryName}</p>
                {bakeryId && (
                  <button
                    onClick={handleBookmarkToggle}
                    disabled={bookmarkLoading}
                    className="ml-1 p-1"
                    aria-label={isBookmarked ? "북마크 제거" : "북마크 추가"}
                  >
                    {bookmarkLoading ? (
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-orange-500 rounded-full animate-spin"></div>
                    ) : (
                      <Bookmark
                        className={`w-4 h-4 ${isBookmarked ? "fill-[#EC9A5E] text-[#EC9A5E]" : "text-gray-400"}`}
                      />
                    )}
                  </button>
                )}
              </div>
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

          {/* 빵집 및 자판기 정보 */}
          <div className="mt-1">
            <p className="text-xs font-medium text-orange-600">{bakeryName} 자판기</p>
            <p className="text-sm text-gray-700">{vendingMachineName}</p>
            <p className="text-xs text-gray-500">{address}</p>
          </div>

          {/* 빵긋번호 */}
          <p className="text-sm mt-1">빵긋번호: {slotNumber}번</p>

          {/* 결제 시간 표시 (있는 경우에만) */}
          {paymentDate && (
            <div className="flex items-center text-sm mt-1 text-gray-600">
              <Clock className="w-3 h-3 mr-1" />
              <span>결제: {formatPaymentDate(paymentDate)}</span>

              {/* 픽업 불가능한 경우 경고 표시 */}
              {isPickupDisabled && <span className="ml-2 text-xs text-red-500">픽업 시간 초과</span>}
            </div>
          )}

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
                  className={`flex-1 text-white text-sm px-4 py-2 rounded-full ${
                    isPickupDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-orange-500"
                  }`}
                  onClick={handlePickupComplete}
                  disabled={isLoading || isPickupDisabled}
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
                  className={`flex-1 text-white text-sm px-4 py-2 rounded-full ${
                    isPickupDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-orange-500"
                  }`}
                  onClick={handlePickupComplete}
                  disabled={isLoading || isPickupDisabled}
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
