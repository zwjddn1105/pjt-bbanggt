"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function Home() {
  // 애니메이션 상태
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeFeature, setActiveFeature] = useState(-1);

  // 컴포넌트가 마운트되면 애니메이션 시작
  useEffect(() => {
    setIsLoaded(true);

    // 특징 아이템 순차적으로 나타나게 하기
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setActiveFeature((prev) => {
          if (prev >= 3) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 200);

      return () => clearInterval(interval);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // 떠다니는 빵 아이콘 위치 - 크기와 투명도 조정
  const floatingIcons = [
    { top: "15%", left: "10%", delay: 0, size: "w-12 h-12" },
    { top: "25%", right: "15%", delay: 1, size: "w-14 h-14" },
    { top: "70%", left: "20%", delay: 2, size: "w-10 h-10" },
    { top: "60%", right: "10%", delay: 1.5, size: "w-16 h-16" },
    { top: "40%", left: "5%", delay: 0.5, size: "w-12 h-12" },
  ];

  // 카카오 로그인 처리 함수
  const handleKakaoLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;

    window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
  };

  return (
    <div className="relative min-h-[calc(100vh-6rem)] flex items-center justify-center overflow-hidden">
      {/* 전체 화면 배경 이미지 - 여백 추가 및 애니메이션 */}
      <div
        className={`absolute inset-x-4 inset-y-4 sm:inset-x-8 sm:inset-y-8 rounded-2xl overflow-hidden z-0 transition-transform duration-[2s] ease-out ${
          isLoaded ? "scale-100" : "scale-110"
        }`}
      >
        <div
          className="h-full w-full bg-cover bg-center transition-transform duration-[15s] ease-in-out transform hover:scale-110"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1608198093002-ad4e005484ec?q=80&w=1932&auto=format&fit=crop')",
            backgroundPosition: "center",
          }}
        ></div>
        {/* 어두운 오버레이 */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* 떠다니는 빵 아이콘들 - 가시성 향상 */}
      {floatingIcons.map((icon, index) => (
        <div
          key={index}
          className={`absolute z-10 text-orange-300 ${icon.size} animate-float drop-shadow-lg`}
          style={{
            top: icon.top,
            left: icon.left,
            right: icon.right,
            animationDelay: `${icon.delay}s`,
            filter: "drop-shadow(0 0 8px rgba(255, 255, 255, 0.7))",
          }}
        >
          <BreadIcon />
        </div>
      ))}

      {/* 로그인 컨테이너 */}
      <div
        className={`relative z-10 w-full max-w-lg px-6 py-10 mx-4 transition-all duration-1000 ease-out ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">
            빵긋빵긋
          </h1>
          <p className="text-xl text-white/90 drop-shadow-md">
            당신의 맛있는 빵을 더 많은 고객에게 소개하세요
          </p>
        </div>

        {/* 카카오 로그인 버튼 */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
          <Button
            onClick={handleKakaoLogin}
            className="w-full h-14 bg-[#FEE500] hover:bg-[#FEE500]/90 text-[#191919] font-medium text-lg rounded-xl flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <KakaoIcon className="w-6 h-6" />
            카카오로 시작하기
          </Button>

          <p className="text-center text-sm text-white/80 mt-6">
            로그인하시면 빵긋 판매자 서비스 이용약관과
            <br />
            개인정보 처리방침에 동의하게 됩니다
          </p>
        </div>

        {/* 하단 특징 리스트 - 순차적으로 나타나는 애니메이션 */}
        <div className="mt-10 grid grid-cols-2 gap-4">
          {[
            "내 주변 빵긋 위치 찾기",
            "간편한 상품 관리",
            "실시간 주문 알림",
            "고객 문의 관리",
          ].map((text, index) => (
            <FeatureItem
              key={index}
              text={text}
              isActive={activeFeature >= index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// 카카오 아이콘 컴포넌트
function KakaoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 3C6.48 3 2 6.48 2 10.8c0 2.76 1.56 5.04 3.96 6.48l-.96 3.6c-.12.36.24.72.6.6l4.08-1.68c.72.12 1.44.12 2.28.12 5.52 0 10-3.48 10-7.8S17.52 3 12 3z" />
    </svg>
  );
}

// 특징 아이템 컴포넌트 - 애니메이션 추가
function FeatureItem({ text, isActive }: { text: string; isActive: boolean }) {
  return (
    <div
      className={`bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3 border border-white/20 transition-all duration-500 ${
        isActive
          ? "opacity-100 transform translate-y-0"
          : "opacity-0 transform translate-y-4"
      }`}
    >
      <div className="text-orange-400">
        <CheckIcon className="w-5 h-5" />
      </div>
      <span className="text-white font-medium">{text}</span>
    </div>
  );
}

// 체크 아이콘 컴포넌트
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}

// 빵 아이콘 컴포넌트
function BreadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12,2C9.01,2 6.17,3.59 5.19,5.77C4.29,5.67 3.44,5.81 2.75,6.17C1.78,6.68 1,7.74 1,9C1,10.54 2.39,12 4,12L5,12C5,12.55 5.45,13 6,13H18C18.55,13 19,12.55 19,12H20C21.61,12 23,10.54 23,9C23,7.74 22.22,6.68 21.25,6.17C20.56,5.81 19.71,5.67 18.81,5.77C17.83,3.59 14.99,2 12,2M12,4C14.21,4 16.17,5.15 16.66,6.71C16.13,6.95 15.66,7.29 15.28,7.71C14.92,8.12 14.66,8.61 14.53,9.16C14.33,9.07 14.09,9 13.83,9H10.17C9.91,9 9.67,9.07 9.47,9.16C9.34,8.61 9.08,8.12 8.72,7.71C8.34,7.29 7.87,6.95 7.34,6.71C7.83,5.15 9.79,4 12,4M6,14C5.45,14 5,14.45 5,15V19C5,20.66 6.34,22 8,22H16C17.66,22 19,20.66 19,19V15C19,14.45 18.55,14 18,14H6Z" />
    </svg>
  );
}
