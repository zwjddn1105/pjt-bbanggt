"use client";

import type React from "react";

import { useState } from "react";
import { X, Store, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { verifyBusiness } from "../api/business-api";
import { useMyPageStore } from "../store/mypage-store";
import type { BusinessVerificationData } from "../types/mypage-types";

interface BusinessVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BusinessVerificationModal({
  isOpen,
  onClose,
}: BusinessVerificationModalProps) {
  const { fetchUserData } = useMyPageStore();
  const [formData, setFormData] = useState<BusinessVerificationData>({
    name: "",
    businessNumber: "",
    address: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await verifyBusiness(formData);
      setIsSuccess(true);
      // 사용자 데이터 다시 불러오기
      await fetchUserData();
      // 3초 후 모달 닫기
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      // console.error("사업자 인증 중 오류 발생:", error);
      setError("사업자 인증 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md max-h-[90vh] flex flex-col shadow-xl transition-colors duration-200 overflow-hidden">
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Store className="w-5 h-5 text-orange-500" />
            사업자 인증
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 모달 내용 */}
        <div className="p-6 overflow-y-auto">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                인증 요청 완료
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                사업자 인증 요청이 성공적으로 처리되었습니다.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                잠시 후 자동으로 창이 닫힙니다.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    가게명
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="가게명을 입력하세요"
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label
                    htmlFor="businessNumber"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    사업자 등록번호
                  </label>
                  <Input
                    id="businessNumber"
                    name="businessNumber"
                    value={formData.businessNumber}
                    onChange={handleChange}
                    placeholder="000-00-00000 형식으로 입력하세요"
                    required
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    하이픈(-)을 포함하여 입력해주세요.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    주소
                  </label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="가게 주소를 입력하세요"
                    required
                    className="w-full"
                  />
                </div>

                {error && (
                  <div className="text-red-500 text-sm p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-900/50">
                    {error}
                  </div>
                )}

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "처리 중..." : "인증 요청하기"}
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>
      </Card>
    </div>
  );
}
