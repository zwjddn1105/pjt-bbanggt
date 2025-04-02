"use client";
import { ChevronRight, MapPin, Package, ShoppingBag } from "lucide-react";

// 더미 데이터 - API 연동 전 사용
const inventoryData = [
  { id: 1, location: "서울 강남구 테헤란로 202", quantity: 5 },
  { id: 2, location: "서울 강남구 선릉로 328", quantity: 3 },
  { id: 3, location: "서울 강남구 테헤란로 202", quantity: 5 },
  { id: 4, location: "서울 강남구 테헤란로 202", quantity: 5 },
  { id: 5, location: "서울 강남구 테헤란로 202", quantity: 5 },
  { id: 6, location: "서울 강남구 테헤란로 202", quantity: 5 },
];

const salesData = [
  { id: 1, location: "서울 강남구 테헤란로 202", quantity: 5 },
  { id: 2, location: "서울 강남구 테헤란로 202", quantity: 5 },
  { id: 3, location: "서울 강남구 테헤란로 202", quantity: 5 },
  { id: 4, location: "서울 강남구 테헤란로 202", quantity: 5 },
  { id: 5, location: "서울 강남구 테헤란로 202", quantity: 5 },
];

export default function ProductsPage() {
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

            {inventoryData.map((item) => (
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
                  <span className="text-gray-500 text-sm ml-1">칸</span>
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
