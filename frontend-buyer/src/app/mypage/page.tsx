import { ProfileSection } from "@/components/mypage/profile-section"
import { MenuSection } from "@/components/mypage/menu-section"

export default function MyPage() {
  // 메뉴 섹션 데이터
  const paymentMenuItems = [
    { label: "결제내역", href: "/mypage/payment-history" },
    { label: "미정", href: "/mypage/undefined1" },
    { label: "미정", href: "/mypage/undefined2" },
  ]

  const inquiryMenuItems = [
    { label: "문의 내역", href: "/mypage/inquiry-history" },
    { label: "환불 내역", href: "/mypage/refund-history" },
    { label: "미정", href: "/mypage/undefined3" },
  ]

  const userMenuItems = [
    { label: "회원탈퇴", href: "/mypage/withdraw" },
    { label: "회원정보수정", href: "/mypage/edit-profile" },
    { label: "로그아웃", href: "/logout" },
  ]

  return (
    <main className="pb-20">
      {/* 프로필 섹션 */}
      <ProfileSection username="빵타스닉터" />

      {/* 구분선 */}
      <div className="h-2 bg-orange-50 border-y border-orange-100"></div>

      {/* 결제 섹션 */}
      <MenuSection title="결제" items={paymentMenuItems} />

      {/* 구분선 */}
      <div className="h-2 bg-orange-50 border-y border-orange-100"></div>

      {/* 문의 섹션 */}
      <MenuSection title="문의" items={inquiryMenuItems} />

      {/* 구분선 */}
      <div className="h-2 bg-orange-50 border-y border-orange-100"></div>

      {/* 회원정보 섹션 */}
      <MenuSection title="회원정보" items={userMenuItems} />
    </main>
  )
}

