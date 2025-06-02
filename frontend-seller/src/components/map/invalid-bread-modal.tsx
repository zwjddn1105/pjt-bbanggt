"use client";
import { X, AlertTriangle } from "lucide-react";

interface InvalidBreadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InvalidBreadModal({
  isOpen,
  onClose,
}: InvalidBreadModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        {/* 헤더 */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-red-50">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
            <h2 className="text-xl font-bold text-gray-800">
              등록 불가능한 빵
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 내용 */}
        <div className="p-6">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              이 빵은 등록할 수 없습니다
            </h3>
            <p className="text-gray-600 mb-4">
              크림, 치즈 등 유제품이 포함된 빵은 온도에 민감하여 상품 품질을
              보장할 수 없습니다. 다른 종류의 빵을 등록해 주세요.
            </p>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-md font-medium bg-red-500 hover:bg-red-600 text-white transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
