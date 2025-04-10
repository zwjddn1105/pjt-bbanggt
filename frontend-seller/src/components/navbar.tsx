import dynamic from "next/dynamic"

// 클라이언트 컴포넌트를 동적으로 가져옵니다
const ClientNavbar = dynamic(() => import("./client-navbar"), {
  ssr: false, // 서버 사이드 렌더링을 비활성화합니다
  loading: () => (
    <header className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative">
        <div className="flex justify-between items-center h-20 relative">
          {/* 간단한 로딩 스켈레톤 */}
          <div className="flex-1"></div>
          <div className="flex-1"></div>
          <div className="flex-1 flex justify-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full animate-pulse"></div>
          </div>
          <div className="flex-1"></div>
          <div className="flex-1"></div>
        </div>
      </div>
    </header>
  ),
})

export default function Navbar() {
  return <ClientNavbar />
}
