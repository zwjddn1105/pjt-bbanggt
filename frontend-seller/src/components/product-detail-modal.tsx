"use client";

import { useEffect } from "react";
import {
  X,
  Loader2,
  AlertCircle,
  MapPin,
  Calendar,
  Tag,
  ShoppingBag,
} from "lucide-react";
import { useProductDetailStore } from "../store/product-detail-store";
import {
  breadTypeMap,
  productStateMap,
  productStateBadgeColorMap,
} from "../types/product-detail";
import { motion } from "framer-motion"; // 이 줄 추가

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendingMachineId: number | string;
  productId: number | string;
}

export default function ProductDetailModal({
  isOpen,
  onClose,
  vendingMachineId,
  productId,
}: ProductDetailModalProps) {
  const { productDetail, isLoading, error, loadProductDetail, resetModal } =
    useProductDetailStore();

  // 컴포넌트 마운트 시 상품 상세 정보 로드
  useEffect(() => {
    if (isOpen && vendingMachineId && productId) {
      loadProductDetail(vendingMachineId, productId);
    }

    return () => {
      if (!isOpen) {
        resetModal();
      }
    };
  }, [isOpen, vendingMachineId, productId, loadProductDetail, resetModal]);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [isOpen, onClose]);

  // 날짜 포맷팅
  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;

    try {
      const date = new Date(dateString);

      // 유효하지 않은 날짜이거나 1970년 1월 1일(Epoch time)인 경우 null 반환
      if (
        isNaN(date.getTime()) ||
        (date.getFullYear() === 1970 &&
          date.getMonth() === 0 &&
          date.getDate() === 1)
      ) {
        return null;
      }

      return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch (error) {
      return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* 헤더 */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-orange-50">
          <h2 className="text-xl font-bold text-gray-800">상품 상세 정보</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 내용 */}
        <div className="overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
              <p className="text-gray-600">상품 정보를 불러오는 중입니다...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-red-500">
              <AlertCircle className="w-12 h-12 mb-4" />
              <p>{error}</p>
              <button
                onClick={() => loadProductDetail(vendingMachineId, productId)}
                className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
              >
                다시 시도
              </button>
            </div>
          ) : productDetail ? (
            <motion.div
              className="p-0 relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* 상품 이미지 */}
              <div className="relative h-64 md:h-80 w-full bg-gray-100">
                {productDetail.image ? (
                  <div className="relative w-full h-full overflow-hidden">
                    <img
                      src={productDetail.image || "/placeholder.svg"}
                      alt={
                        breadTypeMap[productDetail.breadType] ||
                        productDetail.breadType
                      }
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-200">
                    <ShoppingBag className="w-16 h-16 text-gray-400" />
                  </div>
                )}

                {/* 상태 배지 */}
                <div className="absolute top-4 right-4">
                  <motion.span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      productStateBadgeColorMap[productDetail.productState] ||
                      "bg-gray-100 text-gray-800"
                    }`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {productStateMap[productDetail.productState] ||
                      productDetail.productState}
                  </motion.span>
                </div>
              </div>

              {/* 빛나는 효과 */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 animate-shine pointer-events-none"></div>

              {/* 상품 정보 카드 */}
              <motion.div
                className="p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                  <motion.div
                    className="mb-4 md:mb-0"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h1 className="text-2xl font-bold text-gray-800 mb-1">
                      {productDetail.bakeryName}
                    </h1>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{productDetail.address}</span>
                    </div>
                    {formatDate(productDetail.paymentDate) && (
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span className="text-sm">
                          생성일시: {formatDate(productDetail.paymentDate)}
                        </span>
                      </div>
                    )}
                  </motion.div>

                  <motion.div
                    className="bg-orange-50 rounded-lg p-4 w-full md:w-auto shadow-md"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{
                      scale: 1.03,
                      boxShadow: "0 10px 25px -5px rgba(249, 115, 22, 0.2)",
                    }}
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-600 text-sm">원가:</span>
                        <span className="text-gray-800 font-medium line-through">
                          {productDetail.price.toLocaleString()}원
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-600 text-sm">판매가:</span>
                        <span className="text-orange-600 font-bold text-lg">
                          {productDetail.salePrice.toLocaleString()}원
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 text-sm">수량:</span>
                        <span className="text-gray-800 font-medium">
                          {productDetail.count}개
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  className="border-t border-gray-200 pt-6"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    상품 정보
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.div
                      className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                      whileHover={{ scale: 1.02 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <div className="flex items-center mb-2">
                        <Tag className="w-5 h-5 text-orange-500 mr-2" />
                        <span className="text-gray-700 font-medium">
                          빵 종류
                        </span>
                      </div>
                      <p className="text-gray-600">
                        {breadTypeMap[productDetail.breadType] ||
                          productDetail.breadType}
                      </p>
                    </motion.div>

                    <motion.div
                      className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                      whileHover={{ scale: 1.02 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <div className="flex items-center mb-2">
                        <ShoppingBag className="w-5 h-5 text-orange-500 mr-2" />
                        <span className="text-gray-700 font-medium">
                          슬롯 번호
                        </span>
                      </div>
                      <p className="text-gray-600">
                        {productDetail.slotNumber}번
                      </p>
                    </motion.div>

                    <motion.div
                      className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow md:col-span-2"
                      whileHover={{ scale: 1.02 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <div className="flex items-center mb-2">
                        <MapPin className="w-5 h-5 text-orange-500 mr-2" />
                        <span className="text-gray-700 font-medium">
                          자판기 정보
                        </span>
                      </div>
                      <p className="text-gray-600">
                        {productDetail.vendingMachineName}
                      </p>
                      <p className="text-gray-600 text-sm mt-1">
                        {productDetail.address}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>

                <motion.div
                  className="mt-6 p-4 bg-gray-50 rounded-lg shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  whileHover={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
                >
                  <h3 className="font-medium text-gray-800 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-600">
                    {breadTypeMap[productDetail.breadType] ||
                      productDetail.breadType}{" "}
                    | {productDetail.bakeryName} |{" "}
                    {productStateMap[productDetail.productState] ||
                      productDetail.productState}
                  </p>
                </motion.div>
              </motion.div>

              {/* 별 튀는 효과 */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-yellow-300 rounded-full animate-star"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${1 + Math.random() * 2}s`,
                    }}
                  ></div>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <AlertCircle className="w-12 h-12 mb-4 text-gray-300" />
              <p>상품 정보를 찾을 수 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
