import { create } from "zustand";
import type { VendingMachineDetailResponse } from "../types/map";
import { SlotStatus } from "../types/map";
import { fetchVendingMachineDetail } from "../api/vending-machine";

// SlotUI 인터페이스 업데이트
export interface SlotUI {
  slotNumber: number;
  spaceId: number;
  status: SlotStatus;
  orderId?: number;
  hasBread: boolean; // 빵 정보가 있는지 여부 추가
}

interface SlotState {
  // 모달 표시 상태
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;

  // 선택된 벤딩머신 ID
  selectedVendingMachineId: number | string | null;
  setSelectedVendingMachineId: (id: number | string | null) => void;

  // 벤딩머신 상세 정보
  vendingMachineDetail: VendingMachineDetailResponse | null;
  setVendingMachineDetail: (
    detail: VendingMachineDetailResponse | null
  ) => void;

  // 슬롯 UI 상태
  slots: SlotUI[];
  setSlots: (slots: SlotUI[]) => void;

  // 현재 선택된 슬롯 번호
  selectedSlotNumber: number | null;
  setSelectedSlotNumber: (slotNumber: number | null) => void;

  // 로딩 상태
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;

  // 에러 상태
  error: string | null;
  setError: (error: string | null) => void;

  // 벤딩머신 상세 정보 로드
  loadVendingMachineDetail: (
    vendingMachineId: number | string
  ) => Promise<void>;

  // 슬롯 선택 처리
  selectSlot: (slotNumber: number) => void;

  // 슬롯 초기화
  resetSlots: () => void;

  // 모달 초기화
  resetModal: () => void;

  // 원래 상태 저장 (계산용)
  originalSlots: SlotUI[];
  setOriginalSlots: (slots: SlotUI[]) => void;
}

