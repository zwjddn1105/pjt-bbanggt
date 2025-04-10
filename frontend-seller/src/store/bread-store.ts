import { create } from "zustand";
import { BreadType, type BreadInfo } from "../types/bread";

interface BreadState {
  // 빵 정보 상태
  breadInfo: BreadInfo;
  setBreadInfo: (info: Partial<BreadInfo>) => void;

  // 이미지 상태
  image: string | null;
  setImage: (image: string | null) => void;

  // 등록 불가능 상태
  isInvalidBread: boolean;
  setIsInvalidBread: (isInvalid: boolean) => void;

  // 빵 목록 상태
  breadList: BreadInfo[];
  addBread: (bread: BreadInfo) => void;
  removeBread: (index: number) => void;
  clearBreadList: () => void;

  // 초기화 함수
  resetBreadInfo: () => void;
}

// 기본 빵 정보
const defaultBreadInfo: BreadInfo = {
  breadType: BreadType.SOBORO,
  originalPrice: "",
  discountRate: "",
  finalPrice: "",
  quantity: 1,
  productName: "",
};

export const useBreadStore = create<BreadState>((set) => ({
  // 빵 정보 상태
  breadInfo: { ...defaultBreadInfo },
  setBreadInfo: (info) =>
    set((state) => ({
      breadInfo: { ...state.breadInfo, ...info },
    })),

  // 이미지 상태
  image: null,
  setImage: (image) => set({ image }),

  // 등록 불가능 상태
  isInvalidBread: false,
  setIsInvalidBread: (isInvalid) => set({ isInvalidBread: isInvalid }),

  // 빵 목록 상태
  breadList: [],
  addBread: (bread) =>
    set((state) => ({
      breadList: [...state.breadList, bread],
    })),
  removeBread: (index) =>
    set((state) => ({
      breadList: state.breadList.filter((_, i) => i !== index),
    })),
  clearBreadList: () => set({ breadList: [] }),

  // 초기화 함수
  resetBreadInfo: () =>
    set({
      breadInfo: { ...defaultBreadInfo },
      image: null,
      isInvalidBread: false,
    }),
}));
