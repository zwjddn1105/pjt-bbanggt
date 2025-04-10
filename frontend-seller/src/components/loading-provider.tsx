"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { BreadIcon } from "../components/icons";

// 로딩 컨텍스트 생성
type LoadingContextType = {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
};

// 기본값 제공
const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  setLoading: () => {},
});

// 로딩 프로바이더 컴포넌트
export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 클라이언트 사이드에서만 마운트 상태 설정
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // 라우트 변경 감지
  useEffect(() => {
    // 페이지 로드 완료 시 로딩 상태 해제
    setIsLoading(false);

    return () => {
      // 클린업 함수
    };
  }, [pathname, searchParams]);

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading: setIsLoading }}>
      {children}

      {/* 로딩 UI - 클라이언트 사이드에서만 렌더링 */}
      {isMounted && isLoading && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/90 z-50">
          <div className="relative mb-8">
            {/* 빵 아이콘 애니메이션 */}
            <div className="relative">
              <div className="w-16 h-16 text-orange-400 animate-bounce">
                <BreadIcon />
              </div>

              {/* 작은 빵 아이콘들 주변에 떠다니는 효과 */}
              <div className="absolute -top-4 -left-4 w-6 h-6 text-orange-300 animate-ping opacity-75 delay-300">
                <BreadIcon />
              </div>
              <div className="absolute top-0 -right-4 w-4 h-4 text-orange-300 animate-pulse opacity-75 delay-700">
                <BreadIcon />
              </div>
            </div>

            {/* 로딩 원형 애니메이션 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 border-4 border-orange-200 rounded-full"></div>
              <div className="absolute w-24 h-24 border-t-4 border-orange-500 rounded-full animate-spin"></div>
            </div>
          </div>

          {/* 로딩 텍스트 */}
          <p className="text-orange-500 animate-pulse">Loading...</p>
        </div>
      )}
    </LoadingContext.Provider>
  );
}

// 로딩 훅 - 안전하게 사용할 수 있도록 수정
export function useLoading() {
  const context = useContext(LoadingContext);
  return context;
}
