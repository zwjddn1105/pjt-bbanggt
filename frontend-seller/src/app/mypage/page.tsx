"use client";

import { useEffect } from "react";
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
  User,
  ShoppingBag,
  Moon,
  Sun,
  AlertCircle,
} from "lucide-react";
import { useLoading } from "../../components/loading-provider";
import { BreadIcon } from "../../components/icons";
import {
  useMyPageStore,
  initializeMyPageStore,
} from "../../store/mypage-store";
import { useThemeStore } from "../../store/theme-store"; // 전역 테마 스토어 import
import { logout } from "../../lib/auth";

export default function MyPage() {
  const router = useRouter();
  const { setLoading } = useLoading();
  const { userData, fetchUserData, updateNoticeCheck } = useMyPageStore();
  const { isDarkMode, toggleDarkMode } = useThemeStore(); // 전역 테마 스토어에서 상태와 함수 가져오기

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

  // 로그아웃 처리 함수 - 원래 코드에서 가져온 함수
  const handleLogout = async () => {
    console.log("로그아웃 버튼 클릭");
    setLoading(true); // 로그아웃 처리 중 로딩 표시
    await logout();
    router.push("/"); // 로그아웃 후 홈페이지로 이동
  };

  // 상품 관리 페이지로 이동
  const goToProductsPage = () => {
    router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/products`);
  };

  return (
    <div className="min-h-screen bg-orange-50/50 dark:bg-gray-900 transition-colors duration-200">
      {/* 상단 프로필 섹션 */}
      <div className="relative bg-orange-500 dark:bg-orange-700 h-48 overflow-hidden transition-colors duration-200">
        {/* 장식용 빵 아이콘들 */}
        <div className="absolute top-10 left-10 text-white/10 w-20 h-20 transform rotate-12">
          <BreadIcon />
        </div>
        <div className="absolute bottom-10 right-10 text-white/10 w-16 h-16 transform -rotate-12">
          <BreadIcon />
        </div>

        <div className="container max-w-6xl mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-3xl font-bold">
              {userData?.name || "로딩 중..."}
            </h1>
            <p className="text-white/80">
              {userData?.bakeryName || "로딩 중..."}
            </p>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="container max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 왼쪽 사이드바 */}
          <div className="lg:col-span-1">
            <Card className="shadow-sm border border-gray-200 dark:border-gray-700 dark:bg-gray-800 overflow-hidden transition-colors duration-200">
              <CardContent className="p-0">
                <nav className="flex flex-col">
                  <button
                    onClick={goToProductsPage}
                    className="flex items-center gap-3 p-4 hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200"
                  >
                    <ShoppingBag className="w-5 h-5 min-w-5" />
                    <span className="font-medium whitespace-nowrap">
                      상품 관리
                    </span>
                  </button>

                  <button className="flex items-center gap-3 p-4 hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200">
                    <Grid className="w-5 h-5 min-w-5" />
                    <span className="font-medium whitespace-nowrap">
                      NFT 관리
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
                      사업자 인증을 완료하시면 추가 혜택을 받으실 수 있습니다.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 오른쪽 메인 콘텐츠 */}
          <div className="lg:col-span-3">
            {/* 프로필 정보 카드 */}
            <Card className="shadow-sm border border-gray-200 dark:border-gray-700 dark:bg-gray-800 overflow-hidden mb-6 transition-colors duration-200">
              <CardHeader className="pb-2 border-b border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                      <User className="w-3 h-3 text-orange-500" />
                    </div>
                    <CardTitle className="text-base dark:text-white">
                      사업자 정보
                    </CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-orange-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 px-2 py-1 h-auto"
                  >
                    수정
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {/* 사업자명 */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
                  <div className="text-gray-700 dark:text-gray-300">
                    사업자명
                  </div>
                  <div className="font-medium dark:text-white">
                    {userData?.bakeryName || "로딩 중..."}
                  </div>
                </div>

                {/* 이름 */}
                <div className="flex items-center justify-between p-4">
                  <div className="text-gray-700 dark:text-gray-300">이름</div>
                  <div className="font-medium dark:text-white">
                    {userData?.name || "로딩 중..."}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 사업자 인증 필요 알림 */}
            {!userData?.business && (
              <Card className="shadow-sm border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 overflow-hidden mb-6 transition-colors duration-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                        <AlertCircle className="text-red-500 dark:text-red-400 w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-red-600 dark:text-red-400">
                          사업자 인증 필요
                        </h3>
                        <p className="text-sm text-red-600 dark:text-red-400">
                          사업자 인증을 완료하면 더 많은 기능을 이용할 수
                          있습니다.
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white whitespace-nowrap"
                    >
                      인증하기
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 통계 카드 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                    className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white mt-4 w-full"
                  >
                    NFT 관리하기
                  </Button>
                </CardContent>
              </Card>

              {/* 티켓 카드 */}
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
                      <Bell className="text-purple-500 dark:text-purple-400 w-6 h-6" />
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white mt-4 w-full"
                  >
                    알림 설정
                  </Button>
                </CardContent>
              </Card>
            </div>

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
                  <div className="relative inline-flex items-center">
                    <input
                      type="checkbox"
                      id="noticeCheck"
                      checked={userData?.noticeCheck || false}
                      onChange={() => {
                        if (userData) {
                          updateNoticeCheck(!userData.noticeCheck);
                        }
                      }}
                      className="sr-only"
                    />
                    <div
                      className={`block w-14 h-8 rounded-full ${
                        userData?.noticeCheck
                          ? "bg-orange-500"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    ></div>
                    <div
                      className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
                        userData?.noticeCheck ? "transform translate-x-6" : ""
                      }`}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
