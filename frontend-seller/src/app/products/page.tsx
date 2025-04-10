"use client";

import { useEffect, useState } from "react";
import {
  ChevronRight,
  ChevronLeft,
  MapPin,
  Package,
  ShoppingBag,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useProductStore } from "../../store/product-store";
import { useLoading } from "../../components/loading-provider";
import ProductDetailModal from "../../components/product-detail-modal";

export default function ProductsPage() {
  const { setLoading } = useLoading();
  const {
    stockProducts,
    soldoutProducts,
    isStockLoading,
    isSoldoutLoading,
    stockError,
    soldoutError,
    loadStockProducts,
    loadSoldoutProducts,
    stockResponse,
    soldoutResponse,
    loadNextStockPage,
    loadNextSoldoutPage,
    loadSpecificStockPage,
    loadSpecificSoldoutPage,
    stockCurrentPage,
    soldoutCurrentPage,
  } = useProductStore();

  const [stockPage, setStockPage] = useState(0);
  const [soldoutPage, setSoldoutPage] = useState(0);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{
    productId: number;
    vendingMachineId: number;
  } | null>(null);

  // 컴포넌트 마운트 시 상품 목록 로드
  useEffect(() => {
    setLoading(true);
    Promise.all([loadStockProducts(), loadSoldoutProducts()]).finally(() =>
      setLoading(false)
    );
  }, [loadStockProducts, loadSoldoutProducts, setLoading]);

  // 스토어의 현재 페이지가 변경되면 로컬 상태도 업데이트
  useEffect(() => {
    setStockPage(stockCurrentPage);
  }, [stockCurrentPage]);

  useEffect(() => {
    setSoldoutPage(soldoutCurrentPage);
  }, [soldoutCurrentPage]);

  // 상품 상세 보기 핸들러 (실제 구현은 나중에)
  const handleProductDetail = (productId: number, vendingMachineId: number) => {
    setSelectedProduct({
      productId,
      vendingMachineId,
    });
    setShowDetailModal(true);
  };

  // 페이지 변경 함수 - 재고 상품
  const handleStockPageChange = (page: number) => {
    if (page === stockPage) return;

    if (
      page > stockPage &&
      page === stockPage + 1 &&
      stockResponse &&
      !stockResponse.last
    ) {
      // 다음 페이지로만 이동하는 경우
      loadNextStockPage();
    } else {
      // 특정 페이지로 직접 이동하는 경우
      loadSpecificStockPage(page);
    }
  };

  // 페이지 변경 함수 - 판매 완료 상품
  const handleSoldoutPageChange = (page: number) => {
    if (page === soldoutPage) return;

    if (
      page > soldoutPage &&
      page === soldoutPage + 1 &&
      soldoutResponse &&
      !soldoutResponse.last
    ) {
      // 다음 페이지로만 이동하는 경우
      loadNextSoldoutPage();
    } else {
      // 특정 페이지로 직접 이동하는 경우
      loadSpecificSoldoutPage(page);
    }
  };

  // 페이지네이션 렌더링 - 재고 상품
  const renderStockPagination = () => {
    if (!stockResponse) return null;

    const totalPages = stockResponse.totalPages;
    const pages = [];

    // 처음 페이지로 이동
    pages.push(
      <button
        key="first"
        onClick={() => handleStockPageChange(0)}
        disabled={stockPage === 0}
        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-orange-100 disabled:opacity-50 disabled:hover:bg-transparent"
      >
        <ChevronLeft className="w-4 h-4" />
        <ChevronLeft className="w-4 h-4 -ml-2" />
      </button>
    );

    // 이전 페이지로 이동
    pages.push(
      <button
        key="prev"
        onClick={() => handleStockPageChange(stockPage - 1)}
        disabled={stockPage === 0}
        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-orange-100 disabled:opacity-50 disabled:hover:bg-transparent"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
    );

    // 페이지 번호
    for (let i = 0; i < totalPages; i++) {
      // 현재 페이지 주변 2개와 첫/마지막 페이지 표시
      if (
        i === 0 ||
        i === totalPages - 1 ||
        (i >= stockPage - 1 && i <= stockPage + 1)
      ) {
        pages.push(
          <button
            key={i}
            onClick={() => handleStockPageChange(i)}
            className={`w-8 h-8 rounded-md flex items-center justify-center ${
              stockPage === i
                ? "bg-orange-500 text-white"
                : "hover:bg-orange-100 text-gray-700"
            }`}
          >
            {i + 1}
          </button>
        );
      } else if (
        (i === stockPage - 2 && stockPage > 2) ||
        (i === stockPage + 2 && stockPage < totalPages - 3)
      ) {
        // 생략 부호 표시
        pages.push(
          <span
            key={i}
            className="w-8 h-8 flex items-center justify-center text-gray-500"
          >
            ...
          </span>
        );
      }
    }

    // 다음 페이지로 이동
    pages.push(
      <button
        key="next"
        onClick={() => handleStockPageChange(stockPage + 1)}
        disabled={stockPage === totalPages - 1 || stockResponse.last}
        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-orange-100 disabled:opacity-50 disabled:hover:bg-transparent"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    );

    // 마지막 페이지로 이동
    pages.push(
      <button
        key="last"
        onClick={() => handleStockPageChange(totalPages - 1)}
        disabled={stockPage === totalPages - 1 || stockResponse.last}
        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-orange-100 disabled:opacity-50 disabled:hover:bg-transparent"
      >
        <ChevronRight className="w-4 h-4" />
        <ChevronRight className="w-4 h-4 -ml-2" />
      </button>
    );

    return pages;
  };

  // 페이지네이션 렌더링 - 판매 완료 상품
  const renderSoldoutPagination = () => {
    if (!soldoutResponse) return null;

    const totalPages = soldoutResponse.totalPages;
    const pages = [];

    // 처음 페이지로 이동
    pages.push(
      <button
        key="first"
        onClick={() => handleSoldoutPageChange(0)}
        disabled={soldoutPage === 0}
        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-orange-100 disabled:opacity-50 disabled:hover:bg-transparent"
      >
        <ChevronLeft className="w-4 h-4" />
        <ChevronLeft className="w-4 h-4 -ml-2" />
      </button>
    );

    // 이전 페이지로 이동
    pages.push(
      <button
        key="prev"
        onClick={() => handleSoldoutPageChange(soldoutPage - 1)}
        disabled={soldoutPage === 0}
        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-orange-100 disabled:opacity-50 disabled:hover:bg-transparent"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
    );

    // 페이지 번호
    for (let i = 0; i < totalPages; i++) {
      // 현재 페이지 주변 2개와 첫/마지막 페이지 표시
      if (
        i === 0 ||
        i === totalPages - 1 ||
        (i >= soldoutPage - 1 && i <= soldoutPage + 1)
      ) {
        pages.push(
          <button
            key={i}
            onClick={() => handleSoldoutPageChange(i)}
            className={`w-8 h-8 rounded-md flex items-center justify-center ${
              soldoutPage === i
                ? "bg-orange-500 text-white"
                : "hover:bg-orange-100 text-gray-700"
            }`}
          >
            {i + 1}
          </button>
        );
      } else if (
        (i === soldoutPage - 2 && soldoutPage > 2) ||
        (i === soldoutPage + 2 && soldoutPage < totalPages - 3)
      ) {
        // 생략 부호 표시
        pages.push(
          <span
            key={i}
            className="w-8 h-8 flex items-center justify-center text-gray-500"
          >
            ...
          </span>
        );
      }
    }

    // 다음 페이지로 이동
    pages.push(
      <button
        key="next"
        onClick={() => handleSoldoutPageChange(soldoutPage + 1)}
        disabled={soldoutPage === totalPages - 1 || soldoutResponse.last}
        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-orange-100 disabled:opacity-50 disabled:hover:bg-transparent"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    );

    // 마지막 페이지로 이동
    pages.push(
      <button
        key="last"
        onClick={() => handleSoldoutPageChange(totalPages - 1)}
        disabled={soldoutPage === totalPages - 1 || soldoutResponse.last}
        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-orange-100 disabled:opacity-50 disabled:hover:bg-transparent"
      >
        <ChevronRight className="w-4 h-4" />
        <ChevronRight className="w-4 h-4 -ml-2" />
      </button>
    );

    return pages;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 현재 재고 섹션 */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center">
              <Package className="w-5 h-5 text-orange-500 mr-2" />
              <h2 className="text-xl font-bold text-gray-800">현재 재고</h2>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            <div className="grid grid-cols-12 px-6 py-3 bg-gray-50 text-sm font-medium text-gray-600">
              <div className="col-span-6">위치</div>
              <div className="col-span-3 text-center">수량</div>
              <div className="col-span-3"></div>
            </div>

            {isStockLoading && stockProducts.length === 0 ? (
              <div className="py-12 text-center text-gray-500 flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-2" />
                <p>상품 목록을 불러오는 중입니다...</p>
              </div>
            ) : stockError ? (
              <div className="py-12 text-center text-red-500 flex flex-col items-center justify-center">
                <AlertCircle className="w-8 h-8 mb-2" />
                <p>{stockError}</p>
                <button
                  onClick={() => loadStockProducts()}
                  className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                >
                  다시 시도
                </button>
              </div>
            ) : stockProducts.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                상품 내역이 없습니다.
              </div>
            ) : (
              stockProducts.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 px-6 py-4 items-center hover:bg-orange-50 transition-colors"
                >
                  <div className="col-span-6 flex items-center">
                    <MapPin className="w-4 h-4 text-orange-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-700 text-sm truncate">
                      {item.memo}
                    </span>
                  </div>
                  <div className="col-span-3 text-center">
                    <span className="font-medium text-gray-800">
                      {item.count}
                    </span>
                    <span className="text-gray-500 text-sm ml-1">개</span>
                  </div>
                  <div className="col-span-3 flex justify-end">
                    <button
                      onClick={() =>
                        handleProductDetail(item.id, item.vendingMachineId)
                      }
                      className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-3 py-1.5 rounded-full transition-colors flex items-center"
                    >
                      자세히
                      <ChevronRight className="w-3 h-3 ml-1" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {!isStockLoading &&
            !stockError &&
            stockProducts.length > 0 &&
            stockResponse && (
              <div className="p-4 flex justify-center">
                <div className="flex space-x-1">{renderStockPagination()}</div>
              </div>
            )}
        </div>

        {/* 판매목록 섹션 */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center">
              <ShoppingBag className="w-5 h-5 text-orange-500 mr-2" />
              <h2 className="text-xl font-bold text-gray-800">판매목록</h2>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            <div className="grid grid-cols-12 px-6 py-3 bg-gray-50 text-sm font-medium text-gray-600">
              <div className="col-span-6">위치</div>
              <div className="col-span-3 text-center">수량</div>
              <div className="col-span-3"></div>
            </div>

            {isSoldoutLoading && soldoutProducts.length === 0 ? (
              <div className="py-12 text-center text-gray-500 flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-2" />
                <p>판매 목록을 불러오는 중입니다...</p>
              </div>
            ) : soldoutError ? (
              <div className="py-12 text-center text-red-500 flex flex-col items-center justify-center">
                <AlertCircle className="w-8 h-8 mb-2" />
                <p>{soldoutError}</p>
                <button
                  onClick={() => loadSoldoutProducts()}
                  className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                >
                  다시 시도
                </button>
              </div>
            ) : soldoutProducts.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                판매 내역이 없습니다.
              </div>
            ) : (
              soldoutProducts.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 px-6 py-4 items-center hover:bg-orange-50 transition-colors"
                >
                  <div className="col-span-6 flex items-center">
                    <MapPin className="w-4 h-4 text-orange-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-700 text-sm truncate">
                      {item.memo}
                    </span>
                  </div>
                  <div className="col-span-3 text-center">
                    <span className="font-medium text-gray-800">
                      {item.count}
                    </span>
                    <span className="text-gray-500 text-sm ml-1">개</span>
                  </div>
                  <div className="col-span-3 flex justify-end">
                    <button
                      onClick={() =>
                        handleProductDetail(item.id, item.vendingMachineId)
                      }
                      className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-3 py-1.5 rounded-full transition-colors flex items-center"
                    >
                      자세히
                      <ChevronRight className="w-3 h-3 ml-1" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {!isSoldoutLoading &&
            !soldoutError &&
            soldoutProducts.length > 0 &&
            soldoutResponse && (
              <div className="p-4 flex justify-center">
                <div className="flex space-x-1">
                  {renderSoldoutPagination()}
                </div>
              </div>
            )}
        </div>
      </div>
      {showDetailModal && selectedProduct && (
        <ProductDetailModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          vendingMachineId={selectedProduct.vendingMachineId}
          productId={selectedProduct.productId}
        />
      )}
    </div>
  );
}
