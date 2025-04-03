"use client";
import { useEffect } from "react";
import {
  ChevronRight,
  MapPin,
  Package,
  ShoppingBag,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useProductStore } from "../../store/product-store";

// 더미 데이터 - 판매 목록용 (API 연동 전 사용)
const salesData = [
  { id: 1, location: "서울 강남구 테헤란로 202", quantity: 5 },
  { id: 2, location: "서울 강남구 테헤란로 202", quantity: 5 },
  { id: 3, location: "서울 강남구 테헤란로 202", quantity: 5 },
  { id: 4, location: "서울 강남구 테헤란로 202", quantity: 5 },
  { id: 5, location: "서울 강남구 테헤란로 202", quantity: 5 },
];

export default function ProductsPage() {
  const { isLoading, error, loadProducts, getFilteredProducts } =
    useProductStore();

  // 컴포넌트 마운트 시 상품 목록 로드
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // 필터링된 상품 목록
  const filteredProducts = getFilteredProducts();

  // 상품 상세 보기 핸들러 (실제 구현은 나중에)
  const handleProductDetail = (productId: number) => {
    console.log(`상품 ${productId} 상세 정보로 이동합니다.`);
    // 실제 구현은 나중에
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

            {isLoading ? (
              <div className="py-12 text-center text-gray-500 flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-2" />
                <p>상품 목록을 불러오는 중입니다...</p>
              </div>
            ) : error ? (
              <div className="py-12 text-center text-red-500 flex flex-col items-center justify-center">
                <AlertCircle className="w-8 h-8 mb-2" />
                <p>{error}</p>
                <button
                  onClick={() => loadProducts()}
                  className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                >
                  다시 시도
                </button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                상품 내역이 없습니다.
              </div>
            ) : (
              filteredProducts.map((item) => (
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
                    <span className="text-gray-500 text-sm ml-1">칸</span>
                  </div>
                  <div className="col-span-3 flex justify-end">
                    <button
                      onClick={() => handleProductDetail(item.id)}
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
        </div>

        {/* 판매목록 섹션 (더미 데이터 유지) */}
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

            {salesData.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-12 px-6 py-4 items-center hover:bg-orange-50 transition-colors"
              >
                <div className="col-span-6 flex items-center">
                  <MapPin className="w-4 h-4 text-orange-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-700 text-sm truncate">
                    {item.location}
                  </span>
                </div>
                <div className="col-span-3 text-center">
                  <span className="font-medium text-gray-800">
                    {item.quantity}
                  </span>
                  <span className="text-gray-500 text-sm ml-1">개</span>
                </div>
                <div className="col-span-3 flex justify-end">
                  <button className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-3 py-1.5 rounded-full transition-colors flex items-center">
                    자세히
                    <ChevronRight className="w-3 h-3 ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
