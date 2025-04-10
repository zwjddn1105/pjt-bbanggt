"use client";

import { useEffect, useState } from "react";
import {
  X,
  Loader2,
  AlertCircle,
  ShoppingBag,
  Tag,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useSellerProductsStore } from "../../store/seller-products-store";
import type {
  SellerProductFilter,
  SellerProduct,
} from "../../types/seller-products";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

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

  // 현재 보고 있는 카드 인덱스
  const [currentIndex, setCurrentIndex] = useState(0);
  // 카드 오픈 애니메이션 상태
  const [isRevealed, setIsRevealed] = useState(false);
  // 카드 슬라이드 방향
  const [direction, setDirection] = useState(0);
  // 카드 뷰 모드 (그리드 또는 카드)
  const [viewMode, setViewMode] = useState<"grid" | "card">("grid");
  // 선택된 카드 (카드 뷰에서 보여줄 카드)
  const [, setSelectedCard] = useState<SellerProduct | null>(null);

  // 컴포넌트 마운트 시 상품 목록 로드
  useEffect(() => {
    if (isOpen && vendingMachineId) {
      // 모달이 열릴 때 필터 상태를 "전체"로 초기화
      setFilterStatus("전체");
      // 상품 목록 로드
      loadSellerProducts(vendingMachineId);
      // 상태 초기화
      setIsRevealed(false);
      setCurrentIndex(0);
      setViewMode("grid");
    }
  }, [isOpen, vendingMachineId, loadSellerProducts, setFilterStatus]);

  // 필터링된 상품 목록
  const filteredProducts = getFilteredProducts();

  // 다음 카드로 이동
  const nextCard = () => {
    if (filteredProducts.length === 0) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % filteredProducts.length);
  };

  // 이전 카드로 이동
  const prevCard = () => {
    if (filteredProducts.length === 0) return;
    setDirection(-1);
    setCurrentIndex(
      (prev) => (prev - 1 + filteredProducts.length) % filteredProducts.length
    );
  };

  // 카드 클릭 핸들러
  const handleCardClick = (product: SellerProduct) => {
    setSelectedCard(product);
    setViewMode("card");
    // 선택한 카드의 인덱스 찾기
    const index = filteredProducts.findIndex(
      (p) => p.orderId === product.orderId
    );
    if (index !== -1) {
      setCurrentIndex(index);
    }
    // 카드 공개 애니메이션 시작
    setTimeout(() => {
      setIsRevealed(true);
    }, 500);
  };

  // 그리드 뷰로 돌아가기
  const backToGrid = () => {
    setViewMode("grid");
    setIsRevealed(false);
  };

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
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            판매중
          </span>
        );
      case "FINISHED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            판매완료
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
      // 유효한 날짜인지 확인
      const date = new Date(dateString);

      // 1970년 1월 1일(Epoch time)인 경우 빈 문자열 반환
      if (
        date.getFullYear() === 1970 &&
        date.getMonth() === 0 &&
        date.getDate() === 1
      ) {
        return "";
      }

      // 유효하지 않은 날짜인 경우
      if (isNaN(date.getTime())) {
        return "";
      }

      return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "";
    }
  };

  // 필터 버튼 클릭 핸들러
  const handleFilterChange = (filter: SellerProductFilter) => {
    // 필터 변경 시 API 다시 호출
    if (vendingMachineId) {
      useSellerProductsStore.getState().changeFilter(filter, vendingMachineId);
    }
    // 카드 뷰에서 그리드 뷰로 돌아가기
    setViewMode("grid");
    setIsRevealed(false);
  };

  // 카드 애니메이션 변수
  const cardVariants = {
    hidden: {
      rotateY: 180,
      opacity: 0.8,
      scale: 0.9,
    },
    visible: {
      rotateY: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        type: "spring",
        stiffness: 70,
      },
    },
    exit: {
      opacity: 0,
      x: direction > 0 ? -300 : 300,
      transition: { duration: 0.3 },
    },
  };

  // 빛나는 효과 컴포넌트
  const ShineEffect = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 animate-shine"></div>
    </div>
  );

  // 별 튀는 효과 컴포넌트
  const StarEffect = () => {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
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
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* 헤더 */}
        <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-800">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center">
              <ShoppingBag className="w-5 h-5 text-orange-400 mr-2" />
              {vendingMachineName} 등록한 빵 목록
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            {/* 필터 버튼 */}
            <div className="flex rounded-md shadow-md overflow-hidden">
              <button
                onClick={() => handleFilterChange("전체")}
                className={`px-4 py-2 text-sm font-medium ${
                  filterStatus === "전체"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                } transition-colors`}
              >
                전체
              </button>
              <button
                onClick={() => handleFilterChange("판매중")}
                className={`px-4 py-2 text-sm font-medium ${
                  filterStatus === "판매중"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                } transition-colors`}
              >
                판매중
              </button>
              <button
                onClick={() => handleFilterChange("판매완료")}
                className={`px-4 py-2 text-sm font-medium ${
                  filterStatus === "판매완료"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                } transition-colors`}
              >
                판매완료
              </button>
            </div>

            {/* 뷰 모드 전환 버튼 (카드 뷰일 때만 표시) */}
            {viewMode === "card" && (
              <button
                onClick={backToGrid}
                className="px-4 py-2 text-sm font-medium bg-gray-700 text-gray-200 hover:bg-gray-600 rounded-md transition-colors"
              >
                목록으로
              </button>
            )}

            <button
              onClick={onClose}
              className="text-gray-300 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* 내용 */}
        <div className="p-6 overflow-y-auto flex-1 bg-gradient-to-b from-gray-800 to-gray-900">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-orange-400 animate-spin mb-4" />
              <p className="text-gray-300">상품 목록을 불러오는 중입니다...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-red-400">
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
          ) : (
            <>
              {filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <ShoppingBag className="w-12 h-12 mb-4 text-gray-500" />
                  <p>등록된 상품이 없습니다.</p>
                </div>
              ) : (
                <>
                  {/* 그리드 뷰 */}
                  {viewMode === "grid" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredProducts.map((product) => (
                        <motion.div
                          key={product.orderId}
                          className="relative bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-600 hover:shadow-orange-500/20 hover:border-orange-500/50 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                          whileHover={{ scale: 1.03 }}
                          onClick={() => handleCardClick(product)}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="relative h-48 overflow-hidden">
                            {product.image ? (
                              <div className="relative w-full h-full">
                                <Image
                                  src={product.image || "/placeholder.svg"}
                                  alt={getBreadTypeName(product.breadType)}
                                  fill
                                  className="object-cover transition-transform duration-700 hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center h-full bg-gray-700">
                                <ShoppingBag className="w-16 h-16 text-gray-500" />
                              </div>
                            )}
                            <div className="absolute top-2 right-2">
                              {getStatusBadge(product.productState)}
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                              <h3 className="text-white font-bold text-lg truncate">
                                {product.bakeryName}
                              </h3>
                              <p className="text-gray-300 text-sm truncate">
                                {getBreadTypeName(product.breadType)}
                              </p>
                            </div>
                          </div>
                          <div className="p-4 space-y-3">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center text-gray-300 text-sm">
                                <Tag className="w-4 h-4 mr-1 text-orange-400" />
                                <span>슬롯 {product.slotNumber}번</span>
                              </div>
                              {formatDate(product.paymentDate) && (
                                <div className="flex items-center text-gray-300 text-sm">
                                  <Calendar className="w-4 h-4 mr-1 text-orange-400" />
                                  <span>{formatDate(product.paymentDate)}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <span className="text-sm text-gray-400 line-through mr-2">
                                  {product.price.toLocaleString()}원
                                </span>
                                <span className="font-bold text-orange-400">
                                  {product.salePrice.toLocaleString()}원
                                </span>
                              </div>
                              <div className="text-sm text-gray-300">
                                수량: {product.count}개
                              </div>
                            </div>
                            <div className="text-sm text-gray-400 truncate">
                              {product.address}
                            </div>
                          </div>

                          {/* 빛나는 효과 */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:animate-shine pointer-events-none"></div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* 카드 뷰 */}
                  {viewMode === "card" && filteredProducts.length > 0 && (
                    <div className="relative flex flex-col items-center justify-center min-h-[60vh]">
                      {/* 카드 컨테이너 */}
                      <div className="relative w-full max-w-md aspect-[3/4] perspective-1000">
                        <AnimatePresence initial={false} mode="wait">
                          <motion.div
                            key={currentIndex}
                            className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl overflow-hidden shadow-2xl border-4 border-orange-500/50 preserve-3d backface-hidden"
                            variants={cardVariants}
                            initial="hidden"
                            animate={isRevealed ? "visible" : "hidden"}
                            exit="exit"
                          >
                            {/* 카드 내용 */}
                            <div className="absolute inset-0 flex flex-col">
                              {/* 카드 이미지 */}
                              <div className="relative h-2/3 overflow-hidden">
                                {filteredProducts[currentIndex]?.image ? (
                                  <div className="relative w-full h-full">
                                    <Image
                                      src={
                                        filteredProducts[currentIndex].image ||
                                        "/placeholder.svg"
                                      }
                                      alt={getBreadTypeName(
                                        filteredProducts[currentIndex].breadType
                                      )}
                                      fill
                                      className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-center h-full bg-gray-700">
                                    <ShoppingBag className="w-24 h-24 text-gray-500" />
                                  </div>
                                )}
                                <div className="absolute top-4 right-4">
                                  {getStatusBadge(
                                    filteredProducts[currentIndex].productState
                                  )}
                                </div>
                              </div>

                              {/* 카드 정보 */}
                              <div className="flex-1 p-6 bg-gradient-to-b from-gray-800 to-gray-900">
                                <h3 className="text-2xl font-bold text-white mb-2">
                                  {filteredProducts[currentIndex].bakeryName}
                                </h3>
                                <p className="text-lg text-orange-400 mb-4">
                                  {getBreadTypeName(
                                    filteredProducts[currentIndex].breadType
                                  )}
                                </p>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                  <div className="bg-gray-700/50 p-3 rounded-lg">
                                    <p className="text-gray-400 text-sm">
                                      원가
                                    </p>
                                    <p className="text-gray-300 line-through">
                                      {filteredProducts[
                                        currentIndex
                                      ].price.toLocaleString()}
                                      원
                                    </p>
                                  </div>
                                  <div className="bg-gray-700/50 p-3 rounded-lg">
                                    <p className="text-gray-400 text-sm">
                                      판매가
                                    </p>
                                    <p className="text-orange-400 font-bold">
                                      {filteredProducts[
                                        currentIndex
                                      ].salePrice.toLocaleString()}
                                      원
                                    </p>
                                  </div>
                                  <div className="bg-gray-700/50 p-3 rounded-lg">
                                    <p className="text-gray-400 text-sm">
                                      수량
                                    </p>
                                    <p className="text-gray-300">
                                      {filteredProducts[currentIndex].count}개
                                    </p>
                                  </div>
                                  <div className="bg-gray-700/50 p-3 rounded-lg">
                                    <p className="text-gray-400 text-sm">
                                      슬롯 번호
                                    </p>
                                    <p className="text-gray-300">
                                      {
                                        filteredProducts[currentIndex]
                                          .slotNumber
                                      }
                                      번
                                    </p>
                                  </div>
                                </div>

                                <div className="text-sm text-gray-400">
                                  {filteredProducts[currentIndex].address}
                                </div>
                                {formatDate(
                                  filteredProducts[currentIndex].paymentDate
                                ) && (
                                  <div className="mt-2 text-sm text-gray-400 flex items-center">
                                    <Calendar className="w-4 h-4 mr-1 text-orange-400" />
                                    {formatDate(
                                      filteredProducts[currentIndex].paymentDate
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* 빛나는 효과 */}
                            {isRevealed && <ShineEffect />}

                            {/* 별 튀는 효과 */}
                            {isRevealed && <StarEffect />}
                          </motion.div>
                        </AnimatePresence>

                        {/* 카드 뒷면 (공개 전) */}
                        {!isRevealed && (
                          <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl overflow-hidden shadow-2xl border-4 border-orange-400 flex items-center justify-center">
                            <div className="text-white text-center p-8">
                              <ShoppingBag className="w-24 h-24 mx-auto mb-4 text-white/80" />
                              <p className="text-2xl font-bold">빵 카드</p>
                              <p className="text-lg mt-2">클릭하여 공개하기</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 카드 공개 버튼 (카드가 공개되지 않았을 때만 표시) */}
                      {!isRevealed && (
                        <button
                          className="mt-8 px-6 py-3 bg-orange-500 text-white rounded-full font-bold text-lg hover:bg-orange-600 transition-colors shadow-lg hover:shadow-orange-500/50"
                          onClick={() => setIsRevealed(true)}
                        >
                          카드 공개하기
                        </button>
                      )}

                      {/* 네비게이션 버튼 (카드가 공개되었을 때만 표시) */}
                      {isRevealed && (
                        <div className="flex justify-center mt-8 space-x-4">
                          <button
                            className="p-3 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors shadow-lg"
                            onClick={prevCard}
                            disabled={filteredProducts.length <= 1}
                          >
                            <ChevronLeft className="w-6 h-6" />
                          </button>
                          <div className="px-4 py-2 bg-gray-700 text-white rounded-full">
                            {currentIndex + 1} / {filteredProducts.length}
                          </div>
                          <button
                            className="p-3 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors shadow-lg"
                            onClick={nextCard}
                            disabled={filteredProducts.length <= 1}
                          >
                            <ChevronRight className="w-6 h-6" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
