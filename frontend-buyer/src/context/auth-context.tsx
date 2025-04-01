"use client"

import type React from "react"
import { createContext, useContext } from "react"
import { useAuth } from "@/hooks/use-auth"

interface User {
  id: number
  nickname: string
}

interface AuthContextProps {
  login: (accessToken: string, user: User, refreshToken?: string) => void
  logout: () => void
  isAuthenticated: boolean
  user: User | null
  isLoading: boolean
  error: string | null
  refreshToken: () => Promise<boolean>
  checkAuthStatus: () => Promise<void>
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // useAuth 훅을 사용하여 인증 상태와 메서드를 가져옵니다
  const auth = useAuth()

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuthContext must be used within a AuthProvider")
  }
  return context
}

