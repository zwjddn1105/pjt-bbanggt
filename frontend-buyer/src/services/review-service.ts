import { api } from "@/lib/api"
import type { PageReviewResponse, Pageable, ReviewRequest } from "@/types/api-types"

// 리뷰 관련 API 서비스
export const ReviewService = {
  // 리뷰 생성
  createReview: async (bakeryId: number, request: ReviewRequest): Promise<void> => {
    return api.post(`/api/v1/review/createReview/${bakeryId}`, request)
  },

  // 리뷰 목록 조회
  getReviews: async (bakeryId: number, pageable: Pageable): Promise<PageReviewResponse> => {
    const { page, size, sort } = pageable
    let url = `/api/v1/review/${bakeryId}?page=${page}&size=${size}`

    if (sort && sort.length > 0) {
      sort.forEach((sortItem) => {
        url += `&sort=${sortItem}`
      })
    }

    return api.get<PageReviewResponse>(url)
  },

  // 리뷰 삭제
  deleteReview: async (bakeryId: number, reviewId: number): Promise<void> => {
    return api.delete(`/api/v1/review/deleteReview/${bakeryId}/${reviewId}`)
  },
}

