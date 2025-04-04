"use client"

import { useState } from "react"

interface CurrentLocationButtonProps {
  map: any // 카카오맵 객체
}

export default function CurrentLocationButton({ map }: CurrentLocationButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleClick = () => {
    if (!map) return

    setLoading(true)

    // 현재 위치 가져오기
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        const moveLatLng = new window.kakao.maps.LatLng(latitude, longitude)

        // 지도 중심 이동
        map.setCenter(moveLatLng)

        // TODO: 현재 위치 기반으로 주변 빵집 데이터 가져오기

        setLoading(false)
      },
      (error) => {
        console.error("현재 위치를 가져오는데 실패했습니다:", error)
        alert("현재 위치를 가져오는데 실패했습니다. 위치 권한을 확인해주세요.")
        setLoading(false)
      },
      { enableHighAccuracy: true },
    )
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading || !map}
      className="absolute bottom-24 right-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center z-50"
      aria-label="현재 위치로 이동"
    >
      {loading ? (
        <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
      ) : (
        <svg
          className="w-6 h-6 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )}
    </button>
  )
}

