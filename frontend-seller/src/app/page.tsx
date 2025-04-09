"use client";

import { Button } from "../components/ui/button";
import { useEffect, useState } from "react";
import { useLoading } from "../components/loading-provider";
import { BreadIcon, KakaoIcon, CheckIcon } from "../components/icons";

export default function Home() {
  const { setLoading } = useLoading();
  // 마운트 상태 추가
  const [mounted, setMounted] = useState(false);

  // 기존 상태들
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeFeature, setActiveFeature] = useState(-1);

  // 컴포넌트가 마운트되면 마운트 상태를 true로 설정
  useEffect(() => {
    // 페이지 로딩 시작
    setLoading(true);

    setMounted(true);

    // 페이지 로딩 완료
    setLoading(false);
  }, [setLoading]);

  // 컴포넌트가 마운트되면 애니메이션 시작
  useEffect(() => {
    if (!mounted) return; // 마운트되지 않았으면 실행하지 않음

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
  }, [mounted]); // mounted 상태가 변경될 때만 실행

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
    // 로그인 처리 시작 - 로딩 표시
    setLoading(true);

    const clientId = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;

    if (!clientId || !redirectUri) {
      console.error("카카오 로그인 환경 변수가 설정되지 않았습니다.");
      setLoading(false); // 에러 발생 시 로딩 종료
      return;
    }

    // 카카오 로그인 페이지로 리다이렉트
    // 참고: 실제 리다이렉트가 발생하므로 setLoading(false)는 실행되지 않습니다.
    window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
  };

  // 마운트되지 않았으면 아무것도 렌더링하지 않음
  if (!mounted) {
    return null;
  }

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
