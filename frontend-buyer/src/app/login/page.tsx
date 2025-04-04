"use client"

import Image from "next/image"
import styles from "./login.module.css"

import { useCallback } from "react"

export default function LoginPage() {
  const handleKakaoLogin = useCallback(() => {
    const clientId = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID
    const redirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI

    if (!clientId || !redirectUri) {
      console.error("카카오 로그인 환경 변수가 설정되지 않았습니다.")
      return
    }

    window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`
  }, [])

  return (
    <div className={styles.container}>
      {/* 움직이는 배경 */}
      <div className={styles.movingBackground}></div>

      {/* 콘텐츠 */}
      <div className={styles.content}>
        {/* 로고 및 앱 이름 */}
        <div className="mb-8 text-center">
          <div className="w-24 h-24 mx-auto mb-4 relative">
            <Image
              src="/logo.jpg"
              alt="빵긋 로고"
              fill
              sizes="(max-width: 768px) 40px, 80px"
              className="rounded-full object-cover"
            />
          </div>
          <h1 className="text-3xl font-bold text-primary-custom">빵긋</h1>
          <p className="text-gray-700 mt-2">맛있는 빵을 주문하고 픽업하세요</p>
        </div>

        {/* 카카오 로그인 버튼 */}
        <div 
            onClick={handleKakaoLogin}
            className="w-full h-14 bg-[#FEE500] hover:bg-[#FEE500]/90 text-[#191919] font-medium text-lg rounded-xl flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <KakaoIcon className="w-6 h-6" />
            카카오로 시작하기
        </div>

          <p className="text-center text-sm text-gray-700 mt-6">
            로그인하면 빵긋의 서비스 이용약관과
            <br />
            개인정보 처리방침에 동의하게 됩니다.
          </p>

          {/* 개발 중 임시 링크 */}
          <div className="mt-8 text-center text-sm text-gray-700">
            <p>개발 중에는 로그인 없이도 모든 페이지에 접근할 수 있습니다.</p>
            <a href="/" className="text-primary-custom underline mt-2 inline-block">
              홈으로 바로가기
            </a>
          </div>
        </div>
      </div>

  )
}

// 카카오 아이콘 컴포넌트
function KakaoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 3C6.48 3 2 6.48 2 10.8c0 2.76 1.56 5.04 3.96 6.48l-.96 3.6c-.12.36.24.72.6.6l4.08-1.68c.72.12 1.44.12 2.28.12 5.52 0 10-3.48 10-7.8S17.52 3 12 3z" />
    </svg>
  )
}
