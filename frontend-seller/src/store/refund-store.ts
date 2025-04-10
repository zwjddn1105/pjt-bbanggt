import { create } from "zustand";
import type { RefundItem, RefundState } from "../types/refund-types";
import { fetchRefunds, confirmRefund } from "../api/refund-api";

interface RefundStore {
  refunds: RefundItem[];
  isLoading: boolean;
  error: string | null;
  pageToken: string | null;
  hasNext: boolean;
  currentState: RefundState;

  // 액션
  fetchRefunds: (reset?: boolean) => Promise<void>;
  confirmRefund: (refundId: number) => Promise<void>;
  setCurrentState: (state: RefundState) => void;
  resetStore: () => void;
}

export const useRefundStore = create<RefundStore>((set, get) => ({
  refunds: [],
  isLoading: false,
  error: null,
  pageToken: null,
  hasNext: false,
  currentState: "PROCESSING",

  // 환불 목록 조회
  fetchRefunds: async (reset = false) => {
    const { currentState, pageToken, refunds } = get();

    // 이미 로딩 중이면 중복 요청 방지
    if (get().isLoading) return;

    set({ isLoading: true, error: null });

    try {
      const response = await fetchRefunds(
        currentState,
        reset ? undefined : pageToken || undefined
      );

      set({
        refunds: reset ? response.data : [...refunds, ...response.data],
        pageToken: response.pageToken,
        hasNext: response.hasNext,
        isLoading: false,
      });
    } catch (error) {
      // console.error("환불 목록을 가져오는 중 오류 발생:", error);
      set({
        error: "환불 목록을 가져오는 중 오류가 발생했습니다.",
        isLoading: false,
      });
    }
  },

  // 환불 승인
  confirmRefund: async (refundId: number) => {
    set({ isLoading: true, error: null });

    try {
      await confirmRefund(refundId);

      // 승인 후 목록에서 해당 항목 제거
      const updatedRefunds = get().refunds.filter(
        (refund) => refund.refundId !== refundId
      );

      set({
        refunds: updatedRefunds,
        isLoading: false,
      });
    } catch (error) {
      // console.error("환불 승인 중 오류 발생:", error);
      set({
        error: "환불 승인 중 오류가 발생했습니다.",
        isLoading: false,
      });
    }
  },

  // 상태 변경
  setCurrentState: (state: RefundState) => {
    if (state !== get().currentState) {
      set({
        currentState: state,
        refunds: [],
        pageToken: null,
        hasNext: false,
      });

      // 상태 변경 후 데이터 다시 로드
      get().fetchRefunds(true);
    }
  },

  // 스토어 초기화
  resetStore: () => {
    set({
      refunds: [],
      isLoading: false,
      error: null,
      pageToken: null,
      hasNext: false,
      currentState: "PROCESSING",
    });
  },
}));
