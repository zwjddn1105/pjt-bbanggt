import { create } from "zustand";
import { fetchMyStocks } from "../api/product-api";
import type { Product, ProductFilter } from "../types/products";

interface ProductState {
  // 상품 목록 상태
  products: Product[];
  setProducts: (products: Product[]) => void;

  // 로딩 상태
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;

  // 에러 상태
  error: string | null;
  setError: (error: string | null) => void;

  // 필터 상태
  filterStatus: ProductFilter;
  setFilterStatus: (status: ProductFilter) => void;

  // 데이터 로드 액션
  loadProducts: () => Promise<void>;

  // 필터링된 상품 목록 가져오기
  getFilteredProducts: () => Product[];
}

export const useProductStore = create<ProductState>((set, get) => ({
  // 초기 상태
  products: [],
  setProducts: (products) => set({ products }),

  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),

  error: null,
  setError: (error) => set({ error }),

  filterStatus: "전체",
  setFilterStatus: (status) => set({ filterStatus: status }),

  // 필터링된 상품 목록 가져오기
  getFilteredProducts: () => {
    const { products, filterStatus } = get();

    if (filterStatus === "전체") {
      return products;
    } else if (filterStatus === "재고있음") {
      return products.filter((product) => product.count > 0);
    } else {
      return products.filter((product) => product.count === 0);
    }
  },

  // 상품 목록 로드 액션
  loadProducts: async () => {
    const { setIsLoading, setError, setProducts } = get();

    try {
      setIsLoading(true);
      setError(null);

      const products = await fetchMyStocks();
      setProducts(products);
    } catch (error) {
      console.error("상품 목록을 불러오는 중 오류가 발생했습니다:", error);
      setError(
        error instanceof Error
          ? error.message
          : "상품 목록을 불러오는 중 오류가 발생했습니다"
      );
    } finally {
      setIsLoading(false);
    }
  },
}));
