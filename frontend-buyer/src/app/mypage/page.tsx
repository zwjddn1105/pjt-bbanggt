import Link from "next/link"
import { ChevronRight } from "lucide-react"

export default function MyPage() {
  return (
    <main className="pb-20">
      {/* 프로필 섹션 */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-14 h-14 rounded-md overflow-hidden mr-3 bg-gray-200">
            {/* 프로필 이미지 - 실제 구현 시 사용자 이미지로 교체 */}
            <div className="w-full h-full bg-orange-100"></div>
          </div>
          <h1 className="text-lg font-medium">
            빵탄소년단님,
            <br />
            반갑습니다!
          </h1>
        </div>
        <button className="px-4 py-1.5 border border-primary-custom text-primary-custom rounded-full text-sm">
          설정
        </button>
      </div>

      {/* 구분선 */}
      <div className="h-2 bg-orange-50 border-y border-orange-100"></div>

      {/* 결제 섹션 */}
      <div>
        <div className="px-4 py-3 text-gray-500 font-medium text-sm">결제</div>
        <div>
          <Link
            href="/mypage/payment-history"
            className="flex items-center justify-between px-4 py-3 border-b border-gray-100"
          >
            <span>결제내역</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
          <Link
            href="/mypage/undefined1"
            className="flex items-center justify-between px-4 py-3 border-b border-gray-100"
          >
            <span>미정</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
          <Link
            href="/mypage/undefined2"
            className="flex items-center justify-between px-4 py-3 border-b border-gray-100"
          >
            <span>미정</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
        </div>
      </div>

      {/* 구분선 */}
      <div className="h-2 bg-orange-50 border-y border-orange-100"></div>

      {/* 문의 섹션 */}
      <div>
        <div className="px-4 py-3 text-gray-500 font-medium text-sm">문의</div>
        <div>
          <Link
            href="/mypage/inquiry-history"
            className="flex items-center justify-between px-4 py-3 border-b border-gray-100"
          >
            <span>문의 내역</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
          <Link
            href="/mypage/refund-history"
            className="flex items-center justify-between px-4 py-3 border-b border-gray-100"
          >
            <span>환불 내역</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
          <Link
            href="/mypage/undefined3"
            className="flex items-center justify-between px-4 py-3 border-b border-gray-100"
          >
            <span>미정</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
        </div>
      </div>

      {/* 구분선 */}
      <div className="h-2 bg-orange-50 border-y border-orange-100"></div>

      {/* 회원정보 섹션 */}
      <div>
        <div className="px-4 py-3 text-gray-500 font-medium text-sm">회원정보</div>
        <div>
          <Link
            href="/mypage/withdraw"
            className="flex items-center justify-between px-4 py-3 border-b border-gray-100"
          >
            <span>회원탈퇴</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
          <Link
            href="/mypage/edit-profile"
            className="flex items-center justify-between px-4 py-3 border-b border-gray-100"
          >
            <span>회원정보수정</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
          <Link href="/logout" className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span>로그아웃</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
        </div>
      </div>
    </main>
  )
}