export const useSlotStore = create<SlotState>((set, get) => ({
  // 초기 상태
  isModalOpen: false,
  setIsModalOpen: (isOpen) => set({ isModalOpen: isOpen }),

  selectedVendingMachineId: null,
  setSelectedVendingMachineId: (id) => set({ selectedVendingMachineId: id }),

  vendingMachineDetail: null,
  setVendingMachineDetail: (detail) => set({ vendingMachineDetail: detail }),

  slots: [],
  setSlots: (slots) => set({ slots: slots }),

  // 원래 상태 저장 (계산용)
  originalSlots: [],
  setOriginalSlots: (slots) => set({ originalSlots: slots }),

  selectedSlotNumber: null,
  setSelectedSlotNumber: (slotNumber) =>
    set({ selectedSlotNumber: slotNumber }),

  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading: isLoading }),

  error: null,
  setError: (error) => set({ error: error }),

  // 벤딩머신 상세 정보 로드
  loadVendingMachineDetail: async (vendingMachineId) => {
    const {
      setIsLoading,
      setError,
      setVendingMachineDetail,
      setSlots,
      resetSlots,
      setOriginalSlots,
    } = get();

    try {
      setIsLoading(true);
      setError(null);
      resetSlots();

      console.log(
        `슬롯 스토어에서 자판기 상세 정보 로드 시작: ID=${vendingMachineId}, 타입=${typeof vendingMachineId}`
      );

      // ID가 유효한지 확인
      if (vendingMachineId === null || vendingMachineId === undefined) {
        throw new Error("유효하지 않은 자판기 ID입니다.");
      }

      // 문자열로 변환하여 전달
      const stringId = String(vendingMachineId);

      const detail = await fetchVendingMachineDetail(stringId);
      console.log("받은 자판기 상세 정보:", detail);

      if (!detail) {
        throw new Error("자판기 상세 정보가 없습니다.");
      }

      setVendingMachineDetail(detail);

      // sellerResponseList가 없는 경우 빈 배열로 처리
      if (
        !detail.sellerResponseList ||
        !Array.isArray(detail.sellerResponseList)
      ) {
        console.warn("슬롯 응답 목록이 없거나 배열이 아닙니다.");
        setSlots([]);
        setOriginalSlots([]);
        return;
      }

      // 데이터 구조 변경에 맞게 슬롯 UI 상태 초기화 로직 수정
      const slotsUI: SlotUI[] = detail.sellerResponseList.map((slot) => {
        let status: SlotStatus;
        let hasBread = false;

        // 수정된 로직: mine 필드가 바깥으로 빠져나옴
        if (slot.mine) {
          status = SlotStatus.MINE;
          // stackSummaryResponse가 null이 아니면 빵 정보가 있음
          hasBread = slot.stackSummaryResponse !== null;
        } else {
          // mine이 false일 때
          if (!slot.stackSummaryResponse) {
            status = SlotStatus.AVAILABLE; // 이용 가능
          } else {
            status = SlotStatus.OCCUPIED; // 타인이 사용 중
          }
        }

        return {
          slotNumber: slot.slotNumber,
          spaceId: slot.spaceId,
          status: status,
          orderId: slot.stackSummaryResponse?.orderId,
          hasBread: hasBread,
        };
      });

      setSlots(slotsUI);
      // 원본 상태 저장 (계산용)
      setOriginalSlots([...slotsUI]);
    } catch (error) {
      console.error("벤딩머신 상세 정보 로드 실패:", error);
      setError(
        error instanceof Error ? error.message : "벤딩머신 상세 정보 로드 실패"
      );
      setSlots([]);
      setOriginalSlots([]);
    } finally {
      setIsLoading(false);
    }
  },

  // 슬롯 선택 처리 함수 수정
  selectSlot: (slotNumber) => {
    const {
      slots,
      originalSlots,
      selectedSlotNumber,
      setSlots,
      setSelectedSlotNumber,
    } = get();

    // 현재 선택된 슬롯과 동일한 슬롯을 클릭한 경우 (선택 해제)
    if (selectedSlotNumber === slotNumber) {
      // 모든 슬롯을 원래 상태로 복원
      const updatedSlots = slots.map((slot) => {
        // 현재 선택된 슬롯만 원래 상태로 복원
        if (slot.slotNumber === slotNumber) {
          const originalStatus =
            originalSlots.find((origSlot) => origSlot.slotNumber === slotNumber)
              ?.status || SlotStatus.AVAILABLE;

          return { ...slot, status: originalStatus };
        }
        return slot;
      });

      setSlots(updatedSlots);
      setSelectedSlotNumber(null);
      return;
    }

    // 새로운 슬롯 선택 시
    const clickedSlotIndex = slots.findIndex(
      (slot) => slot.slotNumber === slotNumber
    );
    if (clickedSlotIndex === -1) return;

    const clickedSlot = slots[clickedSlotIndex];

    // 이용 가능한 슬롯만 선택 가능 (MINE 상태 제외)
    if (clickedSlot.status !== SlotStatus.AVAILABLE) {
      return;
    }

    // 새로운 슬롯 배열 생성
    const newSlots = [...slots];

    // 이전에 선택된 슬롯이 있으면 원래 상태로 복원
    if (selectedSlotNumber !== null) {
      const prevSelectedIndex = newSlots.findIndex(
        (slot) => slot.slotNumber === selectedSlotNumber
      );
      if (prevSelectedIndex !== -1) {
        const originalStatus =
          originalSlots.find(
            (origSlot) => origSlot.slotNumber === selectedSlotNumber
          )?.status || SlotStatus.AVAILABLE;

        newSlots[prevSelectedIndex] = {
          ...newSlots[prevSelectedIndex],
          status: originalStatus,
        };
      }
    }

    // 새로 선택한 슬롯만 SELECTED 상태로 변경
    newSlots[clickedSlotIndex] = {
      ...clickedSlot,
      status: SlotStatus.SELECTED,
    };

    setSlots(newSlots);
    setSelectedSlotNumber(slotNumber);
  },

  // 슬롯 초기화
  resetSlots: () => {
    set({ slots: [], originalSlots: [], selectedSlotNumber: null });
  },

  // 모달 초기화
  resetModal: () => {
    set({
      isModalOpen: false,
      selectedVendingMachineId: null,
      vendingMachineDetail: null,
      slots: [],
      originalSlots: [],
      selectedSlotNumber: null,
      error: null,
    });
  },
}));
