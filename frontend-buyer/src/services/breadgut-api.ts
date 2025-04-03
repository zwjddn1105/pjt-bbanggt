import type { VendingMachine } from "@/types/vending-machine"

// 환경 변수에서 API URL 가져오기
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://j12a209.p.ssafy.io"

// 인증 토큰을 가져오는 함수 (로컬 스토리지 또는 쿠키에서)
const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("access_token")
  }
  return null
}

// API 요청 헤더 생성
const createHeaders = (): HeadersInit => {
  const token = getAuthToken()
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  return headers
}

// 빵긋(자판기) 위치 정보 가져오기
export const fetchVendingMachines = async (
  latitude: number,
  longitude: number,
  distance = 5,
): Promise<VendingMachine[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/vending-machines?latitude=${latitude}&longitude=${longitude}&distance=${distance}`,
      {
        method: "GET",
        headers: createHeaders(),
      },
    )

    if (!response.ok) {
      throw new Error("빵긋 데이터를 가져오는데 실패했습니다.")
    }

    return await response.json()
  } catch (error) {
    console.error("빵긋 데이터 요청 오류:", error)
    throw error
  }
}

// 북마크된 빵긋(자판기) 위치 정보 가져오기
export const fetchBookmarkedVendingMachines = async (
  latitude: number,
  longitude: number,
  distance = 5,
): Promise<VendingMachine[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/vending-machines/bookmarked?latitude=${latitude}&longitude=${longitude}&distance=${distance}`, {
      method: "GET",
      headers: createHeaders(),
    })

    if (!response.ok) {
      throw new Error("북마크된 빵긋 데이터를 가져오는데 실패했습니다.")
    }

    return await response.json()
  } catch (error) {
    console.error("북마크된 빵긋 데이터 요청 오류:", error)
    throw error
  }
}

// 빵집 북마크 상태 확인
export const checkBakeryBookmark = async (bakeryId: number): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/bakery/bookmark/${bakeryId}`, {
      method: "GET",
      headers: createHeaders(),
    })

    if (!response.ok) {
      throw new Error("북마크 상태 확인에 실패했습니다.")
    }

    return await response.json()
  } catch (error) {
    console.error("북마크 상태 확인 오류:", error)
    throw error
  }
}

// 빵집 북마크 추가
export const addBakeryBookmark = async (bakeryId: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/bakery/bookmark/${bakeryId}`, {
      method: "POST",
      headers: createHeaders(),
    })

    if (!response.ok) {
      throw new Error("북마크 추가에 실패했습니다.")
    }
  } catch (error) {
    console.error("북마크 추가 오류:", error)
    throw error
  }
}

// 빵집 북마크 삭제
export const removeBakeryBookmark = async (bakeryId: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/bakery/bookmark/${bakeryId}`, {
      method: "DELETE",
      headers: createHeaders(),
    })

    if (!response.ok) {
      throw new Error("북마크 삭제에 실패했습니다.")
    }
  } catch (error) {
    console.error("북마크 삭제 오류:", error)
    throw error
  }
}

