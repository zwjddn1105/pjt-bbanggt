// 필터링 로직을 클라이언트 측에서 처리하되, 필터 변경 시 API를 다시 호출하도록 수정

import { create } from "zustand";
import { fetchSellerProducts } from "../api/seller-products-api";
import type {
  SellerProduct,
  SellerProductFilter,
} from "../types/seller-products";

interface SellerProductsState {
  // 상품 목록 상태
  products: SellerProduct[];
  setProducts: (products: SellerProduct[]) => void;

  // 로딩 상태
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;

  // 에러 상태
  error: string | null;
  setError: (error: string | null) => void;

  // 필터 상태
  filterStatus: SellerProductFilter;
  setFilterStatus: (status: SellerProductFilter) => void;

  // 모달 상태
  isProductsModalOpen: boolean;
  setIsProductsModalOpen: (isOpen: boolean) => void;

  // 데이터 로드 액션
  loadSellerProducts: (vendingMachineId: number | string) => Promise<void>;

  // 필터링된 상품 목록 가져오기
  getFilteredProducts: () => SellerProduct[];

  // 스토어 초기화 (모달 닫을 때 사용)
  resetStore: () => void;

  // 필터 변경 시 상품 목록 다시 로드하는 함수 추가
  changeFilter: (
    filter: SellerProductFilter,
    vendingMachineId: number | string | null
  ) => void;
}

export const useSellerProductsStore = create<SellerProductsState>(
  (set, get) => ({
    // 초기 상태
    products: [],
    setProducts: (products) => set({ products }),

    isLoading: false,
    setIsLoading: (isLoading) => set({ isLoading }),

    error: null,
    setError: (error) => set({ error }),

    filterStatus: "전체",
    setFilterStatus: (status) => set({ filterStatus: status }),

    isProductsModalOpen: false,
    setIsProductsModalOpen: (isOpen) => set({ isProductsModalOpen: isOpen }),

    // 필터링된 상품 목록 가져오기 - 상태 필터링 로직
    getFilteredProducts: () => {
      const { products, filterStatus } = get();

      if (filterStatus === "전체") {
        return products;
      } else if (filterStatus === "판매중") {
        // AVAILABLE과 SOLD_OUT 상태는 "판매중"으로 표시
        return products.filter(
          (product) =>
            product.productState === "AVAILABLE" ||
            product.productState === "SOLD_OUT"
        );
      } else {
        // FINISHED 상태만 "판매완료"로 표시
        return products.filter(
          (product) => product.productState === "FINISHED"
        );
      }
    },

    // 판매자 상품 목록 로드 액션
    loadSellerProducts: async (vendingMachineId) => {
      const { setIsLoading, setError, setProducts } = get();

      try {
        setIsLoading(true);
        setError(null);

        const response = await fetchSellerProducts(vendingMachineId);
        setProducts(response);
      } catch (error) {
        // console.error(
        //   "판매자 상품 목록을 불러오는 중 오류가 발생했습니다:",
        //   error
        // );
        setError(
          error instanceof Error
            ? error.message
            : "판매자 상품 목록을 불러오는 중 오류가 발생했습니다"
        );
        setProducts([]); // 에러 발생 시 빈 배열로 설정
      } finally {
        setIsLoading(false);
      }
    },

    // 스토어 초기화 함수
    resetStore: () => {
      set({
        products: [],
        isLoading: false,
        error: null,
        filterStatus: "전체",
      });
    },

    // 필터 변경 시 상품 목록 다시 로드하는 함수
    changeFilter: (
      filter: SellerProductFilter,
      vendingMachineId: number | string | null
    ) => {
      const { setFilterStatus } = get();

      // 필터 상태 변경
      setFilterStatus(filter);

      // 자판기 ID가 있으면 상품 목록 다시 로드
      if (vendingMachineId) {
        get().loadSellerProducts(vendingMachineId);
      }
    },
  })
);
