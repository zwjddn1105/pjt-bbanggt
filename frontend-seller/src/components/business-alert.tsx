"use client";

import { useEffect } from "react";
import { Store, X } from "lucide-react";

interface BusinessAlertProps {
  onClose: () => void;
}

export function BusinessAlert({ onClose }: BusinessAlertProps) {
  // 3초 후에 자동으로 알림창 닫기
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-20 right-4 z-50 max-w-md animate-in slide-in-from-right">
      <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/50 rounded-lg p-4 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-800/50 flex items-center justify-center">
            <Store className="text-orange-500 dark:text-orange-400 w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-orange-600 dark:text-orange-400">
              사업자 인증이 필요합니다
            </h3>
            <p className="text-sm text-orange-600 dark:text-orange-400">
              이 기능을 사용하려면 먼저 사업자 인증을 완료해주세요.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-orange-500 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
