"use client"
import { ArrowLeft, MapPin, CreditCard } from "lucide-react"
import type { VendingMachine } from "@/types/vending-machine"
import type { OrderResponse, BreadType, AccountResponse } from "@/types/api-types"
import { useEffect, useState } from "react"
import { fetchOrderDetail, fetchAccountInfo } from "@/services/breadgut-api"

// 빵 타입별 한글 이름 매핑
const breadTypeNames: Record<BreadType, string> = {
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

// BreadDetailProps 인터페이스 수정
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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [breadDetail, setBreadDetail] = useState<OrderResponse | null>(null)
  const [accountInfo, setAccountInfo] = useState<AccountResponse[]>([])
  const [accountLoading, setAccountLoading] = useState(true)

  // API에서 빵 상세 정보 가져오기
  useEffect(() => {
    const fetchBreadData = async () => {
      try {
        setLoading(true)
        const data = await fetchOrderDetail(vendingMachine.id, orderId)
        setBreadDetail(data)
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

  // 빵 타입에 따른 더미 데이터
  const getBreadData = (type: string, bakery: string) => {
    // API에서 가져온 데이터가 있으면 그것을 사용
    if (breadDetail) {
      return {
        name: breadTypeNames[breadDetail.breadType as BreadType] || breadDetail.breadType,
        bakery: breadDetail.bakeryName,
        price: breadDetail.price,
        salePrice: breadDetail.salePrice,
        count: breadDetail.count,
        image: breadDetail.image,
      }
    }

    // API 데이터가 없으면 기존 로직 사용
    const koreanName = breadTypeNames[type as BreadType] || type

    switch (type) {
      case "BAGUETTE":
        return {
          name: koreanName,
          bakery: bakery,
          price: 4000,
          salePrice: 3000,
          count: 1,
          image: "/BAGUETTE.jpg",
        }
      case "CROISSANT":
        return {
          name: koreanName,
          bakery: bakery,
          price: 3500,
          salePrice: 2500,
          count: 1,
          image: "/CROISSANT.jpg",
        }
      case "WHITE_BREAD":
        return {
          name: koreanName,
          bakery: bakery,
          price: 5000,
          salePrice: 4000,
          count: 1,
          image: "/WHITE_BREAD.jpg",
        }
      case "SOBORO":
        return {
          name: koreanName,
          bakery: bakery,
          price: 2500,
          salePrice: 2000,
          count: 1,
          image: "/SOBORO.jpg",
        }
      case "SWEET_RED_BEAN":
        return {
          name: koreanName,
          bakery: bakery,
          price: 2000,
          salePrice: 1500,
          count: 1,
          image: "/SWEET_RED_BEAN.jpg",
        }
      case "DONUT":
        return {
          name: koreanName,
          bakery: bakery,
          price: 3000,
          salePrice: 2500,
          count: 1,
          image: "/DONUT.jpg",
        }
      case "CREAM_BREAD":
        return {
          name: koreanName,
          bakery: bakery,
          price: 2500,
          salePrice: 2000,
          count: 1,
          image: "/CREAM_BREAD.jpg",
        }
      case "GARLIC_BREAD":
        return {
          name: koreanName,
          bakery: bakery,
          price: 3500,
          salePrice: 3000,
          count: 1,
          image: "/GARLIC_BREAD.jpg",
        }
      default:
        return {
          name: koreanName,
          bakery: bakery,
          price: 3000,
          salePrice: 2500,
          count: 1,
          image: "/bread-pattern.png",
        }
    }
  }

  const breadData = getBreadData(breadType, bakeryName)

  // 뒤로가기 또는 취소 버튼 클릭 시 자판기 상세 화면으로 이동
  const handleBack = () => {
    if (onBackToVendingMachine) {
      onBackToVendingMachine()
    } else {
      onClose()
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

  const handlePayment = () => {
    alert("결제 페이지로 이동합니다.")
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
            <h2 className="text-xl font-bold mb-2">{breadData.bakery}</h2>
            <p className="text-gray-700 mb-2">{breadData.name}</p>
            <p className="text-sm text-gray-500 mb-4">
              {breadDetail?.count ? `${breadDetail.count}개 구성` : "1개 구성"}
            </p>
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

            {/* 버튼 영역 - 취소하기와 결제하기 버튼 */}
            <div className="flex gap-3">
              <button
                onClick={handleBack}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium"
              >
                취소하기
              </button>
              <button
                onClick={handlePayment}
                className="flex-1 py-3 px-4 bg-orange-500 text-white rounded-lg font-medium"
              >
                결제하기
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="sticky bottom-0 bg-white border-t flex justify-between p-4">
        <button onClick={handleBack} className="px-8 py-3 border border-gray-300 rounded-full text-gray-700">
          취소
        </button>
        <button onClick={handlePayment} className="px-8 py-3 bg-orange-500 text-white rounded-full">
          결제하기
        </button>
      </div>
    </div>
  )
}

