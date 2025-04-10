"use client";

import { X, MapPin, MapPinned, Ruler } from "lucide-react";
import { useSlotStore } from "../../store/slot-store";
import type { VendingMachine } from "../../types/map";

interface VendingMachinePanelProps {
  vendingMachine: VendingMachine | null;
  onClose: () => void;
}

export default function VendingMachinePanel({
  vendingMachine,
  onClose,
}: VendingMachinePanelProps) {
  const {
    setSelectedVendingMachineId,
    setIsModalOpen,
    loadVendingMachineDetail,
  } = useSlotStore();

  if (!vendingMachine) return null;

  // 남은 공간 수 안전하게 가져오기
  const getRemainingSpaceCount = () => {
    return vendingMachine?.remainSpaceCount ?? 0;
  };

  // 상품 등록하기 버튼 클릭 핸들러
  const handleRegisterProduct = async () => {
    if (!vendingMachine || getRemainingSpaceCount() <= 0) return;

    try {
      // console.log(
      //   `상품 등록하기 버튼 클릭: 자판기 ID=${
      //     vendingMachine.id
      //   }, 타입=${typeof vendingMachine.id}`
      // );

      // 자판기 ID 설정
      setSelectedVendingMachineId(vendingMachine.id);

      // 자판기 상세 정보 로드 (문자열로 변환하여 전달)
      await loadVendingMachineDetail(String(vendingMachine.id));

      // 모달 열기
      setIsModalOpen(true);
    } catch (error) {
      // console.error("상품 등록 처리 중 오류 발생:", error);
      alert("상품 등록을 처리하는 중 오류가 발생했습니다.");
    }
  };

  // 남은 공간에 따른 상태 텍스트 및 색상
  const getStatusText = () => {
    const count = getRemainingSpaceCount();

    if (count === 0) {
      return { text: "구매불가", className: "bg-gray-800 text-white" };
    } else if (count <= 5) {
      return { text: "거의찬 상태", className: "bg-red-500 text-white" };
    } else {
      return { text: "사용가능", className: "bg-green-500 text-white" };
    }
  };

  const status = getStatusText();

  return (
    <div className="absolute top-0 left-0 h-full w-80 bg-white shadow-lg z-20 transition-transform transform">
      <div className="h-full flex flex-col">
        {/* 헤더 부분 */}
        <div className="bg-orange-500 p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-orange-600 rounded-full p-1"
          >
            <X size={20} />
          </button>
          <h2 className="text-xl font-bold mb-1">{vendingMachine.name}</h2>
          <p className="text-sm opacity-90 flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            {vendingMachine.address}
          </p>
        </div>

        {/* 내용 부분 */}
        <div className="p-5 flex-1 overflow-auto">
          <div className="bg-orange-50 rounded-lg p-4 mb-5">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center">
                <Ruler className="w-5 h-5 text-orange-500 mr-2" />
                <span className="font-medium text-gray-700">거리</span>
              </div>
              <span className="text-orange-600 font-bold">
                {typeof vendingMachine.distance === "number"
                  ? `${Number(vendingMachine.distance).toFixed(2)}km`
                  : `${vendingMachine.distance || "0"}km`}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <MapPinned className="w-5 h-5 text-orange-500 mr-2" />
                <span className="font-medium text-gray-700">남은 공간</span>
              </div>
              <div className="flex items-center">
                <span className="text-orange-600 font-bold mr-1">
                  {getRemainingSpaceCount()}
                </span>
                <span className="text-gray-500">칸</span>
              </div>
            </div>
          </div>

          {/* 상태 표시 */}
          <div className="flex flex-col items-center mb-6">
            <div className="text-center mb-2">
              <span className="text-sm text-gray-500">자판기 상태</span>
            </div>
            <div className="relative inline-block">
              <div
                className={`text-center py-2 px-4 rounded-full font-bold ${status.className}`}
              >
                {status.text}
              </div>
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="p-4 border-t border-gray-200">
          <button
            className={`w-full py-3 rounded-md font-bold shadow-md flex items-center justify-center
              ${
                getRemainingSpaceCount() > 0
                  ? "bg-orange-500 hover:bg-orange-600 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            onClick={handleRegisterProduct}
            disabled={getRemainingSpaceCount() <= 0}
          >
            {getRemainingSpaceCount() > 0 ? "상품등록하기" : "상품등록불가"}
          </button>
        </div>
      </div>
    </div>
  );
}
