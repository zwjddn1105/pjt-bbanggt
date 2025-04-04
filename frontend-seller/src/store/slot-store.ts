import { create } from "zustand";
import type { VendingMachineDetailResponse, SlotUI } from "../types/map";
import { SlotStatus } from "../types/map";
import { fetchVendingMachineDetail } from "../api/vending-machine";

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
        return;
      }

      // 슬롯 UI 상태 초기화 - 필드 이름 변경 반영
      const slotsUI: SlotUI[] = detail.sellerResponseList.map((slot) => {
        let status: SlotStatus;

        if (!slot.stackSummaryResponse) {
          status = SlotStatus.AVAILABLE;
        } else if (slot.stackSummaryResponse.mine) {
          // isMine에서 mine으로 변경
          status = SlotStatus.MINE;
        } else {
          status = SlotStatus.OCCUPIED;
        }

        return {
          slotNumber: slot.slotNumber,
          status: status,
          orderId: slot.stackSummaryResponse?.orderId,
        };
      });

      setSlots(slotsUI);
    } catch (error) {
      console.error("벤딩머신 상세 정보 로드 실패:", error);
      setError(
        error instanceof Error ? error.message : "벤딩머신 상세 정보 로드 실패"
      );
      setSlots([]);
    } finally {
      setIsLoading(false);
    }
  },

  // 슬롯 선택 처리
  selectSlot: (slotNumber) => {
    const { slots, setSlots, setSelectedSlotNumber } = get();

    // 이미 선택된 슬롯이 있으면 선택 해제
    const updatedSlots = slots.map((slot) => {
      if (slot.status === SlotStatus.SELECTED) {
        return { ...slot, status: SlotStatus.AVAILABLE };
      }
      return slot;
    });

    // 선택한 슬롯 찾기
    const selectedSlot = updatedSlots.find(
      (slot) => slot.slotNumber === slotNumber
    );

    // 선택한 슬롯이 이용 가능한 상태인 경우에만 선택 처리
    if (selectedSlot && selectedSlot.status === SlotStatus.AVAILABLE) {
      selectedSlot.status = SlotStatus.SELECTED;
      setSelectedSlotNumber(slotNumber);
    } else {
      setSelectedSlotNumber(null);
    }

    setSlots(updatedSlots);
  },

  // 슬롯 초기화
  resetSlots: () => {
    set({ slots: [], selectedSlotNumber: null });
  },

  // 모달 초기화
  resetModal: () => {
    set({
      isModalOpen: false,
      selectedVendingMachineId: null,
      vendingMachineDetail: null,
      slots: [],
      selectedSlotNumber: null,
      error: null,
    });
  },
}));
