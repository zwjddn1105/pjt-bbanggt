"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useLoading } from "../../components/loading-provider";
import { isLoggedIn } from "../../lib/auth";
import { useRouter } from "next/navigation";
import { useMapStore } from "../../store/map-store";
import { fetchVendingMachines } from "../../api/vending-machine";
import type {
  KakaoMap,
  KakaoMarker,
  KakaoEvent,
  KakaoCircle,
} from "../../types/map";

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const kakaoMapRef = useRef<KakaoMap | null>(null);
  const selectedMarkerRef = useRef<KakaoMarker | null>(null);
  const searchCircleRef = useRef<KakaoCircle | null>(null);
  const vendingMarkers = useRef<KakaoMarker[]>([]);
  const { setLoading } = useLoading();
  const router = useRouter();
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

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
  } = useMapStore();

  // 검색 반경 원 표시 함수
  const showSearchRadius = useCallback(
    (lat: number, lng: number, radiusKm: number) => {
      // 이전 원이 있으면 제거
      if (searchCircleRef.current) {
        searchCircleRef.current.setMap(null);
      }

      if (!kakaoMapRef.current) return;

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
      try {
        setIsSearching(true);

        // 기존 자판기 마커 제거
        vendingMarkers.current.forEach((marker) => marker.setMap(null));
        vendingMarkers.current = [];

        // 검색 반경 원 표시
        showSearchRadius(lat, lng, distance);

        // API 호출
        const machines = await fetchVendingMachines(lat, lng, distance);
        setVendingMachines(machines);

        // 지도에 자판기 마커 표시
        if (kakaoMapRef.current) {
          machines.forEach((machine) => {
            // 자판기 마커 이미지 생성
            const vendingMarkerImage = new window.kakao.maps.MarkerImage(
              "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
              new window.kakao.maps.Size(24, 35)
            );

            // 자판기 마커 생성
            const marker = new window.kakao.maps.Marker({
              position: new window.kakao.maps.LatLng(
                machine.latitude,
                machine.longitude
              ),
              map: kakaoMapRef.current,
              image: vendingMarkerImage,
              title: machine.name,
            });

            // 마커 클릭 이벤트 - 정보 표시
            window.kakao.maps.event.addListener(marker, "click", () => {
              // kakaoMapRef.current가 null이 아닌지 확인
              if (!kakaoMapRef.current) return;

              const infoWindow = new window.kakao.maps.InfoWindow({
                content: `
                  <div style="padding:10px;width:200px;">
                    <h3 style="margin-top:0;margin-bottom:5px;">${
                      machine.name
                    }</h3>
                    <p style="margin:0;margin-bottom:5px;">${
                      machine.address
                    }</p>
                    <p style="margin:0;">거리: ${
                      typeof machine.distance === "number"
                        ? Number(machine.distance).toFixed(2)
                        : machine.distance
                    }km</p>
                  </div>
                `,
                removable: true,
              });

              infoWindow.open(kakaoMapRef.current, marker);
            });

            // 마커 배열에 추가
            vendingMarkers.current.push(marker);
          });
        }
      } catch (error) {
        console.error("빵긋 자판기 조회 실패:", error);
      } finally {
        setIsSearching(false);
      }
    },
    [setVendingMachines, setIsSearching, showSearchRadius]
  );

  // 현재 위치로 이동하는 함수
  const moveToUserLocation = useCallback(() => {
    if (!userLocation || !kakaoMapRef.current) return;

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
    kakaoMapRef,
    searchDistance,
    searchVendingMachines,
    setSelectedLocation,
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
      const clickPosition = mouseEvent.latLng;
      if (!clickPosition || !kakaoMapRef.current) return;

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
    },
    [
      setSelectedLocation,
      searchDistance,
      showSearchRadius,
      searchVendingMachines,
    ]
  );

  // 카카오맵 스크립트 로드 및 지도 초기화
  useEffect(() => {
    setLoading(true); // 로딩 시작

    const script = document.createElement("script");
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false`;
    document.head.appendChild(script);

    script.addEventListener("load", () => {
      window.kakao.maps.load(() => {
        // mapRef.current가 null인지 확인
        if (!mapRef.current) return;

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
              const kakaoMap = new window.kakao.maps.Map(
                mapRef.current!,
                options
              );

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
            }
          );
        }
      });
    });

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [
    setLoading,
    router,
    setMap,
    handleMapClick,
    searchDistance,
    searchVendingMachines,
    showSearchRadius,
    setUserLocation,
  ]);

  return (
    <div className="relative h-[calc(100vh-6rem)] w-full overflow-hidden">
      {/* 지도 컨테이너 */}
      <div ref={mapRef} className="w-full h-full"></div>

      {/* 검색 컨트롤 패널 */}
      <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-md z-10">
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
          내 위치로 이동
        </button>

        {vendingMachines.length > 0 && (
          <div className="mt-3 text-sm text-gray-700">
            {vendingMachines.length}개의 빵긋 자판기를 찾았습니다
          </div>
        )}
      </div>
    </div>
  );
}
