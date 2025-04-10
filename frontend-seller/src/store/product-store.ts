import { create } from "zustand";
import {
  fetchMyStocks,
  fetchMySoldout,
  fetchNextProducts,
} from "../api/product-api";
import type {
  Product,
  ProductsResponse,
  ProductFilter,
} from "../types/products";

interface ProductState {
  // 상품 목록 상태
  stockProducts: Product[];
  setStockProducts: (products: Product[]) => void;

  soldoutProducts: Product[];
  setSoldoutProducts: (products: Product[]) => void;

  // 현재 응답 데이터 (페이지네이션 정보 포함)
  stockResponse: ProductsResponse | null;
  setStockResponse: (response: ProductsResponse | null) => void;

  soldoutResponse: ProductsResponse | null;
  setSoldoutResponse: (response: ProductsResponse | null) => void;

  // 로딩 상태
  isStockLoading: boolean;
  setIsStockLoading: (isLoading: boolean) => void;

  isSoldoutLoading: boolean;
  setIsSoldoutLoading: (isLoading: boolean) => void;

  // 에러 상태
  stockError: string | null;
  setStockError: (error: string | null) => void;

  soldoutError: string | null;
  setSoldoutError: (error: string | null) => void;

  // 필터 상태
  filterStatus: ProductFilter;
  setFilterStatus: (status: ProductFilter) => void;

  // 현재 페이지 번호
  stockCurrentPage: number;
  setStockCurrentPage: (page: number) => void;

  soldoutCurrentPage: number;
  setSoldoutCurrentPage: (page: number) => void;

  // 데이터 로드 액션
  loadStockProducts: () => Promise<void>;
  loadSoldoutProducts: () => Promise<void>;
  loadNextStockPage: () => Promise<void>;
  loadNextSoldoutPage: () => Promise<void>;
  loadSpecificStockPage: (page: number) => Promise<void>;
  loadSpecificSoldoutPage: (page: number) => Promise<void>;

  // 필터링된 상품 목록 가져오기
  getFilteredStockProducts: () => Product[];
}

