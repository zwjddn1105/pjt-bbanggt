"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn, logout } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  LogOut,
  Wallet,
  BadgeCheck,
  Ticket,
  AlertCircle,
  Grid,
  Edit,
} from "lucide-react";

export default function MyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [businessName, setBusinessName] = useState("빵긋 베이커리");
  const [userName, setUserName] = useState("김씨피");
  const [isEditingBusiness, setIsEditingBusiness] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempBusinessName, setTempBusinessName] = useState(businessName);
  const [tempUserName, setTempUserName] = useState(userName);

  useEffect(() => {
    // 로그인 상태 확인
    if (!isLoggedIn()) {
      // 로그인되지 않은 경우 홈으로 리다이렉트
      router.push("/");
      return;
    }

    setLoading(false);
  }, [router]);

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
    await logout();
    router.push("/"); // 로그아웃 후 홈페이지로 이동
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div className="relative w-16 h-16 mr-4 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl font-bold">
              {userName.charAt(0)}
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">마이페이지</h1>
            <p className="text-gray-600">빵긋 판매자님, 환영합니다!</p>
          </div>
        </div>

        {/* 로그아웃 버튼 추가 */}
        <Button
          onClick={() => {
            console.log("좀나와라");
            window.alert("버튼이 클릭되었습니다!");
          }}
        >
          흠
        </Button>

        <Button
          onClick={handleLogout}
          variant="outline"
          className="border-orange-300 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
        >
          <LogOut className="w-4 h-4 mr-2" />
          로그아웃
        </Button>
      </div>

      <Card className="overflow-hidden border-none shadow-lg mb-8">
        <div className="bg-gradient-to-r from-orange-400 to-orange-500 h-3"></div>
        <CardContent className="p-0">
          {/* 사업자명 */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-4">
                <Wallet className="text-orange-500" />
              </div>
              <span className="text-gray-700 font-medium">사업자명</span>
            </div>
            <div className="flex items-center">
              {isEditingBusiness ? (
                <Input
                  value={tempBusinessName}
                  onChange={(e) => setTempBusinessName(e.target.value)}
                  className="mr-2 w-48 border-orange-200 focus:border-orange-500"
                />
              ) : (
                <span className="mr-4 text-gray-800">{businessName}</span>
              )}
              <Button
                onClick={handleEditBusiness}
                size="sm"
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                {isEditingBusiness ? "수정" : <Edit className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* 이름 */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-4">
                <BadgeCheck className="text-orange-500" />
              </div>
              <span className="text-gray-700 font-medium">이름</span>
            </div>
            <div className="flex items-center">
              {isEditingName ? (
                <Input
                  value={tempUserName}
                  onChange={(e) => setTempUserName(e.target.value)}
                  className="mr-2 w-48 border-orange-200 focus:border-orange-500"
                />
              ) : (
                <span className="mr-4 text-gray-800">{userName}</span>
              )}
              <Button
                onClick={handleEditName}
                size="sm"
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                {isEditingName ? "수정" : <Edit className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* 보유티켓 */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                <Ticket className="text-purple-500" />
              </div>
              <span className="text-gray-700 font-medium">보유티켓</span>
            </div>
            <div className="flex items-center">
              <div className="flex items-center mr-4">
                <div className="relative w-8 h-8 mr-2">
                  <Ticket className="text-purple-500" />
                </div>
                <span className="text-gray-800 font-bold">X 15</span>
              </div>
              <Button
                size="sm"
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                구매하기
              </Button>
            </div>
          </div>

          {/* 사업자 인증 필요 */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-4">
                <AlertCircle className="text-red-500" />
              </div>
              <span className="text-gray-700 font-medium">
                사업자 인증 필요
              </span>
            </div>
            <Button
              size="sm"
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              인증하기
            </Button>
          </div>

          {/* 보유한 NFT */}
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                <Grid className="text-blue-500" />
              </div>
              <span className="text-gray-700 font-medium">보유한 NFT</span>
            </div>
            <Button
              size="sm"
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              NFT로 이동하기
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
        <h3 className="text-lg font-semibold text-orange-800 mb-3">
          알림 및 공지사항
        </h3>
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 mr-2"></div>
            <p className="text-gray-700">
              빵긋 판매자 서비스가 업데이트 되었습니다. 새로운 기능을
              확인해보세요!
            </p>
          </div>
          <div className="flex items-start">
            <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 mr-2"></div>
            <p className="text-gray-700">
              사업자 인증을 완료하시면 추가 혜택을 받으실 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
