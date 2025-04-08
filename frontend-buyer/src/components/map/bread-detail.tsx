"use client"
import { ArrowLeft, MapPin, CreditCard, Bookmark } from "lucide-react"
import type { VendingMachine } from "@/types/vending-machine"
import type { OrderResponse, BreadType, AccountResponse } from "@/types/api-types"
import { useEffect, useState } from "react"
import {
  fetchOrderDetail,
  fetchAccountInfo,
  addBakeryBookmark,
  removeBakeryBookmark,
  fetchBakeryById,
} from "@/services/breadgut-api"
import { useRouter } from "next/navigation"

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

// BreadDetailProps 인터페이스 수���
interface BreadDetailProps {
  vendingMachine: VendingMachine
  slotId: number
  breadType: string
  bakeryName: string
  orderId: number
  onClose: () => void
  onBackToVendingMachine?: () => void // 자판기 상세 화면으로 돌아가는 함수 추가
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
  // 상태 관리 부분에 동의 체크박스 상태 추가
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [breadDetail, setBreadDetail] = useState<OrderResponse | null>(null)
  const [accountInfo, setAccountInfo] = useState<AccountResponse[]>([])
  const [accountLoading, setAccountLoading] = useState(true)
  const [agreeToTerms, setAgreeToTerms] = useState(false) // 구매 동의 상태 추가
  const [paymentLoading, setPaymentLoading] = useState(false) // 결제 로딩 상태 추가
  const [isBookmarked, setIsBookmarked] = useState(false) // 북마크 상태 추가
  const [bookmarkLoading, setBookmarkLoading] = useState(false) // 북마크 로딩 상태 추가
  const [bakeryId, setBakeryId] = useState<number | null>(null) // 빵집 ID 상태 추가
  const router = useRouter() // Next.js 라우터 사용

  // API에서 빵 상세 정보 가져오기
  useEffect(() => {
    const fetchBreadData = async () => {
      try {
        setLoading(true)
        const data = await fetchOrderDetail(vendingMachine.id, orderId)
        setBreadDetail(data)

        // 빵집 ID가 breadDetail 객체에 있으면 사용
        if (data && data.bakeryId) {
          setBakeryId(data.bakeryId)

          // 빵집 정보 가져오기
          try {
            const bakeryData = await fetchBakeryById(data.bakeryId)
            console.log("빵집 정보:", bakeryData) // 디버깅용 로그

            // 스웨거 문서에 따라 mark 속성 사용
            setIsBookmarked(bakeryData.mark ?? false)
          } catch (bakeryErr) {
            console.error("빵집 정보를 가져오는데 실패했습니다:", bakeryErr)
          }
        }

        setLoading(false)
      } catch (err) {
        console.error("빵 상세 정보를 가져오는데 실패했습니다:", err)
        setError("빵 상세 정보를 가져오는데 실패했습니다.")
        setLoading(false)
      }
    }

    fetchBreadData()
  }, [vendingMachine.id, orderId])

  // API에서 계좌 정보 가져오기
  useEffect(() => {
    const fetchAccount = async () => {
      try {
        setAccountLoading(true)
        const data = await fetchAccountInfo()
        setAccountInfo(data)
        setAccountLoading(false)
      } catch (err) {
        console.error("계좌 정보를 가져오는데 실패했습니다:", err)
        setAccountLoading(false)
      }
    }

    fetchAccount()
  }, [])

  // 계좌번호 마스킹 처리 함수
  const maskAccountNumber = (accountNo: string) => {
    if (!accountNo) return ""

    // 계좌번호의 앞 부분은 그대로 표시하고 뒷 부분은 '*'로 마스킹
    const visibleLength = Math.min(accountNo.length - 4, 6) // 앞 6자리 또는 전체 길이에서 4자리를 뺀 길이 중 작은 값
    const maskedLength = accountNo.length - visibleLength

    return accountNo.substring(0, visibleLength) + "*".repeat(maskedLength)
  }

  // breadData 변수 선언 부분을 다음과 같이 변경:
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

  // 뒤로가기 또는 취소 버튼 클릭 시 자판기 상세 화면으로 이동
  const handleBack = () => {
    if (onBackToVendingMachine) {
      onBackToVendingMachine()
    } else {
      onClose()
    }
  }

  // 북마크 토글 함수
  const handleBookmarkToggle = async () => {
    if (!bakeryId || bookmarkLoading) return

    try {
      setBookmarkLoading(true)

      if (isBookmarked) {
        // 북마크 삭제
        await removeBakeryBookmark(bakeryId)
      } else {
        // 북마크 추가
        await addBakeryBookmark(bakeryId)
      }

      // 북마크 상태 토글
      setIsBookmarked(!isBookmarked)
      setBookmarkLoading(false)
    } catch (err) {
      console.error("북마크 처리 중 오류가 발생했습니다:", err)
      alert("북마크 처리에 실패했습니다. 다시 시도해주세요.")
      setBookmarkLoading(false)
    }
  }

