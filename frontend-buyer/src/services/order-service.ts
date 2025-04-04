import { api } from "@/lib/api"
import type { OrderRequest, OrderResponse, OrderStackResponse, SpaceResponse, ProductState } from "@/types/api-types"

// 주문 관련 API 서비스
export const OrderService = {
  // 주문 생성
  createOrder: async (spaceId: number, orderRequests: OrderRequest[], image: File): Promise<void> => {
    const formData = new FormData()

    // 주문 요청 데이터 추가
    formData.append("orderRequests", JSON.stringify(orderRequests))

    // 이미지 추가
    formData.append("image", image)

    return api.upload(`/api/v1/order/createOrder/${spaceId}`, formData)
  },

  // 주문 예약
  reserveOrder: async (orderId: number): Promise<void> => {
    return api.post(`/api/v1/order/reserve/${orderId}`)
  },

  // 주문 결제
  payForOrder: async (orderId: number): Promise<void> => {
    return api.post(`/api/v1/order/pay/${orderId}`)
  },

  // 자판기별 주문 조회
  getOrdersByVendingMachineId: async (vendingMachineId: number): Promise<SpaceResponse[]> => {
    return api.get<SpaceResponse[]>(`/api/v1/order/vendor/${vendingMachineId}`)
  },

  // 자판기별 특정 주문 조회
  getOrdersByIdAndVendingMachineId: async (id: number, vendingMachineId: number): Promise<OrderResponse> => {
    return api.get<OrderResponse>(`/api/v1/order/vendor/${vendingMachineId}/${id}`)
  },

  // 내 주문 목록 조회
  getMyOrders: async (): Promise<OrderResponse[]> => {
    return api.get<OrderResponse[]>("/api/v1/order/myOrder")
  },

  // 내 재고 목록 조회
  getMyOrderStocks: async (): Promise<OrderStackResponse[]> => {
    return api.get<OrderStackResponse[]>("/api/v1/order/myStocks")
  },

  // 주문 상태 변경 (장바구니에서 삭제 시 RESERVED → AVAILABLE로 변경)
  updateOrderStatus: async (orderId: number, status: ProductState): Promise<void> => {
    return api.patch(`/api/v1/order/status/${orderId}`, { status })
  },

  // 주문 취소 (장바구니에서 삭제 시 사용)
  cancelOrder: async (orderId: number): Promise<void> => {
    // 주문 상태를 AVAILABLE로 변경
    return OrderService.updateOrderStatus(orderId, "AVAILABLE")
  },
}