export const useProductStore = create<ProductState>((set, get) => ({
  // 초기 상태
  stockProducts: [],
  setStockProducts: (products) => set({ stockProducts: products }),

  soldoutProducts: [],
  setSoldoutProducts: (products) => set({ soldoutProducts: products }),

  stockResponse: null,
  setStockResponse: (response) => set({ stockResponse: response }),

  soldoutResponse: null,
  setSoldoutResponse: (response) => set({ soldoutResponse: response }),

  isStockLoading: false,
  setIsStockLoading: (isLoading) => set({ isStockLoading: isLoading }),

  isSoldoutLoading: false,
  setIsSoldoutLoading: (isLoading) => set({ isSoldoutLoading: isLoading }),

  stockError: null,
  setStockError: (error) => set({ stockError: error }),

  soldoutError: null,
  setSoldoutError: (error) => set({ soldoutError: error }),

  filterStatus: "전체",
  setFilterStatus: (status) => set({ filterStatus: status }),

  stockCurrentPage: 0,
  setStockCurrentPage: (page) => set({ stockCurrentPage: page }),

  soldoutCurrentPage: 0,
  setSoldoutCurrentPage: (page) => set({ soldoutCurrentPage: page }),

  // 필터링된 상품 목록 가져오기
  getFilteredStockProducts: () => {
    const { stockProducts, filterStatus } = get();

    if (filterStatus === "전체") {
      return stockProducts;
    } else if (filterStatus === "재고있음") {
      return stockProducts.filter((product) => product.count > 0);
    } else {
      return stockProducts.filter((product) => product.count === 0);
    }
  },

  // 상품 재고 목록 로드 액션
  loadStockProducts: async () => {
    const {
      setIsStockLoading,
      setStockError,
      setStockProducts,
      setStockResponse,
      setStockCurrentPage,
    } = get();

    try {
      setIsStockLoading(true);
      setStockError(null);

      const response = await fetchMyStocks({ page: 0 });
      setStockProducts(response.content);
      setStockResponse(response);
      setStockCurrentPage(0);
    } catch (error) {
      // console.error("상품 재고 목록을 불러오는 중 오류가 발생했습니다:", error);
      setStockError(
        error instanceof Error
          ? error.message
          : "상품 재고 목록을 불러오는 중 오류가 발생했습니다"
      );
    } finally {
      setIsStockLoading(false);
    }
  },

  // 판매 완료 상품 목록 로드 액션
  loadSoldoutProducts: async () => {
    const {
      setIsSoldoutLoading,
      setSoldoutError,
      setSoldoutProducts,
      setSoldoutResponse,
      setSoldoutCurrentPage,
    } = get();

    try {
      setIsSoldoutLoading(true);
      setSoldoutError(null);

      const response = await fetchMySoldout({ page: 0 });
      setSoldoutProducts(response.content);
      setSoldoutResponse(response);
      setSoldoutCurrentPage(0);
    } catch (error) {
      // console.error(
      //   "판매 완료 상품 목록을 불러오는 중 오류가 발생했습니다:",
      //   error
      // );
      setSoldoutError(
        error instanceof Error
          ? error.message
          : "판매 완료 상품 목록을 불러오는 중 오류가 발생했습니다"
      );
    } finally {
      setIsSoldoutLoading(false);
    }
  },

  // 다음 페이지 상품 재고 로드 액션
  loadNextStockPage: async () => {
    const {
      stockCurrentPage,
      stockResponse,
      setIsStockLoading,
      setStockError,
      setStockProducts,
      setStockResponse,
      stockProducts,
      setStockCurrentPage,
    } = get();

    if (!stockResponse || stockResponse.last) return;

    try {
      setIsStockLoading(true);
      setStockError(null);

      const nextResponse = await fetchNextProducts("stocks", stockCurrentPage);

      if (nextResponse) {
        // 기존 상품 목록에 새로운 데이터 추가
        setStockProducts([...stockProducts, ...nextResponse.content]);
        setStockResponse(nextResponse);
        setStockCurrentPage(stockCurrentPage + 1);
      }
    } catch (error) {
      // console.error(
      //   "다음 페이지 상품 재고를 불러오는 중 오류가 발생했습니다:",
      //   error
      // );
      setStockError(
        error instanceof Error
          ? error.message
          : "다음 페이지 상품 재고를 불러오는 중 오류가 발생했습니다"
      );
    } finally {
      setIsStockLoading(false);
    }
  },

  // 다음 페이지 판매 완료 상품 로드 액션
  loadNextSoldoutPage: async () => {
    const {
      soldoutCurrentPage,
      soldoutResponse,
      setIsSoldoutLoading,
      setSoldoutError,
      setSoldoutProducts,
      setSoldoutResponse,
      soldoutProducts,
      setSoldoutCurrentPage,
    } = get();

    if (!soldoutResponse || soldoutResponse.last) return;

    try {
      setIsSoldoutLoading(true);
      setSoldoutError(null);

      const nextResponse = await fetchNextProducts(
        "soldout",
        soldoutCurrentPage
      );

      if (nextResponse) {
        // 기존 상품 목록에 새로운 데이터 추가
        setSoldoutProducts([...soldoutProducts, ...nextResponse.content]);
        setSoldoutResponse(nextResponse);
        setSoldoutCurrentPage(soldoutCurrentPage + 1);
      }
    } catch (error) {
      // console.error(
      //   "다음 페이지 판매 완료 상품을 불러오는 중 오류가 발생했습니다:",
      //   error
      // );
      setSoldoutError(
        error instanceof Error
          ? error.message
          : "다음 페이지 판매 완료 상품을 불러오는 중 오류가 발생했습니다"
      );
    } finally {
      setIsSoldoutLoading(false);
    }
  },

  // 특정 페이지 상품 재고 로드 액션
  loadSpecificStockPage: async (page) => {
    const {
      setIsStockLoading,
      setStockError,
      setStockProducts,
      setStockResponse,
      setStockCurrentPage,
    } = get();

    try {
      setIsStockLoading(true);
      setStockError(null);

      const response = await fetchMyStocks({ page });
      setStockProducts(response.content);
      setStockResponse(response);
      setStockCurrentPage(page);
    } catch (error) {
      // console.error(
      //   `${page} 페이지 상품 재고를 불러오는 중 오류가 발생했습니다:`,
      //   error
      // );
      setStockError(
        error instanceof Error
          ? error.message
          : `${page} 페이지 상품 재고를 불러오는 중 오류가 발생했습니다`
      );
    } finally {
      setIsStockLoading(false);
    }
  },

  // 특정 페이지 판매 완료 상품 로드 액션
  loadSpecificSoldoutPage: async (page) => {
    const {
      setIsSoldoutLoading,
      setSoldoutError,
      setSoldoutProducts,
      setSoldoutResponse,
      setSoldoutCurrentPage,
    } = get();

    try {
      setIsSoldoutLoading(true);
      setSoldoutError(null);

      const response = await fetchMySoldout({ page });
      setSoldoutProducts(response.content);
      setSoldoutResponse(response);
      setSoldoutCurrentPage(page);
    } catch (error) {
      // console.error(
      //   `${page} 페이지 판매 완료 상품을 불러오는 중 오류가 발생했습니다:`,
      //   error
      // );
      setSoldoutError(
        error instanceof Error
          ? error.message
          : `${page} 페이지 판매 완료 상품을 불러오는 중 오류가 발생했습니다`
      );
    } finally {
      setIsSoldoutLoading(false);
    }
  },
}));
