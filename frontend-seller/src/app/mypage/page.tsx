"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/auth";

export default function MyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 로그인 상태 확인
    if (!isLoggedIn()) {
      // 로그인되지 않은 경우 홈으로 리다이렉트
      router.push("/");
      return;
    }

    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">마이페이지</h1>
        <p className="text-gray-600">빵긋 판매자님, 환영합니다!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">내 정보</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">이메일</span>
              <span className="font-medium">user@example.com</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">이름</span>
              <span className="font-medium">판매자</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">가입일</span>
              <span className="font-medium">2023년 5월 15일</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            활동 내역
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">등록한 상품</span>
              <span className="font-medium">12개</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">답변한 문의</span>
              <span className="font-medium">8개</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">최근 로그인</span>
              <span className="font-medium">오늘</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
