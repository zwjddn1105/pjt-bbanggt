"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  LogOut,
  Grid,
  Bell,
  ShoppingBag,
  Moon,
  Sun,
  RefreshCw,
  Store,
  Mail,
  Plus,
  Minus,
} from "lucide-react";
import { useLoading } from "../../components/loading-provider";
import { BreadIcon } from "../../components/icons";
import { TicketIcon } from "../../components/icons/ticket-icon";
import {
  useMyPageStore,
  initializeMyPageStore,
} from "../../store/mypage-store";
import { useThemeStore } from "../../store/theme-store";
import { useTicketStore } from "../../store/ticket-store";
import { logout } from "../../lib/auth";
import { RefundModal } from "../../components/refund-modal";
import { BusinessVerificationModal } from "../../components/business-verification-modal";
import { BusinessAlert } from "../../components/business-alert";
// NFT 모달 import 추가 (파일 상단에 추가)
import NFTModal from "../../components/nft-modal";

export default function MyPage() {
  const router = useRouter();
  const { setLoading } = useLoading();
  const { userData, fetchUserData, updateNoticeCheck } = useMyPageStore();
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const { purchaseTickets, isLoading: isPurchasing } = useTicketStore();

  // 모달 상태
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [isBusinessModalOpen, setIsBusinessModalOpen] = useState(false);
  const [showBusinessAlert, setShowBusinessAlert] = useState(false);
  // NFT 모달 상태 추가 (컴포넌트 내부 상태 부분에 추가)
  const [showNFTModal, setShowNFTModal] = useState(false);

  // 티켓 구매 수량
  const [ticketCount, setTicketCount] = useState(1);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  // 초기 데이터 로드
  useEffect(() => {
    initializeMyPageStore();

    const loadData = async () => {
      setLoading(true);
      try {
        await fetchUserData();
      } catch (error) {
        console.error("데이터 로드 중 오류:", error);
        // 토큰이 없거나 만료된 경우 로그인 페이지로 리다이렉트
        if ((error as Error).message === "인증 토큰이 없습니다.") {
          router.push("/");
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 구매 성공 메시지 타이머
  useEffect(() => {
    if (purchaseSuccess) {
      const timer = setTimeout(() => {
        setPurchaseSuccess(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [purchaseSuccess]);

  // 로그아웃 처리 함수
  const handleLogout = async () => {
    setLoading(true); // 로그아웃 처리 중 로딩 표시
    await logout();
    router.push("/"); // 로그아웃 후 홈페이지로 이동
  };

  // 상품 관리 페이지로 이동 또는 사업자 인증 알림
  const handleProductsClick = () => {
    if (userData?.business) {
      router.push("/products");
    } else {
      setShowBusinessAlert(true);
    }
  };

  // NFT 관리 클릭 또는 사업자 인증 알림
  const handleNFTClick = () => {
    if (userData?.business) {
      // NFT 모달 열기
      setShowNFTModal(true);
    } else {
      setShowBusinessAlert(true);
    }
  };

  // 환불 관리 모달 열기 또는 사업자 인증 알림
  const handleRefundClick = () => {
    if (userData?.business) {
      setIsRefundModalOpen(true);
    } else {
      setShowBusinessAlert(true);
    }
  };

  // 환불 모달 닫기
  const closeRefundModal = () => {
    setIsRefundModalOpen(false);
  };

  // 사업자 인증 모달 열기
  const openBusinessModal = () => {
    setIsBusinessModalOpen(true);
    setShowBusinessAlert(false);
  };

  // 사업자 인증 모달 닫기
  const closeBusinessModal = () => {
    setIsBusinessModalOpen(false);
  };

  // 알림 닫기
  const closeBusinessAlert = () => {
    setShowBusinessAlert(false);
  };

  // 알림 설정 토글 처리
  const handleNoticeToggle = async () => {
    await updateNoticeCheck();
  };

  // 티켓 수량 증가
  const increaseTicketCount = () => {
    setTicketCount((prev) => prev + 1);
  };

  // 티켓 수량 감소
  const decreaseTicketCount = () => {
    setTicketCount((prev) => (prev > 1 ? prev - 1 : 1));
  };

  // 티켓 구매 처리
  const handlePurchaseTickets = async () => {
    const success = await purchaseTickets(ticketCount);
    if (success) {
      setPurchaseSuccess(true);
      setTicketCount(1); // 구매 후 수량 초기화
    }
  };

  return (
    <div className="min-h-screen bg-orange-50/50 dark:bg-gray-900 transition-colors duration-200">
      {/* 상단 프로필 섹션 */}
      <div className="relative bg-gradient-to-r from-orange-500 to-orange-400 dark:from-orange-700 dark:to-orange-600 h-48 overflow-hidden transition-colors duration-200">
        {/* 장식용 빵 아이콘들 */}
        <div className="absolute top-10 left-10 text-white/10 w-20 h-20 transform rotate-12 animate-float">
          <BreadIcon />
        </div>
        <div
          className="absolute bottom-10 right-10 text-white/10 w-16 h-16 transform -rotate-12 animate-float"
          style={{ animationDelay: "1s" }}
        >
          <BreadIcon />
        </div>
        <div
          className="absolute top-40 right-40 text-white/10 w-12 h-12 transform rotate-45 animate-float"
          style={{ animationDelay: "1.5s" }}
        >
          <BreadIcon />
        </div>

        {/* 프로필 정보 - 박스 크기 확대 */}
        <div className="container max-w-6xl mx-auto px-4 h-full flex items-center">
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-lg border border-white/20 shadow-lg w-full max-w-xl">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-white text-3xl font-bold border-2 border-white/30">
                {userData?.name ? userData.name.charAt(0) : "?"}
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">
                  {userData?.name || "로딩 중..."}
                </h1>
                <div className="flex items-center gap-2 text-white/80 mt-2 text-lg">
                  <Mail className="w-5 h-5" />
                  <span>판매자 계정</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 - 주황색 배경과 간격 조정 */}
      <div className="bg-orange-50/50 dark:bg-gray-900 pt-6 pb-10">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* 왼쪽 사이드바 */}
            <div className="lg:col-span-1">
              <Card className="shadow-sm border border-gray-200 dark:border-gray-700 dark:bg-gray-800 overflow-hidden transition-colors duration-200">
                <CardContent className="p-0">
                  <nav className="flex flex-col">
                    <button
                      onClick={handleProductsClick}
                      className="flex items-center gap-3 p-4 hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200"
                    >
                      <ShoppingBag className="w-5 h-5 min-w-5" />
                      <span className="font-medium whitespace-nowrap">
                        상품 관리
                      </span>
                    </button>

                    <button
                      onClick={handleNFTClick}
                      className="flex items-center gap-3 p-4 hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200"
                    >
                      <Grid className="w-5 h-5 min-w-5" />
                      <span className="font-medium whitespace-nowrap">
                        NFT 관리
                      </span>
                    </button>

                    {/* 환불 관리 버튼 */}
                    <button
                      onClick={handleRefundClick}
                      className="flex items-center gap-3 p-4 hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200"
                    >
                      <RefreshCw className="w-5 h-5 min-w-5" />
                      <span className="font-medium whitespace-nowrap">
                        환불 관리
                      </span>
                    </button>

                    <button
                      onClick={toggleDarkMode}
                      className="flex items-center gap-3 p-4 hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200"
                    >
                      {isDarkMode ? (
                        <>
                          <Sun className="w-5 h-5 min-w-5" />
                          <span className="font-medium whitespace-nowrap">
                            라이트모드로 전환
                          </span>
                        </>
                      ) : (
                        <>
                          <Moon className="w-5 h-5 min-w-5" />
                          <span className="font-medium whitespace-nowrap">
                            다크모드로 전환
                          </span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 p-4 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors mt-auto border-t border-gray-100 dark:border-gray-700"
                    >
                      <LogOut className="w-5 h-5 min-w-5" />
                      <span className="font-medium whitespace-nowrap">
                        로그아웃
                      </span>
                    </button>
                  </nav>
                </CardContent>
              </Card>

              {/* 알림 카드 */}
              <Card className="shadow-sm border border-gray-200 dark:border-gray-700 dark:bg-gray-800 mt-6 overflow-hidden transition-colors duration-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2 dark:text-white">
                    <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    알림 및 공지사항
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="min-w-2 pt-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        빵긋 판매자 서비스가 업데이트 되었습니다. 새로운 기능을
                        확인해보세요!
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="min-w-2 pt-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {userData?.noticeCheck
                          ? "마케팅 및 이벤트 알림을 수신합니다."
                          : "마케팅 및 이벤트 알림이 꺼져 있습니다."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 오른쪽 메인 콘텐츠 */}
            <div className="lg:col-span-3 space-y-6">
              {/* 사업자 정보 또는 인증 버튼 */}
              {userData?.business ? (
                // 사업자 인증이 완료된 경우 정보 표시
                <Card className="shadow-sm border border-gray-200 dark:border-gray-700 dark:bg-gray-800 overflow-hidden transition-colors duration-200">
                  <CardHeader className="pb-2 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                        <Store className="w-3 h-3 text-orange-500" />
                      </div>
                      <CardTitle className="text-base dark:text-white">
                        사업자 정보
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    {/* 가게명 */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
                      <div className="text-gray-700 dark:text-gray-300">
                        가게명
                      </div>
                      <div className="font-medium dark:text-white">
                        {userData?.bakeryName || "-"}
                      </div>
                    </div>

                    {/* 이름 */}
                    <div className="flex items-center justify-between p-4">
                      <div className="text-gray-700 dark:text-gray-300">
                        이름
                      </div>
                      <div className="font-medium dark:text-white">
                        {userData?.name || "로딩 중..."}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                // 사업자 인증이 필요한 경우 인증 버튼 표시
                <Card className="shadow-sm border border-orange-200 dark:border-orange-900/50 bg-orange-50 dark:bg-orange-900/20 overflow-hidden transition-colors duration-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center">
                          <Store className="text-orange-500 dark:text-orange-400 w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-medium text-orange-600 dark:text-orange-400">
                            사업자 인증 필요
                          </h3>
                          <p className="text-sm text-orange-600 dark:text-orange-400">
                            사업자 인증을 완료하면 더 많은 기능을 이용할 수
                            있습니다.
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={openBusinessModal}
                        className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white whitespace-nowrap"
                      >
                        인증하기
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 통계 카드 그리드 - 사업자 인증된 경우에만 표시 */}
              {userData?.business && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* NFT 카드 */}
                  <Card className="shadow-sm border border-gray-200 dark:border-gray-700 dark:bg-gray-800 overflow-hidden transition-colors duration-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            보유 NFT
                          </p>
                          <div className="flex items-baseline mt-1">
                            <h3 className="text-2xl font-bold dark:text-white">
                              0
                            </h3>
                            <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                              개
                            </span>
                          </div>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Grid className="text-blue-500 dark:text-blue-400 w-6 h-6" />
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-blue-500 hover:bg-blue-600 text-white mt-4 w-full"
                        onClick={() => setShowNFTModal(true)}
                      >
                        NFT 관리하기
                      </Button>
                    </CardContent>
                  </Card>

                  {/* 티켓 카드 - 아이콘 변경 및 구매 기능 추가 */}
                  <Card className="shadow-sm border border-gray-200 dark:border-gray-700 dark:bg-gray-800 overflow-hidden transition-colors duration-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            보유 티켓
                          </p>
                          <div className="flex items-baseline mt-1">
                            <h3 className="text-2xl font-bold dark:text-white">
                              {userData?.tickets || 0}
                            </h3>
                            <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                              티켓
                            </span>
                          </div>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                          <TicketIcon className="text-purple-500 dark:text-purple-400 w-6 h-6" />
                        </div>
                      </div>

                      {/* 티켓 구매 UI */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            구매 수량:
                          </span>
                          <div className="flex items-center">
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 rounded-full"
                              onClick={decreaseTicketCount}
                              disabled={ticketCount <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="mx-3 font-medium">
                              {ticketCount}
                            </span>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 rounded-full"
                              onClick={increaseTicketCount}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <Button
                          size="sm"
                          className="bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white w-full"
                          onClick={handlePurchaseTickets}
                          disabled={isPurchasing}
                        >
                          {isPurchasing ? "처리 중..." : "티켓 구매하기"}
                        </Button>

                        {/* 구매 성공 메시지 */}
                        {purchaseSuccess && (
                          <div className="mt-2 text-center text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-2 rounded-md">
                            티켓 구매가 완료되었습니다!
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* 알림 설정 카드 */}
              <Card className="shadow-sm border border-gray-200 dark:border-gray-700 dark:bg-gray-800 overflow-hidden transition-colors duration-200">
                <CardHeader className="pb-2 border-b border-gray-100 dark:border-gray-700">
                  <CardTitle className="text-base flex items-center gap-2 dark:text-white">
                    <Bell className="w-4 h-4 text-orange-500" />
                    알림 설정
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium dark:text-white">
                        알림 수신 동의
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        마케팅 및 이벤트 알림을 수신합니다.
                      </p>
                    </div>
                    {/* 토글 스위치 */}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={userData?.noticeCheck || false}
                        onChange={handleNoticeToggle}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-8 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-6 peer-checked:bg-orange-500 after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all"></div>
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* 사업자 인증 알림 */}
      {showBusinessAlert && <BusinessAlert onClose={closeBusinessAlert} />}

      {/* 환불 관리 모달 */}
      <RefundModal isOpen={isRefundModalOpen} onClose={closeRefundModal} />

      {/* 사업자 인증 모달 */}
      <BusinessVerificationModal
        isOpen={isBusinessModalOpen}
        onClose={closeBusinessModal}
      />
      {showNFTModal && (
        <NFTModal
          isOpen={showNFTModal}
          onClose={() => setShowNFTModal(false)}
        />
      )}
    </div>
  );
}
