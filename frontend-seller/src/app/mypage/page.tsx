"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn, logout } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LogOut,
  Ticket,
  AlertCircle,
  Grid,
  Bell,
  User,
  ShoppingBag,
  Settings,
  Star,
} from "lucide-react";
import { useLoading } from "@/components/loading-provider";
import { BreadIcon } from "@/components/icons";

export default function MyPage() {
  const router = useRouter();
  const { setLoading } = useLoading();
  const [businessName, setBusinessName] = useState("빵긋 베이커리");
  const [userName, setUserName] = useState("김싸피");
  const [isEditingBusiness, setIsEditingBusiness] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempBusinessName, setTempBusinessName] = useState(businessName);
  const [tempUserName, setTempUserName] = useState(userName);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    // 로딩 시작
    setLoading(true);

    // 로그인 상태 확인
    if (!isLoggedIn()) {
      // 로그인되지 않은 경우 홈으로 리다이렉트
      router.push("/");
      return;
    }

    // 여기서 사용자 데이터를 가져오는 API 호출을 할 수 있습니다
    // 예: fetchUserData()

    // 데이터 로딩 완료
    setLoading(false);
  }, [router, setLoading]);

  const handleEditBusiness = () => {
    if (isEditingBusiness) {
      setBusinessName(tempBusinessName);
      setIsEditingBusiness(false);
    } else {
      setTempBusinessName(businessName);
      setIsEditingBusiness(true);
    }
  };

  const handleEditName = () => {
    if (isEditingName) {
      setUserName(tempUserName);
      setIsEditingName(false);
    } else {
      setTempUserName(userName);
      setIsEditingName(true);
    }
  };

  // 로그아웃 처리 함수
  const handleLogout = async () => {
    console.log("로그아웃 버튼 클릭");
    setLoading(true); // 로그아웃 처리 중 로딩 표시
    await logout();
    router.push("/"); // 로그아웃 후 홈페이지로 이동
  };

  return (
    <div className="min-h-screen bg-orange-50/50">
      {/* 상단 프로필 섹션 - 참고 이미지와 유사하게 수정 */}
      <div className="relative bg-orange-500 h-48 overflow-hidden">
        {/* 장식용 빵 아이콘들 */}
        <div className="absolute top-10 left-10 text-white/10 w-20 h-20 transform rotate-12">
          <BreadIcon />
        </div>
        <div className="absolute bottom-10 right-10 text-white/10 w-16 h-16 transform -rotate-12">
          <BreadIcon />
        </div>

        <div className="container max-w-6xl mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-3xl font-bold">{userName}</h1>
            <p className="text-white/80">{businessName}</p>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="container max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 왼쪽 사이드바 - 참고 이미지와 유사하게 수정 */}
          <div className="lg:col-span-1">
            <Card className="shadow-sm border border-gray-200 overflow-hidden">
              <CardContent className="p-0">
                <nav className="flex flex-col">
                  <button
                    onClick={() => setActiveTab("products")}
                    className={`flex items-center gap-3 p-4 hover:bg-orange-50 transition-colors ${
                      activeTab === "products"
                        ? "text-orange-500 bg-orange-50"
                        : "text-gray-700"
                    }`}
                  >
                    <ShoppingBag className="w-5 h-5 min-w-5" />
                    <span className="font-medium whitespace-nowrap">
                      상품 관리
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab("tickets")}
                    className={`flex items-center gap-3 p-4 hover:bg-orange-50 transition-colors ${
                      activeTab === "tickets"
                        ? "text-orange-500 bg-orange-50"
                        : "text-gray-700"
                    }`}
                  >
                    <Ticket className="w-5 h-5 min-w-5" />
                    <span className="font-medium whitespace-nowrap">
                      티켓 관리
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab("nft")}
                    className={`flex items-center gap-3 p-4 hover:bg-orange-50 transition-colors ${
                      activeTab === "nft"
                        ? "text-orange-500 bg-orange-50"
                        : "text-gray-700"
                    }`}
                  >
                    <Grid className="w-5 h-5 min-w-5" />
                    <span className="font-medium whitespace-nowrap">
                      NFT 관리
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab("settings")}
                    className={`flex items-center gap-3 p-4 hover:bg-orange-50 transition-colors ${
                      activeTab === "settings"
                        ? "text-orange-500 bg-orange-50"
                        : "text-gray-700"
                    }`}
                  >
                    <Settings className="w-5 h-5 min-w-5" />
                    <span className="font-medium whitespace-nowrap">설정</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 p-4 hover:bg-red-50 text-red-500 transition-colors mt-auto border-t border-gray-100"
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
            <Card className="shadow-sm border border-gray-200 mt-6 overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="w-5 h-5 text-gray-700" />
                  알림 및 공지사항
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="min-w-2 pt-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    </div>
                    <p className="text-sm text-gray-700">
                      빵긋 판매자 서비스가 업데이트 되었습니다. 새로운 기능을
                      확인해보세요!
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="min-w-2 pt-2">
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    </div>
                    <p className="text-sm text-gray-700">
                      사업자 인증을 완료하시면 추가 혜택을 받으실 수 있습니다.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 오른쪽 메인 콘텐츠 - 참고 이미지와 유사하게 수정 */}
          <div className="lg:col-span-3">
            {/* 프로필 정보 카드 */}
            <Card className="shadow-sm border border-gray-200 overflow-hidden mb-6">
              <CardHeader className="pb-2 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                      <User className="w-3 h-3 text-orange-500" />
                    </div>
                    <CardTitle className="text-base">사업자 정보</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-orange-500 hover:text-orange-600 hover:bg-orange-50 px-2 py-1 h-auto"
                  >
                    수정
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {/* 사업자명 */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                  <div className="text-gray-700">사업자명</div>
                  <div className="font-medium">{businessName}</div>
                </div>

                {/* 이름 */}
                <div className="flex items-center justify-between p-4">
                  <div className="text-gray-700">이름</div>
                  <div className="font-medium">{userName}</div>
                </div>
              </CardContent>
            </Card>

            {/* 사업자 인증 필요 알림 */}
            <Card className="shadow-sm border border-red-200 bg-red-50 overflow-hidden mb-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                      <AlertCircle className="text-red-500 w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-red-600">
                        사업자 인증 필요
                      </h3>
                      <p className="text-sm text-red-600">
                        사업자 인증을 완료하면 더 많은 기능을 이용할 수
                        있습니다.
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="bg-red-500 hover:bg-red-600 text-white whitespace-nowrap"
                  >
                    인증하기
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 통계 카드 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* 티켓 카드 */}
              <Card className="shadow-sm border border-gray-200 overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">보유 티켓</p>
                      <div className="flex items-baseline mt-1">
                        <h3 className="text-2xl font-bold">15</h3>
                        <span className="text-sm text-gray-500 ml-1">티켓</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <Ticket className="text-purple-500 w-6 h-6" />
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="bg-purple-500 hover:bg-purple-600 text-white mt-4 w-full"
                  >
                    티켓 구매하기
                  </Button>
                </CardContent>
              </Card>

              {/* NFT 카드 */}
              <Card className="shadow-sm border border-gray-200 overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">보유 NFT</p>
                      <div className="flex items-baseline mt-1">
                        <h3 className="text-2xl font-bold">3</h3>
                        <span className="text-sm text-gray-500 ml-1">개</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Grid className="text-blue-500 w-6 h-6" />
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600 text-white mt-4 w-full"
                  >
                    NFT 관리하기
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* 최근 활동 */}
            <Card className="shadow-sm border border-gray-200 overflow-hidden">
              <CardHeader className="pb-2 border-b border-gray-100">
                <CardTitle className="text-base flex items-center gap-2">
                  <Star className="w-4 h-4 text-green-500" />
                  최근 활동
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                  {[
                    {
                      date: "2023.04.01",
                      text: "새로운 상품 '크림 치즈 베이글' 등록",
                    },
                    { date: "2023.03.28", text: "티켓 5개 구매" },
                    { date: "2023.03.25", text: "고객 문의 2건 답변 완료" },
                  ].map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-sm text-gray-700">
                          {activity.text}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {activity.date}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
