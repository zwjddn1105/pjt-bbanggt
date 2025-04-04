"use client";

import { Navigation } from "lucide-react";
import { useMapStore } from "../../store/map-store";

export default function ControlPanel() {
  const {
    searchDistance,
    setSearchDistance,
    vendingMachines,
    isSearching,
    userLocation,
    showLegend,
    setShowLegend,
    map,
    setSelectedLocation,
  } = useMapStore();

  // 현재 위치로 이동하는 함수
  const moveToUserLocation = () => {
    if (!window.kakao || !window.kakao.maps || !userLocation || !map) return;

    // 지도 중심 이동
    map.setCenter(
      new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng)
    );

    // 선택된 위치 초기화
    setSelectedLocation(null);

    // 검색 거리를 3km로 재설정
    setSearchDistance(3);

    // 현재 위치 기준으로 검색 반경 원 업데이트 및 자판기 재검색
    if (typeof window !== "undefined") {
      const event = new CustomEvent("updateSearchRadius", {
        detail: { lat: userLocation.lat, lng: userLocation.lng, distance: 3 },
      });
      window.dispatchEvent(event);
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-md z-10 w-80">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          검색 거리
        </label>
        <div className="flex space-x-3">
          {[1, 3, 5, 10].map((distance) => (
            <button
              key={distance}
              className={`px-4 py-2 text-sm rounded-md ${
                searchDistance === distance
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-orange-100"
              }`}
              onClick={() => setSearchDistance(distance)}
            >
              {distance}km
            </button>
          ))}
        </div>
      </div>

      {/* 현재 위치로 이동 버튼 */}
      <button
        className="w-full py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-base"
        onClick={moveToUserLocation}
        disabled={isSearching || !userLocation}
      >
        <Navigation className="h-5 w-5 mr-2" />내 위치로 이동
      </button>

      {vendingMachines.length > 0 && (
        <div className="mt-4 text-base text-gray-700">
          {vendingMachines.length}개의 빵긋 자판기를 찾았습니다
        </div>
      )}

      {/* 범례 표시 토글 버튼 */}
      <button
        className="mt-3 text-base text-orange-500 hover:text-orange-600 underline"
        onClick={() => setShowLegend(!showLegend)}
      >
        {showLegend ? "범례 숨기기" : "범례 보기"}
      </button>
    </div>
  );
}
