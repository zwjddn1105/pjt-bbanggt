import { create } from "zustand";
import { fetchProductDetail } from "../api/product-detail-api";
import type { ProductDetail } from "../types/product-detail";

interface ProductDetailState {
  // 상품 상세 정보
  productDetail: ProductDetail | null;
  setProductDetail: (detail: ProductDetail | null) => void;

  // 모달 상태
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;

  // 로딩 상태
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;

  // 에러 상태
  error: string | null;
  setError: (error: string | null) => void;

  // 상품 상세 정보 로드 액션
  loadProductDetail: (
    vendingMachineId: number | string,
    productId: number | string
  ) => Promise<void>;

  // 모달 초기화
  resetModal: () => void;
}

export const useProductDetailStore = create<ProductDetailState>((set) => ({
  // 초기 상태
  productDetail: null,
  setProductDetail: (detail) => set({ productDetail: detail }),

  isModalOpen: false,
  setIsModalOpen: (isOpen) => set({ isModalOpen: isOpen }),

  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),

  error: null,
  setError: (error) => set({ error }),

  // 상품 상세 정보 로드 액션
  loadProductDetail: async (vendingMachineId, productId) => {
    set({ isLoading: true, error: null });

    try {
      const detail = await fetchProductDetail(vendingMachineId, productId);
      set({ productDetail: detail });
    } catch (error) {
      console.error("상품 상세 정보를 불러오는 중 오류가 발생했습니다:", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : "상품 상세 정보를 불러오는 중 오류가 발생했습니다",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  // 모달 초기화
  resetModal: () => {
    set({
      productDetail: null,
      isModalOpen: false,
      error: null,
    });
  },
}));
