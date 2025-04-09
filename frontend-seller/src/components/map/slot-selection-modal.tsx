"use client";

import { useEffect, useState } from "react";
import { X, Loader2, AlertCircle, ShoppingBag } from "lucide-react";
import { useSlotStore } from "../../store/slot-store";
import { useMapStore } from "../../store/map-store";
import { useSellerProductsStore } from "../../store/seller-products-store";
import { SlotStatus } from "../../types/map";
import ProductRegistrationModal from "./product-registration-modal";
import SellerProductsModal from "./seller-products-modal";
import axios from "axios";

export default function SlotSelectionModal() {
  const {
    isModalOpen,
    vendingMachineDetail,
    slots,
    originalSlots,
    selectedSlotNumber,
    isLoading,
    error,
    selectSlot,
    resetModal,
    loadVendingMachineDetail,
    selectedVendingMachineId,
    setSelectedSlotNumber,
    setIsLoading,
  } = useSlotStore();

  const { selectedVendingMachine } = useMapStore();
  const { setIsProductsModalOpen, isProductsModalOpen } =
    useSellerProductsStore();

  // 상품 등록 모달 관련 코드 수정
  // 상품 등록 모달 상태
  const [showProductModal, setShowProductModal] = useState(false);
  // 구매 중 상태
  const [isPurchasing, setIsPurchasing] = useState(false);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isModalOpen) {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [isModalOpen]);

  // 모달 닫기 처리
  const handleClose = () => {
    resetModal();
  };

  // 슬롯 클릭 처리 - 수정된 로직
  const handleSlotClick = (
    slotNumber: number,
    status: SlotStatus,
    hasBread: boolean
  ) => {
    console.log(
      `슬롯 클릭: 번호=${slotNumber}, 상태=${status}, 빵있음=${hasBread}`
    );

    // 내 슬롯인 경우 (노란색)
    if (status === SlotStatus.MINE) {
      // 빵 정보가 있는 경우
      if (hasBread) {
        alert("이미 빵이 등록되어 있는 칸입니다.");
        return;
      }

      // 빵 정보가 없는 경우 상품 등록 모달 열기
      console.log("상품 등록 모달 열기");
      // 선택된 슬롯 번호 설정
      setSelectedSlotNumber(slotNumber);
      // 상품 등록 모달 열기
      setShowProductModal(true);
      return;
    }

    // 타인이 사용 중인 슬롯인 경우 (회색) - 클릭 불가
    if (status === SlotStatus.OCCUPIED) {
      alert("이미 다른 사용자가 구매한 칸입니다.");
      return;
    }

    // 이용 가능한 슬롯만 선택 가능 (흰색)
    if (status === SlotStatus.AVAILABLE || status === SlotStatus.SELECTED) {
      selectSlot(slotNumber);
    }
  };

  // 버튼 텍스트 결정 - "구매하기"로 변경
  const getButtonText = () => {
    if (selectedSlotNumber === null) {
      return "빵긋 선택하기";
    }
    return "선택한 빵긋 구매하기";
  };

  // 슬롯 색상 결정
  const getSlotColor = (status: SlotStatus) => {
    switch (status) {
      case SlotStatus.AVAILABLE:
        return "bg-white";
      case SlotStatus.SELECTED:
        return "bg-green-500";
      case SlotStatus.MINE:
        return "bg-yellow-400";
      case SlotStatus.OCCUPIED:
        return "bg-gray-400";
      default:
        return "bg-white";
    }
  };

  // 슬롯 커서 스타일 결정 - 수정된 로직
  const getSlotCursor = (status: SlotStatus, hasBread: boolean) => {
    // 내 슬롯이면서 빵 정보가 없는 경우에도 클릭 가능
    if (status === SlotStatus.MINE && !hasBread) {
      return "cursor-pointer";
    }

    // 타인이 사용 중인 슬롯은 클릭 불가
    if (status === SlotStatus.OCCUPIED) {
      return "cursor-not-allowed";
    }

    // 이용 가능한 슬롯과 이미 선택된 슬롯만 클릭 가능
    if (status === SlotStatus.AVAILABLE || status === SlotStatus.SELECTED) {
      return "cursor-pointer";
    }

    return "cursor-not-allowed";
  };

  // 자판기 크기 안전하게 가져오기
  const getVendingMachineSize = () => {
    const height = vendingMachineDetail?.height ?? 0;
    const width = vendingMachineDetail?.width ?? 0;
    return { height, width };
  };

  // 총 슬롯 수 계산
  const getTotalSlots = () => {
    const { height, width } = getVendingMachineSize();
    return height * width;
  };

  // 이용 가능한 슬롯 수 계산 - 원본 상태 기준으로 계산
  const getAvailableSlots = () => {
    return originalSlots.filter((slot) => slot.status === SlotStatus.AVAILABLE)
      .length;
  };

  // 내가 이용 중인 슬롯 수 계산 - 원본 상태 기준으로 계산
  const getMySlots = () => {
    return originalSlots.filter((slot) => slot.status === SlotStatus.MINE)
      .length;
  };

  // 쿠키에서 auth_token 가져오는 함수
  const getAuthToken = (): string | null => {
    if (typeof document === "undefined") return null;
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "auth_token") {
        return value;
      }
    }
    return null;
  };

  // 빵긋 구매하기 버튼 클릭 핸들러 - 수정된 로직
  const handleBuySlot = async () => {
    if (selectedSlotNumber === null) return;

    // 선택된 슬롯의 spaceId 찾기
    const selectedSlot = slots.find(
      (slot) => slot.slotNumber === selectedSlotNumber
    );
    if (!selectedSlot) return;

    try {
      setIsPurchasing(true);

      const authToken = getAuthToken();
      if (!authToken) {
        throw new Error("인증 토큰이 없습니다. 로그인이 필요합니다.");
      }

      // 슬롯 구매 API 호출 - axios.post 명시적 사용
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/spaces/${selectedSlot.spaceId}/buy`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      // 구매 성공 시 자판기 정보 다시 로드하여 UI 갱신
      if (selectedVendingMachineId) {
        await loadVendingMachineDetail(selectedVendingMachineId);
      }

      alert("빵긋 칸 구매가 완료되었습니다.");
    } catch (error) {
      console.error("구매 처리 중 오류 발생:", error);
      alert("구매 처리 중 오류가 발생했습니다.");
    } finally {
      setIsPurchasing(false);
    }
  };

  // 상품 등록 모달 닫기 핸들러
  const handleCloseProductModal = async () => {
    setShowProductModal(false);

    // 모달이 닫힐 때 슬롯 정보 다시 로드하여 초기화
    if (selectedVendingMachineId) {
      try {
        // 로딩 상태 설정
        setIsLoading(true);

        // 자판기 상세 정보 다시 로드
        await loadVendingMachineDetail(selectedVendingMachineId);

        // 선택된 슬롯 초기화
        setSelectedSlotNumber(null);
      } catch (error) {
        console.error("자판기 정보 다시 로드 중 오류 발생:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // 등록한 빵 목록 모달 열기 핸들러
  const handleOpenProductsModal = () => {
    setIsProductsModalOpen(true);
  };

  // 등록한 빵 목록 모달 닫기 핸들러
  const handleCloseProductsModal = () => {
    setIsProductsModalOpen(false);
    // 스토어 초기화 추가
    useSellerProductsStore.getState().resetStore();
  };

  if (!isModalOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-[90vw] max-h-[90vh] overflow-hidden flex flex-col">
          {/* 헤더 */}
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">
              {vendingMachineDetail?.vendingMachineName || "빵긋 자판기"}
            </h2>
            <div className="flex items-center space-x-3">
              {/* 등록한 빵 목록 버튼 추가 */}
              <button
                onClick={handleOpenProductsModal}
                className="flex items-center px-4 py-2 bg-orange-100 text-orange-600 rounded-md hover:bg-orange-200 transition-colors"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                등록한 빵 목록
              </button>
              <button
                onClick={handleClose}
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
                <p className="text-gray-600">
                  자판기 정보를 불러오는 중입니다...
                </p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12 text-red-500">
                <AlertCircle className="w-12 h-12 mb-4" />
                <p>{error}</p>
                <button
                  onClick={handleClose}
                  className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                >
                  닫기
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* 자판기 정보 */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-500">총 빵긋</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {getTotalSlots()}
                      <span className="text-sm font-normal text-gray-500 ml-1">
                        칸
                      </span>
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-500">이용 가능한 빵긋</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {getAvailableSlots()}
                      <span className="text-sm font-normal text-gray-500 ml-1">
                        칸
                      </span>
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-500">내가 이용중인 빵긋</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {getMySlots()}
                      <span className="text-sm font-normal text-gray-500 ml-1">
                        칸
                      </span>
                    </p>
                  </div>
                </div>

                {/* 슬롯 그리드 */}
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">
                    빵긋 배치도
                  </h3>
                  <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    {slots.length > 0 ? (
                      <div
                        className="grid gap-3"
                        style={{
                          gridTemplateColumns: `repeat(${
                            getVendingMachineSize().width
                          }, minmax(0, 1fr))`,
                        }}
                      >
                        {slots.map((slot) => (
                          <div
                            key={slot.slotNumber}
                            className={`
                            aspect-square rounded-md shadow-sm border border-gray-200 
                            ${getSlotColor(slot.status)} 
                            ${getSlotCursor(slot.status, slot.hasBread)}
                            transition-all duration-200 hover:shadow-md
                            ${
                              slot.status === SlotStatus.SELECTED
                                ? "ring-2 ring-green-600"
                                : ""
                            }
                            flex items-center justify-center text-sm font-medium
                            ${
                              slot.status === SlotStatus.SELECTED
                                ? "text-white"
                                : slot.status === SlotStatus.OCCUPIED
                                ? "text-white"
                                : "text-gray-700"
                            }
                          `}
                            onClick={() =>
                              handleSlotClick(
                                slot.slotNumber,
                                slot.status,
                                slot.hasBread
                              )
                            }
                          >
                            {slot.slotNumber}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-60 text-gray-500">
                        슬롯 정보를 불러올 수 없습니다.
                      </div>
                    )}
                  </div>
                </div>

                {/* 범례 */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-white border border-gray-200 rounded-md flex items-center justify-center text-xs text-gray-700">
                      1
                    </div>
                    <span className="text-sm text-gray-600">
                      이용 가능 빵긋
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-500 border border-gray-200 rounded-md flex items-center justify-center text-xs text-white">
                      2
                    </div>
                    <span className="text-sm text-gray-600">선택한 빵긋</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-yellow-400 border border-gray-200 rounded-md flex items-center justify-center text-xs text-gray-700">
                      3
                    </div>
                    <span className="text-sm text-gray-600">보유중인 빵긋</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-400 border border-gray-200 rounded-md flex items-center justify-center text-xs text-white">
                      4
                    </div>
                    <span className="text-sm text-gray-600">
                      이용 불가 빵긋
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 하단 버튼 */}
          <div className="p-5 border-t border-gray-200">
            <button
              className={`w-full py-4 rounded-md font-bold shadow-md flex items-center justify-center text-white text-lg
              ${
                selectedSlotNumber !== null
                  ? "bg-orange-500 hover:bg-orange-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={selectedSlotNumber === null || isPurchasing}
              onClick={handleBuySlot}
            >
              {isPurchasing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  구매 중...
                </>
              ) : (
                getButtonText()
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 상품 등록 모달 */}
      {showProductModal && selectedSlotNumber !== null && (
        <ProductRegistrationModal
          isOpen={showProductModal}
          onClose={handleCloseProductModal}
          vendingMachineName={
            vendingMachineDetail?.vendingMachineName ||
            selectedVendingMachine?.name ||
            "빵긋 자판기"
          }
          vendingMachineAddress={selectedVendingMachine?.address || ""}
          slotNumber={selectedSlotNumber}
        />
      )}

      {/* 등록한 빵 목록 모달 */}
      {isProductsModalOpen && (
        <SellerProductsModal
          isOpen={isProductsModalOpen}
          onClose={handleCloseProductsModal}
          vendingMachineId={selectedVendingMachineId}
          vendingMachineName={
            vendingMachineDetail?.vendingMachineName ||
            selectedVendingMachine?.name ||
            "빵긋 자판기"
          }
        />
      )}
    </>
  );
}
