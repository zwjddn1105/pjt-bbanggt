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

    // 필터링된 상품 목록 가져오기
    getFilteredProducts: () => {
      const { products, filterStatus } = get();

      if (filterStatus === "전체") {
        return products;
      } else if (filterStatus === "판매중") {
        return products.filter(
          (product) => product.productState === "AVAILABLE"
        );
      } else {
        return products.filter(
          (product) => product.productState === "SOLD_OUT"
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
        console.error(
          "판매자 상품 목록을 불러오는 중 오류가 발생했습니다:",
          error
        );
        setError(
          error instanceof Error
            ? error.message
            : "판매자 상품 목록을 불러오는 중 오류가 발생했습니다"
        );
      } finally {
        setIsLoading(false);
      }
    },
  })
);
