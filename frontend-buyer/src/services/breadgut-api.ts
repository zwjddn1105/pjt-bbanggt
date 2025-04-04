import { api } from "@/lib/api"
import type {
  VendingMachineCreateJsonRequest,
  VendingMachineResponse,
  VendingMachineSlotResponse,
  OrderResponse,
  AccountResponse,
} from "@/types/api-types"

// 자판기 관련 API 서비스
export const VendingMachineService = {
  // 위치 기반 자판기 조회
  findAll: async (latitude: number, longitude: number, distance: number): Promise<VendingMachineResponse[]> => {
    return api.get<VendingMachineResponse[]>(
      `/api/v1/vending-machines?latitude=${latitude}&longitude=${longitude}&distance=${distance}`,
    )
  },

  // 자판기 ID로 상세 정보 조회
  findById: async (vendingMachineId: string | number): Promise<VendingMachineSlotResponse> => {
    return api.get<VendingMachineSlotResponse>(`/api/v1/vending-machines/buyer/${vendingMachineId}`)
  },

  // 북마크된 빵집의 빵이 담긴 자판기 조회 (수정된 부분)
  findAllByBookmark: async (
    latitude: number,
    longitude: number,
    distance: number,
  ): Promise<VendingMachineResponse[]> => {
    return api.get<VendingMachineResponse[]>(
      `/api/v1/vending-machines/bookmarked?latitude=${latitude}&longitude=${longitude}&distance=${distance}`,
    )
  },

  // 자판기 생성 (어드민 전용)
  create: async (request: VendingMachineCreateJsonRequest, files: File[]): Promise<void> => {
    const formData = new FormData()

    // JSON 요청 데이터 추가
    formData.append("jsonRequest", JSON.stringify(request))

    // 파일 추가
    files.forEach((file) => {
      formData.append("files", file)
    })

    return api.upload("/api/v1/vending-machines", formData)
  },

  // 자판기 삭제 (어드민 전용)
  delete: async (vendingMachineId: number): Promise<void> => {
    return api.delete(`/api/v1/vending-machines/${vendingMachineId}`)
  },

  // 캐시 워밍업 (어드민 전용)
  warmUp: async (): Promise<void> => {
    return api.post("/api/v1/vending-machines/warm-up")
  },
}

// 빵긋 API 함수들
export async function fetchVendingMachines(
  latitude: number,
  longitude: number,
  distance = 5,
): Promise<VendingMachineResponse[]> {
  return VendingMachineService.findAll(latitude, longitude, distance)
}

// 자판기 ID로 상세 정보 조회 함수
export async function fetchVendingMachineById(vendingMachineId: string | number): Promise<VendingMachineSlotResponse> {
  return VendingMachineService.findById(vendingMachineId)
}

// 북마크된 빵집의 빵이 담긴 자판기 조회 함수 (수정된 부분)
export async function fetchBookmarkedVendingMachines(
  latitude: number,
  longitude: number,
  distance = 5,
): Promise<VendingMachineResponse[]> {
  return VendingMachineService.findAllByBookmark(latitude, longitude, distance)
}

export async function addBakeryBookmark(vendingMachineId: number): Promise<void> {
  return api.post(`/api/v1/bookmarks/vending-machines/${vendingMachineId}`)
}

export async function removeBakeryBookmark(vendingMachineId: number): Promise<void> {
  return api.delete(`/api/v1/bookmarks/vending-machines/${vendingMachineId}`)
}

// 주문 상세 정보 조회 함수 추가 (반환 타입 명시)
export async function fetchOrderDetail(vendingMachineId: string | number, orderId: number): Promise<OrderResponse> {
  return api.get<OrderResponse>(`/api/v1/order/vendor/${vendingMachineId}/${orderId}`)
}

// 계좌 정보 조회 함수 추가
export async function fetchAccountInfo(): Promise<AccountResponse[]> {
  return api.get<AccountResponse[]>(`/api/v1/account`)
}

