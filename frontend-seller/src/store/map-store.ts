import { create } from "zustand";
import type { KakaoMap, KakaoLatLng, VendingMachine } from "../types/map";

interface MapState {
  // 지도 관련 상태
  map: KakaoMap | null;
  setMap: (map: KakaoMap) => void;

  // 위치 정보 오류 상태
  locationError: string | null;
  setLocationError: (error: string | null) => void;

  // 선택된 위치 상태
  selectedLocation: KakaoLatLng | null;
  setSelectedLocation: (location: KakaoLatLng | null) => void;

  // 검색 거리 상태
  searchDistance: number;
  setSearchDistance: (distance: number) => void;

  // 빵긋 자판기 상태
  vendingMachines: VendingMachine[];
  setVendingMachines: (machines: VendingMachine[]) => void;

  // 로딩 상태
  isSearching: boolean;
  setIsSearching: (isSearching: boolean) => void;

  // 현재 위치 상태
  userLocation: { lat: number; lng: number } | null;
  setUserLocation: (location: { lat: number; lng: number } | null) => void;

  // 선택된 자판기 상태
  selectedVendingMachine: VendingMachine | null;
  setSelectedVendingMachine: (machine: VendingMachine | null) => void;

  // 사이드 패널 표시 상태
  showSidePanel: boolean;
  setShowSidePanel: (show: boolean) => void;

  // 범례 표시 상태
  showLegend: boolean;
  setShowLegend: (show: boolean) => void;
}

export const useMapStore = create<MapState>((set, get) => ({
  // 지도 관련 상태
  map: null,
  setMap: (map) => set({ map }),

  // 위치 정보 오류 상태
  locationError: null,
  setLocationError: (error) => set({ locationError: error }),

  // 선택된 위치 상태
  selectedLocation: null,
  setSelectedLocation: (location) => set({ selectedLocation: location }),

  // 검색 거리 상태 (기본값 3km로 설정)
  searchDistance: 3,
  setSearchDistance: (distance) => {
    set({ searchDistance: distance });

    // 검색 거리 변경 시 이벤트 발생
    if (typeof window !== "undefined") {
      const { userLocation, selectedLocation, map } = get();

      // 현재 선택된 위치 또는 사용자 위치 기준으로 원 업데이트
      if (map) {
        let lat, lng;

        if (selectedLocation) {
          lat = selectedLocation.getLat();
          lng = selectedLocation.getLng();
        } else if (userLocation) {
          lat = userLocation.lat;
          lng = userLocation.lng;
        } else {
          return; // 위치 정보가 없으면 종료
        }

        // 원 업데이트 이벤트 발생
        const event = new CustomEvent("updateSearchRadius", {
          detail: { lat, lng, distance },
        });
        window.dispatchEvent(event);
      }
    }
  },

  // 빵긋 자판기 상태
  vendingMachines: [],
  setVendingMachines: (machines) => set({ vendingMachines: machines }),

  // 로딩 상태
  isSearching: false,
  setIsSearching: (isSearching) => set({ isSearching: isSearching }),

  // 현재 위치 상태
  userLocation: null,
  setUserLocation: (location) => set({ userLocation: location }),

  // 선택된 자판기 상태
  selectedVendingMachine: null,
  setSelectedVendingMachine: (machine) =>
    set({ selectedVendingMachine: machine }),

  // 사이드 패널 표시 상태
  showSidePanel: false,
  setShowSidePanel: (show) => set({ showSidePanel: show }),

  // 범례 표시 상태
  showLegend: true,
  setShowLegend: (show) => set({ showLegend: show }),
}));
