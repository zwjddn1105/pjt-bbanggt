"use client";

import { useState } from "react";
import { cn } from "../../lib/utils";
import { SlotStatus } from "../../types/map";

interface VendingMachineDoor3DProps {
  slotNumber: number;
  status: SlotStatus;
  hasBread: boolean;
  onClick: () => void;
}

export default function VendingMachineDoor3D({
  slotNumber,
  status,
  hasBread,
  onClick,
}: VendingMachineDoor3DProps) {
  const [isHovered, setIsHovered] = useState(false);

  // 상태에 따른 문 색상 가져오기
  const getDoorColor = () => {
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
        "relative aspect-square perspective-500 transition-all duration-200",
        getCursorStyle(),
        isHovered && status !== SlotStatus.OCCUPIED ? "z-10" : ""
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D 문 - 회전 각도 증가 */}
      <div
        className={cn(
          "absolute inset-0 transform-style-3d transition-transform duration-300 shadow-lg",
          isHovered && status !== SlotStatus.OCCUPIED ? "rotate-y-30" : "",
          status === SlotStatus.SELECTED ? "ring-2 ring-green-600" : ""
        )}
      >
        {/* 문 앞면 */}
        <div
          className={cn(
            "absolute inset-0 backface-hidden border-2 border-gray-300 rounded-sm",
            getDoorColor()
          )}
        >
          {/* 문 프레임 */}
          <div className="absolute inset-1 border border-black/10 rounded-sm"></div>

          {/* 문 창문 */}
          <div className="absolute left-1/2 top-1/3 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/4 bg-black/20 rounded-sm border border-black/30"></div>

          {/* 문 손잡이 */}
          <div className="absolute right-2 top-1/2 transform translate-y-[-50%] w-2 h-7">
            {/* 손잡이 베이스 */}
            <div className="absolute inset-0 bg-gray-600 rounded-full"></div>

            {/* 손잡이 하이라이트 */}
            <div className="absolute inset-y-0 left-0 w-1/3 bg-gray-400 rounded-l-full"></div>
          </div>

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

        {/* 문 측면 (옆면) - 두께 증가 */}
        <div className="absolute top-0 right-0 w-4 h-full transform rotate-y-90 translate-x-2 origin-right bg-yellow-300 border-r border-gray-400"></div>

        {/* 문 측면 (윗면) - 두께 증가 */}
        <div className="absolute top-0 left-0 w-full h-4 transform rotate-x-90 -translate-y-2 origin-top bg-yellow-300 border-t border-gray-400"></div>

        {/* 문 측면 (아랫면) - 추가 */}
        <div className="absolute bottom-0 left-0 w-full h-4 transform rotate-x-90 translate-y-2 origin-bottom bg-yellow-300 border-b border-gray-400"></div>

        {/* 문 측면 (왼쪽면) - 추가 */}
        <div className="absolute top-0 left-0 w-4 h-full transform rotate-y-90 -translate-x-2 origin-left bg-yellow-300 border-l border-gray-400"></div>
      </div>
    </div>
  );
}
