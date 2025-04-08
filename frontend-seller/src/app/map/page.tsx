"use client";

import { useEffect, useState } from "react";
import { useLoading } from "../../components/loading-provider";
import { isLoggedIn } from "../../lib/auth";
import { useRouter } from "next/navigation";
import { useMapStore } from "../../store/map-store";
import { useSellerProductsStore } from "../../store/seller-products-store";
import SlotSelectionModal from "../../components/map/slot-selection-modal";
import MapContainer from "../../components/map/map-container";
import SearchBar from "../../components/map/search-bar";
import ControlPanel from "../../components/map/control-panel";
import Legend from "../../components/map/legend";
import VendingMachinePanel from "../../components/map/vending-machine-panel";
import SellerProductsModal from "../../components/map/seller-products-modal";
import type { KakaoMap } from "../../types/map";

export default function MapPage() {
  const { setLoading } = useLoading();
  const router = useRouter();
  const [, setMapLoaded] = useState(false);

  // Zustand 스토어에서 상태와 액션 가져오기
  const {
    selectedVendingMachine,
    showSidePanel,
    setShowSidePanel,
    setSelectedVendingMachine,
    showLegend,
  } = useMapStore();

  const { isProductsModalOpen, setIsProductsModalOpen } =
    useSellerProductsStore();

  // 로그인 상태 확인
  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/");
    }
  }, [router]);

  // 컴포넌트 마운트 시 로딩 상태 설정
  useEffect(() => {
    setLoading(true);
    return () => setLoading(false);
  }, [setLoading]);

  // 맵 로드 완료 핸들러
  const handleMapLoad = (loadedMap: KakaoMap) => {
    setMapLoaded(true);
    setLoading(false);
  };

  return (
    <div className="relative h-[calc(100vh-6rem)] w-full overflow-hidden">
      {/* 카카오맵 컨테이너 */}
      <MapContainer onMapLoad={handleMapLoad} />

      {/* 검색 바 - 맵 상단에 고정 */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 z-10">
        <SearchBar />
      </div>

      {/* 컨트롤 패널 - 오른쪽 상단에 고정 */}
      <div className="absolute top-20 right-4 z-10">
        <ControlPanel />
      </div>

      {/* 범례 - 오른쪽 하단에 고정 */}
      {showLegend && (
        <div className="absolute bottom-4 right-4 z-10">
          <Legend />
        </div>
      )}

      {/* 자판기 정보 사이드 패널 */}
      {showSidePanel && selectedVendingMachine && (
        <VendingMachinePanel
          vendingMachine={selectedVendingMachine}
          onClose={() => {
            setShowSidePanel(false);
            setSelectedVendingMachine(null);
          }}
        />
      )}

      {/* 슬롯 선택 모달 */}
      <SlotSelectionModal />

      {/* 등록한 빵 목록 모달 */}
      {isProductsModalOpen && selectedVendingMachine && (
        <SellerProductsModal
          isOpen={isProductsModalOpen}
          onClose={() => setIsProductsModalOpen(false)}
          vendingMachineId={selectedVendingMachine.id}
          vendingMachineName={selectedVendingMachine.name || "빵긋 자판기"}
        />
      )}
    </div>
  );
}
