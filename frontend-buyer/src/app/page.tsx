"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import BottomNavTab from "@/components/bottom-navtab"
import CurrentLocationButton from "@/components/map/current-location-button"
import FilterButtons from "@/components/map/filter-buttons"
import MarkerDetail from "@/components/map/marker-detail"
import CustomMarker from "@/components/map/custom-marker"
import { fetchVendingMachines, fetchBookmarkedVendingMachines } from "@/services/breadgut-api"
import type { VendingMachine } from "@/types/vending-machine"

declare global {
  interface Window {
    kakao: any
  }
}

export default function Home() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [isKakaoMapLoaded, setIsKakaoMapLoaded] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [vendingMachines, setVendingMachines] = useState<VendingMachine[]>([])
  const [markers, setMarkers] = useState<any[]>([])
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false)
  const [selectedVendingMachine, setSelectedVendingMachine] = useState<VendingMachine | null>(null)
  const scriptLoadedRef = useRef(false)
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null)

  const initializeMap = () => {
    if (!mapRef.current || !window.kakao?.maps) return

    const options = {
      center: new window.kakao.maps.LatLng(37.5665, 126.978),
      level: 3,
    }

    const kakaoMap = new window.kakao.maps.Map(mapRef.current, options)
    setMap(kakaoMap)

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          const moveLatLng = new window.kakao.maps.LatLng(latitude, longitude)

          kakaoMap.setCenter(moveLatLng)
          setCurrentLocation({ lat: latitude, lng: longitude })

          new window.kakao.maps.Marker({
            position: moveLatLng,
            map: kakaoMap,
          })

          fetchData(latitude, longitude, showBookmarkedOnly)
        },
        (error) => {
          console.error("현재 위치를 가져오는데 실패했습니다:", error)
          setCurrentLocation({ lat: 37.5665, lng: 126.978 })
          fetchData(37.5665, 126.978, showBookmarkedOnly)
        },
      )
    } else {
      setCurrentLocation({ lat: 37.5665, lng: 126.978 })
      fetchData(37.5665, 126.978, showBookmarkedOnly)
    }
  }

  // ✅ showBookmarkedOnly를 인자로 받음
  const fetchData = async (lat: number, lng: number, useBookmark: boolean) => {
    try {
      if (useBookmark) {
        const bookmarkedVendingMachines = await fetchBookmarkedVendingMachines(lat, lng)
        const uniqueVendingMachines = removeDuplicateById(bookmarkedVendingMachines)
        setVendingMachines(uniqueVendingMachines)
      } else {
        const vendingData = await fetchVendingMachines(lat, lng, 5)
        const uniqueVendingMachines = removeDuplicateById(vendingData)
        setVendingMachines(uniqueVendingMachines)
      }
    } catch (error) {
      console.error("데이터를 가져오는데 실패했습니다:", error)
    }
  }

  const removeDuplicateById = (items: VendingMachine[]): VendingMachine[] => {
    const uniqueIds = new Set<string>()
    return items.filter((item) => {
      if (uniqueIds.has(item.id)) return false
      uniqueIds.add(item.id)
      return true
    })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (!searchQuery.trim() || !map) return

    const ps = new window.kakao.maps.services.Places()

    const placesSearchCB = (data: any, status: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const bounds = new window.kakao.maps.LatLngBounds()
        data.forEach((place: any) => {
          bounds.extend(new window.kakao.maps.LatLng(place.y, place.x))
        })
        map.setBounds(bounds)

        if (data.length > 0) {
          const lat = parseFloat(data[0].y)
          const lng = parseFloat(data[0].x)
          setCurrentLocation({ lat, lng })
          fetchData(lat, lng, showBookmarkedOnly)
        }
      } else {
        alert("검색 결과가 없습니다.")
      }
    }

    ps.keywordSearch(searchQuery, placesSearchCB)
  }

  const handleFilterChange = (isBookmarkedOnly: boolean) => {
    setShowBookmarkedOnly(isBookmarkedOnly)

    if (currentLocation) {
      fetchData(currentLocation.lat, currentLocation.lng, isBookmarkedOnly)
    }
  }

  const handleBookmarkClick = () => {
    const lat = currentLocation?.lat ?? 37.5665
    const lng = currentLocation?.lng ?? 126.978

    setShowBookmarkedOnly(true)

    fetchBookmarkedVendingMachines(lat, lng)
      .then((data) => {
        const uniqueVendingMachines = removeDuplicateById(data)
        setVendingMachines(uniqueVendingMachines)
      })
      .catch((error) => {
        console.error("북마크된 빵긋 데이터를 가져오는데 실패했습니다:", error)
      })
  }

  const handleVendingMachineBookmarkChange = (isBookmarked: boolean) => {
    if (selectedVendingMachine) {
      const updatedVendingMachine = { ...selectedVendingMachine, isBookmarked }
      setSelectedVendingMachine(updatedVendingMachine)

      const updatedList = vendingMachines.map((vm) =>
        vm.id === selectedVendingMachine.id ? { ...vm, isBookmarked } : vm,
      )
      setVendingMachines(updatedList)

      if (showBookmarkedOnly && !isBookmarked) {
        const filtered = updatedList.filter((vm) => vm.isBookmarked)
        setVendingMachines(filtered)
        setSelectedVendingMachine(null)
      }
    }
  }

  useEffect(() => {
    if (window.kakao?.maps) {
      setIsKakaoMapLoaded(true)
      return
    }

    if (!scriptLoadedRef.current && !document.getElementById("kakao-maps-sdk")) {
      scriptLoadedRef.current = true

      const script = document.createElement("script")
      script.id = "kakao-maps-sdk"
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&libraries=services&autoload=false`
      script.async = true
      script.onload = () => {
        window.kakao.maps.load(() => {
          setIsKakaoMapLoaded(true)
        })
      }
      document.head.appendChild(script)
    }
  }, [])

  useEffect(() => {
    if (isKakaoMapLoaded && mapRef.current && !map) {
      initializeMap()
    }
  }, [isKakaoMapLoaded, map])

  useEffect(() => {
    return () => {
      if (map) {
        setMap(null)
      }
    }
  }, [map])

  return (
    <main className="flex flex-col h-screen relative">
      <div className="relative flex-1 w-full h-full" style={{ marginBottom: "72px" }}>
        <div ref={mapRef} className="w-full h-full" />

        <CurrentLocationButton map={map} />

        {map &&
          vendingMachines.map((vm) => (
            <CustomMarker
              key={`marker-${vm.id}-${vm.latitude}-${vm.longitude}`}
              map={map}
              position={{ lat: vm.latitude, lng: vm.longitude }}
              title={vm.name}
              isBookmarked={vm.isBookmarked}
              availableCount={vm.availableCount}
              onClick={() => setSelectedVendingMachine(vm)}
            />
          ))}
      </div>

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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </form>

          <div className="flex justify-between mt-2">
            <FilterButtons onFilterChange={handleFilterChange} onBookmarkClick={handleBookmarkClick} />
          </div>
        </div>
      </div>

      {selectedVendingMachine && (
        <MarkerDetail
          vendingMachine={selectedVendingMachine}
          onClose={() => setSelectedVendingMachine(null)}
          onBookmarkChange={handleVendingMachineBookmarkChange}
        />
      )}

      <BottomNavTab />
    </main>
  )
}
