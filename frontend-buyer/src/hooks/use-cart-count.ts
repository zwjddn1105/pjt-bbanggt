"use client"

import { useState, useEffect } from "react"
import { OrderService } from "@/services"

/**
 * 장바구니 아이템 수를 가져오는 커스텀 훅
 *
 * @returns 장바구니 아이템 수와 로딩 상태
 */
export function useCartCount() {
  const [count, setCount] = useState<number>(3) // 기본값으로 더미 데이터 사용
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        setIsLoading(true)

        // API에서 주문 목록 가져오기
        const orders = await OrderService.getMyOrders()

        // RESERVED 상태인 주문만 필터링하여 개수 계산
        const reservedOrders = orders.filter((order) => order.productState === "RESERVED")
        const cartCount = reservedOrders.length

        console.log("장바구니 아이템 수 조회 성공:", cartCount)
        setCount(cartCount)
      } catch (err) {
        console.error("장바구니 아이템 수 조회 실패:", err)
        console.log("장바구니 API 연동 안되서 더미 사용")
        // 에러 발생 시 더미 값(3) 유지
        setError("장바구니 정보를 불러오는데 실패했습니다.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCartCount()
  }, [])

  return { count, isLoading, error }
}

