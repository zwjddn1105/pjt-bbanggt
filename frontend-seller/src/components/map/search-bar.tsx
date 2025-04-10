"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useMapStore } from "../../store/map-store";
import { fetchVendingMachines } from "../../api/vending-machine";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const {
    map,
    setSelectedVendingMachine,
    setShowSidePanel,
    setSearchDistance,
    setSelectedLocation,
  } = useMapStore();

  // 주소 검색 함수
  const handleSearch = async () => {
    if (!window.kakao || !window.kakao.maps || !searchTerm.trim() || !map)
      return;

    try {
      setIsSearching(true);

      // 전국 범위에서 자판기 검색 (넓은 범위로 검색)
      // 실제로는 API에서 검색 기능을 제공해야 하지만, 여기서는 모든 자판기를 가져와서 클라이언트에서 필터링
      const allMachines = await fetchVendingMachines(37.5665, 126.978, 400); // 서울 중심, 100km 반경

      // 검색어와 일치하는 자판기 찾기 - 대소문자 구분 없이 검색
      const searchTermLower = searchTerm.toLowerCase();
      const foundMachine = allMachines.find(
        (machine) =>
          (machine.address &&
            machine.address.toLowerCase().includes(searchTermLower)) ||
          (machine.name && machine.name.toLowerCase().includes(searchTermLower))
      );

      if (foundMachine) {
        // 찾은 자판기 위치로 지도 이동
        const position = new window.kakao.maps.LatLng(
          foundMachine.latitude,
          foundMachine.longitude
        );
        map.setCenter(position);
        map.setLevel(3); // 더 가깝게 확대

        // 선택된 위치 업데이트
        setSelectedLocation(position);

        // 검색 거리를 3km로 설정
        setSearchDistance(3);

        // 선택된 자판기 정보 설정 및 사이드 패널 표시
        setSelectedVendingMachine(foundMachine);
        setShowSidePanel(true);

        // 검색 반경 원 업데이트 및 자판기 재검색
        if (typeof window !== "undefined") {
          const event = new CustomEvent("updateSearchRadius", {
            detail: {
              lat: foundMachine.latitude,
              lng: foundMachine.longitude,
              distance: 3,
            },
          });
          window.dispatchEvent(event);
        }
      } else {
        alert("검색 결과가 없습니다. 다른 검색어를 입력해보세요.");
      }
    } catch (error) {
      // console.error("검색 중 오류가 발생했습니다:", error);
      alert("검색 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="자판기 이름 또는 주소 검색"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        className="w-full px-4 py-3 pr-12 bg-white border-0 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        disabled={isSearching}
      />
      <button
        onClick={handleSearch}
        disabled={isSearching}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-orange-500 text-white p-1.5 rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50"
      >
        <Search size={18} />
      </button>
    </div>
  );
}
