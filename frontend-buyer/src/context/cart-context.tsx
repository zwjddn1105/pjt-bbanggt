"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { OrderService } from "@/services"

interface CartContextType {
  cartCount: number
  refreshCartCount: () => Promise<void>
}

const CartContext = createContext<CartContextType>({
  cartCount: 3, // 기본값
  refreshCartCount: async () => {},
})

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartCount, setCartCount] = useState<number>(3) // 기본값으로 더미 데이터 사용

  const refreshCartCount = async () => {
    try {
      // API에서 주문 목록 가져오기
      const orders = await OrderService.getMyOrders()

      // RESERVED 상태인 주문만 필터링하여 개수 계산
      const reservedOrders = orders.filter((order) => order.productState === "RESERVED")
      const count = reservedOrders.length

      console.log("장바구니 아이템 수 조회 성공:", count)
      setCartCount(count)
    } catch (err) {
      console.error("장바구니 아이템 수 조회 실패:", err)
      console.log("장바구니 API 연동 안되서 더미 사용")
      // 에러 발생 시 더미 값(3) 유지
    }
  }

  // 컴포넌트 마운트 시 장바구니 수량 조회
  useEffect(() => {
    refreshCartCount()
  }, [])

  return <CartContext.Provider value={{ cartCount, refreshCartCount }}>{children}</CartContext.Provider>
}

export function useCart() {
  return useContext(CartContext)
}

