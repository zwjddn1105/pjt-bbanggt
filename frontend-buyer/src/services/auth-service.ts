import { api } from "../lib/api"
import type { AccessTokenResponse, LoginRequest, UserTokens } from "../types/api-types"

// 인증 관련 API 서비스
export const AuthService = {
  // 카카오 로그인
  kakaoLogin: async (loginRequest: LoginRequest): Promise<AccessTokenResponse> => {
    const response = await api.post<AccessTokenResponse>("/api/v1/auth/login/kakao", loginRequest)

    // 응답에서 액세스 토큰 저장
    if (typeof window !== "undefined" && response.accessToken) {
      localStorage.setItem("access_token", response.accessToken)
    }

    return response
  },

  // 로그아웃
  logout: async (): Promise<void> => {
    await api.post("/api/v1/auth/logout")

    // 로컬 스토리지에서 토큰 제거
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")
    }
  },

  // 토큰 재발급
  reissueToken: async (): Promise<AccessTokenResponse> => {
    const response = await api.post<AccessTokenResponse>("/api/v1/auth/reissue")

    // 새 액세스 토큰 저장
    if (typeof window !== "undefined" && response.accessToken) {
      localStorage.setItem("access_token", response.accessToken)
    }

    return response
  },

  // 테스트용 토큰 발급 (개발 환경에서만 사용)
  getTestToken: async (): Promise<UserTokens> => {
    const response = await api.get<UserTokens>("/api/v1/access-tokens")

    // 토큰 저장
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", response.accessToken)
      localStorage.setItem("refresh_token", response.refreshToken)
    }

    return response
  },
}

