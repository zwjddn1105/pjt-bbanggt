"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useMapStore } from "../../store/map-store";
import { fetchVendingMachines } from "../../api/vending-machine";
import type {
  KakaoMap,
  KakaoMarker,
  KakaoEvent,
  KakaoCircle,
  KakaoCustomOverlay,
  VendingMachine,
} from "../../types/map";

interface MapContainerProps {
  onMapLoad: (map: KakaoMap) => void;
}

export default function MapContainer({ onMapLoad }: MapContainerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const kakaoMapRef = useRef<KakaoMap | null>(null);
  const selectedMarkerRef = useRef<KakaoMarker | null>(null);
  const searchCircleRef = useRef<KakaoCircle | null>(null);
  const vendingMarkers = useRef<{ marker: KakaoMarker; id: number | string }[]>(
    []
  );
  const customOverlays = useRef<KakaoCustomOverlay[]>([]);
  const scriptLoadedRef = useRef(false);
  const [, setKakaoLoaded] = useState(false);

  // Zustand 스토어에서 상태와 액션 가져오기
  const {
    setMap,
    setSelectedLocation,

    setSearchDistance,
    setVendingMachines,
    setIsSearching,
    setUserLocation,
    setSelectedVendingMachine,
    setShowSidePanel,
  } = useMapStore();

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
    (selectedId: number | string | null, vendingMachines: VendingMachine[]) => {
      if (!window.kakao || !window.kakao.maps) return;

      // 모든 마커를 원래 이미지로 되돌림
      vendingMarkers.current.forEach(({ marker, id }) => {
        const machine = vendingMachines.find(
          (m: VendingMachine) => m.id === id
        );
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
    [getMarkerImageByStatus]
  );

  // 검색 반경 원 표시 함수
  const showSearchRadius = useCallback(
    (lat: number, lng: number, radiusKm: number) => {
      if (!window.kakao || !window.kakao.maps || !kakaoMapRef.current) return;

      console.log(`원 그리기: 위도=${lat}, 경도=${lng}, 반경=${radiusKm}km`);

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
            highlightSelectedMarker(machine.id, machines);
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

      // 검색 거리를 3km로 재설정 (지도 클릭 시 항상 3km로 설정)
      setSearchDistance(3);

      // 검색 반경 원 표시
      showSearchRadius(lat, lng, 3);

      // 클릭 위치 기준으로 빵긋 자판기 조회
      searchVendingMachines(lat, lng, 3);

      // 사이드 패널 닫기
      setShowSidePanel(false);
      setSelectedVendingMachine(null);
    },
    [
      setSelectedLocation,
      showSearchRadius,
      searchVendingMachines,
      setShowSidePanel,
      setSelectedVendingMachine,
      setSearchDistance,
    ]
  );

  // 검색 반경 업데이트 이벤트 리스너
  useEffect(() => {
    const handleUpdateSearchRadius = (event: CustomEvent) => {
      const { lat, lng, distance } = event.detail;
      console.log(`이벤트 수신: 위도=${lat}, 경도=${lng}, 반경=${distance}km`);

      // 검색 반경 원 표시
      showSearchRadius(lat, lng, distance);

      // 자판기 재검색
      searchVendingMachines(lat, lng, distance);
    };

    window.addEventListener(
      "updateSearchRadius",
      handleUpdateSearchRadius as EventListener
    );

    return () => {
      window.removeEventListener(
        "updateSearchRadius",
        handleUpdateSearchRadius as EventListener
      );
    };
  }, [showSearchRadius, searchVendingMachines]);

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
          onMapLoad(kakaoMap);

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
          setUserLocation(userLocationData);

          // 검색 반경 원 표시 (기본 3km)
          showSearchRadius(latitude, longitude, 3);

          // 현재 위치 기준으로 빵긋 자판기 조회 (기본 3km)
          searchVendingMachines(latitude, longitude, 3);
        },
        (error) => {
          console.error("위치 정보를 가져오는데 실패했습니다:", error);
        }
      );
    } else {
      console.error("이 브라우저에서는 Geolocation이 지원되지 않습니다.");
    }
  }, [
    setMap,
    handleMapClick,
    searchVendingMachines,
    showSearchRadius,
    setUserLocation,
    onMapLoad,
  ]);

  // 카카오맵 스크립트 로드
  useEffect(() => {
    // 이미 로드 중이거나 로드된 경우 중복 실행 방지
    if (scriptLoadedRef.current) return;
    scriptLoadedRef.current = true;

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
  }, [initializeMap]);

  return <div ref={mapRef} className="w-full h-full"></div>;
}
