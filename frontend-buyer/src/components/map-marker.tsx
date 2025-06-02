"use client"

import { useEffect, useRef } from "react"

interface MapMarkerProps {
  map: any // 카카오맵 객체
  position: {
    lat: number
    lng: number
  }
  rating: number
  title: string
  onClick?: () => void
}

export default function MapMarker({ map, position, rating, title, onClick }: MapMarkerProps) {
  const markerRef = useRef<any>(null)

  useEffect(() => {
    if (!map) return

    // TODO: 커스텀 마커 이미지 구현
    // 스크린샷에 있는 것처럼 숫자와 아이콘이 있는 마커 구현

    // 기본 마커 생성 (추후 커스텀 마커로 대체)
    const markerPosition = new window.kakao.maps.LatLng(position.lat, position.lng)
    const marker = new window.kakao.maps.Marker({
      position: markerPosition,
      map: map,
      title: title,
    })

    // 마커 클릭 이벤트
    window.kakao.maps.event.addListener(marker, "click", () => {
      if (onClick) onClick()
    })

    markerRef.current = marker

    // 컴포넌트 언마운트 시 마커 제거
    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null)
      }
    }
  }, [map, position, title, onClick])

  return null // 이 컴포넌트는 UI를 렌더링하지 않음
}

