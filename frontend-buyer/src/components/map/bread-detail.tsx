"use client"
import { ArrowLeft, MapPin, Bookmark } from "lucide-react"
import type { VendingMachine } from "../../types/vending-machine"
import type { OrderResponse, BreadType, AccountResponse } from "../../types/api-types"
import { useEffect, useState } from "react"
import {
  fetchOrderDetail,
  fetchAccountInfo,
  addBakeryBookmark,
  removeBakeryBookmark,
  fetchBakeryById,
} from "../../services/breadgut-api"
import { useRouter } from "next/navigation"

declare global {
  interface Window {
    IMP: any
  }
}
// 빵 타입별 한글 이름 매핑
const breadTypeNames: Record<BreadType, string> = {
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

interface BreadDetailProps {
  vendingMachine: VendingMachine
  slotId: number
  breadType: string
  bakeryName: string
  orderId: number
  onClose: () => void
  onBackToVendingMachine?: () => void
}

export default function BreadDetail({
  vendingMachine,
  slotId,
  breadType,
  bakeryName,
  orderId,
  onClose,
  onBackToVendingMachine,
}: BreadDetailProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [breadDetail, setBreadDetail] = useState<OrderResponse | null>(null)
  const [accountInfo, setAccountInfo] = useState<AccountResponse[]>([])
  const [accountLoading, setAccountLoading] = useState(true)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [bookmarkLoading, setBookmarkLoading] = useState(false)
  const [bakeryId, setBakeryId] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchBreadData = async () => {
      try {
        setLoading(true)
        const data = await fetchOrderDetail(vendingMachine.id, orderId)
        setBreadDetail(data)

        if (data?.bakeryId) {
          setBakeryId(data.bakeryId)
          try {
            const bakeryData = await fetchBakeryById(data.bakeryId)
            setIsBookmarked(bakeryData.mark ?? false)
          } catch (bakeryErr) {
            // console.error("빵집 정보를 가져오는데 실패했습니다:", bakeryErr)
          }
        }

        setLoading(false)
      } catch (err) {
        // console.error("빵 상세 정보를 가져오는데 실패했습니다:", err)
        setError("빵 상세 정보를 가져오는데 실패했습니다.")
        setLoading(false)
      }
    }

    fetchBreadData()
  }, [vendingMachine.id, orderId])

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        setAccountLoading(true)
        const data = await fetchAccountInfo()
        setAccountInfo(data)
        setAccountLoading(false)
      } catch (err) {
        // console.error("계좌 정보를 가져오는데 실패했습니다:", err)
        setAccountLoading(false)
      }
    }

    fetchAccount()
  }, [])

  const maskAccountNumber = (accountNo: string) => {
    if (!accountNo) return ""
    const visibleLength = Math.min(accountNo.length - 4, 6)
    const maskedLength = accountNo.length - visibleLength
    return accountNo.substring(0, visibleLength) + "*".repeat(maskedLength)
  }

  const breadData = breadDetail
    ? {
        name: breadTypeNames[breadDetail.breadType as BreadType] || breadDetail.breadType,
        bakery: breadDetail.bakeryName,
        price: breadDetail.price,
        salePrice: breadDetail.salePrice,
        count: breadDetail.count,
        image: breadDetail.image || "/bread-pattern.png",
      }
    : null

  const handleBack = () => {
    if (onBackToVendingMachine) {
      onBackToVendingMachine()
    } else {
      onClose()
    }
  }

  const onClickPayment = () => {
    if (!breadDetail || !breadData) {
      alert("빵 정보를 불러올 수 없습니다.")
      return
    }

    if (typeof window === "undefined" || !window.IMP) {
      alert("결제 모듈이 로딩되지 않았습니다.")
      return
    }

    const { IMP } = window
    IMP.init(process.env.NEXT_PUBLIC_PORTONE_IMP_CODE!) // .env에서 불러온 코드

    // 실제 빵 가격 사용
    const data = {
      pg: "html5_inicis",
      pay_method: "card",
      merchant_uid: `mid_${Date.now()}`,
      amount: breadData.salePrice, // 하드코딩된 1000원 대신 실제 할인가 사용
      name: `${breadData.bakery} - ${breadData.name}`, // 상품명 개선
      buyer_name: "홍길동",
      buyer_tel: "010-1234-5678",
      buyer_email: "example@example.com",
      buyer_addr: "서울특별시 강남구 ...",
      buyer_postcode: "12345",
    }

    setPaymentLoading(true)

    IMP.request_pay(data, async (response: any) => {
      const { success, error_msg, imp_uid } = response

      if (success) {
        try {
          // 결제 성공 시 백엔드 API 호출
          const token = localStorage.getItem("access_token")
          if (!token) {
            throw new Error("로그인이 필요합니다.")
          }

          // 포트원 결제 성공 후 백엔드 API 호출
          const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/order/${orderId}/pay/iamport`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ impUid: imp_uid }),
          })

          if (!apiResponse.ok) {
            const errorData = await apiResponse.json()
            throw new Error(errorData.message || "결제 처리 중 오류가 발생했습니다.")
          }

          alert("결제가 성공적으로 완료되었습니다!")
          router.push("/buyer/pickup")
        } catch (err) {
          // console.error("결제 처리 중 오류:", err)
          alert(err instanceof Error ? err.message : "결제 처리 중 오류가 발생했습니다.")
        }
      } else {
        alert(`결제 실패: ${error_msg}`)
      }
      setPaymentLoading(false)
    })
  }

  const handleBookmarkToggle = async () => {
    if (!bakeryId || bookmarkLoading) return
    try {
      setBookmarkLoading(true)
      if (isBookmarked) {
        await removeBakeryBookmark(bakeryId)
      } else {
        await addBakeryBookmark(bakeryId)
      }
      setIsBookmarked(!isBookmarked)
    } catch (err) {
      // console.error("북마크 처리 중 오류:", err)
      alert("북마크 처리에 실패했습니다.")
    } finally {
      setBookmarkLoading(false)
    }
  }

  const handlePayment = async () => {
    if (!agreeToTerms || !breadDetail || accountInfo.length === 0) {
      // console.log("결제 조건 미충족:", { agreeToTerms, breadDetail, accountInfo })
      return
    }

    try {
      setPaymentLoading(true)
      const payRequest = { accountNo: accountInfo[0].accountNo }
      const token = localStorage.getItem("access_token")
      if (!token) throw new Error("로그인이 필요합니다.")

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/order/${breadDetail.orderId}/pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payRequest),
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (errorData.code === 3002) throw new Error("인증이 만료되었습니다.")
        throw new Error(errorData.message || "결제에 실패했습니다.")
      }

      router.push("/buyer/pickup")
    } catch (err) {
      // console.error("결제 오류:", err)
      alert(err instanceof Error ? err.message : "결제 실패")
    } finally {
      setPaymentLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">빵 정보를 불러오는 중...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
        <p className="text-red-500">{error}</p>
        <button onClick={handleBack} className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg">
          닫기
        </button>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <div className="sticky top-0 bg-white p-4 border-b flex items-center">
        <button onClick={handleBack} className="mr-4">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">{vendingMachine.name}</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-center p-4 text-gray-600">
          <MapPin className="w-5 h-5 mr-1" />
          <p className="text-sm">{vendingMachine.address}</p>
        </div>

        <div className="w-16 h-1 bg-gray-200 rounded-full mx-auto mb-4"></div>

        {breadData ? (
          <div className="mx-4 bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="w-full h-64 bg-gray-100 flex items-center justify-center p-4">
              <img
                src={breadData.image || "/placeholder.svg"}
                alt={breadData.name}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = "/bread-pattern.png"
                }}
              />
            </div>

            <div className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <h2 className="text-xl font-bold">{breadData.bakery}</h2>
                <button onClick={handleBookmarkToggle} disabled={bookmarkLoading || !bakeryId} className="ml-2 p-1">
                  {bookmarkLoading ? (
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-orange-500 rounded-full animate-spin"></div>
                  ) : (
                    <Bookmark
                      className={`w-5 h-5 ${isBookmarked ? "fill-orange-500 text-orange-500" : "text-gray-400"}`}
                    />
                  )}
                </button>
              </div>

              <p className="text-gray-700 mb-2">{breadData.name}</p>
              <p className="text-sm text-gray-500 mb-4">{breadData.count ? `${breadData.count}개 구성` : "1개 구성"}</p>
              <div className="flex justify-center items-center mb-6">
                <span className="text-gray-500 line-through mr-2">{breadData.price}원</span>
                <span className="text-xl font-bold text-orange-500">{breadData.salePrice}원</span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleBack}
                  className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium"
                  disabled={paymentLoading}
                >
                  취소하기
                </button>
                <button
                  onClick={onClickPayment}
                  className="flex-1 py-3 px-4 bg-orange-500 text-white rounded-lg font-medium"
                  disabled={paymentLoading}
                >
                  {paymentLoading ? (
                    <span className="flex items-center justify-center">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></span>
                      결제 중...
                    </span>
                  ) : (
                    "결제하기"
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-4 p-6 bg-white rounded-xl shadow-sm border text-center">
            <p className="text-gray-500">빵 정보를 불러올 수 없습니다.</p>
            <button onClick={handleBack} className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg">
              돌아가기
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
