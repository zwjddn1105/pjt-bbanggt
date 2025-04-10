"use client"

import { useState } from "react"
import Image from "next/image"

export default function KakaoLoginButton() {
  const [isLoading, setIsLoading] = useState(false)

  // 카카오 로그인 요청 함수
  const handleKakaoLogin = () => {
    setIsLoading(true)

    // 환경 변수에서 설정 가져오기
    const CLIENT_ID = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID
    const REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI

    // 디버깅: 환경 변수 로깅
    // console.log("🔑 카카오 로그인 설정 (전체 값):", {
    //   CLIENT_ID_FULL: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID,
    //   REDIRECT_URI_FULL: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI,
    // })

    // // 디버깅: 리다이렉트 URI 로깅
    // console.log("🔍 리다이렉트 URI (전체 값):", REDIRECT_URI)

    // 환경 변수가 설정되어 있는지 확인
    if (!CLIENT_ID || !REDIRECT_URI) {
      // console.error("❌ 카카오 로그인 설정이 없습니다.")
      setIsLoading(false)
      return
    }

    // CSRF 공격 방지를 위한 state 생성
    const state = Math.random().toString(36).substring(2, 15)

    // state를 세션 스토리지에 저장 (검증용)
    try {
      sessionStorage.setItem("kakao_auth_state", state)
      // console.log("✅ 상태 값 저장 완료:", state)

      // 저장 확인
      const savedState = sessionStorage.getItem("kakao_auth_state")
      // console.log("✅ 저장된 상태 값 확인:", savedState)

      if (savedState !== state) {
        // console.warn("⚠️ 상태 값이 제대로 저장되지 않았습니다.")
      }
    } catch (e) {
      // console.error("❌ 세션 스토리지 접근 오류:", e)
      // 오류가 발생해도 계속 진행 (개발 중에는 허용)
    }

    // 카카오 인증 URL - encodeURIComponent 사용하여 리다이렉트 URI 인코딩
    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&state=${state}`

    // 디버깅: 카카오 인증 URL 로깅
    // console.log("🔗 카카오 인증 URL:", kakaoURL)

    // 카카오 로그인 페이지로 리다이렉트
    window.location.href = kakaoURL
  }

  return (
    <button
      onClick={handleKakaoLogin}
      disabled={isLoading}
      className="w-full bg-[#FEE500] text-[#3A1D1D] py-3 px-4 rounded-md font-medium flex items-center justify-center relative"
    >
      {isLoading ? (
        <span>로그인 중...</span>
      ) : (
        <>
          <div className="absolute left-4">
            <Image src="/kakao-logo.png" alt="카카오 로고" width={22} height={22} className="object-contain" />
          </div>
          <span>카카오로 시작하기</span>
        </>
      )}
    </button>
  )
}

