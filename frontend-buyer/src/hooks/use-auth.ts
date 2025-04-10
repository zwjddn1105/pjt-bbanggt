"use client"

import { useState, useEffect, useCallback } from "react"
import axios from "axios"

interface User {
  id: number
  nickname: string
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  accessToken: string | null
  isLoading: boolean
  error: string | null
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    accessToken: null,
    isLoading: true,
    error: null,
  })

  // 로그인 상태 확인
  const checkAuthStatus = useCallback(async () => {
    try {
      // console.log("🔍 로그인 상태 확인 시작")

      // 로컬 스토리지에서 액세스 토큰과 사용자 정보 가져오기
      const token = localStorage.getItem("access_token")
      const userJson = localStorage.getItem("user_info")

      // 디버깅: 토큰 정보 로깅
      // console.log("🔑 저장된 액세스 토큰:", token ? `${token.substring(0, 10)}...` : "없음")
      // console.log("👤 저장된 사용자 정보:", userJson || "없음")

      if (!token) {
        // console.log("❌ 저장된 토큰 없음 - 로그아웃 상태")
        setAuthState({
          isAuthenticated: false,
          user: null,
          accessToken: null,
          isLoading: false,
          error: null,
        })
        return
      }

      // 사용자 정보가 있으면 파싱
      let user: User | null = null
      if (userJson) {
        try {
          user = JSON.parse(userJson)
        } catch (e) {
          // console.error("❌ 사용자 정보 파싱 오류:", e)
        }
      }

      // 토큰이 있으면 인증된 상태로 간주
      if (token) {
        // console.log("✅ 토큰 확인됨 - 로그인 상태")
        setAuthState({
          isAuthenticated: true,
          user,
          accessToken: token,
          isLoading: false,
          error: null,
        })
      } else {
        // 토큰 갱신 시도
        // console.log("🔄 토큰 갱신 시도")
        const refreshSuccess = await refreshToken()

        if (!refreshSuccess) {
          // 갱신 실패 시 로그아웃
          // console.log("❌ 토큰 갱신 실패 - 로그아웃 처리")
          logout()
        }
      }
    } catch (error) {
      // console.error("❌ 인증 상태 확인 오류:", error)
      setAuthState({
        isAuthenticated: false,
        user: null,
        accessToken: null,
        isLoading: false,
        error: "인증 상태 확인 중 오류가 발생했습니다.",
      })
    }
  }, [])

  // 토큰 갱신
  const refreshToken = async () => {
    try {
      // console.log("🔄 토큰 갱신 API 호출 시작")

      // 로컬 스토리지에서 리프레시 토큰 가져오기
      const refreshTokenValue = localStorage.getItem("refresh_token")

      if (!refreshTokenValue) {
        // console.error("❌ 리프레시 토큰이 없습니다.")
        return false
      }

      // console.log("🔑 리프레시 토큰:", refreshTokenValue ? `${refreshTokenValue.substring(0, 10)}...` : "없음")

      // 백엔드 API URL
      const backendApiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/reissue`

      // 백엔드 API 호출
      const response = await axios.post(
        backendApiUrl,
        { refreshToken: refreshTokenValue },
        {
          headers: { "Content-Type": "application/json" },
        },
      )

      // 디버깅: 응답 상태 로깅
      // console.log("🔍 토큰 갱신 응답 상태:", response.status)
      // console.log("🔍 토큰 갱신 응답 데이터:", response.data)

      if (response.status >= 200 && response.status < 300) {
        // 응답 데이터에서 새 토큰 가져오기
        const { accessToken, refreshToken: newRefreshToken } = response.data

        // 디버깅: 갱신된 토큰 정보 로깅
        // console.log("✅ 토큰 갱신 성공:", {
        //   accessToken: accessToken ? `${accessToken.substring(0, 10)}...` : "없음",
        //   refreshToken: newRefreshToken ? `${newRefreshToken.substring(0, 10)}...` : "없음",
        // })

        localStorage.setItem("access_token", accessToken)

        // 새 리프레시 토큰이 있으면 저장
        if (newRefreshToken) {
          localStorage.setItem("refresh_token", newRefreshToken)
        }

        // 사용자 정보가 응답에 포함되어 있으면 저장
        if (response.data.user) {
          localStorage.setItem("user_info", JSON.stringify(response.data.user))
        }

        setAuthState({
          isAuthenticated: true,
          user: response.data.user || null,
          accessToken: accessToken,
          isLoading: false,
          error: null,
        })

        return true
      } else {
        // 갱신 실패 시 로그아웃
        // console.error("❌ 토큰 갱신 실패:", response.data)
        logout()
        return false
      }
    } catch (error) {
      // console.error("❌ 토큰 갱신 오류:", error)
      logout()
      return false
    }
  }

  // 로그인
  const login = async (accessToken: string, user: User, refreshToken?: string) => {
    // console.log("🔑 로그인 처리:", {
    //   accessToken: accessToken ? `${accessToken.substring(0, 10)}...` : "없음",
    //   refreshToken: refreshToken ? `${refreshToken.substring(0, 10)}...` : "없음",
    //   user,
    // })

    // 로컬 스토리지에 저장
    localStorage.setItem("access_token", accessToken)

    // 리프레시 토큰이 있으면 저장
    if (refreshToken) {
      localStorage.setItem("refresh_token", refreshToken)
    }

    // 사용자 정보 저장
    localStorage.setItem("user_info", JSON.stringify(user))

    // 사용자 ID가 있으면 로컬 스토리지와 쿠키에 저장
    if (user && user.id) {
      localStorage.setItem("user_id", user.id.toString())
      document.cookie = `user_id=${user.id}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
    }

    // 쿠키에도 저장 (미들웨어에서 확인하기 위함)
    document.cookie = `auth_token=${accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`

    setAuthState({
      isAuthenticated: true,
      user,
      accessToken,
      isLoading: false,
      error: null,
    })
  }

  // 로그아웃
  const logout = () => {
    const token = localStorage.getItem("access_token")
    // console.log("🚪 로그아웃 처리 시작")

    // 로컬 스토리지에서 토큰 제거
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("user_info")
    localStorage.removeItem("user_id")

    // 쿠키에서도 제거
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax"
    document.cookie = "user_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax"

    // 서버에 로그아웃 요청
    if (token) {
      // console.log("🔄 서버 로그아웃 API 호출")

      // 백엔드 API URL
      const backendApiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/logout`

      axios
        .post(
          backendApiUrl,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then((response) => {
          // console.log("✅ 서버 로그아웃 응답:", response.status, response.statusText)
        })
        .catch((error) => {
          // console.error("❌ 서버 로그아웃 오류:", error)
        })
    }

    setAuthState({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      isLoading: false,
      error: null,
    })
  }

  // 컴포넌트 마운트 시 인증 상태 확인
  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])

  return {
    isAuthenticated: authState.isAuthenticated,
    user: authState.user,
    isLoading: authState.isLoading,
    error: authState.error,
    login,
    logout,
    refreshToken,
    checkAuthStatus,
  }
}
