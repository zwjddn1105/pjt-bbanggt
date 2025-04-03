"use client";

import React from "react";

import { useEffect, useRef, useCallback, useState } from "react";
import { useLoading } from "../../components/loading-provider";
import { isLoggedIn } from "../../lib/auth";
import { useRouter } from "next/navigation";
import { useMapStore } from "../../store/map-store";
import { fetchVendingMachines } from "../../api/vending-machine";
import { Search, X, MapPin, Navigation, MapPinned, Ruler } from "lucide-react";
import Image from "next/image";
import type {
  KakaoMap,
  KakaoMarker,
  KakaoEvent,
  KakaoCircle,
  KakaoCustomOverlay,
} from "../../types/map";

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const kakaoMapRef = useRef<KakaoMap | null>(null);
  const selectedMarkerRef = useRef<KakaoMarker | null>(null);
  const searchCircleRef = useRef<KakaoCircle | null>(null);
  const vendingMarkers = useRef<{ marker: KakaoMarker; id: number | string }[]>(
    []
  );
  const customOverlays = useRef<KakaoCustomOverlay[]>([]);
  const scriptLoadedRef = useRef(false);
  const { setLoading } = useLoading();
  const router = useRouter();
  const [kakaoLoaded, setKakaoLoaded] = useState(false);

  // Zustand 스토어에서 상태와 액션 가져오기
  const {
    setMap,
    setSelectedLocation,
    searchDistance,
    setSearchDistance,
    vendingMachines,
    setVendingMachines,
    isSearching,
    setIsSearching,
    userLocation,
    setUserLocation,
    selectedVendingMachine,
    setSelectedVendingMachine,
    showSidePanel,
    setShowSidePanel,
    showLegend,
    setShowLegend,
  } = useMapStore();

  // 검색어 상태 (이것은 로컬 상태로 유지)
  const [searchTerm, setSearchTerm] = React.useState("");

  // 현재 위치 상태 (이것은 로컬 상태로 유지)
  const [currentLocation, setCurrentLocation] = React.useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // 자판기 상태에 따른 마커 이미지 선택
  const getMarkerImageByStatus = useCallback(
    (remainSpaceCount: number, isSelected = false) => {
      if (!window.kakao || !window.kakao.maps) return null;

      let imageSrc = "";

      if (remainSpaceCount === 0) {
        // 구매불가 자판함 (검은색)
        imageSrc = "/black-cabinet.png";
      } else if (remainSpaceCount >= 1 && remainSpaceCount <= 5) {
        // 거의찬 자판함 (빨간색)
        imageSrc = "/red-cabinet.png";
      } else {
        // 사용가능 자판함 (녹색)
        imageSrc = "/green-cabinet.png";
      }

      // 마커 이미지 크기 (선택된 경우 더 크게)
      const size = isSelected ? 65 : 45; // 선택된 마커 크기 증가
      const height = isSelected ? 87 : 60; // 선택된 마커 높이 증가

      return new window.kakao.maps.MarkerImage(
        imageSrc,
        new window.kakao.maps.Size(size, height),
        {
          offset: new window.kakao.maps.Point(size / 2, height),
        }
      );
    },
    []
  );

  // 선택된 마커 강조 표시 함수
  const highlightSelectedMarker = useCallback(
    (selectedId: number | string | null) => {
      if (!window.kakao || !window.kakao.maps) return;

      // 모든 마커를 원래 이미지로 되돌림
      vendingMarkers.current.forEach(({ marker, id }) => {
        const machine = vendingMachines.find((m) => m.id === id);
        if (machine) {
          const markerImage = getMarkerImageByStatus(
            machine.remainSpaceCount || 0
          );
          if (markerImage) marker.setImage(markerImage);

          // 선택된 마커라면 크기를 키우고 z-index를 높임
          if (id === selectedId) {
            const selectedImage = getMarkerImageByStatus(
              machine.remainSpaceCount || 0,
              true
            );
            if (selectedImage) marker.setImage(selectedImage);
            marker.setZIndex(10); // 다른 마커보다 위에 표시
          } else {
            marker.setZIndex(1);
          }
        }
      });
    },
    [vendingMachines, getMarkerImageByStatus]
  );

  // 검색 반경 원 표시 함수
  const showSearchRadius = useCallback(
    (lat: number, lng: number, radiusKm: number) => {
      if (!window.kakao || !window.kakao.maps || !kakaoMapRef.current) return;

      // 이전 원이 있으면 제거
      if (searchCircleRef.current) {
        searchCircleRef.current.setMap(null);
      }

      // 반경 원 생성 (km를 m로 변환)
      const radiusM = radiusKm * 1000;
      const circle = new window.kakao.maps.Circle({
        center: new window.kakao.maps.LatLng(lat, lng),
        radius: radiusM,
        strokeWeight: 2,
        strokeColor: "#FF8C38",
        strokeOpacity: 0.8,
        strokeStyle: "solid",
        fillColor: "#FF8C38",
        fillOpacity: 0.2,
        map: kakaoMapRef.current,
      });

      // 원 참조 저장
      searchCircleRef.current = circle;
    },
    []
  );

  // 빵긋 자판기 조회 함수
  const searchVendingMachines = useCallback(
    async (lat: number, lng: number, distance: number) => {
      if (!window.kakao || !window.kakao.maps || !kakaoMapRef.current) return;

      try {
        setIsSearching(true);

        // 기존 자판기 마커 제거
        vendingMarkers.current.forEach(({ marker }) => marker.setMap(null));
        vendingMarkers.current = [];

        // 기존 커스텀 오버레이 제거
        customOverlays.current.forEach((overlay) => overlay.setMap(null));
        customOverlays.current = [];

        // 검색 반경 원 표시
        showSearchRadius(lat, lng, distance);

        // API 호출
        const machines = await fetchVendingMachines(lat, lng, distance);
        setVendingMachines(machines);

        // 지도에 자판기 마커 표시
        machines.forEach((machine) => {
          // 자판기 상태에 따른 마커 이미지 선택
          const markerImage = getMarkerImageByStatus(
            machine.remainSpaceCount || 0
          );
          if (!markerImage) return;

          // 자판기 마커 생성
          const marker = new window.kakao.maps.Marker({
            position: new window.kakao.maps.LatLng(
              machine.latitude,
              machine.longitude
            ),
            map: kakaoMapRef.current,
            image: markerImage,
            title: machine.name,
            zIndex: 1,
          });

          // 마커 배열에 추가
          vendingMarkers.current.push({ marker, id: machine.id });

          // 마커 위에 남은 공간 수 표시하는 커스텀 오버레이 생성
          const content = document.createElement("div");
          content.className = "marker-count";
          content.style.position = "absolute";
          content.style.width = "100%";
          content.style.textAlign = "center";
          content.innerHTML = `
  <div style="
    position: relative;
    top: -75px;
    color: white;
    font-weight: bold;
    font-size: 16px;
    text-shadow: 1px 1px 1px rgba(0,0,0,0.7);
    background-color: rgba(0,0,0,0.6);
    border-radius: 50%;
    width: 26px;
    height: 26px;
    line-height: 26px;
    margin: 0 auto;
    z-index: 10;
  ">
    ${machine.remainSpaceCount || 0}
  </div>
`;

          const overlay = new window.kakao.maps.CustomOverlay({
            position: new window.kakao.maps.LatLng(
              machine.latitude,
              machine.longitude
            ),
            content: content,
            map: kakaoMapRef.current,
            yAnchor: 0.0,
            zIndex: 10,
          });

          customOverlays.current.push(overlay);

          // 마커 클릭 이벤트 - 사이드 패널에 정보 표시
          window.kakao.maps.event.addListener(marker, "click", () => {
            // 선택된 자판기 정보 설정
            setSelectedVendingMachine(machine);
            // 사이드 패널 표시
            setShowSidePanel(true);
            // 선택된 마커 강조 표시
            highlightSelectedMarker(machine.id);
          });
        });
      } catch (error) {
        console.error("빵긋 자판기 조회 실패:", error);
      } finally {
        setIsSearching(false);
      }
    },
    [
      setVendingMachines,
      setIsSearching,
      showSearchRadius,
      getMarkerImageByStatus,
      setSelectedVendingMachine,
      setShowSidePanel,
      highlightSelectedMarker,
    ]
  );

  // 현재 위치로 이동하는 함수
  const moveToUserLocation = useCallback(() => {
    if (
      !window.kakao ||
      !window.kakao.maps ||
      !userLocation ||
      !kakaoMapRef.current
    )
      return;

    // 지도 중심 이동
    kakaoMapRef.current.setCenter(
      new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng)
    );

    // 현재 위치 기준으로 빵긋 자판기 조회
    searchVendingMachines(userLocation.lat, userLocation.lng, searchDistance);

    // 현재 위치로 currentLocation 업데이트
    setCurrentLocation(userLocation);

    // 선택된 위치 업데이트
    setSelectedLocation(
      new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng)
    );
  }, [
    userLocation,
    searchDistance,
    searchVendingMachines,
    setSelectedLocation,
  ]);

  // 주소 검색 함수
  const handleSearch = useCallback(() => {
    if (
      !window.kakao ||
      !window.kakao.maps ||
      !searchTerm.trim() ||
      !kakaoMapRef.current
    )
      return;

    // 검색어와 일치하는 자판기 찾기
    const foundMachine = vendingMachines.find(
      (machine) =>
        machine.address.includes(searchTerm) ||
        machine.name.includes(searchTerm)
    );

    if (foundMachine) {
      // 찾은 자판기 위치로 지도 이동
      const position = new window.kakao.maps.LatLng(
        foundMachine.latitude,
        foundMachine.longitude
      );

      kakaoMapRef.current.setCenter(position);

      // 현재 위치 업데이트
      setCurrentLocation({
        lat: foundMachine.latitude,
        lng: foundMachine.longitude,
      });

      // 선택된 위치 업데이트
      setSelectedLocation(position);

      // 검색 반경 표시 및 자판기 조회
      showSearchRadius(
        foundMachine.latitude,
        foundMachine.longitude,
        searchDistance
      );

      // 선택된 자판기 정보 설정 및 사이드 패널 표시
      setSelectedVendingMachine(foundMachine);
      setShowSidePanel(true);

      // 선택된 마커 강조 표시
      highlightSelectedMarker(foundMachine.id);
    } else {
      alert("검색 결과가 없습니다.");
    }
  }, [
    searchTerm,
    vendingMachines,
    searchDistance,
    setSelectedLocation,
    showSearchRadius,
    setSelectedVendingMachine,
    setShowSidePanel,
    highlightSelectedMarker,
  ]);

  // 로그인 상태 확인
  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/");
    }
  }, [router]);

  // 지도 클릭 이벤트 핸들러
  const handleMapClick = useCallback(
    (mouseEvent: KakaoEvent) => {
      if (!window.kakao || !window.kakao.maps || !kakaoMapRef.current) return;

      const clickPosition = mouseEvent.latLng;
      if (!clickPosition) return;

      // 이전 마커가 있으면 지도에서 제거
      if (selectedMarkerRef.current) {
        selectedMarkerRef.current.setMap(null);
      }

      // 빨간색 마커 이미지 생성
      const redMarkerImage = new window.kakao.maps.MarkerImage(
        "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png",
        new window.kakao.maps.Size(42, 42),
        { offset: new window.kakao.maps.Point(21, 42) }
      );

      // 새 마커 생성 (빨간색 마커 사용)
      const marker = new window.kakao.maps.Marker({
        position: clickPosition,
        map: kakaoMapRef.current,
        image: redMarkerImage,
      });

      // 마커 참조 저장 (다음 클릭 시 제거하기 위해)
      selectedMarkerRef.current = marker;

      // 선택된 위치 상태 업데이트
      setSelectedLocation(clickPosition);

      // 클릭 위치 저장
      const lat = clickPosition.getLat();
      const lng = clickPosition.getLng();
      setCurrentLocation({ lat, lng });

      // 검색 반경 원 표시
      showSearchRadius(lat, lng, searchDistance);

      // 클릭 위치 기준으로 빵긋 자판기 조회 (조회하기 버튼 대신 클릭 시 바로 API 호출)
      searchVendingMachines(lat, lng, searchDistance);

      // 사이드 패널 닫기
      setShowSidePanel(false);
      setSelectedVendingMachine(null);

      // 선택된 마커 강조 해제
      highlightSelectedMarker(null);
    },
    [
      setSelectedLocation,
      searchDistance,
      showSearchRadius,
      searchVendingMachines,
      setShowSidePanel,
      setSelectedVendingMachine,
      highlightSelectedMarker,
    ]
  );

  // 선택된 자판기가 변경될 때 해당 마커 강조 표시
  useEffect(() => {
    if (selectedVendingMachine && kakaoLoaded) {
      highlightSelectedMarker(selectedVendingMachine.id);
    }
  }, [selectedVendingMachine, highlightSelectedMarker, kakaoLoaded]);

  // 지도 초기화 함수
  const initializeMap = useCallback(() => {
    if (!window.kakao || !window.kakao.maps || !mapRef.current) return;

    // 현재 위치 가져오기
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        // 위치 정보 가져오기 성공
        (position) => {
          const { latitude, longitude } = position.coords;

          // 지도 생성 (현재 위치 기준)
          const options = {
            center: new window.kakao.maps.LatLng(latitude, longitude),
            level: 5, // 지도 확대 레벨
          };

          // 지도 생성
          const kakaoMap = new window.kakao.maps.Map(mapRef.current!, options);

          // 지도 참조 저장
          kakaoMapRef.current = kakaoMap;
          setMap(kakaoMap);

          // 현재 위치에 마커 표시
          new window.kakao.maps.Marker({
            position: new window.kakao.maps.LatLng(latitude, longitude),
            map: kakaoMap,
          });

          // 지도 클릭 이벤트 등록
          window.kakao.maps.event.addListener(
            kakaoMap,
            "click",
            handleMapClick
          );

          // 현재 위치 저장
          const userLocationData = { lat: latitude, lng: longitude };
          setCurrentLocation(userLocationData);
          setUserLocation(userLocationData);

          // 검색 반경 원 표시
          showSearchRadius(latitude, longitude, searchDistance);

          // 현재 위치 기준으로 빵긋 자판기 조회
          searchVendingMachines(latitude, longitude, searchDistance);

          setLoading(false); // 로딩 완료
        },
        (error) => {
          console.error("위치 정보를 가져오는데 실패했습니다:", error);
          setLoading(false);
        }
      );
    } else {
      console.error("이 브라우저에서는 Geolocation이 지원되지 않습니다.");
      setLoading(false);
    }
  }, [
    setLoading,
    setMap,
    handleMapClick,
    searchDistance,
    searchVendingMachines,
    showSearchRadius,
    setUserLocation,
  ]);

  // 카카오맵 스크립트 로드
  useEffect(() => {
    // 이미 로드 중이거나 로드된 경우 중복 실행 방지
    if (scriptLoadedRef.current) return;
    scriptLoadedRef.current = true;

    setLoading(true);

    // 이미 window.kakao가 존재하는지 확인
    if (window.kakao && window.kakao.maps) {
      setKakaoLoaded(true);
      initializeMap();
      return;
    }

    // 스크립트 로드 함수
    const loadKakaoMap = () => {
      const script = document.createElement("script");
      script.id = "kakao-map-script";
      script.async = true;
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false`;

      script.onload = () => {
        window.kakao.maps.load(() => {
          setKakaoLoaded(true);
          initializeMap();
        });
      };

      document.head.appendChild(script);
    };

    loadKakaoMap();

    // 컴포넌트 언마운트 시 마커와 오버레이 정리
    return () => {
      if (window.kakao && window.kakao.maps) {
        vendingMarkers.current.forEach(({ marker }) => marker.setMap(null));
        customOverlays.current.forEach((overlay) => overlay.setMap(null));
        if (searchCircleRef.current) searchCircleRef.current.setMap(null);
        if (selectedMarkerRef.current) selectedMarkerRef.current.setMap(null);
      }
    };
  }, []); // 의존성 배열을 비워서 한 번만 실행되도록 함

  return (
    <div className="relative h-[calc(100vh-6rem)] w-full overflow-hidden">
      {/* 지도 컨테이너 */}
      <div ref={mapRef} className="w-full h-full"></div>

      {/* 상단 중앙 검색바 */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-md px-4">
        <div className="relative">
          <input
            type="text"
            placeholder="자판기 이름 또는 주소 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full px-4 py-3 pr-12 bg-white border-0 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            onClick={handleSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-orange-500 text-white p-1.5 rounded-full hover:bg-orange-600 transition-colors"
          >
            <Search size={18} />
          </button>
        </div>
      </div>

      {/* 검색 컨트롤 패널 */}
      <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-md z-10 w-64">
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            검색 거리
          </label>
          <div className="flex space-x-2">
            {[1, 3, 5, 10].map((distance) => (
              <button
                key={distance}
                className={`px-3 py-1 text-sm rounded-md ${
                  searchDistance === distance
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-orange-100"
                }`}
                onClick={() => {
                  setSearchDistance(distance);
                  // 거리 변경 시 현재 선택된 위치로 다시 검색
                  if (currentLocation) {
                    searchVendingMachines(
                      currentLocation.lat,
                      currentLocation.lng,
                      distance
                    );
                  }
                }}
              >
                {distance}km
              </button>
            ))}
          </div>
        </div>

        {/* 현재 위치로 이동 버튼 */}
        <button
          className="w-full py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          onClick={moveToUserLocation}
          disabled={isSearching || !userLocation}
        >
          <Navigation className="h-5 w-5 mr-1" />내 위치로 이동
        </button>

        {vendingMachines.length > 0 && (
          <div className="mt-3 text-sm text-gray-700">
            {vendingMachines.length}개의 빵긋 자판기를 찾았습니다
          </div>
        )}

        {/* 범례 표시 토글 버튼 */}
        <button
          className="mt-3 text-sm text-orange-500 hover:text-orange-600 underline"
          onClick={() => setShowLegend(!showLegend)}
        >
          {showLegend ? "범례 숨기기" : "범례 보기"}
        </button>
      </div>

      {/* 범례 (오른쪽 하단으로 이동) - 텍스트 변경 */}
      {showLegend && (
        <div className="absolute bottom-8 right-4 bg-orange-500 p-4 rounded-lg shadow-md z-10 text-white">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center">
              <Image
                src="/green-cabinet.png"
                alt="사용가능"
                width={30}
                height={40}
                className="h-8 mr-2"
              />
              <span>사용가능</span>
            </div>
            <div className="flex items-center">
              <Image
                src="/red-cabinet.png"
                alt="거의찬 상태"
                width={30}
                height={40}
                className="h-8 mr-2"
              />
              <span>거의찬 상태</span>
            </div>
            <div className="flex items-center">
              <Image
                src="/black-cabinet.png"
                alt="구매불가"
                width={30}
                height={40}
                className="h-8 mr-2"
              />
              <span>구매불가</span>
            </div>
          </div>
        </div>
      )}

      {/* 자판기 정보 사이드 패널 - 디자인 개선 */}
      {showSidePanel && selectedVendingMachine && (
        <div className="absolute top-0 left-0 h-full w-80 bg-white shadow-lg z-20 transition-transform transform">
          <div className="h-full flex flex-col">
            {/* 헤더 부분 */}
            <div className="bg-orange-500 p-5 text-white relative">
              <button
                onClick={() => setShowSidePanel(false)}
                className="absolute top-4 right-4 text-white hover:bg-orange-600 rounded-full p-1"
              >
                <X size={20} />
              </button>
              <h2 className="text-xl font-bold mb-1">
                {selectedVendingMachine.name}
              </h2>
              <p className="text-sm opacity-90 flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {selectedVendingMachine.address}
              </p>
            </div>

            {/* 내용 부분 */}
            <div className="p-5 flex-1 overflow-auto">
              <div className="bg-orange-50 rounded-lg p-4 mb-5">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center">
                    <Ruler className="w-5 h-5 text-orange-500 mr-2" />
                    <span className="font-medium text-gray-700">거리</span>
                  </div>
                  <span className="text-orange-600 font-bold">
                    {typeof selectedVendingMachine.distance === "number"
                      ? `${Number(selectedVendingMachine.distance).toFixed(
                          2
                        )}km`
                      : `${selectedVendingMachine.distance}km`}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <MapPinned className="w-5 h-5 text-orange-500 mr-2" />
                    <span className="font-medium text-gray-700">남은 공간</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-orange-600 font-bold mr-1">
                      {selectedVendingMachine.remainSpaceCount || 0}
                    </span>
                    <span className="text-gray-500">칸</span>
                  </div>
                </div>
              </div>

              {/* 상태 표시 */}
              <div className="flex flex-col items-center mb-6">
                <div className="text-center mb-2">
                  <span className="text-sm text-gray-500">자판기 상태</span>
                </div>
                <div className="relative inline-block">
                  <div
                    className={`text-center py-2 px-4 rounded-full font-bold ${
                      selectedVendingMachine.remainSpaceCount === 0
                        ? "bg-gray-800 text-white"
                        : selectedVendingMachine.remainSpaceCount &&
                          selectedVendingMachine.remainSpaceCount <= 5
                        ? "bg-red-500 text-white"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    {selectedVendingMachine.remainSpaceCount === 0
                      ? "구매불가"
                      : selectedVendingMachine.remainSpaceCount &&
                        selectedVendingMachine.remainSpaceCount <= 5
                      ? "거의찬 상태"
                      : "사용가능"}
                  </div>
                </div>
              </div>
            </div>

            {/* 하단 버튼 */}
            <div className="p-4 border-t border-gray-200">
              <button className="w-full py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors font-bold shadow-md flex items-center justify-center">
                상품등록하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
