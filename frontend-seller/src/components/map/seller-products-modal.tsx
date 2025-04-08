"use client";

import { useEffect } from "react";
import {
  X,
  Loader2,
  AlertCircle,
  ShoppingBag,
  Tag,
  Calendar,
} from "lucide-react";
import { useSellerProductsStore } from "../../store/seller-products-store";
import Image from "next/image";

interface SellerProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendingMachineId: number | string | null;
  vendingMachineName: string;
}

export default function SellerProductsModal({
  isOpen,
  onClose,
  vendingMachineId,
  vendingMachineName,
}: SellerProductsModalProps) {
  const {
    isLoading,
    error,
    loadSellerProducts,
    filterStatus,
    setFilterStatus,
    getFilteredProducts,
  } = useSellerProductsStore();

  // 컴포넌트 마운트 시 상품 목록 로드
  useEffect(() => {
    if (isOpen && vendingMachineId) {
      loadSellerProducts(vendingMachineId);
    }
  }, [isOpen, vendingMachineId, loadSellerProducts]);

  // 필터링된 상품 목록
  const filteredProducts = getFilteredProducts();

  // 빵 종류에 따른 한글 이름 반환
  const getBreadTypeName = (breadType: string): string => {
    const breadTypeMap: Record<string, string> = {
      SOBORO: "소보로빵",
      SWEET_RED_BEAN: "단팥빵",
      WHITE_BREAD: "식빵",
      BAGUETTE: "바게트",
      CROISSANT: "크루아상",
      PIZZA_BREAD: "피자빵",
      BAGEL: "베이글",
      GARLIC_BREAD: "마늘빵",
      OTHER: "기타",
    };
    return breadTypeMap[breadType] || breadType;
  };

  // 상품 상태에 따른 배지 스타일 반환
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            판매중
          </span>
        );
      case "SOLD_OUT":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            판매완료
          </span>
        );
      case "EXPIRED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            기간만료
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return dateString;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* 헤더 */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-orange-50">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <ShoppingBag className="w-5 h-5 text-orange-500 mr-2" />
              {vendingMachineName} 등록한 빵 목록
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            {/* 필터 버튼 */}
            <div className="flex rounded-md shadow-sm">
              <button
                onClick={() => setFilterStatus("전체")}
                className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                  filterStatus === "전체"
                    ? "bg-orange-500 text-white"
                    : "bg-white text-gray-700 hover:bg-orange-50"
                } border border-gray-300`}
              >
                전체
              </button>
              <button
                onClick={() => setFilterStatus("판매중")}
                className={`px-4 py-2 text-sm font-medium ${
                  filterStatus === "판매중"
                    ? "bg-orange-500 text-white"
                    : "bg-white text-gray-700 hover:bg-orange-50"
                } border-t border-b border-gray-300`}
              >
                판매중
              </button>
              <button
                onClick={() => setFilterStatus("판매완료")}
                className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                  filterStatus === "판매완료"
                    ? "bg-orange-500 text-white"
                    : "bg-white text-gray-700 hover:bg-orange-50"
                } border border-gray-300`}
              >
                판매완료
              </button>
            </div>

            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* 내용 */}
        <div className="p-6 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
              <p className="text-gray-600">상품 목록을 불러오는 중입니다...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-red-500">
              <AlertCircle className="w-12 h-12 mb-4" />
              <p>{error}</p>
              <button
                onClick={() =>
                  vendingMachineId && loadSellerProducts(vendingMachineId)
                }
                className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
              >
                다시 시도
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <ShoppingBag className="w-12 h-12 mb-4 text-gray-300" />
              <p>등록된 상품이 없습니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.orderId}
                  className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48">
                    {product.image ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={getBreadTypeName(product.breadType)}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <Image
                        src="/placeholder.svg?height=200&width=300"
                        alt={getBreadTypeName(product.breadType)}
                        fill
                        className="object-cover"
                      />
                    )}
                    <div className="absolute top-2 right-2">
                      {getStatusBadge(product.productState)}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <h3 className="text-white font-bold text-lg truncate">
                        {product.bakeryName}
                      </h3>
                      <p className="text-white/90 text-sm truncate">
                        {getBreadTypeName(product.breadType)}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-gray-600 text-sm">
                        <Tag className="w-4 h-4 mr-1" />
                        <span>슬롯 {product.slotNumber}번</span>
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{formatDate(product.paymentDate)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 line-through mr-2">
                          {product.price.toLocaleString()}원
                        </span>
                        <span className="font-bold text-orange-600">
                          {product.salePrice.toLocaleString()}원
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        수량: {product.count}개
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 truncate">
                      {product.address}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
