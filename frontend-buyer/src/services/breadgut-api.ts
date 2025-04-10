import { api } from "../lib/api"
import type {
  VendingMachineCreateJsonRequest,
  VendingMachineResponse,
  VendingMachineSlotResponse,
  OrderResponse,
  AccountResponse,
  PayRequest,
  BakeryResponse,
} from "../types/api-types"

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

export async function addBakeryBookmark(bakeryId: number): Promise<void> {
  return api.post(`/api/v1/bakery/${bakeryId}/bookmark`)
}

export async function removeBakeryBookmark(bakeryId: number): Promise<void> {
  return api.delete(`/api/v1/bakery/${bakeryId}/bookmark`)
}

// 주문 상세 정보 조회 함수 추가 (반환 타입 명시)
export async function fetchOrderDetail(vendingMachineId: string | number, orderId: number): Promise<OrderResponse> {
  return api.get<OrderResponse>(`/api/v1/order/vendor/${vendingMachineId}/${orderId}`)
}

// 계좌 정보 조회 함수 추가
export async function fetchAccountInfo(): Promise<AccountResponse[]> {
  return api.get<AccountResponse[]>(`/api/v1/account`)
}

// 결제 함수 수정 - 디버깅 로그 추가 및 URL 경로 수정
export async function payForOrder(orderId: number, payRequest: PayRequest): Promise<any> {
  // console.log(`결제 요청: orderId=${orderId}, payRequest=`, payRequest)
  try {
    // 백엔드 API 경로가 /api/v1/order/{orderId}/pay 형식임을 확인
    const response = await api.post(`/api/v1/order/${orderId}/pay`, payRequest)
    // console.log("결제 응답:", response)
    return response
  } catch (error) {
    // console.error("결제 오류:", error)
    throw error
  }
}

// 빵집 정보 조회 함수
export async function fetchBakeryById(bakeryId: number): Promise<BakeryResponse> {
  return api.get<BakeryResponse>(`/api/v1/bakery/${bakeryId}`)
}

// 북마크된 빵집 목록 조회 함수 (추가)
export async function fetchBookmarkedBakeries(): Promise<BakeryResponse[]> {
  return api.get<BakeryResponse[]>(`/api/v1/bakery/bookmark`)
}


// 자판기 이름 또는 주소로 검색하는 함수
export async function searchVendingMachines(
  query: string,
  latitude: number,
  longitude: number,
  distance = 5,
): Promise<VendingMachineResponse[]> {
  // 현재는 백엔드 API에 검색 기능이 없으므로 클라이언트에서 필터링
  const allMachines = await fetchVendingMachines(latitude, longitude, distance)

  // 검색어가 비어있으면 모든 결과 반환
  if (!query.trim()) {
    return allMachines
  }

  // 검색어로 필터링 (이름 또는 주소에 검색어가 포함된 자판기)
  return allMachines.filter(
    (machine) =>
      machine.name.toLowerCase().includes(query.toLowerCase()) ||
      (machine.address && machine.address.toLowerCase().includes(query.toLowerCase())),
  )
}

// 북마크된 빵집의 자판기 검색 함수
export async function searchBookmarkedVendingMachines(
  query: string,
  latitude: number,
  longitude: number,
  distance = 5,
): Promise<VendingMachineResponse[]> {
  // 현재는 백엔드 API에 검색 기능이 없으므로 클라이언트에서 필터링
  const bookmarkedMachines = await fetchBookmarkedVendingMachines(latitude, longitude, distance)

  // 검색어가 비어있으면 모든 결과 반환
  if (!query.trim()) {
    return bookmarkedMachines
  }

  // 검색어로 필터링 (이름 또는 주소에 검색어가 포함된 자판기)
  return bookmarkedMachines.filter(
    (machine) =>
      machine.name.toLowerCase().includes(query.toLowerCase()) ||
      (machine.address && machine.address.toLowerCase().includes(query.toLowerCase())),
  )
}

