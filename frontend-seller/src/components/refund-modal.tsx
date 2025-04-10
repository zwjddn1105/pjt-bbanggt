"use client";

import { useEffect, useRef, useState } from "react";
import { useRefundStore } from "../store/refund-store";
import type { RefundState } from "../types/refund-types";
import { X, RefreshCw, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface RefundModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RefundModal({ isOpen, onClose }: RefundModalProps) {
  const {
    refunds,
    isLoading,
    error,
    hasNext,
    currentState,
    fetchRefunds,
    confirmRefund,
    setCurrentState,
    resetStore,
  } = useRefundStore();

  const [isIntersecting, setIsIntersecting] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  // 모달이 열릴 때 데이터 로드
  useEffect(() => {
    if (isOpen) {
      fetchRefunds(true);
    } else {
      resetStore();
    }
  }, [isOpen, fetchRefunds, resetStore]);

  // 무한 스크롤 구현
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsIntersecting(true);
        } else {
          setIsIntersecting(false);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, []);

  // 교차점이 감지되면 다음 페이지 로드
  useEffect(() => {
    if (isIntersecting && hasNext && !isLoading) {
      fetchRefunds();
    }
  }, [isIntersecting, hasNext, isLoading, fetchRefunds]);

  // 상태 필터 변경 핸들러
  const handleStateChange = (state: RefundState) => {
    setCurrentState(state);
  };

  // 환불 승인 핸들러
  const handleConfirmRefund = async (refundId: number) => {
    await confirmRefund(refundId);
  };

  // 날짜 포맷 함수
  const formatRefundDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // 가격 포맷 함수
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-3xl max-h-[80vh] flex flex-col shadow-xl transition-colors duration-200">
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            환불 관리
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 필터 탭 */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              currentState === "PROCESSING"
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400"
            }`}
            onClick={() => handleStateChange("PROCESSING")}
          >
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" />
              <span>처리 중</span>
            </div>
          </button>
          <button
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              currentState === "COMPLETED"
                ? "text-green-500 border-b-2 border-green-500"
                : "text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400"
            }`}
            onClick={() => handleStateChange("COMPLETED")}
          >
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>완료됨</span>
            </div>
          </button>
          <button
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              currentState === "EXPIRED"
                ? "text-red-500 border-b-2 border-red-500"
                : "text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
            }`}
            onClick={() => handleStateChange("EXPIRED")}
          >
            <div className="flex items-center justify-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>만료됨</span>
            </div>
          </button>
        </div>

        {/* 환불 목록 */}
        <div className="flex-1 overflow-y-auto p-4">
          {error && (
            <div className="text-red-500 p-4 text-center">
              <p>{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => fetchRefunds(true)}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                다시 시도
              </Button>
            </div>
          )}

          {refunds.length === 0 && !isLoading && !error ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>환불 요청이 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {refunds.map((refund) => (
                <Card
                  key={refund.refundId}
                  className="p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        주문 #{refund.orderId}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {refund.vendingMachineName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        고객: {refund.customerName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                        {formatRefundDate(refund.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {formatPrice(refund.refundPrice)}원
                      </p>
                      {currentState === "PROCESSING" && (
                        <Button
                          size="sm"
                          className="mt-2 bg-green-500 hover:bg-green-600 text-white"
                          onClick={() => handleConfirmRefund(refund.refundId)}
                          disabled={isLoading}
                        >
                          환불 승인
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}

              {/* 무한 스크롤 감지 요소 */}
              <div ref={observerTarget} className="h-4" />
            </div>
          )}

          {isLoading && (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
