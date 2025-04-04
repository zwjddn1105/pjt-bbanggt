import { api } from "@/lib/api"
import type { BakeryRequest, BakeryResponse } from "@/types/api-types"

// 빵집 관련 API 서비스
export const BakeryService = {
  // 빵집 생성
  createBakery: async (request: BakeryRequest): Promise<void> => {
    return api.post("/api/v1/bakery/createBakery", request)
  },

  // 빵집 상세 조회
  getBakeryById: async (bakeryId: number): Promise<BakeryResponse> => {
    return api.get<BakeryResponse>(`/api/v1/bakery/${bakeryId}`)
  },

  // 빵집 수정
  modifyBakery: async (bakeryId: number, request: BakeryRequest): Promise<BakeryResponse> => {
    return api.patch<BakeryResponse>(`/api/v1/bakery/${bakeryId}`, request)
  },

  // 북마크 조회
  getBookmark: async (bakeryId: number): Promise<boolean> => {
    return api.get<boolean>(`/api/v1/bakery/bookmark/${bakeryId}`)
  },

  // 북마크 등록
  createBookmark: async (bakeryId: number): Promise<void> => {
    return api.post(`/api/v1/bakery/bookmark/${bakeryId}`)
  },

  // 북마크 삭제
  deleteBookmark: async (bakeryId: number): Promise<void> => {
    return api.delete(`/api/v1/bakery/bookmark/${bakeryId}`)
  },
}

