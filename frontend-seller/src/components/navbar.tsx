"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { isLoggedIn, logout } from "@/lib/auth";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  // 컴포넌트가 마운트될 때 로그인 상태 확인
  useEffect(() => {
    setIsUserLoggedIn(isLoggedIn());
  }, []);

  // 로그인이 필요한 페이지로 이동하려고 할 때 처리
  const handleProtectedNavigation = (path: string) => {
    window.location.href = path;
  };

  // 로그인/마이페이지 버튼 클릭 처리
  const handleAuthButtonClick = () => {
    if (isUserLoggedIn) {
      // 마이페이지로 이동 또는 드롭다운 메뉴 표시 등
      window.location.href = "/mypage";
    } else {
      // 로그인 페이지로 이동
      window.location.href = "/";
    }
  };

  // 로그아웃 처리
  const handleLogout = async () => {
    await logout();
    setIsUserLoggedIn(false);
  };

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative">
        <div className="flex justify-between items-center h-20 relative">
          {/* 균등한 간격의 네비게이션 아이템 */}
          <div className="flex-1 flex justify-start items-center">
            <button
              onClick={() => handleProtectedNavigation("/map")}
              className="text-gray-600 hover:text-orange-500 transition-all duration-200 font-medium text-base relative group py-2"
            >
              <span className="relative">
                빵긋 지도
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-400 group-hover:w-full transition-all duration-300"></span>
              </span>
            </button>
          </div>

          <div className="flex-1 flex justify-center items-center">
            <button
              onClick={() => handleProtectedNavigation("/products")}
              className="text-gray-600 hover:text-orange-500 transition-all duration-200 font-medium text-base relative group py-2"
            >
              <span className="relative">
                상품관리
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-400 group-hover:w-full transition-all duration-300"></span>
              </span>
            </button>
          </div>

          {/* 로고 (중앙) - 버튼에서 이미지로 변경 */}
          <div className="flex-1 flex flex-col items-center justify-center mx-4 relative">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 relative">
                <Image
                  src="/logo.png"
                  alt="빵긋 로고"
                  width={80}
                  height={80}
                  className="object-contain drop-shadow-md hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>

          <div className="flex-1 flex justify-center items-center">
            <button
              onClick={() => handleProtectedNavigation("/inquiries")}
              className="text-gray-600 hover:text-orange-500 transition-all duration-200 font-medium text-base relative group py-2"
            >
              <span className="relative">
                고객 문의 관리
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-400 group-hover:w-full transition-all duration-300"></span>
              </span>
            </button>
          </div>

          <div className="flex-1 flex justify-end items-center">
            <Button
              onClick={handleAuthButtonClick}
              className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white rounded-full px-6 py-2 shadow-md hover:shadow-lg transition-all duration-200"
            >
              {isUserLoggedIn ? "마이페이지" : "로그인"}
            </Button>

            {/* 로그인 상태일 때만 로그아웃 버튼 표시 (선택적) */}
            {isUserLoggedIn && (
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="ml-2 text-gray-600 hover:text-orange-500"
              >
                로그아웃
              </Button>
            )}
          </div>

          {/* 모바일 메뉴 버튼 */}
          <div className="md:hidden flex items-center ml-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">메뉴 열기</span>
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-orange-500" />
              ) : (
                <Menu className="h-6 w-6 text-orange-500" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      <div
        className={cn(
          "md:hidden shadow-lg",
          isMobileMenuOpen ? "block" : "hidden"
        )}
      >
        <div className="px-4 pt-3 pb-4 space-y-2 sm:px-5 bg-white">
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              handleProtectedNavigation("/map");
            }}
            className="block w-full text-left px-3 py-3 rounded-md text-base font-medium text-gray-600 hover:text-orange-500 hover:bg-orange-50 transition-all duration-200"
          >
            빵긋 지도
          </button>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              handleProtectedNavigation("/products");
            }}
            className="block w-full text-left px-3 py-3 rounded-md text-base font-medium text-gray-600 hover:text-orange-500 hover:bg-orange-50 transition-all duration-200"
          >
            상품관리
          </button>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              handleProtectedNavigation("/inquiries");
            }}
            className="block w-full text-left px-3 py-3 rounded-md text-base font-medium text-gray-600 hover:text-orange-500 hover:bg-orange-50 transition-all duration-200"
          >
            고객 문의 관리
          </button>
          <div className="px-3 py-3 mt-2">
            <Button
              className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white rounded-full py-2 shadow-md hover:shadow-lg transition-all duration-200"
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleAuthButtonClick();
              }}
            >
              {isUserLoggedIn ? "마이페이지" : "로그인"}
            </Button>

            {/* 로그인 상태일 때만 로그아웃 버튼 표시 (모바일) */}
            {isUserLoggedIn && (
              <Button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                variant="ghost"
                className="w-full mt-2 text-gray-600 hover:text-orange-500"
              >
                로그아웃
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
