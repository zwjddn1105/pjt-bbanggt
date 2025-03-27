import Image from "next/image"
import LoginButton from "@/components/login/login-button"
import styles from "./login.module.css"

export default function LoginPage() {
  return (
    <div className={styles.container}>
      {/* 움직이는 배경 */}
      <div className={styles.movingBackground}></div>

      {/* 콘텐츠 */}
      <div className={styles.content}>
        {/* 로고 및 앱 이름 */}
        <div className="mb-8 text-center">
          <div className="w-24 h-24 mx-auto mb-4 relative">
            <Image src="/logo.jpg" alt="빵긋 로고" fill sizes="(max-width: 768px) 40px, 80px" className="rounded-full object-cover" />
          </div>
          <h1 className="text-3xl font-bold text-primary-custom">빵긋</h1>
          <p className="text-gray-700 mt-2">맛있는 빵을 주문하고 픽업하세요</p>
        </div>

        {/* 로그인 버튼 */}
        <div className="w-full max-w-sm">
          <LoginButton />

          {/* 개발 중 쉬운 접근을 위한 임시 링크 */}
          <div className="mt-8 text-center text-sm text-gray-700">
            <p>개발 중에는 로그인 없이도 모든 페이지에 접근할 수 있습니다.</p>
            <a href="/" className="text-primary-custom underline mt-2 inline-block">
              홈으로 바로가기
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