  // 결제 처리 함수 수정 - 디버깅 로그 추가 및 오류 처리 개선
  const handlePayment = async () => {
    if (!agreeToTerms || !breadDetail || accountInfo.length === 0) {
      console.log("결제 조건 미충족:", { agreeToTerms, breadDetail, accountInfo })
      return
    }

    try {
      setPaymentLoading(true)
      console.log("결제 시작 - breadDetail:", breadDetail)
      console.log("결제 시작 - orderId:", breadDetail.orderId)

      // 결제 요청 객체 생성
      const payRequest = {
        accountNo: accountInfo[0].accountNo, // 첫 번째 계좌 사용
      }

      // 토큰 가져오기
      const token = localStorage.getItem("access_token")
      if (!token) {
        throw new Error("로그인이 필요합니다. 토큰이 없습니다.")
      }

      console.log(`결제 요청 준비: orderId=${breadDetail.orderId}, payRequest=`, payRequest)

      // 환경 변수 이름 수정 (NEXT_PUBLIC_API_BASE_URL -> NEXT_PUBLIC_API_URL)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/order/${breadDetail.orderId}/pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Bearer 접두사 확인
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payRequest),
      })

      console.log("결제 응답 상태:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("결제 오류 응답:", errorData)

        // 토큰 오류인 경우 특별 처리
        if (errorData.code === 3002) {
          throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.")
        }

        throw new Error(errorData.message || "결제에 실패했습니다")
      }

      console.log("결제 성공")

      // 결제 성공 시 pickup 페이지로 이동
      router.push("/pickup")
    } catch (err) {
      console.error("결제 처리 중 오류가 발생했습니다:", err)
      alert(err instanceof Error ? err.message : "결제에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setPaymentLoading(false)
    }
  }

  // 로딩 중 표시
  if (loading) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">빵 정보를 불러오는 중...</p>
      </div>
    )
  }

  // 에러 표시
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
      {/* 헤더 */}
      <div className="sticky top-0 bg-white p-4 border-b flex items-center">
        <button onClick={handleBack} className="mr-4">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">{vendingMachine.name}</h1>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 overflow-y-auto">
        {/* 자판기 주소 */}
        <div className="flex items-center justify-center p-4 text-gray-600">
          <MapPin className="w-5 h-5 mr-1" />
          <p className="text-sm">{vendingMachine.address}</p>
        </div>

        {/* 구분선 */}
        <div className="w-16 h-1 bg-gray-200 rounded-full mx-auto mb-4"></div>

        {/* 빵 상세 정보 카드 */}
        {breadData ? (
          <div className="mx-4 bg-white rounded-xl shadow-sm border overflow-hidden">
            {/* 빵 이미지 */}
            <div className="w-full h-64 bg-gray-100 flex items-center justify-center p-4">
              <img
                src={breadData.image || "/bread-pattern.png"}
                alt={breadData.name}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = "/bread-pattern.png"
                }}
              />
            </div>

            {/* 빵 정보 */}
            <div className="p-6 text-center">
              {/* 빵집 이름과 북마크 버튼 */}
              <div className="flex items-center justify-center mb-2">
                <h2 className="text-xl font-bold">{breadData.bakery}</h2>
                <button
                  onClick={handleBookmarkToggle}
                  disabled={bookmarkLoading || !bakeryId}
                  className="ml-2 p-1 focus:outline-none"
                  aria-label={isBookmarked ? "북마크 제거" : "북마크 추가"}
                >
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

              {/* 계좌 정보 */}
              <div className="mt-6 mb-6">
                <div className="border rounded-lg p-4 bg-gray-50">
                  {accountLoading ? (
                    <div className="flex justify-center items-center h-16">
                      <div className="w-5 h-5 border-2 border-gray-300 border-t-orange-500 rounded-full animate-spin mr-2"></div>
                      <p className="text-gray-500">계좌 정보를 불러오는 중...</p>
                    </div>
                  ) : accountInfo.length > 0 ? (
                    <div>
                      <div className="flex items-center mb-2">
                        <CreditCard className="w-5 h-5 text-gray-500 mr-2" />
                        <span className="font-medium">결제 계좌 정보</span>
                      </div>
                      {accountInfo.map((account, index) => (
                        <div key={index} className="mt-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">{account.bankName}</span>
                            <span className="font-medium">{maskAccountNumber(account.accountNo)}</span>
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className="text-gray-600">잔액</span>
                            <span className="font-medium text-orange-500">
                              {account.accountBalance.toLocaleString()}원
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex justify-center items-center h-16">
                      <p className="text-gray-500">등록된 계좌가 없습니다.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* 구매 동의 체크박스 */}
              <div className="flex items-center mb-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="ml-2 text-gray-700">구매하는데 동의합니다</span>
                </label>
              </div>

              {/* 버튼 영역 - 취소하기와 결제하기 버튼 */}
              <div className="flex gap-3">
                <button
                  onClick={handleBack}
                  className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium"
                  disabled={paymentLoading}
                >
                  취소하기
                </button>
                <button
                  onClick={handlePayment}
                  disabled={!agreeToTerms || paymentLoading || accountInfo.length === 0}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium ${
                    agreeToTerms && !paymentLoading && accountInfo.length > 0
                      ? "bg-orange-500 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {paymentLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      <span>결제 중...</span>
                    </div>
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

      {/* 하단 버튼 */}
      {breadData && (
        <div className="sticky bottom-0 bg-white border-t flex justify-between p-4">
          <button
            onClick={handleBack}
            className="px-8 py-3 border border-gray-300 rounded-full text-gray-700"
            disabled={paymentLoading}
          >
            취소
          </button>
          <button
            onClick={handlePayment}
            disabled={!agreeToTerms || paymentLoading || accountInfo.length === 0}
            className={`px-8 py-3 rounded-full ${
              agreeToTerms && !paymentLoading && accountInfo.length > 0
                ? "bg-orange-500 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {paymentLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                <span>결제 중...</span>
              </div>
            ) : (
              "결제하기"
            )}
          </button>
        </div>
      )}
    </div>
  )
}
