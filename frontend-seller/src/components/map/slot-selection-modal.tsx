"use client";

import { useEffect } from "react";
import { X, Loader2, AlertCircle } from "lucide-react";
import { useSlotStore } from "../../store/slot-store";
import { SlotStatus } from "../../types/map";

export default function SlotSelectionModal() {
  const {
    isModalOpen,
    vendingMachineDetail,
    slots,
    selectedSlotNumber,
    isLoading,
    error,
    selectSlot,
    resetModal,
  } = useSlotStore();

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

  // 슬롯 클릭 처리
  const handleSlotClick = (slotNumber: number, status: SlotStatus) => {
    // 이용 가능한 슬롯만 선택 가능
    if (status === SlotStatus.AVAILABLE) {
      selectSlot(slotNumber);
    }
  };

  // 버튼 텍스트 결정
  const getButtonText = () => {
    if (selectedSlotNumber === null) {
      return "빵긋 선택하기";
    }
    return "선택한 빵긋 이용하기";
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

  // 슬롯 커서 스타일 결정
  const getSlotCursor = (status: SlotStatus) => {
    return status === SlotStatus.AVAILABLE
      ? "cursor-pointer"
      : "cursor-not-allowed";
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

  // 이용 가능한 슬롯 수 계산
  const getAvailableSlots = () => {
    return slots.filter((slot) => slot.status === SlotStatus.AVAILABLE).length;
  };

  // 내가 이용 중인 슬롯 수 계산
  const getMySlots = () => {
    return slots.filter((slot) => slot.status === SlotStatus.MINE).length;
  };

  // 빵긋 선택하기 버튼 클릭 핸들러
  const handleSelectSlot = () => {
    if (selectedSlotNumber === null) return;

    // 여기서 선택한 슬롯으로 상품 등록 API 호출 등의 로직 추가
    console.log(`슬롯 ${selectedSlotNumber} 선택됨`);

    // 모달 닫기
    resetModal();
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* 헤더 */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">
            {vendingMachineDetail?.vendingMachineName || "빵긋 자판기"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
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
                            ${getSlotCursor(slot.status)}
                            transition-all duration-200 hover:shadow-md
                            ${
                              slot.status === SlotStatus.SELECTED
                                ? "ring-2 ring-green-600"
                                : ""
                            }
                            flex items-center justify-center text-sm font-medium
                          `}
                          onClick={() =>
                            handleSlotClick(slot.slotNumber, slot.status)
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
                  <div className="w-6 h-6 bg-white border border-gray-200 rounded-md"></div>
                  <span className="text-sm text-gray-600">이용 가능 빵긋</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-500 border border-gray-200 rounded-md"></div>
                  <span className="text-sm text-gray-600">선택한 빵긋</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-yellow-400 border border-gray-200 rounded-md"></div>
                  <span className="text-sm text-gray-600">보유중인 빵긋</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-400 border border-gray-200 rounded-md"></div>
                  <span className="text-sm text-gray-600">이용 불가 빵긋</span>
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
            disabled={selectedSlotNumber === null}
            onClick={handleSelectSlot}
          >
            {getButtonText()}
          </button>
        </div>
      </div>
    </div>
  );
}
