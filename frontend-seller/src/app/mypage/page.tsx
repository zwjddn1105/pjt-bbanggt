"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center mb-8">
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

      <Card className="overflow-hidden border-none shadow-lg mb-8">
        <div className="bg-gradient-to-r from-orange-400 to-orange-500 h-3"></div>
        <CardContent className="p-0">
          {/* 사업자명 */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-4">
                <WalletIcon />
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
                {isEditingBusiness ? "수정" : <EditIcon />}
              </Button>
            </div>
          </div>

          {/* 이름 */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-4">
                <BadgeCheckIcon />
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
                {isEditingName ? "수정" : <EditIcon />}
              </Button>
            </div>
          </div>

          {/* 보유티켓 */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                <TicketIcon className="text-purple-500" />
              </div>
              <span className="text-gray-700 font-medium">보유티켓</span>
            </div>
            <div className="flex items-center">
              <div className="flex items-center mr-4">
                <div className="relative w-8 h-8 mr-2">
                  <TicketIcon className="text-purple-500" />
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
                <AlertCircleIcon className="text-red-500" />
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
                <NFTIcon />
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

// 아이콘 컴포넌트들
function WalletIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-orange-500"
    >
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </svg>
  );
}

function BadgeCheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-orange-500"
    >
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function TicketIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M13 5v2" />
      <path d="M13 17v2" />
      <path d="M13 11v2" />
    </svg>
  );
}

function AlertCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  );
}

function NFTIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-blue-500"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M7 7h.01" />
      <path d="M17 7h.01" />
      <path d="M7 17h.01" />
      <path d="M17 17h.01" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}
