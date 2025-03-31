import axios, { type AxiosInstance } from "axios"

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
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    },
  )

  // 응답 인터셉터 설정
  instance.interceptors.response.use(
    (response) => {
      return response
    },
    async (error) => {
      const originalRequest = error.config

      // 401 에러이고, 재시도하지 않은 경우 토큰 재발급 시도
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        try {
          // 리프레시 토큰으로 새 액세스 토큰 발급 요청
          const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null

          if (refreshToken) {
            const response = await axios.post(
              `${config.baseURL}/api/v1/auth/reissue`,
              {},
              {
                headers: {
                  Authorization: originalRequest.headers["Authorization"],
                },
                withCredentials: true, // 쿠키 포함
              },
            )

            const { accessToken } = response.data

            // 새 액세스 토큰 저장
            if (typeof window !== "undefined") {
              localStorage.setItem("access_token", accessToken)
            }

            // 원래 요청 헤더 업데이트
            originalRequest.headers["Authorization"] = `Bearer ${accessToken}`

            // 원래 요청 재시도
            return axios(originalRequest)
          }
        } catch (refreshError) {
          // 리프레시 토큰도 만료된 경우 로그아웃 처리
          if (typeof window !== "undefined") {
            localStorage.removeItem("access_token")
            localStorage.removeItem("refresh_token")
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

