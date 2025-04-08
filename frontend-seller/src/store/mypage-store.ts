import { create } from "zustand";
import type { UserData } from "../types/mypage-types";
import { fetchUserData, updateNoticeSettings } from "../api/mypage-api";

interface MyPageState {
  userData: UserData | null;
  isLoading: boolean;
  error: string | null;
  fetchUserData: () => Promise<void>;
  updateNoticeCheck: () => Promise<void>;
  setUserData: (data: UserData) => void;
}

export const useMyPageStore = create<MyPageState>((set, get) => ({
  userData: null,
  isLoading: false,
  error: null,

  // 사용자 데이터 가져오기
  fetchUserData: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetchUserData();
      set({ userData: data, isLoading: false });
    } catch (error) {
      console.error("사용자 데이터를 가져오는 중 오류 발생:", error);
      set({
        error: "사용자 데이터를 가져오는 중 오류가 발생했습니다.",
        isLoading: false,
      });
    }
  },

  // 알림 설정 변경
  updateNoticeCheck: async () => {
    set({ isLoading: true, error: null });
    try {
      await updateNoticeSettings();
      set((state) => ({
        userData: state.userData
          ? { ...state.userData, noticeCheck: !state.userData.noticeCheck }
          : null,
        isLoading: false,
      }));
    } catch (error) {
      console.error("알림 설정 변경 중 오류 발생:", error);
      set({
        error: "알림 설정을 변경하는 중 오류가 발생했습니다.",
        isLoading: false,
      });
    }
  },

  // 사용자 데이터 직접 설정 (사업자 인증 후 업데이트용)
  setUserData: (data: UserData) => {
    set({ userData: data });
  },
}));

// 초기화 함수
export const initializeMyPageStore = () => {
  // 필요한 초기화 작업이 있다면 여기에 추가
};
