import axios from 'axios'

// API 인스턴스 생성 및 기본 설정
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 15000, // 15초 타임아웃 설정
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청 인터셉터 - 토큰 추가
api.interceptors.request.use(
  (config) => {
    // 브라우저 환경에서만 localStorage 접근
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 응답 인터셉터 - 토큰 만료 처리 및 에러 핸들링
api.interceptors.response.use(
  (response) => response, // 성공 응답은 그대로 반환
  async (error) => {
    const originalRequest = error.config

    // 토큰 만료 에러(401)이고, 재시도하지 않은 요청인 경우
    if (error.response?.status === 401 && !originalRequest._retry && typeof window !== 'undefined') {
      originalRequest._retry = true

      try {
        // 토큰 재발급
        const token = localStorage.getItem('accessToken')
        if (!token) throw new Error('No token available')

        const response = await reissueToken(token)
        const { accessToken } = response.data

        // 새 토큰 저장
        localStorage.setItem('accessToken', accessToken)

        // 원래 요청 헤더 업데이트
        originalRequest.headers.Authorization = `Bearer ${accessToken}`

        // 원래 요청 재시도
        return api(originalRequest)
      } catch (refreshError) {
        // 토큰 재발급 실패 시 로그아웃 처리
        localStorage.removeItem('accessToken')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    // 서버 에러 (500대) 처리
    if (error.response?.status >= 500) {
      console.error('서버 오류가 발생했습니다:', error)
      // 여기에 에러 로깅 서비스 호출 코드 추가 가능
    }

    return Promise.reject(error)
  }
)

// 공통 에러 처리 헬퍼 함수
export const handleApiError = (error: any) => {
  if (axios.isAxiosError(error)) {
    // 네트워크 오류
    if (!error.response) {
      return '네트워크 연결에 문제가 있습니다. 인터넷 연결을 확인해주세요.'
    }
    
    // HTTP 상태 코드별 메시지
    const status = error.response.status
    if (status === 400) return '잘못된 요청입니다.'
    if (status === 401) return '로그인이 필요합니다.'
    if (status === 403) return '접근 권한이 없습니다.'
    if (status === 404) return '요청한 리소스를 찾을 수 없습니다.'
    if (status >= 500) return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
    
    // 서버에서 보낸 에러 메시지가 있으면 사용
    if (error.response.data?.message) {
      return error.response.data.message
    }
  }
  
  // 기타 에러
  return '오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
}

export default api

// ===================== Bakery API =====================

export interface BakeryRequest {
  name: string
  businessNumber: string
  homepageUrl: string
  address: string
  phone: string
}

export interface BakeryResponse {
  id: number
  name: string
  homepageUrl: string
  address: string
  phone: string
}

// 빵집 생성
export const createBakery = (data: BakeryRequest) => {
  return api.post<BakeryResponse>('/v1/bakery/createBakery', data)
}

// 빵집 상세 조회
export const getBakery = (bakeryId: number) => {
  return api.get<BakeryResponse>(`/v1/bakery/${bakeryId}`)
}

// 빵집 수정
export const updateBakery = (bakeryId: number, data: BakeryRequest) => {
  return api.patch<BakeryResponse>(`/v1/bakery/${bakeryId}`, data)
}

// 북마크 여부 조회
export const isBookmarked = (bakeryId: number) => {
  return api.get<boolean>(`/v1/bakery/bookmark/${bakeryId}`)
}

// 북마크 등록
export const bookmarkBakery = (bakeryId: number) => {
  return api.post(`/v1/bakery/bookmark/${bakeryId}`)
}

// 북마크 해제
export const unbookmarkBakery = (bakeryId: number) => {
  return api.delete(`/v1/bakery/bookmark/${bakeryId}`)
}

// ===================== Auth API =====================

export interface TokenResponse {
  accessToken: string
}

// 카카오 로그인
export const kakaoLogin = (code: string) => {
  return api.post<TokenResponse>('/v1/auth/login/kakao', { code })
}

// 토큰 재발급
export const reissueToken = (accessToken: string) => {
  return api.post<TokenResponse>('/v1/auth/reissue', null, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}

// 로그아웃
export const logout = () => {
  return api.post('/v1/auth/logout')
}

// ===================== Vending Machine API =====================

export interface VendingMachine {
  id: number
  latitude: number
  longitude: number
  distance: number
}

export interface CreateVendingMachineRequest {
  jsonRequest: {
    latitude: number
    longitude: number
    memo: string
    row: number
    column: number
  }
  files: File[]
}

// 자판기 리스트 조회
export const getVendingMachines = (
  latitude: number,
  longitude: number,
  distance: number
) => {
  return api.get<VendingMachine[]>(`/api/v1/vending-machines`, {
    params: { latitude, longitude, distance },
  })
}

// 자판기 생성 (어드민 전용)
export const createVendingMachine = (data: CreateVendingMachineRequest) => {
  const formData = new FormData()
  formData.append(
    'jsonRequest',
    new Blob([JSON.stringify(data.jsonRequest)], {
      type: 'application/json',
    })
  )
  data.files.forEach((file) => formData.append('files', file))

  return api.post('/api/v1/vending-machines', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

// 캐시 워밍업
export const warmUpVendingMachineCache = () => {
  return api.post('/api/v1/vending-machines/warm-up')
}

// 자판기 삭제
export const deleteVendingMachine = (vendingMachineId: number) => {
  return api.delete(`/api/v1/vending-machines/${vendingMachineId}`)
}

// ===================== Token API (Test Only) =====================

export interface TokenTestResponse {
  accessToken: string
  refreshToken: string
}

// 테스트용 토큰 발급
export const getTestTokens = () => {
  return api.get<TokenTestResponse>('/api/v1/access-tokens')
}