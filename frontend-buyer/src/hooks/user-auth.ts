"use client"

import { useState, useEffect, useCallback } from "react"
import { AuthService } from "../services"
import type { LoginRequest } from "../types/api-types"

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // 로그인 상태 확인
  const checkLoginStatus = useCallback(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token")
      setIsLoggedIn(!!token)
    }
    setIsLoading(false)
  }, [])

  // 컴포넌트 마운트 시 로그인 상태 확인
  useEffect(() => {
    checkLoginStatus()
  }, [checkLoginStatus])

  // 카카오 로그인
  const login = async (code: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const loginRequest: LoginRequest = { code }
      await AuthService.kakaoLogin(loginRequest)

      setIsLoggedIn(true)
      return true
    } catch (err: any) {
      setError(err.message || "로그인 중 오류가 발생했습니다.")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // 로그아웃
  const logout = async () => {
    try {
      setIsLoading(true)
      setError(null)

      await AuthService.logout()

      setIsLoggedIn(false)
      return true
    } catch (err: any) {
      setError(err.message || "로그아웃 중 오류가 발생했습니다.")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // 개발용 테스트 토큰 발급
  const getTestToken = async () => {
    try {
      setIsLoading(true)
      setError(null)

      await AuthService.getTestToken()

      setIsLoggedIn(true)
      return true
    } catch (err: any) {
      setError(err.message || "테스트 토큰 발급 중 오류가 발생했습니다.")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoggedIn,
    isLoading,
    error,
    login,
    logout,
    getTestToken,
  }
}

