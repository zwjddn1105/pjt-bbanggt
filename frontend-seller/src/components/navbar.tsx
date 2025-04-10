import dynamic from "next/dynamic";
import { Suspense } from "react";

// 로딩 스켈레톤 컴포넌트
function NavbarSkeleton() {
  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative">
        <div className="flex justify-between items-center h-20 relative">
          {/* 스켈레톤 UI */}
          <div className="flex-1 flex justify-start items-center">
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex-1 flex justify-center items-center">
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center mx-4 relative">
            <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
          <div className="flex-1 flex justify-center items-center">
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex-1 flex justify-end items-center">
            <div className="h-10 w-24 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </header>
  );
}

// 클라이언트 컴포넌트를 동적으로 가져옵니다
const ClientNavbar = dynamic(() => import("./client-navbar"), {
  loading: () => <NavbarSkeleton />,
  ssr: false,
});

export default function Navbar() {
  return (
    <Suspense fallback={<NavbarSkeleton />}>
      <ClientNavbar />
    </Suspense>
  );
}
