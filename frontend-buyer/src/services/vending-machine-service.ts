import { api } from "@/lib/api"
import type { VendingMachineCreateJsonRequest, VendingMachineResponse } from "@/types/api-types"

// 자판기 관련 API 서비스
export const VendingMachineService = {
  // 위치 기반 자판기 조회
  findAll: async (latitude: number, longitude: number, distance: number): Promise<VendingMachineResponse[]> => {
    return api.get<VendingMachineResponse[]>(
      `/api/v1/vending-machines?latitude=${latitude}&longitude=${longitude}&distance=${distance}`,
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

