import axios, { type AxiosInstance, type AxiosResponse } from "axios"

// API 기본 설정
interface ApiConfig {
  baseURL: string
  timeout: number
  headers: Record<string, string>
}

// 기본 API 설정값
export const defaultApiConfig: ApiConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://43.203.248.254:8082",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
}

// API 인스턴스 생성 함수
export const createApiInstance = (config: ApiConfig = defaultApiConfig): AxiosInstance => {
  const instance = axios.create({
    baseURL: config.baseURL,
    timeout: config.timeout,
    headers: config.headers,
  })

  // 요청 인터셉터 설정
  instance.interceptors.request.use(
    (config) => {
      // 토큰이 있으면 헤더에 추가
      const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null

      // 디버깅: 요청 정보 로깅
      // console.log("🚀 API 요청:", {
      //   url: config.url,
      //   method: config.method?.toUpperCase(),
      //   headers: config.headers,
      //   data: config.data,
      //   params: config.params,
      // })

      // 디버깅: 토큰 정보 로깅
      // console.log("🔑 요청 토큰:", token ? `${token.substring(0, 10)}...` : "없음")

      if (token) {
        // 헤더 설정 방식 수정 - 대소문자 확인
        config.headers["Authorization"] = `Bearer ${token}`

        // 디버깅: 설정된 Authorization 헤더 로깅
        // console.log("🔐 설정된 Authorization 헤더:", `Bearer ${token.substring(0, 10)}...`)
      } else {
        // console.warn("⚠️ 토큰이 없습니다. 인증이 필요한 API 호출 시 오류가 발생할 수 있습니다.")
      }

      return config
    },
    (error) => {
      // 디버깅: 요청 오류 로깅
      // console.error("❌ API 요청 오류:", error)
      return Promise.reject(error)
    },
  )

  // 응답 인터셉터 설정
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      // 디버깅: 응답 정보 로깅
      // console.log("✅ API 응답:", {
      //   url: response.config.url,
      //   status: response.status,
      //   statusText: response.statusText,
      //   headers: response.headers,
      //   data: response.data,
      // })

      return response
    },
    async (error) => {
      // 디버깅: 응답 오류 로깅
      // console.error("❌ API 응답 오류:", {
      //   url: error.config?.url,
      //   status: error.response?.status,
      //   statusText: error.response?.statusText,
      //   data: error.response?.data,
      //   message: error.message,
      // })

      const originalRequest = error.config

      // 401 에러이고, 재시도하지 않은 경우 토큰 재발급 시도
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        try {
          // console.log("🔄 토큰 재발급 시도")

          // 리프레시 토큰으로 새 액세스 토큰 발급 요청
          const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null
          // console.log("🔑 리프레시 토큰:", refreshToken ? `${refreshToken.substring(0, 10)}...` : "없음")

          if (refreshToken) {
            const response = await axios.post(
              `${config.baseURL}/api/v1/auth/reissue`,
              { refreshToken },
              {
                headers: { "Content-Type": "application/json" },
              },
            )

            const { accessToken, refreshToken: newRefreshToken } = response.data
            // console.log("🔑 새 액세스 토큰:", accessToken ? `${accessToken.substring(0, 10)}...` : "없음")

            // 새 액세스 토큰 저장
            if (typeof window !== "undefined") {
              localStorage.setItem("access_token", accessToken)

              // 새 리프레시 토큰이 있으면 저장
              if (newRefreshToken) {
                localStorage.setItem("refresh_token", newRefreshToken)
              }
            }

            // 원래 요청 헤더 업데이트
            originalRequest.headers["Authorization"] = `Bearer ${accessToken}`

            // 원래 요청 재시도
            return axios(originalRequest)
          }
        } catch (refreshError) {
          // 디버깅: 토큰 갱신 오류 로깅
          // console.error("❌ 토큰 갱신 오류:", refreshError)

          // 리프레시 토큰도 만료된 경우 로그아웃 처리
          if (typeof window !== "undefined") {
            localStorage.removeItem("access_token")
            localStorage.removeItem("refresh_token")
            localStorage.removeItem("user_info")
            // 로그인 페이지로 리다이렉트
            window.location.href = "/login"
          }
        }
      }

      return Promise.reject(error)
    },
  )

  return instance
}

// 기본 API 인스턴스
export const apiClient = createApiInstance()

