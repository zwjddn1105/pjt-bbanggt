"use client"

import { useState, useEffect } from "react"
import { ShoppingBag, Trash2 } from "lucide-react"
import { Header } from "@/components/ui/header"
import CartItem from "@/components/cart/cart-item"
import CartSummary from "@/components/cart/cart-summary"
import CartActions from "@/components/cart/cart-actions"
import { OrderService } from "@/services"
import type { OrderResponse, ProductState, BreadType } from "@/types/api-types"
import { useCart } from "@/context/cart-context"

// OrderResponse 타입을 확장하여 UI에 필요한 필드 추가
interface CartItemUI extends OrderResponse {
  isSelected: boolean
}

/**
 * 장바구니 페이지
 *
 * @remarks
 * API 연동 구현:
 * 1. OrderService.getMyOrders()를 호출하여 주문 목록을 가져옴
 * 2. productState가 RESERVED인 주문만 필터링하여 표시
 * 3. 삭제 시 OrderService.cancelOrder()를 호출하여 상태를 AVAILABLE로 변경
 *
 * 유지보수 참고사항:
 * - API 연동 실패 시 더미 데이터를 사용함
 * - 실제 배포 시 더미 데이터 관련 코드는 주석 처리 필요
 */
export default function CartPage() {
  // API 응답 데이터를 저장할 상태
  const [cartItems, setCartItems] = useState<CartItemUI[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [useDummyData, setUseDummyData] = useState<boolean>(false)

  // 더미 데이터 (API 연동 실패 시 폴백으로 사용)
  const dummyCartItems: CartItemUI[] = [
    {
      id: 1,
      bakeryName: "빵긋빵긋 역삼점",
      price: 3200,
      salePrice: 3200,
      count: 3,
      image: "/bread-pattern.png",
      productState: "RESERVED" as ProductState,
      breadType: "SOBORO" as BreadType,
      isSelected: true,
    },
    {
      id: 2,
      bakeryName: "빵긋빵긋 강남점",
      price: 3200,
      salePrice: 3200,
      count: 3,
      image: "/bread-pattern.png",
      productState: "RESERVED" as ProductState,
      breadType: "CROISSANT" as BreadType,
      isSelected: true,
    },
    {
      id: 3,
      bakeryName: "빵긋빵긋 선릉점",
      price: 3200,
      salePrice: 3200,
      count: 3,
      image: "/bread-pattern.png",
      productState: "RESERVED" as ProductState,
      breadType: "SWEET_RED_BEAN" as BreadType,
      isSelected: true,
    },
  ]

  // API에서 장바구니 데이터 가져오기
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setIsLoading(true)
        setUseDummyData(false)
        console.log("장바구니 API 호출 시작...")

        const orders = await OrderService.getMyOrders()
        console.log("API 응답 받음:", orders)

        // RESERVED 상태인 주문만 필터링하고 isSelected 필드 추가
        const reservedOrders = orders
          .filter((order) => order.productState === "RESERVED")
          .map((order) => ({
            ...order,
            isSelected: true, // UI를 위한 선택 상태 추가
          }))

        console.log("RESERVED 상태 주문만 필터링:", reservedOrders)

        setCartItems(reservedOrders)
      } catch (err: any) {
        console.error("장바구니 데이터를 불러오는 중 오류가 발생했습니다:", err)

        // 개발 중에는 API 실패 시 더미 데이터 사용
        // 실제 배포 시 아래 두 줄 주석 처리 필요
        console.log("API 실패로 더미 데이터 사용")
        setCartItems(dummyCartItems)
        setUseDummyData(true) // 더미 데이터 사용 상태 설정
      } finally {
        setIsLoading(false)
      }
    }

    fetchCartItems()
  }, [])

  // 선택 상태 변경 핸들러
  const handleSelectChange = (id: number, selected: boolean) => {
    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, isSelected: selected } : item)))
  }

  // 장바구니 수량 업데이트를 위한 context 사용
  const { refreshCartCount } = useCart()

  // 아이템 삭제 핸들러
  const handleDeleteItem = async (id: number) => {
    try {
      console.log("아이템 삭제 시작:", id)

      if (!useDummyData) {
        // 실제 API 연동 시 - 주문 상태를 AVAILABLE로 변경
        await OrderService.cancelOrder(id)
        console.log("주문 상태 변경 완료:", id)

        // 장바구니 수량 업데이트
        await refreshCartCount()
      } else {
        // 더미 데이터 사용 시 - 딜레이 추가하여 API 호출 시뮬레이션
        console.log("더미 데이터 모드: 삭제 API 호출 시뮬레이션")
        await new Promise((resolve) => setTimeout(resolve, 500))
      }

      // UI에서 해당 아이템 제거
      setCartItems(cartItems.filter((item) => item.id !== id))
    } catch (err) {
      console.error("주문 상태 변경 중 오류 발생:", err)
      // toast.error("삭제 중 오류가 발생했습니다. 다시 시도해주세요.") // 알림 라이브러리 사용 시
      alert("삭제 중 오류가 발생했습니다. 다시 시도해주세요.")
    }
  }

  // 선택된 아이템 삭제 핸들러도 동일하게 수정
  const handleDeleteSelected = async () => {
    try {
      const selectedIds = selectedItems.map((item) => item.id)
      console.log("선택된 아이템 삭제 시작:", selectedIds)

      if (!useDummyData) {
        // 실제 API 연동 시 - 선택된 모든 아이템의 상태를 AVAILABLE로 변경
        await Promise.all(selectedItems.map((item) => OrderService.cancelOrder(item.id)))
        console.log("선택된 아이템 상태 변경 완료")

        // 장바구니 수량 업데이트
        await refreshCartCount()
      } else {
        // 더미 데이터 사용 시 - 딜레이 추가하여 API 호출 시뮬레이션
        console.log("더미 데이터 모드: 선택 삭제 API 호출 시뮬레이션")
        await new Promise((resolve) => setTimeout(resolve, 500))
      }

      // UI에서 선택된 아이템 제거
      setCartItems(cartItems.filter((item) => !item.isSelected))
    } catch (err) {
      console.error("주문 상태 변경 중 오류 발생:", err)
      // toast.error("삭제 중 오류가 발생했습니다. 다시 시도해주세요.") // 알림 라이브러리 사용 시
      alert("삭제 중 오류가 발생했습니다. 다시 시도해주세요.")
    }
  }

  // 전체 선택 핸들러
  const handleSelectAll = () => {
    // 현재 모든 아이템이 선택되어 있는지 확인
    const allSelected = cartItems.every((item) => item.isSelected)

    // 모든 아이템이 선택되어 있으면 모두 해제, 아니면 모두 선택
    setCartItems(cartItems.map((item) => ({ ...item, isSelected: !allSelected })))
  }

  // 선택된 아이템만 필터링
  const selectedItems = cartItems.filter((item) => item.isSelected)

  // 총 수량 및 가격 계산
  const totalItems = cartItems.reduce((sum, item) => sum + item.count, 0)
  const totalTypes = cartItems.length

  // 선택된 아이템의 수량 및 가격 계산
  const selectedItemsCount = selectedItems.reduce((sum, item) => sum + item.count, 0)
  const selectedTypesCount = selectedItems.length
  const totalPrice = selectedItems.reduce((sum, item) => sum + item.salePrice, 0)

  // 모든 아이템이 선택되어 있는지 확인
  const allSelected = cartItems.length > 0 && cartItems.every((item) => item.isSelected)

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <main className="pb-20">
        <Header title="빵긋 장바구니" icon={ShoppingBag} count={0} backLink="/" />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-custom"></div>
        </div>
      </main>
    )
  }

  return (
    <main className="pb-20">
      <Header title="빵긋 장바구니" icon={ShoppingBag} count={totalTypes} backLink="/" />

      {/* 더미 데이터 사용 시 알림 표시 */}
      {useDummyData && (
        <div className="bg-yellow-100 p-2 text-sm text-yellow-800 text-center">
          API 연동 실패로 더미 데이터를 표시합니다.
          <button onClick={() => window.location.reload()} className="ml-2 underline">
            다시 시도
          </button>
        </div>
      )}

      {/* 전체 선택 및 선택 삭제 버튼 */}
      <div className="flex justify-between items-center px-4 py-3 border-b">
        <div className="flex items-center">
          <div
            className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mr-2 cursor-pointer ${
              allSelected ? "bg-orange-400" : "border-2 border-gray-300"
            }`}
            onClick={handleSelectAll}
          >
            {allSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
          </div>
          <span className="text-sm font-medium">전체 선택</span>
        </div>
        <button
          onClick={handleDeleteSelected}
          className={`flex items-center text-sm ${selectedItems.length === 0 ? "text-gray-300" : "text-gray-500"}`}
          disabled={selectedItems.length === 0}
        >
          <Trash2 className="w-4 h-4 mr-1" />
          선택 삭제
        </button>
      </div>

      {/* 장바구니 아이템 목록 */}
      <div className="px-4 py-2">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <CartItem
              key={item.id}
              id={item.id}
              name={getBreadTypeKorean(item.breadType)}
              bakery={item.bakeryName}
              quantity={item.count}
              price={item.salePrice}
              image={item.image || "/bread-pattern.png"}
              isSelected={item.isSelected}
              onSelectChange={handleSelectChange}
              onDelete={handleDeleteItem}
            />
          ))
        ) : (
          <div className="py-8 text-center">
            <p className="text-gray-500">장바구니가 비어있습니다.</p>
          </div>
        )}
      </div>

      {/* 장바구니 요약 정보 */}
      {cartItems.length > 0 && (
        <CartSummary
          selectedItems={selectedItemsCount}
          totalItems={totalItems}
          selectedTypes={selectedTypesCount}
          totalTypes={totalTypes}
          totalPrice={totalPrice}
        />
      )}

      {/* 하단 버튼 */}
      <CartActions />
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

