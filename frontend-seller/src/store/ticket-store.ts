import { create } from "zustand";
import { purchaseTickets } from "../api/ticket-api";
import { useMyPageStore } from "./mypage-store";

interface TicketStore {
  isLoading: boolean;
  error: string | null;
  purchaseTickets: (count: number) => Promise<boolean>;
}

export const useTicketStore = create<TicketStore>((set) => ({
  isLoading: false,
  error: null,

  // 티켓 구매
  purchaseTickets: async (count: number) => {
    set({ isLoading: true, error: null });
    try {
      await purchaseTickets(count);

      // 마이페이지 스토어의 사용자 데이터 갱신
      const { fetchUserData } = useMyPageStore.getState();
      await fetchUserData();

      set({ isLoading: false });
      return true;
    } catch (error) {
      // console.error("티켓 구매 중 오류 발생:", error);
      set({
        error: "티켓 구매 중 오류가 발생했습니다.",
        isLoading: false,
      });
      return false;
    }
  },
}));
