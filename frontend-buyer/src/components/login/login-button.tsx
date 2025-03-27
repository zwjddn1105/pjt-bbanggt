"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function LoginButton() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  /**
   * 카카오 로그인 처리 함수
   *
   * @remarks
   * 실제 구현 시 카카오 SDK를 사용하여 로그인 처리
   * 현재는 개발 중이므로 간단한 시뮬레이션만 구현
   */
  const handleKakaoLogin = async () => {
    setIsLoading(true)

    try {
      // 실제 카카오 로그인 구현 시 이 부분을 수정
      // 예: await kakaoLogin()

      // 개발 중 로그인 시뮬레이션 (1초 후 홈으로 이동)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 로그인 성공 시 사용자 정보 저장
      // localStorage.setItem('user', JSON.stringify({ id: 'test-user', name: '테스트 사용자' }))

      // 홈으로 이동
      router.push("/")
    } catch (error) {
      console.error("로그인 중 오류 발생:", error)
      alert("로그인에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setIsLoading(false)
    }
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
            <Image src="/kakao-logo.svg" alt="카카오 로고" width={22} height={22} className="object-contain h-auto" />
          </div>
          <span>카카오로 시작하기</span>
        </>
      )}
    </button>
  )
}

