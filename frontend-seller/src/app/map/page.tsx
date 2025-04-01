"use client";

import type React from "react";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Search,
  Store,
  Navigation,
  List,
  X,
  Sliders,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import type {
  KakaoMap,
  KakaoMarker,
  KakaoInfoWindow,
  KakaoEvent,
  KakaoCircle,
  VendingMachine,
  VendingMachineApiResponse,
} from "@/types/map";
import { useLoading } from "@/components/loading-provider";
import axios from "axios";
import { isLoggedIn } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<KakaoMap | null>(null);
  const [userMarker, setUserMarker] = useState<KakaoMarker | null>(null);
  const { setLoading } = useLoading();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [selectedVendingMachine, setSelectedVendingMachine] =
    useState<VendingMachine | null>(null);
  const [infoWindow, setInfoWindow] = useState<KakaoInfoWindow | null>(null);
  const [vendingMachines, setVendingMachines] = useState<VendingMachine[]>([]);
  const [markers, setMarkers] = useState<KakaoMarker[]>([]);
  const [userPosition, setUserPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [searchDistance, setSearchDistance] = useState<number>(5); // 기본 검색 반경 5km
  const [showDistanceSelector, setShowDistanceSelector] =
    useState<boolean>(false);
  const [selectedPosition, setSelectedPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [selectedPositionMarker, setSelectedPositionMarker] =
    useState<KakaoMarker | null>(null);
  const [searchCircle, setSearchCircle] = useState<KakaoCircle | null>(null); // 검색 반경 원

  // 로그인 상태 확인
  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/");
    }
  }, [router]);

  // 카카오맵 스크립트 로드
  useEffect(() => {
    setLoading(true); // 로딩 시작

    const script = document.createElement("script");
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false`;
    document.head.appendChild(script);

    script.addEventListener("load", () => {
      window.kakao.maps.load(() => {
        if (!mapRef.current) return;

        // 지도 생성
        const options = {
          center: new window.kakao.maps.LatLng(37.5665, 126.978), // 서울 시청 좌표 (기본값)
          level: 5, // 지도 확대 레벨
        };

        const kakaoMap = new window.kakao.maps.Map(mapRef.current, options);
        setMap(kakaoMap);

        // 지도 클릭 이벤트 - 특정 위치 선택
        window.kakao.maps.event.addListener(
          kakaoMap,
          "click",
          (e: KakaoEvent) => {
            if (!e.latLng) return;

            // 선택한 위치 저장
            const clickPosition = {
              lat: e.latLng.getLat(),
              lng: e.latLng.getLng(),
            };
            setSelectedPosition(clickPosition);

            // 기존 선택 위치 마커 제거
            if (selectedPositionMarker) {
              selectedPositionMarker.setMap(null);
            }

            // 새 마커 생성
            const marker = new window.kakao.maps.Marker({
              position: new window.kakao.maps.LatLng(
                clickPosition.lat,
                clickPosition.lng
              ),
              map: kakaoMap,
              image: new window.kakao.maps.MarkerImage(
                "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png",
                new window.kakao.maps.Size(35, 35)
              ),
            });
            setSelectedPositionMarker(marker);

            // 검색 반경 표시
            updateSearchCircle(
              clickPosition.lat,
              clickPosition.lng,
              searchDistance
            );

            // 거리 선택기 표시
            setShowDistanceSelector(true);
          }
        );

        // 사용자 위치 가져오기
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const lat = position.coords.latitude;
              const lng = position.coords.longitude;

              // 사용자 위치 저장
              setUserPosition({ lat, lng });

              // 지도 중심 이동
              const userLatLng = new window.kakao.maps.LatLng(lat, lng);
              kakaoMap.setCenter(userLatLng);

              // 사용자 위치 마커 생성
              const marker = new window.kakao.maps.Marker({
                position: userLatLng,
                map: kakaoMap,
                image: new window.kakao.maps.MarkerImage(
                  "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_blue.png",
                  new window.kakao.maps.Size(35, 35)
                ),
              });
              setUserMarker(marker);

              // 사용자 위치 기반으로 빵긋 자판기 데이터 가져오기
              fetchVendingMachines(lat, lng, searchDistance);
            },
            (error) => {
              console.error("위치 정보를 가져오는데 실패했습니다:", error);
              setLoading(false); // 로딩 완료 (에러 발생해도)
            }
          );
        } else {
          console.error("이 브라우저에서는 위치 정보를 지원하지 않습니다.");
          setLoading(false); // 로딩 완료 (지원하지 않는 경우)
        }
      });
    });

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [setLoading, router]);

  // 검색 반경 원 업데이트
  const updateSearchCircle = (lat: number, lng: number, distance: number) => {
    if (!map) return;

    // 기존 원 제거
    if (searchCircle) {
      searchCircle.setMap(null);
    }

    // 새 원 생성 (km를 m로 변환)
    const circle = new window.kakao.maps.Circle({
      center: new window.kakao.maps.LatLng(lat, lng),
      radius: distance * 1000, // 미터 단위
      strokeWeight: 2,
      strokeColor: "#FF6B6B",
      strokeOpacity: 0.8,
      strokeStyle: "dashed",
      fillColor: "#FF6B6B",
      fillOpacity: 0.2,
      map: map,
    });

    setSearchCircle(circle);
  };

  // 빵긋 자판기 데이터 가져오기
  const fetchVendingMachines = async (
    lat: number,
    lng: number,
    distance: number
  ) => {
    try {
      setLoading(true);

      // 쿠키에서 auth_token 가져오기
      const cookies = document.cookie.split(";");
      let authToken = "";

      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split("=");
        if (name === "auth_token") {
          authToken = value;
          break;
        }
      }

      if (!authToken) {
        console.error("인증 토큰이 없습니다.");
        router.push("/");
        return;
      }

      // API 요청
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const response = await axios.get(`${baseUrl}/api/v1/vending-machines`, {
        params: {
          latitude: lat,
          longitude: lng,
          distance: distance,
        },
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      // 응답 데이터 처리
      const data = response.data;

      // 데이터 형식에 따라 조정 필요할 수 있음
      const machines: VendingMachine[] = data.map(
        (item: VendingMachineApiResponse) => ({
          id: item.id,
          name: item.name || "빵긋 자판기",
          address: item.address || "주소 정보 없음",
          latitude: item.latitude,
          longitude: item.longitude,
          distance: item.distance
            ? `${item.distance.toFixed(1)}km`
            : "거리 정보 없음",
          category: item.category || "자판기",
          rating: item.rating || 4.5,
        })
      );

      setVendingMachines(machines);

      // 마커 표시
      displayVendingMachineMarkers(machines);

      setLoading(false);
    } catch (error) {
      console.error("빵긋 자판기 데이터를 가져오는데 실패했습니다:", error);
      setLoading(false);
    }
  };

  // 빵긋 자판기 마커 표시
  const displayVendingMachineMarkers = (machines: VendingMachine[]) => {
    if (!map) return;

    // 기존 마커 제거
    markers.forEach((marker) => marker.setMap(null));

    // 인포윈도우가 있으면 닫기
    if (infoWindow) {
      infoWindow.close();
    }

    // 마커 이미지 설정
    const markerImageSrc =
      "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";
    const imageSize = new window.kakao.maps.Size(24, 35);
    const markerImage = new window.kakao.maps.MarkerImage(
      markerImageSrc,
      imageSize
    );

    // 새 마커 생성
    const newMarkers: KakaoMarker[] = [];

    machines.forEach((machine) => {
      const marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(
          machine.latitude,
          machine.longitude
        ),
        map: map,
        image: markerImage,
        title: machine.name,
      });

      // 마커 클릭 이벤트
      window.kakao.maps.event.addListener(marker, "click", () => {
        // 인포윈도우 생성 및 표시
        const content = `
          <div class="p-2 bg-white rounded shadow-md text-sm" style="min-width: 150px; padding: 10px;">
            <strong style="color: #f97316;">${machine.name}</strong>
            <p style="margin: 5px 0; font-size: 12px;">${
              machine.category || "자판기"
            } | ⭐ ${machine.rating || "4.5"}</p>
          </div>
        `;

        // 기존 인포윈도우 닫기
        if (infoWindow) {
          infoWindow.close();
        }

        // 새 인포윈도우 생성
        const newInfoWindow = new window.kakao.maps.InfoWindow({
          content: content,
          removable: true,
        });

        // 인포윈도우 표시
        newInfoWindow.open(map, marker);
        setInfoWindow(newInfoWindow);

        // 선택된 자판기 설정 및 사이드바 열기
        setSelectedVendingMachine(machine);
        setShowSidebar(true);
      });

      newMarkers.push(marker);
    });

    setMarkers(newMarkers);
  };

  // 현재 위치로 이동
  const moveToCurrentLocation = () => {
    if (navigator.geolocation && map && userPosition) {
      setLoading(true); // 위치 가져오는 동안 로딩 표시

      const userLatLng = new window.kakao.maps.LatLng(
        userPosition.lat,
        userPosition.lng
      );
      map.setCenter(userLatLng);

      // 선택 위치 초기화
      if (selectedPositionMarker) {
        selectedPositionMarker.setMap(null);
        setSelectedPositionMarker(null);
      }

      if (searchCircle) {
        searchCircle.setMap(null);
        setSearchCircle(null);
      }

      setSelectedPosition(null);
      setShowDistanceSelector(false);

      // 현재 위치 기반으로 데이터 다시 가져오기
      fetchVendingMachines(userPosition.lat, userPosition.lng, searchDistance);

      setLoading(false);
    }
  };

  // 검색 처리
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // 검색어 기반 필터링 (이름이나 주소에 검색어가 포함된 자판기만 표시)
    if (searchQuery.trim() === "") {
      // 검색어가 없으면 모든 자판기 표시
      displayVendingMachineMarkers(vendingMachines);
    } else {
      const filteredMachines = vendingMachines.filter(
        (machine) =>
          machine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          machine.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
      displayVendingMachineMarkers(filteredMachines);
    }
  };

  // 거리 변경 처리
  const handleDistanceChange = (newDistance: number) => {
    setSearchDistance(newDistance);

    // 선택한 위치가 있으면 해당 위치 기준으로 검색
    if (selectedPosition) {
      updateSearchCircle(
        selectedPosition.lat,
        selectedPosition.lng,
        newDistance
      );
      fetchVendingMachines(
        selectedPosition.lat,
        selectedPosition.lng,
        newDistance
      );
    }
    // 선택한 위치가 없으면 현재 위치 기준으로 검색
    else if (userPosition) {
      updateSearchCircle(userPosition.lat, userPosition.lng, newDistance);
      fetchVendingMachines(userPosition.lat, userPosition.lng, newDistance);
    }
  };

  // 선택한 위치 기준으로 검색
  const searchFromSelectedPosition = () => {
    if (!selectedPosition) return;

    fetchVendingMachines(
      selectedPosition.lat,
      selectedPosition.lng,
      searchDistance
    );
  };

  // 자판기 선택 처리
  const handleVendingMachineSelect = (machine: VendingMachine) => {
    setSelectedVendingMachine(machine);

    // 해당 마커 찾기
    const marker = markers.find((m) => {
      const position = m.getPosition();
      return (
        position.getLat() === machine.latitude &&
        position.getLng() === machine.longitude
      );
    });

    if (marker && map) {
      // 지도 중심 이동
      map.setCenter(
        new window.kakao.maps.LatLng(machine.latitude, machine.longitude)
      );

      // 인포윈도우 표시
      if (infoWindow) {
        infoWindow.close();
      }

      const content = `
        <div class="p-2 bg-white rounded shadow-md text-sm" style="min-width: 150px; padding: 10px;">
          <strong style="color: #f97316;">${machine.name}</strong>
          <p style="margin: 5px 0; font-size: 12px;">${
            machine.category || "자판기"
          } | ⭐ ${machine.rating || "4.5"}</p>
        </div>
      `;

      const newInfoWindow = new window.kakao.maps.InfoWindow({
        content: content,
        removable: true,
      });

      newInfoWindow.open(map, marker);
      setInfoWindow(newInfoWindow);
    }
  };

  return (
    <div className="relative h-[calc(100vh-6rem)] w-full overflow-hidden">
      {/* 지도 컨테이너 */}
      <div ref={mapRef} className="w-full h-full"></div>

      {/* 검색 바 */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 z-10">
        <form onSubmit={handleSearch} className="relative">
          <Input
            type="text"
            placeholder="빵긋 자판기 이름 또는 주소 검색"
            className="pr-10 h-12 shadow-lg border-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            type="submit"
            size="icon"
            className="absolute right-0 top-0 h-12 w-12 rounded-l-none bg-orange-500 hover:bg-orange-600"
          >
            <Search className="h-5 w-5" />
          </Button>
        </form>
      </div>

      {/* 거리 선택기 */}
      {showDistanceSelector && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-4 z-10 w-full max-w-md">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-700">검색 반경 설정</h3>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setShowDistanceSelector(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-2 mb-3">
            {[1, 3, 5, 10, 20].map((distance) => (
              <Button
                key={distance}
                variant={searchDistance === distance ? "default" : "outline"}
                size="sm"
                className={
                  searchDistance === distance
                    ? "bg-orange-500 hover:bg-orange-600"
                    : ""
                }
                onClick={() => handleDistanceChange(distance)}
              >
                {distance}km
              </Button>
            ))}
          </div>

          <Button
            className="w-full bg-orange-500 hover:bg-orange-600"
            onClick={searchFromSelectedPosition}
          >
            이 위치에서 검색
          </Button>
        </div>
      )}

      {/* 컨트롤 버튼 */}
      <div className="absolute bottom-6 right-4 flex flex-col gap-2 z-10">
        <Button
          onClick={() => setShowDistanceSelector(!showDistanceSelector)}
          size="icon"
          className="h-12 w-12 rounded-full bg-white text-orange-500 hover:bg-orange-50 shadow-lg border border-gray-200"
        >
          <Sliders className="h-5 w-5" />
        </Button>
        <Button
          onClick={moveToCurrentLocation}
          size="icon"
          className="h-12 w-12 rounded-full bg-white text-orange-500 hover:bg-orange-50 shadow-lg border border-gray-200"
        >
          <Navigation className="h-5 w-5" />
        </Button>
        <Button
          onClick={() => setShowSidebar(!showSidebar)}
          size="icon"
          className="h-12 w-12 rounded-full bg-white text-orange-500 hover:bg-orange-50 shadow-lg border border-gray-200"
        >
          {showSidebar ? (
            <X className="h-5 w-5" />
          ) : (
            <List className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* 사이드바 - 빵긋 자판기 목록 */}
      <div
        className={`absolute top-0 left-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 z-20 ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold flex items-center">
            <Store className="mr-2 h-5 w-5 text-orange-500" />
            주변 빵긋 자판기
          </h2>
        </div>

        {/* 선택된 자판기 상세 정보 */}
        {selectedVendingMachine && (
          <div className="p-4 bg-orange-50 border-b border-orange-100">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-lg text-orange-700">
                {selectedVendingMachine.name}
              </h3>
              <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                ⭐ {selectedVendingMachine.rating || "4.5"}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {selectedVendingMachine.address}
            </p>
            <div className="flex items-center mt-2 text-sm text-orange-600">
              <MapPin className="h-3 w-3 mr-1" />
              {selectedVendingMachine.distance} |{" "}
              {selectedVendingMachine.category || "자판기"}
            </div>
            <div className="mt-3 flex gap-2">
              <Button
                size="sm"
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                상세 정보
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-orange-200 text-orange-700"
              >
                길찾기
              </Button>
            </div>
          </div>
        )}

        <div className="overflow-y-auto h-[calc(100%-60px)] pt-2">
          {vendingMachines.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              주변에 빵긋 자판기가 없습니다.
            </div>
          ) : (
            vendingMachines.map((machine) => (
              <Card
                key={machine.id}
                className={`m-2 border-none shadow-sm hover:bg-orange-50 cursor-pointer transition-colors ${
                  selectedVendingMachine?.id === machine.id
                    ? "bg-orange-50 border-l-4 border-l-orange-500"
                    : ""
                }`}
                onClick={() => handleVendingMachineSelect(machine)}
              >
                <CardContent className="p-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-gray-900">
                      {machine.name}
                    </h3>
                    <span className="text-xs text-gray-500">
                      ⭐ {machine.rating || "4.5"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {machine.address}
                  </p>
                  <div className="flex items-center mt-2 text-xs">
                    <span className="bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full mr-2">
                      {machine.category || "자판기"}
                    </span>
                    <MapPin className="h-3 w-3 mr-1 text-orange-500" />
                    <span className="text-orange-500">{machine.distance}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
