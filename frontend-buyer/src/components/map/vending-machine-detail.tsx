"use client"

import type React from "react"

import { X } from "lucide-react"
import type { VendingMachine } from "@/types/vending-machine"
import { useEffect, useRef, useState } from "react"

interface VendingMachineDetailProps {
  vendingMachine: VendingMachine
  onClose: () => void
  onBreadDetailClick: (slotId: number, breadType: number) => void
}

interface Slot {
  id: number
  hasBread: boolean
  breadType: number
}

export default function VendingMachineDetail({
  vendingMachine,
  onClose,
  onBreadDetailClick,
}: VendingMachineDetailProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)

  // 더미 데이터
  const dummyData = {
    totalSlots: 30,
    remainingBread: 13,
    breadTypes: 2,
    participatingBakeries: 3,
    slots: Array(30)
      .fill(null)
      .map((_, index) => ({
        id: index,
        hasBread: Math.random() > 0.6, // 약 40%의 슬롯에 빵이 있음
        breadType: Math.floor(Math.random() * 3) + 1, // 1, 2, 3 중 하나의 빵 타입
      })),
  }

  // 슬롯 배경색 결정 함수
  const getSlotBackground = (slot: Slot) => {
    // 선택된 슬롯인 경우 다른 스타일 적용
    if (selectedSlot && selectedSlot.id === slot.id) {
      return "bg-blue-200 border-2 border-blue-500"
    }

    if (!slot.hasBread) return "bg-gray-300"

    // 빵 타입에 따라 다른 색상 반환
    switch (slot.breadType) {
      case 1:
        return "bg-yellow-200"
      case 2:
        return "bg-orange-200"
      case 3:
        return "bg-red-200"
      default:
        return "bg-gray-300"
    }
  }

  // 슬롯 내용물 결정 함수
  const getSlotContent = (slot: Slot) => {
    if (!slot.hasBread) return null

    // 빵 타입에 따라 다른 이모지 반환
    switch (slot.breadType) {
      case 1:
        return "🥖"
      case 2:
        return "🥐"
      case 3:
        return "🍞"
      default:
        return null
    }
  }

  // 슬롯 클릭 핸들러
  const handleSlotClick = (slot: Slot) => {
    // 빵이 없는 슬롯은 선택할 수 없음
    if (!slot.hasBread) return

    // 이미 선택된 슬롯을 다시 클릭하면 선택 해제
    if (selectedSlot && selectedSlot.id === slot.id) {
      setSelectedSlot(null)
    } else {
      setSelectedSlot(slot)
    }
  }

  // 빵긋 보기 버튼 클릭 핸들러
  const handleBreadDetailClick = () => {
    if (selectedSlot) {
      onBreadDetailClick(selectedSlot.id, selectedSlot.breadType)
    }
  }

  // 화면 바깥 클릭 시 닫기
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // 모달이 마운트되면 스크롤을 맨 위로 이동
  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.scrollTop = 0
    }
  }, [])

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-t-2xl w-full max-w-md max-h-[85vh] overflow-y-auto pb-20"
        style={{ marginTop: "auto", marginBottom: "72px" }}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{vendingMachine.name}</h2>
            <button onClick={onClose} className="p-1" aria-label="닫기">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="bg-red-100 rounded-xl p-4 mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-700">
                남은 빵긋: {dummyData.remainingBread}/{dummyData.totalSlots}
              </span>
              <button className="bg-orange-200 text-orange-800 text-xs px-2 py-1 rounded-full">
                카카오 지도 찾아보기
              </button>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-700">남은 빵 종류: {dummyData.breadTypes}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">참여 빵집: {dummyData.participatingBakeries}</span>
              <button className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">목록보기</button>
            </div>
          </div>

          {/* 자판기 슬롯 그리드 */}
          <div className="grid grid-cols-5 gap-2 mb-6">
            {dummyData.slots.map((slot) => (
              <div
                key={slot.id}
                className={`${getSlotBackground(slot)} w-full aspect-square rounded-md flex items-center justify-center text-2xl cursor-pointer transition-all duration-200 ${slot.hasBread ? "hover:opacity-80" : "cursor-not-allowed"}`}
                onClick={() => handleSlotClick(slot)}
              >
                {getSlotContent(slot)}
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-4 mb-4">
            <button onClick={onClose} className="flex-1 mr-2 py-3 border border-gray-300 rounded-full text-gray-700">
              취소
            </button>
            <button
              onClick={handleBreadDetailClick}
              className={`flex-1 ml-2 py-3 rounded-full ${selectedSlot ? "bg-orange-500 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
              disabled={!selectedSlot}
            >
              빵긋보기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

