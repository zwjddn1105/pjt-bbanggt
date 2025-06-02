"use client";

import { useState } from "react";
import { cn } from "../../lib/utils";
import { SlotStatus } from "../../types/map";

interface VendingMachineDoorProps {
  slotNumber: number;
  status: SlotStatus;
  hasBread: boolean;
  onClick: () => void;
}

export default function VendingMachineDoor({
  slotNumber,
  status,
  hasBread,
  onClick,
}: VendingMachineDoorProps) {
  const [isHovered, setIsHovered] = useState(false);

  // 상태에 따른 문 색상 가져오기
  const getDoorColor = () => {
    switch (status) {
      case SlotStatus.AVAILABLE:
        return "bg-white border-gray-300";
      case SlotStatus.SELECTED:
        return "bg-gradient-to-r from-green-400 to-green-500 border-green-600";
      case SlotStatus.MINE:
        return "bg-gradient-to-r from-yellow-300 to-yellow-400 border-yellow-500";
      case SlotStatus.OCCUPIED:
        return "bg-gradient-to-r from-gray-300 to-gray-400 border-gray-500";
      default:
        return "bg-white border-gray-300";
    }
  };

  // 상태에 따른 텍스트 색상 가져오기
  const getTextColor = () => {
    switch (status) {
      case SlotStatus.SELECTED:
        return "text-white";
      case SlotStatus.OCCUPIED:
        return "text-gray-100";
      default:
        return "text-gray-800";
    }
  };

  // 상태와 빵 유무에 따른 커서 스타일 가져오기
  const getCursorStyle = () => {
    if (status === SlotStatus.MINE && !hasBread) {
      return "cursor-pointer";
    }
    if (status === SlotStatus.OCCUPIED) {
      return "cursor-not-allowed";
    }
    if (status === SlotStatus.AVAILABLE || status === SlotStatus.SELECTED) {
      return "cursor-pointer";
    }
    return "cursor-not-allowed";
  };

  return (
    <div
      className={cn(
        "relative aspect-square rounded-sm shadow-md transition-all duration-200",
        getDoorColor(),
        getCursorStyle(),
        status === SlotStatus.SELECTED ? "ring-2 ring-green-600" : "",
        isHovered && status !== SlotStatus.OCCUPIED
          ? "shadow-lg transform scale-[1.02]"
          : ""
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 문 프레임 */}
      <div className="absolute inset-0.5 border border-black/10 rounded-sm bg-transparent"></div>

      {/* 문 창문 */}
      <div className="absolute left-1/2 top-1/3 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/4 bg-black/20 rounded-sm border border-black/30"></div>

      {/* 문 손잡이 */}
      <div className="absolute right-2 top-1/2 transform translate-y-[-50%] w-1.5 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-sm"></div>

      {/* 슬롯 번호 */}
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center font-medium",
          getTextColor()
        )}
      >
        {slotNumber}
      </div>

      {/* 빵 표시기 */}
      {status === SlotStatus.MINE && hasBread && (
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full"></div>
      )}
    </div>
  );
}
