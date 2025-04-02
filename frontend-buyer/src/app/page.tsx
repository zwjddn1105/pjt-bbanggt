"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import BottomNavTab from "@/components/bottom-navtab"
import CurrentLocationButton from "@/components/map/current-location-button"
import FilterButtons from "@/components/map/filter-buttons"
import MarkerDetail from "@/components/map/marker-detail"
import { fetchVendingMachines, fetchBookmarkedVendingMachines } from "@/services/breadgut-api"
import type { VendingMachine } from "@/types/vending-machine"

// 카카오맵 타입 정의
declare global {
  interface Window {
    kakao: any
  }
}

export default function Home() {
  // 지도 컨테이너 ref
  const mapRef = useRef<HTMLDivElement>(null)
  // 지도 객체 상태
  const [map, setMap] = useState<any>(null)
  // 카카오맵 스크립트 로드 상태
  const [isKakaoMapLoaded, setIsKakaoMapLoaded] = useState(false)
  // 검색어 상태
  const [searchQuery, setSearchQuery] = useState("")
  // 빵긋 데이터 상태
  const [vendingMachines, setVendingMachines] = useState<VendingMachine[]>([])
  // 마커 상태
  const [markers, setMarkers] = useState<any[]>([])
  // 북마크된 빵긋만 표시 상태
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false)
  // 선택된 빵긋 상태
  const [selectedVendingMachine, setSelectedVendingMachine] = useState<VendingMachine | null>(null)
  // 스크립트 로드 완료 플래그
  const scriptLoadedRef = useRef(false)
  // 현재 위치 상태
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null)

  // 카카오맵 초기화 함수
  const initializeMap = () => {
    if (!mapRef.current || !window.kakao?.maps) return

    console.log("카카오맵 초기화 시작")

    // 지도 생성 옵션
    const options = {
      center: new window.kakao.maps.LatLng(37.5665, 126.978), // 서울 중심 좌표
      level: 3, // 확대 레벨
    }

    // 지도 생성
    const kakaoMap = new window.kakao.maps.Map(mapRef.current, options)
    setMap(kakaoMap)

    // 현재 위치 가져오기
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          const moveLatLng = new window.kakao.maps.LatLng(latitude, longitude)

          // 지도 중심 이동
          kakaoMap.setCenter(moveLatLng)
          setCurrentLocation({ lat: latitude, lng: longitude })

          // 현재 위치 마커 생성
          const currentPositionMarker = new window.kakao.maps.Marker({
            position: moveLatLng,
            map: kakaoMap,
          })

          // 현재 위치 기반으로 데이터 가져오기
          fetchData(latitude, longitude)
        },
        (error) => {
          console.error("현재 위치를 가져오는데 실패했습니다:", error)
          // 기본 위치 기반으로 데이터 가져오기
          setCurrentLocation({ lat: 37.5665, lng: 126.978 })
          fetchData(37.5665, 126.978)
        },
      )
    } else {
      // 위치 정보를 지원하지 않는 경우 기본 위치 기반으로 데이터 가져오기
      setCurrentLocation({ lat: 37.5665, lng: 126.978 })
      fetchData(37.5665, 126.978)
    }

    console.log("카카오맵 초기화 완료")
  }

  // 데이터 가져오기 함수
  const fetchData = async (lat: number, lng: number) => {
    try {
      // 북마크된 빵긋만 표시하는 경우
      if (showBookmarkedOnly) {
        const bookmarkedVendingMachines = await fetchBookmarkedVendingMachines()
        setVendingMachines(bookmarkedVendingMachines)
      } else {
        // 주변 빵긋 데이터 가져오기
        const vendingData = await fetchVendingMachines(lat, lng, 5)
        setVendingMachines(vendingData)
      }
    } catch (error) {
      console.error("데이터를 가져오는데 실패했습니다:", error)
    }
  }

  // 마커 표시 함수
  const displayMarkers = () => {
    if (!map) return

    // 기존 마커 제거
    markers.forEach((marker) => marker.setMap(null))
    const newMarkers: any[] = []

    // 빵긋 마커 생성
    vendingMachines.forEach((vm) => {
      // 커스텀 마커 컴포넌트 사용
      const markerPosition = new window.kakao.maps.LatLng(vm.latitude, vm.longitude)

      // 마커 생성
      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
        map: map,
        title: vm.name,
      })

      // 마커 클릭 이벤트
      window.kakao.maps.event.addListener(marker, "click", () => {
        setSelectedVendingMachine(vm)
      })

      newMarkers.push(marker)
    })

    setMarkers(newMarkers)
  }

  // 검색 처리 함수
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (!searchQuery.trim() || !map) return

    // 장소 검색 객체 생성
    const ps = new window.kakao.maps.services.Places()

    // 키워드 검색 완료 시 호출되는 콜백함수
    const placesSearchCB = (data: any, status: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        // 검색된 장소 위치로 지도 이동
        const bounds = new window.kakao.maps.LatLngBounds()

        data.forEach((place: any) => {
          bounds.extend(new window.kakao.maps.LatLng(place.y, place.x))
        })

        map.setBounds(bounds)

        // 검색 결과 기반으로 데이터 가져오기
        if (data.length > 0) {
          const lat = Number.parseFloat(data[0].y)
          const lng = Number.parseFloat(data[0].x)
          setCurrentLocation({ lat, lng })
          fetchData(lat, lng)
        }
      } else {
        alert("검색 결과가 없습니다.")
      }
    }

    // 키워드로 장소 검색
    ps.keywordSearch(searchQuery, placesSearchCB)
  }

  // 필터 변경 처리 함수
  const handleFilterChange = (showBookmarkedOnly: boolean) => {
    setShowBookmarkedOnly(showBookmarkedOnly)

    if (currentLocation) {
      fetchData(currentLocation.lat, currentLocation.lng)
    }
  }

  // 북마크 버튼 클릭 처리 함수
  const handleBookmarkClick = () => {
    // 북마크 관리 모달 또는 페이지로 이동
    setShowBookmarkedOnly(true)

    // 북마크된 빵긋 데이터 가져오기
    fetchBookmarkedVendingMachines()
      .then((data) => {
        setVendingMachines(data)
      })
      .catch((error) => {
        console.error("북마크된 빵긋 데이터를 가져오는데 실패했습니다:", error)
      })
  }

  // 북마크 상태 변경 처리 함수
  const handleVendingMachineBookmarkChange = (isBookmarked: boolean) => {
    if (selectedVendingMachine) {
      // 선택된 빵긋의 북마크 상태 업데이트
      const updatedVendingMachine = { ...selectedVendingMachine, isBookmarked }
      setSelectedVendingMachine(updatedVendingMachine)

      // 빵긋 목록에서도 북마크 상태 업데이트
      const updatedVendingMachines = vendingMachines.map((vm) =>
        vm.id === selectedVendingMachine.id ? { ...vm, isBookmarked } : vm,
      )
      setVendingMachines(updatedVendingMachines)

      // 북마크된 빵긋만 표시 중이고 북마크가 해제된 경우, 목록에서 제거
      if (showBookmarkedOnly && !isBookmarked) {
        const filteredVendingMachines = updatedVendingMachines.filter((vm) => vm.isBookmarked)
        setVendingMachines(filteredVendingMachines)
        setSelectedVendingMachine(null)
      }
    }
  }

  // 카카오맵 스크립트 로드 확인 및 초기화
  useEffect(() => {
    // 이미 카카오맵이 로드되어 있는 경우
    if (window.kakao?.maps) {
      console.log("카카오맵 이미 로드됨")
      setIsKakaoMapLoaded(true)
      return
    }

    // 스크립트가 아직 로드되지 않았고, 로드 중이 아닌 경우
    if (!scriptLoadedRef.current && !document.getElementById("kakao-maps-sdk")) {
      console.log("카카오맵 스크립트 로드 시작")
      scriptLoadedRef.current = true

      const script = document.createElement("script")
      script.id = "kakao-maps-sdk"
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&libraries=services&autoload=false`
      script.async = true
      script.onload = () => {
        console.log("카카오맵 스크립트 로드 완료")
        window.kakao.maps.load(() => {
          console.log("카카오맵 API 로드 완료")
          setIsKakaoMapLoaded(true)
        })
      }
      document.head.appendChild(script)
    }
  }, [])

  // 카카오맵 초기화
  useEffect(() => {
    if (isKakaoMapLoaded && mapRef.current && !map) {
      initializeMap()
    }
  }, [isKakaoMapLoaded, map])

  // 데이터 변경 시 마커 업데이트
  useEffect(() => {
    if (map && vendingMachines.length > 0) {
      displayMarkers()
    }
  }, [map, vendingMachines])

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      // 지도 객체 정리
      if (map) {
        setMap(null)
      }
    }
  }, [map])

  return (
    <main className="flex flex-col h-screen relative">
      {/* 지도 영역 */}
      <div className="relative flex-1 w-full h-full" style={{ marginBottom: "72px" }}>
        <div ref={mapRef} className="w-full h-full" />

        {/* 현재 위치 버튼 */}
        <CurrentLocationButton map={map} />
      </div>

      {/* 검색창 */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-transparent flex justify-center">
        <div className="w-full max-w-[800px]">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                placeholder="주소를 입력해주세요. 예) 역삼동"
                className="w-full p-2 pl-10 border rounded-full bg-white bg-opacity-90 shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </form>

          {/* 필터 버튼 영역 */}
          <div className="flex justify-between mt-2">
            <FilterButtons onFilterChange={handleFilterChange} onBookmarkClick={handleBookmarkClick} />
          </div>
        </div>
      </div>

      {/* 빵긋 상세 정보 */}
      {selectedVendingMachine && (
        <MarkerDetail
          vendingMachine={selectedVendingMachine}
          onClose={() => setSelectedVendingMachine(null)}
          onBookmarkChange={handleVendingMachineBookmarkChange}
        />
      )}

      {/* 하단 네비게이션 */}
      <BottomNavTab />
    </main>
  )
}

