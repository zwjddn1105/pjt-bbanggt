"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuthContext } from "../../../context/auth-context"
import axios from "axios"

export default function KakaoAuthPage() {
  const router = useRouter()
  const { login } = useAuthContext()
  const [status, setStatus] = useState<"loading" | "error" | "success">("loading")
  const [errorMessage, setErrorMessage] = useState("")

  // 요청 중복 방지를 위한 ref
  const isProcessingRef = useRef(false)

  useEffect(() => {
    // URL에서 인증 코드와 state 추출
    const searchParams = new URLSearchParams(window.location.search)
    const code = searchParams.get("code")

    // 이미 처리된 코드인지 확인
    const processedCode = sessionStorage.getItem("kakao_processed_code")

    // 이미 처리 중이거나 이미 처리된 코드인 경우 중복 실행 방지
    if (isProcessingRef.current || (code && code === processedCode)) {
      console.log("🔄 이미 인증 처리 중이거나 처리된 코드입니다. 중복 요청 무시.")
      return
    }

    // 처리 중 플래그 설정
    isProcessingRef.current = true

    const state = searchParams.get("state")
    const error = searchParams.get("error")

    // 디버깅: URL 파라미터 로깅
    console.log("🔍 카카오 인증 콜백 파라미터:", {
      code: code ? `${code.substring(0, 10)}...` : "없음",
      state,
      error,
      fullUrl: window.location.href,
    })

    // 에러 처리
    if (error) {
      console.error("❌ 카카오 인증 오류:", error)
      setStatus("error")
      setErrorMessage(`인증 오류: ${error}`)
      isProcessingRef.current = false
      return
    }

    // 코드 확인
    if (!code) {
      console.error("❌ 인증 코드가 없습니다.")
      setStatus("error")
      setErrorMessage("인증 코드가 없습니다.")
      isProcessingRef.current = false
      return
    }

    // 인증 코드를 서버로 전송하여 토큰 발급
    const sendAuthCodeToServer = async () => {
      try {
        console.log("🚀 인증 코드 서버 전송 시작")

        // 처리 중인 코드 저장
        sessionStorage.setItem("kakao_processed_code", code)

        // 백엔드 API URL
        const backendApiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login/kakao`

        // 디버깅: 전체 URL 로깅 추가
        console.log("🔗 백엔드 API URL:", backendApiUrl)
        console.log("📤 백엔드로 전송할 데이터:", { code: code.substring(0, 10) + "..." })

        // 백엔드 API 직접 호출 - 인증 코드만 전송
        console.log("🔄 백엔드 API 직접 호출 시작 - 인증 코드만 전송")

        // axios를 사용하여 API 요청
        const response = await axios.post(
          backendApiUrl,
          { code },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          },
        )

        // 디버깅: 백엔드 응답 상태 로깅
        console.log("✅ 백엔드 응답 상태:", response.status)
        console.log("✅ 백엔드 응답 데이터:", response.data)

        // 응답 데이터에서 accessToken과 refreshToken 가져오기
        const accessToken = response.data.accessToken
        const refreshToken = response.data.refreshToken

        if (!accessToken) {
          throw new Error("액세스 토큰이 응답에 없습니다.")
        }

        // 로컬 스토리지에 액세스 토큰 저장
        localStorage.setItem("access_token", accessToken)

        // 리프레시 토큰도 저장 (백엔드에서 제공하는 경우)
        if (refreshToken) {
          localStorage.setItem("refresh_token", refreshToken)
          console.log("✅ 리프레시 토큰 저장 완료:", refreshToken.substring(0, 10) + "...")
        } else {
          console.warn("⚠️ 백엔드에서 리프레시 토큰을 제공하지 않았습니다.")
        }

        // 백엔드에서 user 정보를 반환하지 않는 경우, 기본 사용자 정보 사용
        const user = response.data.user || {
          id: 0,
          nickname: "사용자",
        }

        console.log("👤 사용자 정보:", user)

        // 사용자 정보 저장
        localStorage.setItem("user_info", JSON.stringify(user))

        // 인증 성공 시 로그인 처리
        login(accessToken, user, refreshToken)
        console.log("🔓 로그인 처리 완료")

        // 인증 성공
        setStatus("success")
        console.log("✨ 인증 성공 - 홈페이지로 리다이렉트 예정")

        // 홈페이지로 리다이렉트
        setTimeout(() => {
          router.push("/")
        }, 1500)
      } catch (error) {
        console.error("❌ 인증 처리 오류:", error)

        // 오류 세부 정보 출력
        if (axios.isAxiosError(error)) {
          console.error("❌ 백엔드 API 호출 실패!")
          console.error("🔍 API 오류 상세:", {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message,
          })
        }

        setStatus("error")
        setErrorMessage(error instanceof Error ? error.message : "인증 처리 중 오류가 발생했습니다.")
      } finally {
        // 처리 완료 플래그 설정
        isProcessingRef.current = false
        console.log("🏁 인증 처리 완료")
      }
    }

    sendAuthCodeToServer()

    // state 정보 삭제
    sessionStorage.removeItem("kakao_auth_state")

    // 컴포넌트 언마운트 시 처리 중 플래그 초기화
    return () => {
      isProcessingRef.current = false
    }
  }, [router, login])

  // 로딩 상태 UI
  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-custom mb-4"></div>
        <p>카카오 로그인 처리 중...</p>
      </div>
    )
  }

  // 에러 상태 UI
  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{errorMessage}</p>
        </div>
        <button onClick={() => router.push("/login")} className="px-4 py-2 bg-primary-custom text-white rounded-md">
          로그인 페이지로 돌아가기
        </button>
      </div>
    )
  }

  // 성공 상태 UI
  // return (
  //   <div className="flex flex-col items-center justify-center min-h-screen">
  //     <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
  //       <p>로그인 성공! 홈페이지로 이동합니다.</p>
  //     </div>
  //   </div>
  // )
}

